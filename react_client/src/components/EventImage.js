import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import fbconfig from '../firebase/FirebaseConfig';

const app = initializeApp(fbconfig);
const storage = getStorage(app);

export const UploadEventImage = async (image, event) => {
    if (image) {
      try {
        //create the path in firebase storage to store the image
        const storageRef = ref(storage, `images/events/${event._id}/${image.name}`);
  
        await uploadBytes(storageRef, image); //upload image
        const downloadUrl = await getDownloadURL(storageRef); //get firebase image url
        console.log('image uploaded to firebase storage successfully');
        return downloadUrl;
      } catch (e) {
        console.log('Error uploading image', e);
      }
    }
  }
  