import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
} from "react-native-appwrite";
import AWS from "aws-sdk";

// Define an interface for Appwrite configuration
interface AppwriteConfig {
  url: string;
  projectId: string;
  databaseId: string;
  platform: string;
  storageId: string;
  productsCollectionId: string;
  usersCollectionId: string;
  likesCollectionId: string;
  messageCol: string;
  chatsCollectionId: string;
  viewsCollectionId: string;
  reportUser: string;
  banUser: string;
  userStatus: string;
  rentals: string;
  userdocs: string;
}

// Appwrite configuration with required environment variables
export const appwriteConfig: AppwriteConfig = {
  url: process.env.EXPO_PUBLIC_APPWRITE_URL || "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "",
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_COL || "",
  storageId: process.env.EXPO_PUBLIC_PPWRITE_STORAGE_ID || "",
  productsCollectionId: process.env.EXPO_PUBLIC_PPWRITE_PRODUCT_COL || "",
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COL || "",
  likesCollectionId: process.env.EXPO_PUBLIC_PPWRITE_LIKES_COL || "",
  messageCol: process.env.EXPO_PUBLIC_PPWRITE_MESSAGE_COL || "",
  chatsCollectionId: process.env.EXPO_PUBLIC_PPWRITE_CHAT_COL || "",
  viewsCollectionId: process.env.EXPO_PUBLIC_PPWRITE_VIEWS_COLLECTION_ID || "",
  reportUser: process.env.EXPO_PUBLIC_PPWRITE_REPORT_COL || "",
  banUser: process.env.EXPO_PUBLIC_PPWRITE_BANUSER_COL || "",
  userStatus: process.env.EXPO_PUBLIC_APPWRITE_USER_STATE_ID || "",
  rentals: process.env.EXPO_PUBLIC_APPWRITE_RENTS || "",
  userdocs: process.env.EXPO_PUBLIC_APPWRITE_DOCS_USER || "",
};

// S3 configuration interface
interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3ForcePathStyle: boolean;
}

// Configure S3 client for IDrive e2
export const s3 = new AWS.S3({
  endpoint: process.env.EXPO_PUBLIC_IDRIVEe2_endpoint || "",
  accessKeyId: process.env.EXPO_PUBLIC_IDRIVEe2_accessKeyId || "",
  secretAccessKey: process.env.EXPO_PUBLIC_IDRIVEe2_secretAccessKey || "",
  region: "Oregon", // Set your region
  s3ForcePathStyle: true, // Required for non-AWS S3 providers
} as S3Config);

// Initialize Appwrite Client
export const client = new Client();

client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
