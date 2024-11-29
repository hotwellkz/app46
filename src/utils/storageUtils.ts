import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Проверяем размер файла (макс. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Файл слишком большой (максимум 5MB)');
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      throw new Error('Можно загружать только изображения');
    }

    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Ошибка при загрузке изображения');
  }
};

export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Ошибка при удалении изображения');
  }
};