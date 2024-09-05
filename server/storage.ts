import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "./firebaseConfig";
import { getBlogsFromDb } from "./dbMethods";

const storage = getStorage(app);

type Blog = {
  id: string;
  userId: string | null;
  blogTitle: string;
  blogUrl: string;
  image: {
    name: string;
    url: string;
  };
  tags: string[];
  markdown: string;
};

export const uploadImage = async (image: File | null) => {
  if (!image) return;

  const storageRef = ref(storage, `images/${image.name}`);

  try {
    await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (
  imageURL: string,
) => {
  const storageRef = ref(storage, `images/${imageURL}`);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};
