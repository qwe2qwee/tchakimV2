import { Models } from "react-native-appwrite"; // Use Appwrite SDK types if available

// Base interface for an Appwrite document
export interface AppwriteDocument extends Models.Document {
  $id: string;
  $collectionId: string;
  $createdAt: string;
  $updatedAt: string;
  $databaseId: string;
  $permissions: string[];
}

// Relationship for products and liked items
export interface ProductRelation extends AppwriteDocument {
  name: string; // Add relevant fields for Product
  price: number;
  description: string;
  imageUrl: string;
}

export interface LikeRelation extends AppwriteDocument {
  productId: string; // The ID of the liked product
  userId: string;
}

// User interface extending AppwriteDocument
export interface AppwriteUser extends AppwriteDocument {
  email: string;
  userName: string;
  phone: string; // Renamed to match your schema
  Details: string[]; // Array of strings
  products: ProductRelation[]; // Relationship with products
  liked: LikeRelation[]; // Relationship with liked products
}

// Interface for a Chat Document
export interface ChatDocument extends AppwriteDocument {
  productId: string; // Product ID associated with the chat
  buyerId: string; // User ID of the buyer
  productOwnerId: string; // User ID of the product owner
  messages?: string[]; // Relationship to messages (array of message IDs)
  visibility: string[]; // Array of user IDs who can see the chat
}

// Interface for Appwrite User
export interface UserDocument extends Models.Document {
  userName: string;
  email: string;
  phone: string;
  Details: string[];
}

export interface UserStatus extends AppwriteDocument {
  userId: string;
  status: string;
  lastActive: string;
}

// Type for the user status update response
export interface UserStatusUpdateResponse extends AppwriteDocument {
  $id: string;
  userId: string;
  status: string;
  lastActive: string;
}
