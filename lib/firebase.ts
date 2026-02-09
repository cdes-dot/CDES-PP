// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBePVSQHLgJ9ttVf9y7-kh_RJNIsdM38lY",
  authDomain: "cdes-admin.firebaseapp.com",
  projectId: "cdes-admin",
  storageBucket: "cdes-admin.firebasestorage.app",
  messagingSenderId: "934328837900",
  appId: "1:934328837900:web:9a8eb8bae4086eaa0fcb29",
};

// Initialize Firebase (singleton)
function getFirebaseApp() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

function getFirebaseServices() {
  const app = getFirebaseApp();
  const storage = getStorage(app);
  const firestore = getFirestore(app);
  return { storage, firestore };
}

export { getFirebaseApp, getFirebaseServices, ref, getDownloadURL };

export async function fetchFileUrl(path: string) {
  if (!path || path.trim() === "") return "/placeholder.jpg";

  try {
    const { storage } = getFirebaseServices();
    const fileRef = ref(storage, path); // path debe ser algo como "CDES_inst/.../archivo.pdf"
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (err) {
    console.error("Error al obtener URL de Firebase:", err);
    return "/placeholder.jpg";
  }
}
