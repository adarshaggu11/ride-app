import { Camera, CameraResultType, CameraSource, Photo, PermissionStatus } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

/**
 * Check if camera permission is granted
 */
export const checkCameraPermission = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - browser handles permissions
      return true;
    }

    const permission: PermissionStatus = await Camera.checkPermissions();
    return permission.camera === 'granted' && permission.photos === 'granted';
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

/**
 * Request camera and photo library permissions
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    const permission: PermissionStatus = await Camera.requestPermissions();
    return permission.camera === 'granted' && permission.photos === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Take a photo using device camera
 */
export const takePhoto = async (): Promise<string | undefined> => {
  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false
    });

    return photo.webPath;
  } catch (error) {
    console.error('Error taking photo:', error);
    throw new Error('Unable to take photo. Please check camera permissions.');
  }
};

/**
 * Pick a photo from gallery
 */
export const pickPhoto = async (): Promise<string | undefined> => {
  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    return photo.webPath;
  } catch (error) {
    console.error('Error picking photo:', error);
    throw new Error('Unable to select photo from gallery.');
  }
};

/**
 * Let user choose between camera or gallery
 */
export const selectPhoto = async (): Promise<string | undefined> => {
  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Shows dialog to choose camera or gallery
      promptLabelHeader: 'Select Photo',
      promptLabelPhoto: 'From Gallery',
      promptLabelPicture: 'Take Photo'
    });

    return photo.webPath;
  } catch (error) {
    console.error('Error selecting photo:', error);
    throw new Error('Unable to select photo.');
  }
};

/**
 * Convert photo to base64 string (for upload to server)
 */
export const photoToBase64 = async (photoUri: string): Promise<string> => {
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting photo to base64:', error);
    throw new Error('Unable to process photo.');
  }
};
