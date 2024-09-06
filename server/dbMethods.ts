import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  QueryFieldFilterConstraint,
  updateDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import { BlogSchema } from "@/types/blog";

const db = getFirestore(app);
const blogsRef = collection(db, "blogs");


export const writeBlogsToDb = async (blog: BlogSchema) => {
  try {
    const docRef = await addDoc(blogsRef, blog);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

export const editBlogToDb = async (blog: BlogSchema, blogId: string) => {
  try {
    await updateDoc(doc(db, "blogs", blogId), blog);
    console.log("Document Updated with ID: ", blogId);
  } catch (e) {
    console.error("Error Updating document: ", e);
  }
};

export const getBlogsFromDb = async (
  filter: QueryFieldFilterConstraint | null,
) => {
  try {
    let q;
    if (filter) {
      q = query(blogsRef, filter);
    } else {
      q = query(blogsRef);
    }
    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as BlogSchema),
    }));
    return results;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const getUserBlogsFromDb = async (userId: string) => {
  const results = getBlogsFromDb(where("userId", "==", userId));
  return results;
};

export const getBlogPageData = async (blogUrl: string) => {
  const q = query(collection(db, "blogs"), where("blogUrl", "==", blogUrl));
  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as BlogSchema),
  }));
  return results;
};

export const deleteBlogFromDb = async (blogId: string) => {
  try {
    await deleteDoc(doc(db, "blogs", blogId));
    console.log("Document Deleted with ID: ", blogId);
  } catch (e) {
    console.error("Error Deleting document: ", e);
  }
};
