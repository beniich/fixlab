import { 
  getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, 
  collection, query, onSnapshot, DocumentData, QuerySnapshot, 
  DocumentSnapshot, getDocFromServer
} from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Operational Enums for Logging
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Mandatory Firestore Error Catcher formatting as JSON string for diagnostic compliance
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Hardened connection diagnostics tester
export async function testConnection(): Promise<boolean> {
  try {
    // Testing path
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info("Firestore Cloud connection verified as active.");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client Offline.");
    }
    return false;
  }
}

// Safe wrapper for setting user profiles
export async function saveProfile(userId: string, data: any): Promise<void> {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, "users", userId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch active profile or fallback
export async function getProfile(userId: string): Promise<DocumentSnapshot<DocumentData>> {
  const path = `users/${userId}`;
  try {
    return await getDoc(doc(db, "users", userId));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
