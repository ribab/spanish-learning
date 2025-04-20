import React from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  apiEndpoint: string;
  value: string;
  onChange: (url: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ apiEndpoint, value, onChange }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Here you would typically upload the file to your storage service
    // For now, we'll just simulate it with a local URL
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {value && (
        <img
          src={value}
          alt="Uploaded file"
          className="w-32 h-32 object-cover rounded-full"
        />
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        Upload File
      </Button>
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default FileUpload; 