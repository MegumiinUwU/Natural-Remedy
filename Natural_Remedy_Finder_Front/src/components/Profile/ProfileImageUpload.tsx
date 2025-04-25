import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImage: string;
  onImageUpload: (file: File) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImage, onImageUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  return (
    <div className="relative group">
      <div 
        className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <img 
          src={currentImage} 
          alt="Profile" 
          className="h-full w-full object-cover"
        />
        <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <Camera className="text-white" size={24} />
        </div>
      </div>
      {isDragActive && (
        <div className="absolute inset-0 border-2 border-dashed border-green-500 rounded-full bg-green-50/20" />
      )}
    </div>
  );
};

export default ProfileImageUpload;