import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import fbconfig from '../firebase/FirebaseConfig';

const app = initializeApp(fbconfig);
const storage = getStorage(app);

export const UploadProfileImage = async (image, user) => {
  if (image) {
    try {
      //create the path in firebase storage to store the image
      const storageRef = ref(storage, `images/userProfileImage/${user.uid}/${image.name}`);

      await uploadBytes(storageRef, image); //upload image
      const downloadUrl = await getDownloadURL(storageRef); //get firebase image url
      console.log('image uploaded to firebase storage successfully');
      return downloadUrl;
    } catch (e) {
      console.log('Error uploading image', e);
    }
  }
}

export const DeleteProfileImage = (user, imagePath) => {
  if (user) {
    const storageRef = ref(storage, imagePath); //get the profile image for the user
    deleteObject(storageRef).then(() => {
      console.log('image deleted successfully from firebase storage');
    }).catch((e) => {
      console.log('Error trying to delete image:', e);
    });
  }
}