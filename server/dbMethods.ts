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
  where,
  serverTimestamp,
  orderBy,
  DocumentData,
  startAfter,
  limit,
  getCountFromServer,
  WhereFilterOp,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import { BlogSchema } from "@/types/blog";

const db = getFirestore(app);
const blogsRef = collection(db, "blogs");

export const writeBlogsToDb = async (blog: BlogSchema) => {
  try {
    const docRef = await addDoc(blogsRef, {
      ...blog,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

export const editBlogToDb = async (blog: BlogSchema, blogId: string) => {
  try {
    await updateDoc(doc(db, "blogs", blogId), {
      ...blog,
      updatedAt: serverTimestamp(),
    });
    console.log("Document Updated with ID: ", blogId);
  } catch (e) {
    console.error("Error Updating document: ", e);
  }
};

export const getBlogsFromDb = async (
  filter: QueryFieldFilterConstraint[] | null,
  lastDoc?: DocumentData,
) => {
  try {
    let q;
    if (lastDoc) {
      q = query(
        blogsRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc?.data()?.createdAt),
        limit(1),
        ...(filter ?? []),
      );
    } else {
      q = query(
        blogsRef,
        orderBy("createdAt", "desc"),
        limit(1),
        ...(filter ?? []),
      );
    }
    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as BlogSchema),
    }));

    // Get the last document from the snapshot for pagination
    const firstVisibleDoc = querySnapshot.docs[0];
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { firstVisibleDoc, lastVisibleDoc, results };
  } catch (e) {
    console.error("Error getting documents: ", e);
    return {
      firstVisibleDoc: undefined,
      lastVisibleDoc: undefined,
      results: [],
    };
  }
};

export const getUserBlogsFromDb = async (
  userId: string | null,
  lastDoc?: DocumentData,
) => {
  const results = getBlogsFromDb([where("userId", "==", userId)], lastDoc);
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

export const getBlogsCountFromServer = async (filter?: {
  filterName?: string;
  operator?: WhereFilterOp;
  value?: string;
}) => {
  const collectionRef = collection(db, "blogs");
  let queryRef;
  if (filter?.filterName && filter?.operator && filter?.value) {
    queryRef = query(
      collectionRef,
      where(filter.filterName, filter.operator, filter.value),
    );
  } else {
    queryRef = query(collectionRef);
  }
  const totalCountRef = await getCountFromServer(queryRef);
  const totalCount = totalCountRef.data().count;
  return totalCount;
};

export const getBlogsFromTags = async (tag: string, lastDoc?: DocumentData) => {
  const results = getBlogsFromDb(
    [where("tags", "array-contains-any", [tag])],
    lastDoc,
  );
  return results;
};
