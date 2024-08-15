import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

export const uploadImage = async (image) => {
  if (!image) return;
  
  const storageRef = ref(storage, `images/${image.name}`);

  try {
    await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Image uploaded successfully:", downloadURL);
    return downloadURL;
    // Save the downloadURL in your database or state
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
