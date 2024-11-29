import React, { useState, useRef } from 'react';
import { Client } from '../types/client';
import { ClientHeader } from '../components/clients/ClientHeader';
import { ClientDetails } from '../components/clients/ClientDetails';
import { ClientFiles } from '../components/clients/ClientFiles';

interface ClientPageProps {
  client: Client;
  onBack: () => void;
  onSave: () => void;
}

export const ClientPage: React.FC<ClientPageProps> = ({ client, onBack, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const detailsRef = useRef<any>(null);

  const handleSave = async () => {
    if (detailsRef.current?.handleSave) {
      setLoading(true);
      try {
        await detailsRef.current.handleSave();
        setIsEditing(false);
        onSave();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader 
        client={client}
        onBack={onBack}
        onSave={onSave}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        loading={loading}
        handleSave={handleSave}
        onFilesClick={() => setShowFiles(true)}
      />
      <ClientDetails 
        ref={detailsRef}
        client={client}
        onSave={onSave}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      {showFiles && (
        <ClientFiles
          client={client}
          isOpen={showFiles}
          onClose={() => setShowFiles(false)}
        />
      )}
    </div>
  );
};