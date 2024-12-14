import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import fbconfig from '../firebase/FirebaseConfig';

const app = initializeApp(fbconfig);
const storage = getStorage(app);

export const UploadImage = async (image, user) => {
    const metaData = {
        contentType: image.type,
        user: user.displayName,
        id: user.uid
    }
    const storageRef = ref(storage, `images/userProfileImage/${user.uid}/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image, metaData);

    uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, 
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            return downloadURL;
          });

        }
      );
}