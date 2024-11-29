import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ProjectPhotosProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  photos: string[];
}

export const ProjectPhotos: React.FC<ProjectPhotosProps> = ({
  isOpen,
  onClose,
  projectId,
  photos = []
}) => {
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      // In a real application, you would upload these files to a storage service
      // For now, we'll just store the file names
      const fileNames = Array.from(files).map(file => file.name);
      
      const projectRef = doc(db, 'clients', projectId);
      await updateDoc(projectRef, {
        photos: arrayUnion(...fileNames)
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Ошибка при загрузке фотографий');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это фото?')) {
      try {
        const projectRef = doc(db, 'clients', projectId);
        await updateDoc(projectRef, {
          photos: arrayRemove(photo)
        });
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('Ошибка при удалении фотографии');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Фотографии проекта</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Нет загруженных фотографий
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Project photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <label className="block w-full">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              {uploading ? 'Загрузка...' : 'Загрузить фотографии'}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};