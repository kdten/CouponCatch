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
// Firestore Firestore imports
import { getFirestore, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore(app);

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
});




// Firebase Storage imports
// import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// import { v4 as uuidv4 } from 'uuid';
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// // Initialize Firestore
// const db = getFirestore();
// const storage = getStorage();

// export const uploadImageToFirebase = async (uri) => {
//   try {
//     const imageName = uuidv4();
//     const imageRef = ref(storage, `Users/${imageName}`);
//     const snapshot = await uploadBytesResumable(imageRef, uri);
//     const downloadURL = await getDownloadURL(snapshot.ref);

//     const docRef = await addDoc(collection(db, "images"), {
//       url: downloadURL,
//       createdAt: new Date().toISOString()
//     });

//     return { id: docRef.id, url: downloadURL };
//   } catch (e) {
//     return { error: e };
//   }
// };

// export const getImagesFromFirebase = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "images"));
//     const images = [];
//     querySnapshot.forEach((doc) => {
//       images.push({ id: doc.id, ...doc.data() });
//     });
//     return images;
//   } catch (e) {
//     return { error: e };
//   }
// };

// In this updated store.js, uploadImageToFirebase uploads an image to Firebase Storage and saves the download URL to Firestore, then returns the new document ID and the image URL. getImagesFromFirebase retrieves all images from Firestore and returns them in an array.

// Note that these functions are exported directly and do not directly update any store. Depending on your application structure, you may want to update the AuthStore (or a new, separate store) inside these functions. For example, if you want to keep track of the current image, you could add currentImage: null to AuthStore, then update currentImage inside uploadImageToFirebase. Similarly, you could add images: [] to AuthStore, then update images inside getImagesFromFirebase.

//native change \/ \/ \/
// export const uploadImageToFirebase = async (uri) => {
//   try {
//     const imageName = uuidv4();
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const imageRef = ref(storage, `images/${imageName}`);
//     const snapshot = await uploadBytesResumable(imageRef, blob);
//     const downloadURL = await getDownloadURL(snapshot.ref);

//     const docRef = await addDoc(collection(db, "images"), {
//       name: imageName,
//       url: downloadURL
//     });

//     return docRef.id;

//   } catch (e) {
//     console.error("Error during image upload to Firebase", e);
//     return null;
//   }
// };



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
      store.isLoggedIn = true;
    });

    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

registerInDevtools({ AuthStore });
