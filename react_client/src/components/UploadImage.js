import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fbconfig from '../firebase/FirebaseConfig';

const app = initializeApp(fbconfig);
const storage = getStorage(app);

export const UploadImage = async (image, user) => {
  if (image) {
    try {
      const storageRef = ref(storage, `images/userProfileImage/${user.uid}/${image.name}`);
      await uploadBytes(storageRef, image);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Download url:', downloadUrl);
      return downloadUrl;
    } catch (e) {
      console.log(e);
    }
  }
}