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
  if (!path || path.trim() === "") {
    console.warn("⚠️ fetchFileUrl: Ruta vacía o nula");
    return "/placeholder.jpg";
  }

  try {
    const { storage } = getFirebaseServices();
    
    // 🔍 DEBUGGING DETALLADO
    console.log(`\n📁 === INTENTO DE CARGA ===`);
    console.log(`   Ruta original: "${path}"`);
    console.log(`   Longitud: ${path.length} caracteres`);
    console.log(`   Bytes (hex): ${Array.from(path).map(c => c.charCodeAt(0).toString(16).padStart(4, '0')).join(' ')}`);
    console.log(`   Contiene espacios: ${path.includes(' ')}`);
    console.log(`   Contiene "pes": ${path.toLowerCase().includes('pes')}`);
    console.log(`   Comienza con: "${path.substring(0, 20)}..."`);
    
    const fileRef = ref(storage, path);
    console.log(`   Ruta completa en Storage: gs://${storage.app.options.storageBucket}/${path}`);
    
    const url = await getDownloadURL(fileRef);
    console.log(`✅ ÉXITO: Archivo cargado - "${path}"`);
    return url;
  } catch (err: any) {
    console.error(`\n❌ === ERROR DE CARGA ===`);
    console.error(`   Ruta que falló: "${path}"`);
    console.error(`   Código de error: ${err?.code || 'DESCONOCIDO'}`);
    console.error(`   Mensaje: ${err?.message || 'Sin mensaje de error'}`);
    
    // Intentar variantes comunes
    if (path.includes(' ')) {
      console.warn(`   ⚠️ La ruta contiene ESPACIOS. Probando variantes...`);
      
      // Intentar con URL encoding
      try {
        const encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
        console.log(`   🔄 Intentando con encoding: "${encodedPath}"`);
        const { storage } = getFirebaseServices();
        const encodedRef = ref(storage, encodedPath);
        const encodedUrl = await getDownloadURL(encodedRef);
        console.log(`   ✅ ÉXITO con encoding!`);
        return encodedUrl;
      } catch (e) {
        console.error(`   ❌ Encoding tampoco funcionó`);
      }
      
      // Intentar sin espacios
      try {
        const noSpacePath = path.replace(/\s+/g, '');
        console.log(`   🔄 Intentando sin espacios: "${noSpacePath}"`);
        const { storage } = getFirebaseServices();
        const noSpaceRef = ref(storage, noSpacePath);
        const noSpaceUrl = await getDownloadURL(noSpaceRef);
        console.log(`   ✅ ÉXITO sin espacios!`);
        return noSpaceUrl;
      } catch (e) {
        console.error(`   ❌ Sin espacios tampoco funcionó`);
      }
    }
    
    console.error(`   Detalles del error:`, err);
    return "/placeholder.jpg";
  }
}
