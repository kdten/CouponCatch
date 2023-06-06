import { Store, registerInDevtools } from "pullstate";
// Firebase Auth imports
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth/react-native";
import { app, auth } from "./firebase-config";
// Firebase Firestore imports
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  setDoc,
  serverTimestamp,
  doc,
  onSnapshot,
} from "firebase/firestore";
// Firebase Storage imports
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
  userID: null,
});

export const ReceiptsStore = new Store({
  receipts: [],
});

// Initialize Firestore
export const db = getFirestore(app);

// // Initialize Storage
const storage = getStorage();

export const uploadReceiptImageToFirebaseStorage = async (uri) => {
  try {
    const uid = auth.currentUser.uid;
    const imageName = uuidv4();
    const response = await fetch(uri);
    const blob = await response.blob();
    const receiptRef = ref(storage, `Users/${uid}/Receipts/${imageName}`);
    const snapshot = await uploadBytesResumable(receiptRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Now this function returns the download URL of the uploaded image
    return downloadURL;
  } catch (e) {
    console.error("Error during image upload to Firebase", e);
    return null;
  }
};

export const addReceiptToFirestore = async (url, receiptInfo) => {
  try {
    const userID = auth.currentUser.uid;
    const receiptData = {
      receiptImageURL: url,
      UserID: userID,
      timeCreated: serverTimestamp(), // this will add a server timestamp
      ...receiptInfo,
    };

    const docRef = await addDoc(collection(db, "Receipts"), receiptData);
    return docRef.id;
  } catch (e) {
    console.error("Error during adding receipt to Firestore", e);
    return null;
  }
};

export const fetchReceipts = async () => {
  const { user } = AuthStore.getRawState(); // Get current user from AuthStore

  if (user) {
    const db = getFirestore();
    const q = query(
      collection(db, "Receipts"),
      where("UserID", "==", user.uid)
    );

    // Create a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const receiptsData = querySnapshot.docs.map((doc) => doc.data());

      ReceiptsStore.update((s) => {
        s.receipts = receiptsData;
      });

      if (!receiptsData) {
        console.log("No receipts found");
      }
    });

    // Optional: Return the unsubscribe function, so you can stop listening later
    return unsubscribe;
  }
};

const unsub = onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChange", user);
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });
});

export const appSignIn = async (email, password) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    AuthStore.update((store) => {
      store.user = resp.user;
      store.isLoggedIn = resp.user ? true : false;
    });
    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    AuthStore.update((store) => {
      store.user = null;
      store.isLoggedIn = false;
    });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

// Creates a new user with Firebase Auth
// Updates the user's profile with a display name
// Creates a new document in the Users collection in Firestore, with the document ID set to the user's UID
export const appSignUp = async (email, password, displayName) => {
  try {
    // this will trigger onAuthStateChange to update the store..
    const resp = await createUserWithEmailAndPassword(auth, email, password);

    // add the displayName
    await updateProfile(resp.user, { displayName });

    // Create a new user document in the Users collection in Firestore
    await setDoc(doc(db, "Users", resp.user.uid), {
      userID: resp.user.uid,
      timeCreated: serverTimestamp(), // this will add a server timestamp
    });

    AuthStore.update((store) => {
      store.user = auth.currentUser;
      store.userID = auth.currentUser.uid;
      store.isLoggedIn = true;
    });

    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

registerInDevtools({ AuthStore });
