import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

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
