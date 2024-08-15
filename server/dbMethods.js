import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

export const writeBlogsToDb = async (blog, onSuccess) => {
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
        ...blog
    }).then(onSuccess);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
