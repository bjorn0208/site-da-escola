import { doc, getDoc, setDoc, collection, getDocs, writeBatch, getDocFromServer } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Client, GameState } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

/**
 * Helper to remove undefined values from objects before saving to Firestore,
 * as Firestore does not support undefined.
 */
function sanitizeForFirestore(data: any): any {
  if (data === undefined) return null;
  if (Array.isArray(data)) return data.map(sanitizeForFirestore);
  if (typeof data === 'object' && data !== null) {
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        cleaned[key] = sanitizeForFirestore(data[key]);
      }
    });
    return cleaned;
  }
  return data;
}

/**
 * Standard security error parser following firebase integration guidelines.
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Security/Operation Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to the database instance on initial boot.
 */
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test-connection-probe', 'probe'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client appears to be offline. Connection probe failed.");
    }
  }
}

/**
 * Loads the complete simulator progress and custom clients for the designated user ID.
 */
export async function loadUserGameState(userId: string): Promise<GameState | null> {
  const savePath = `user_saves/${userId}`;
  try {
    const saveDocRef = doc(db, 'user_saves', userId);
    const saveSnapshot = await getDoc(saveDocRef);
    
    if (!saveSnapshot.exists()) {
      return null;
    }

    const saveDetails = saveSnapshot.data();
    
    // Fetch individual clients subcollection
    const clientsPath = `user_saves/${userId}/clients`;
    const clientsRef = collection(db, 'user_saves', userId, 'clients');
    const clientsSnapshot = await getDocs(clientsRef);
    
    const clientsList: Client[] = [];
    clientsSnapshot.forEach((docSnapshot) => {
      clientsList.push(docSnapshot.data() as Client);
    });

    return {
      clients: clientsList,
      currentClientId: saveDetails.currentClientId || null,
      totalXp: saveDetails.totalXp || 0,
      level: saveDetails.level || 1,
      activeTab: saveDetails.activeTab || 'simulator',
      difficulty: saveDetails.difficulty || 'medium',
      theme: saveDetails.theme || 'dark'
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, savePath);
  }
}

/**
 * Persists the complete gameState representation to user_saves and subcollections.
 */
export async function saveUserGameState(userId: string, gameState: GameState): Promise<void> {
  const savePath = `user_saves/${userId}`;
  try {
    // Write general save game state
    const saveDocRef = doc(db, 'user_saves', userId);
    await setDoc(saveDocRef, {
      userId,
      level: gameState.level,
      totalXp: gameState.totalXp,
      currentClientId: gameState.currentClientId,
      activeTab: gameState.activeTab,
      difficulty: gameState.difficulty,
      theme: gameState.theme,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Multi-write clients inside subcollection in standard batch mode
    const clientsRef = `user_saves/${userId}/clients`;
    const batch = writeBatch(db);
    
    gameState.clients.forEach((client) => {
      const clientDocRef = doc(db, 'user_saves', userId, 'clients', client.id);
      batch.set(clientDocRef, sanitizeForFirestore(client), { merge: true });
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, savePath);
  }
}

/**
 * Saves a single client's progress to the database subcollection.
 */
export async function saveSingleClientState(userId: string, client: Client): Promise<void> {
  const clientPath = `user_saves/${userId}/clients/${client.id}`;
  try {
    const clientDocRef = doc(db, 'user_saves', userId, 'clients', client.id);
    await setDoc(clientDocRef, sanitizeForFirestore(client), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, clientPath);
  }
}
