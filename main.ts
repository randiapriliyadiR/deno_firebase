import { Hono } from '@hono/hono';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { getFirestore,collection,addDoc,getDocs, doc,getDoc } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';

const firebaseConfig = Deno.env.get('FIREBASE_CONFIG');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = new Hono();

app.get('/test', async(c) => {
  const collectionRef = collection(db, "tests");
  const snapshotRef = await getDocs(collectionRef);
  const dataList = snapshotRef.docs.map((doc) => doc.data());
  return c.json({ 'message':dataList });
});

app.get("/test/:id", async (c) => {
  const { id } = c.req.param(); // ambil ID dari path param
  const docRef = doc(db, "tests", id);
  const docSnap = await getDoc(docRef); // ✅ gunakan getDoc

  if (!docSnap.exists()) {
    return c.json({ error: "Document not found" }, 404);
  }

  const data = docSnap.data(); // ✅ ambil data isi dokumen
  return c.json({ data }); // tampilkan hanya isi datanya, tanpa id
});

app.post('/test', async (c) => {
  const data = await c.req.json();
  // add data to firebase
  const docRef = await addDoc(collection(db, "tests"), data);
  return await c.json({ 'message': docRef.id });
});

Deno.serve(app.fetch);