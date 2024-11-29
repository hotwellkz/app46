import React, { useState, useEffect } from 'react';
import { FileText, Download, Share2, Eye, Trash2, Upload, X } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { shareContent } from '../../utils/shareUtils';
import { Client } from '../../types/client';

interface ClientFile {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  path: string;
}

interface ClientFilesProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientFiles: React.FC<ClientFilesProps> = ({ client, isOpen, onClose }) => {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ClientFile | null>(null);

  useEffect(() => {
    if (client.files) {
      setFiles(client.files);
    }
  }, [client.files]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const filePath = `clients/${client.id}/files/${file.name}`;
        const fileRef = ref(storage, filePath);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const fileData: ClientFile = {
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          path: filePath
        };

        // Обновляем документ клиента
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, {
          files: arrayUnion(fileData)
        });

        return fileData;
      });

      await Promise.all(uploadPromises);
      
      // Обновляем локальное состояние
      if (client.files) {
        setFiles([...client.files, ...await Promise.all(uploadPromises)]);
      } else {
        setFiles(await Promise.all(uploadPromises));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Ошибка при загрузке файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (file: ClientFile) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      try {
        // Удаляем файл из Storage
        const fileRef = ref(storage, file.path);
        await deleteObject(fileRef);

        // Удаляем ссылку на файл из документа клиента
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, {
          files: arrayRemove(file)
        });

        // Обновляем локальное состояние
        setFiles(prev => prev.filter(f => f.path !== file.path));
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Ошибка при удалении файла');
      }
    }
  };

  const handleFileShare = async (file: ClientFile) => {
    const shareText = `
Файл: ${file.name}
Клиент: ${client.lastName} ${client.firstName}
Ссылка: ${file.url}
    `;

    await shareContent('Поделиться файлом', shareText);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl" style={{ maxHeight: '90vh' }}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Файлы клиента</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block w-full">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-600">
                  {loading ? 'Загрузка...' : 'Загрузить файлы'}
                </span>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.path}
                className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    title="Просмотреть"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    title="Скачать"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleFileShare(file)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    title="Поделиться"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleFileDelete(file)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                    title="Удалить"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {files.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Нет загруженных файлов
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};