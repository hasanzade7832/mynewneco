// src/components/utilities/ImageUploader.tsx

import React, { useState, useEffect } from "react";
import { FiImage } from "react-icons/fi";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  externalPreviewUrl?: string | null; // URL پیش‌نمایش تصویر دانلود شده یا آپلود شده
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  externalPreviewUrl,
}) => {
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // آپلود فایل با اینپوت
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInternalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // درگ‌اور
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // درگ‌لیو
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // دراپ فایل
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      onUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInternalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // هر تغییری در externalPreviewUrl اتفاق بیفتد (حتی null)،
  // پیش‌نمایش داخلی را پاک می‌کنیم تا فقط externalPreviewUrl نمایش داده شود.
  useEffect(() => {
    setInternalPreview(null);
  }, [externalPreviewUrl]);

  const previewSrc = externalPreviewUrl || internalPreview;

  return (
    <div className="w-full flex flex-col space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all duration-200 
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }
        `}
        style={{ minHeight: "200px" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Preview"
            className="max-h-48 object-contain rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FiImage size={48} />
            <p className="mt-2 text-sm">Drag & Drop or Click to Upload Image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
