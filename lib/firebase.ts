// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnlMW-lOQg3YmssadJp86apbtnokeu_8s",
  authDomain: "indexador-demo-gemini.firebaseapp.com",
  projectId: "indexador-demo-gemini",
  storageBucket: "indexador-demo-gemini.firebasestorage.app",
  messagingSenderId: "1054037908225",
  appId: "1:1054037908225:web:90671d882c52c8f319d900",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, getDownloadURL };

export async function fetchFileUrl(path: string) {
  if (!path || path.trim() === "") return "/placeholder.jpg";

  try {
    const fileRef = ref(storage, path); // path debe ser algo como "CDES_inst/.../archivo.pdf"
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (err) {
    console.error("Error al obtener URL de Firebase:", err);
    return "/placeholder.jpg";
  }
}
