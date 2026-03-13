import { Injectable } from '@angular/core';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Storage, getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  /**
   * Uploads a Blob to a specified path in Firebase Storage
   * @param blob The image blob to upload
   * @param fileName The storage path (e.g., 'avatars/user123.jpg')
   * @returns A Promise resolving to the public download URL
   */
  async uploadImageBlob(blob: Blob, fileName: string): Promise<string> {
    const rootFolder = "artworks";
    const storage = getStorage();
    const storageRef = ref(storage, `${rootFolder}/${fileName}.jpg`);

    try {
      // 1. Upload the blob
      const snapshot = await uploadBytes(storageRef, blob);

      // 2. Get the public download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Firebase Upload Error:", error);
      throw error;
    }
  }


}
