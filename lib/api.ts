import { ID, Models, Query } from "react-native-appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {
  AppwriteUser,
  ChatDocument,
  UserDocument,
  UserStatus,
  UserStatusUpdateResponse,
} from "@/types/appwriteTypes";
import {
  BanStatus,
  BanUserPayload,
  ReportUserPayload,
  UserDetails,
} from "@/types";
import { errorMessagesAPI } from "@/constants";

// Function to get error message in the specified language
function getErrorMessage(errorKey: string, lang: string = "en"): any {
  return (
    errorMessagesAPI[lang]?.[errorKey] ||
    errorMessagesAPI["en"][errorKey] ||
    "Unknown error"
  );
}

// Transliteration map for Arabic to English
const transliterationMap: Record<string, string> = {
  ا: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  أ: "a",
  إ: "i",
  آ: "a",
  ؤ: "w",
  ئ: "y",
  ء: "",
  ى: "a",
  ة: "h",
  "ٓ": "",
  ٱ: "a",
  "ً": "",
  "ٌ": "",
  "ٍ": "",
  "َ": "a",
  "ُ": "u",
  "ِ": "i",
  "ّ": "",
  "ْ": "",
  "ٓ ": "",
  "؟": "?",
  "،": ",",
  "؛": ";",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

// Function to transliterate Arabic name to English
function transliterateArabicToEnglish(name: string): string {
  const isArabic = (char: string) =>
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(char);

  return name
    .split("")
    .map((char) => (isArabic(char) ? transliterationMap[char] || char : char))
    .join("")
    .replace(/\s+/g, ""); // Remove spaces
}

// Function to check if a username already exists
async function isUserNameExisting(userName: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("userName", userName)]
    );
    return response.documents.length > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
    return false; // Default to not existing on error
  }
}

// Function to generate a unique username
async function generateUniqueUserName(
  name: string,
  lang: string
): Promise<string> {
  const baseUserName = name.replace(/\s+/g, "").toLowerCase();
  let uniqueName = baseUserName;
  let counter = 1;

  while (await isUserNameExisting(uniqueName)) {
    uniqueName = `${baseUserName}${counter}`;
    counter++;
  }

  return uniqueName;
}

// Function to create a user account
export async function createUser(
  email: string,
  password: string,
  name: string,
  phone: string,
  lang: string = "en"
): Promise<AppwriteUser> {
  try {
    // Step 1: Create the Appwrite account
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("failedToCreateUser");

    // Step 2: Generate a unique username and avatar
    const userName = await generateUniqueUserName(name, lang);
    const avatarUrl = avatars.getInitials(userName);

    // Step 3: Authenticate user session
    await account.createEmailPasswordSession(email, password);

    // Step 4: Construct user details
    const userDetails: UserDetails = {
      name: name,
      imageUrl: avatarUrl.href,
      Rates: "0",
      birthDay: "",
      gender: "",
      address: "",
      views: "0",
      password: password,
    };

    // Step 5: Create the user document in the database
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      newAccount.$id,
      {
        userName,
        email,
        phone,
        Details: [JSON.stringify(userDetails)],
      }
    );

    return newUser as AppwriteUser; // Return as AppwriteUser type
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error creating user:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to retrieve user avatar and name
export async function getUserAvatarAndName(
  userId: string,
  lang: string = "en"
): Promise<{ userName: string; avatarUrl: string }> {
  try {
    const userDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    if (!userDocument || !userDocument.Details?.length) {
      throw new Error("userNotFound");
    }

    const details: UserDetails = JSON.parse(userDocument.Details[0]);
    const { name: userName, imageUrl: avatarUrl } = details;

    return { userName, avatarUrl };
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error fetching user details:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to check if a phone number exists
export async function isPhoneNumberExisting(
  phone: string,
  lang: string = "en"
): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("phone", phone)]
    );
    return response.documents.length > 0;
  } catch (error: any) {
    const errorMsg = getErrorMessage("phoneInUse", lang);
    console.error("Error checking phone number:", errorMsg);
    throw new Error(errorMsg);
  }
}

// Function to fetch chats for a user
export async function fetchUserChats(
  userId: string,
  lang: string = "en"
): Promise<ChatDocument[]> {
  try {
    if (!userId) throw new Error("Invalid user ID");

    // Fetch chats where the user is a buyer or product owner
    const [buyerChats, ownerChats] = await Promise.all([
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        [Query.equal("buyerId", userId), Query.equal("visibility", userId)]
      ),
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        [
          Query.equal("productOwnerId", userId),
          Query.equal("visibility", userId),
        ]
      ),
    ]);

    // Combine results
    const combinedChats: ChatDocument[] = [
      ...(buyerChats.documents as ChatDocument[]),
      ...(ownerChats.documents as ChatDocument[]),
    ];

    // Check for self-chat (user chats with themselves)
    const selfChat = combinedChats.find(
      (chat) => chat.buyerId === userId && chat.productOwnerId === userId
    );

    if (selfChat) return [selfChat];

    // If no chats are found, throw a meaningful error
    if (combinedChats.length === 0) throw new Error("chatNotFound");

    return combinedChats;
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error fetching user chats:", errorMsg);
    throw new Error(errorMsg);
  }
}

// Function to create a new chat
export async function createChat(
  buyerId: string,
  productOwnerId: string,
  productId: string,
  visibility: string[],
  lang: string = "en"
): Promise<ChatDocument> {
  try {
    // Create the new chat document in Appwrite
    const newChat = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      ID.unique(),
      { buyerId, productOwnerId, productId, visibility }
    );

    return newChat as ChatDocument; // Cast the result to the ChatDocument type
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToCreateChat", lang);
    console.error("Error creating chat:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to check if an email exists in the database
export async function isEmailExisting(
  email: string,
  lang: string = "en"
): Promise<boolean> {
  try {
    const response = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", email)]
    );
    return response.documents.length > 0; // Return true if email exists
  } catch (error) {
    const errorMsg = getErrorMessage("failedToCheckEmail", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to update phone number
export const updatePhoneNumber = async (
  phone: string,
  password: string,
  lang: string = "en"
): Promise<Models.User<Models.Preferences>> => {
  try {
    const result = await account.updatePhone(phone, password);
    return result;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToUpdatePhone", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};

//..................................................//
// Function to sign in
export async function signIn(
  email: string,
  password: string,
  lang: string = "en"
): Promise<Models.Session> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToSignIn", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to get email by phone number
export const getEmailByPhoneNumber = async (
  phone: string,
  lang: string = "en"
): Promise<string> => {
  try {
    const response = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("phone", phone)]
    );

    if (response.documents.length > 0) {
      return response.documents[0].email;
    } else {
      throw new Error("userNotFound");
    }
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error fetching email by phone:", errorMsg);
    throw new Error(errorMsg);
  }
};

//..................................................//
// Function to get the current account details
export async function getAccount(): Promise<Models.User<Models.Preferences>> {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error: any) {
    console.error("Error fetching current account:", error.message);
    throw new Error("Failed to fetch current account.");
  }
}

//..................................................//
// Function to update user profile image
export const updateUserProfileImage = async (file: {
  name: string;
  mimeType: string;
  uri: string;
}): Promise<string> => {
  try {
    console.log("File to upload:", file);

    const asset = {
      name: file.name,
      type: file.mimeType,
      uri: file.uri,
    } as any;

    // Step 1: Upload the image to Appwrite storage
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    // Step 2: Generate and return the viewable URI of the uploaded file
    const fileUri = storage.getFileView(
      appwriteConfig.storageId,
      uploadedFile.$id
    );

    console.log("User profile image updated successfully! URI:", fileUri);
    return fileUri.href; // Return the file URL
  } catch (error: any) {
    console.error("Failed to update user profile image:", error.message);
    throw new Error("Failed to upload or update the profile image.");
  }
};

//..................................................//
// Function to sign out the current user
export async function signOut(): Promise<void> {
  try {
    await account.deleteSession("current");
    console.log("User signed out successfully.");
  } catch (error: any) {
    console.error("Error during sign-out:", error.message);
    throw new Error("Failed to sign out.");
  }
}

//..................................................//
// Function to get the current user from the database
export async function getCurrentUser(
  lang: string = "en"
): Promise<UserDocument | null> {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("failedToGetCurrentUser");

    const response = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("$id", currentAccount.$id)]
    );

    return response?.documents[0] || null;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToGetCurrentUser", lang);
    console.error("Error fetching current user:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to send OTP to email
export async function sendOtpToEmail(
  email: string,
  lang: string = "en"
): Promise<Models.Token> {
  try {
    const response = await account.createEmailToken(ID.unique(), email);
    return response;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToSendOTP", lang);
    console.error("Error sending OTP to email:", errorMsg);
    throw new Error(errorMsg);
  }
}

export async function verifyOtp(
  userId: string,
  secret: string
): Promise<Models.Session> {
  try {
    const response = await account.updateMagicURLSession(userId, secret);
    return response;
  } catch (error: any) {
    console.error("Error verifying OTP:", error.message);
    throw new Error("Failed to verify OTP. Please try again.");
  }
}

//..................................................//
// Function to send OTP to phone
export async function sendOtpToPhone(
  phone: string,
  lang: string = "en"
): Promise<string> {
  try {
    const response = await account.createPhoneToken(ID.unique(), phone);
    return response.userId;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToSendOtpToPhone", lang);
    console.error("Error sending OTP to phone:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to verify OTP and reset password
export async function verifyOtpAndResetPassword(
  userId: string,
  otp: string,
  lang: string = "en"
): Promise<Models.Session> {
  try {
    const session = await account.createSession(userId, otp);
    return session;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToResetPassword", lang);
    console.error("Error verifying OTP and resetting password:", errorMsg);
    throw new Error(errorMsg);
  }
}

export async function sendPasswordRecoveryEmail(
  email: string,
  url: string
): Promise<void> {
  try {
    const d = await account.createRecovery(
      email,
      "https://your-app.com/recover"
    );

    console.log(`Password recovery email sent to ${email}`);
  } catch (error: any) {
    console.error("Error sending password recovery email:", error.message);
    throw new Error(
      "Failed to send password recovery email. Please try again."
    );
  }
}

// Function to update user status
export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<UserStatusUpdateResponse | null> => {
  if (!userId || typeof status !== "string") {
    console.error("Invalid userId or status provided to updateUserStatus.");
    return null;
  }

  try {
    // Fetch user and ensure they exist
    const user = await fetchUserById(userId);
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return null;
    }

    // Fetch or create user status document
    const userStatus = await fetchOrCreateUserStatus(userId, status);

    // Update status document
    const updatedStatus = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      userStatus.$id,
      {
        status,
        lastActive: new Date().toISOString(),
      }
    );

    console.log("User status updated:", updatedStatus);
    return updatedStatus as UserStatusUpdateResponse;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Failed to update user status");
  }
};

export async function completePasswordReset(
  userId?: any,
  secret?: any,
  newPassword?: string | null
): Promise<void> {
  if (!userId || !secret) {
    throw new Error("Missing required parameter for password reset.");
  }

  console.log("Starting password reset process...");
  console.log("Parameters:", { userId, secret, newPassword });

  try {
    // Attempt to complete the password reset
    console.log("Attempting to update recovery...");
    await account.updateMagicURLSession(userId, secret);
    console.log("Password reset successfully.");
  } catch (error: any) {
    console.error("Error completing password reset:", error.message);

    // Handle specific Appwrite errors
    if (error.message?.includes("Invalid secret")) {
      console.error("Invalid or expired secret key:", secret);
      throw new Error(
        "The secret key is invalid or has expired. Please request a new one."
      );
    }

    // Handle other unexpected errors
    if (error instanceof Error) {
      throw error;
    }

    // Default error handler
    throw new Error("Failed to reset password. Please try again.");
  }
}

export async function getUserIdByPhoneOrEmail(
  identifier: string,
  lang: string = "en"
): Promise<string | null> {
  try {
    // Determine the type of identifier (email or phone)
    const isEmail = identifier.includes("@");
    const fieldName = isEmail ? "email" : "phone";

    // Query the database
    const response = (await databases.listDocuments(
      appwriteConfig.databaseId, // Replace with your database ID
      appwriteConfig.usersCollectionId, // Replace with your users collection ID
      [Query.equal(fieldName, identifier)]
    )) as any;

    if (response.documents.length > 0) {
      return response.documents[0].$id; // Return the user ID
    }

    throw new Error(isEmail ? "emailNotFound" : "phoneNotFound");
  } catch (error) {
    console.error(
      `Failed to fetch userId by ${
        identifier.includes("@") ? "email" : "phone"
      }:`,
      error
    );
    return null;
  }
}

//..................................................//
// Function to reset the password
export async function ResetPasswordN(
  newPassword: string,
  oldPassword: string,
  lang: string = "en"
): Promise<Models.User<Models.Preferences>> {
  try {
    const response = await account.updatePassword(newPassword, oldPassword);
    return response;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToResetPassword", lang);
    console.error("Error resetting password:", errorMsg);
    throw new Error(errorMsg);
  }
}
// Helper Constants
const MS_IN_A_DAY = 24 * 60 * 60 * 1000;

//..................................................//
// Function to Send Password Reset Email
export async function sendPasswordResetEmail(
  email: string,
  lang: string = "en"
): Promise<void> {
  try {
    const resetUrl = "https://cloud.appwrite.io/v1"; // Replace with your actual reset link
    await account.createRecovery(email, resetUrl);
    console.log("Password reset email sent.");
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToResetPassword", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to Update User Details
export const updateUser = async (
  details: UserDetails,
  userId: string,
  lang: string = "en"
): Promise<Models.Document> => {
  try {
    const updatedDetails = {
      name: details.name,
      imageUrl: details.imageUrl,
      Rates: details.Rates,
      birthDay: details.birthDay,
      gender: details.gender,
      address: details.address,
      views: details.views,
      password: details.password,
    };

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      { Details: [JSON.stringify(updatedDetails)] }
    );

    console.log("User updated successfully:", updatedUser);
    return updatedUser;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToUpdateUserDetails", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};

// Helper: Fetch documents from Appwrite
const fetchDocuments = async <T>(
  databaseId: string,
  collectionId: string,
  query: string[]
): Promise<T[]> => {
  try {
    const response = await databases.listDocuments<any>(
      databaseId,
      collectionId,
      query
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    throw new Error("Error fetching data.");
  }
};

//..................................................//
// Function to Ban a User
export const banUser = async ({
  userId,
  reason,
  bannedBy,
}: BanUserPayload): Promise<{
  success: boolean;
  message: string;
  error?: any;
}> => {
  try {
    const existingBans = await fetchDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.banUser,
      [Query.equal("userId", userId), Query.equal("bannedBy", bannedBy)]
    );

    if (existingBans.length > 0) {
      return { success: false, message: "User is already banned." };
    }

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.banUser,
      ID.unique(),
      { userId, reason, bannedBy }
    );

    console.log("User banned successfully:", response);
    return { success: true, message: "User banned successfully." };
  } catch (error) {
    console.error("Failed to ban user:", error);
    return { success: false, message: "Failed to ban user.", error };
  }
};

//..................................................//
// Function to Report a User
export const reportUser = async ({
  reporterId,
  reportedUserId,
  reason,
  details,
}: ReportUserPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const reports = await fetchDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reportUser,
      [
        Query.equal("reporterId", reporterId),
        Query.equal("reportedUserId", reportedUserId),
      ]
    );

    const now = Date.now();
    const canReport = reports.every((report: any) => {
      const reportDate = new Date(report.$createdAt).getTime();
      return now - reportDate > 20 * MS_IN_A_DAY;
    });

    if (!canReport) {
      return {
        success: false,
        message: "You can only report this user once every 20 days.",
      };
    }

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reportUser,
      ID.unique(),
      { reporterId, reportedUserId, reason, details }
    );

    console.log("Report submitted successfully:", response);
    return { success: true, message: "Report submitted successfully." };
  } catch (error) {
    console.error("Failed to report user:", error);
    return { success: false, message: "Failed to report user." };
  }
};

//..................................................//
// Function to Fetch Ban Status
export const fetchBanStatus = async (
  userId: string,
  bannedBy: string
): Promise<BanStatus> => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.banUser,
      [Query.equal("userId", userId), Query.equal("bannedBy", bannedBy)]
    );

    if (!response.documents.length) {
      return { isBanned: false, reason: null };
    }

    const banDetails = response.documents[0];
    return {
      isBanned: true,
      reason: banDetails.reason || "No reason provided",
    };
  } catch (error) {
    console.error("Error fetching ban status:", error);
    return { isBanned: false, reason: null, error };
  }
};

//..................................................//
// Helper: Fetch User by ID
export const fetchUserById = async (
  userId: string
): Promise<Models.Document | null> => {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("$id", userId)]
  );
  return response.documents[0] || null;
};

//..................................................//
// Helper: Fetch or Create User Status
export const fetchOrCreateUserStatus = async (
  userId: string,
  status: string
): Promise<UserStatus> => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      [Query.equal("userId", userId)]
    );

    if (response.documents.length > 0) {
      return response.documents[0] as UserStatus; // Return existing status document
    }

    const newUserStatus = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      userId,
      { userId, status, lastActive: new Date().toISOString() }
    );

    return newUserStatus as UserStatus;
  } catch (error) {
    console.error("Error fetching/creating user status:", error);
    throw new Error("Failed to fetch or create user status.");
  }
};
