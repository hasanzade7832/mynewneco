// src/components/UploadFilesPanel.tsx
import React, { useRef } from "react";
import { FiTrash2, FiDownload } from "react-icons/fi";

interface UploadFilesPanelProps {
  onWordUpload: (file: File) => void;
  onExcelUpload: (file: File) => void;
  wordFileName: string;
  excelFileName: string;
  onDeleteWord: () => void;
  onDeleteExcel: () => void;
  onDownloadWord?: () => void;
  onDownloadExcel?: () => void;
}

const UploadFilesPanel: React.FC<UploadFilesPanelProps> = ({
  onWordUpload,
  onExcelUpload,
  wordFileName,
  excelFileName,
  onDeleteWord,
  onDeleteExcel,
  onDownloadWord,
  onDownloadExcel,
}) => {
  const wordInputRef = useRef<HTMLInputElement | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const handleWordClick = () => {
    wordInputRef.current?.click();
  };

  const handleExcelClick = () => {
    excelInputRef.current?.click();
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onWordUpload(e.target.files[0]);
    }
  };

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onExcelUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      {/* بخش فایل ورد */}
      <div className="flex items-center space-x-2">
        {wordFileName && (
          <>
            <button
              type="button"
              onClick={onDownloadWord}
              className="p-2 border border-gray-300 rounded"
              title="دانلود فایل ورد"
            >
              <FiDownload size={18} />
            </button>
            <span className="text-gray-700 max-w-[150px] truncate">
              {wordFileName}
            </span>
          </>
        )}
        <button
          type="button"
          onClick={handleWordClick}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {wordFileName ? "تغییر فایل" : "انتخاب فایل"}
        </button>
        {wordFileName && (
          <button
            type="button"
            onClick={onDeleteWord}
            className="text-red-500 p-2"
            title="حذف فایل"
          >
            <FiTrash2 size={18} />
          </button>
        )}
        <input
          type="file"
          accept=".doc,.docx"
          ref={wordInputRef}
          className="hidden"
          onChange={handleWordChange}
        />
      </div>

      {/* بخش فایل اکسل */}
      <div className="flex items-center space-x-2">
        {excelFileName && (
          <>
            <button
              type="button"
              onClick={onDownloadExcel}
              className="p-2 border border-gray-300 rounded"
              title="دانلود فایل اکسل"
            >
              <FiDownload size={18} />
            </button>
            <span className="text-gray-700 max-w-[150px] truncate">
              {excelFileName}
            </span>
          </>
        )}
        <button
          type="button"
          onClick={handleExcelClick}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          {excelFileName ? "تغییر فایل" : "انتخاب فایل"}
        </button>
        {excelFileName && (
          <button
            type="button"
            onClick={onDeleteExcel}
            className="text-red-500 p-2"
            title="حذف فایل"
          >
            <FiTrash2 size={18} />
          </button>
        )}
        <input
          type="file"
          accept=".xls,.xlsx"
          ref={excelInputRef}
          className="hidden"
          onChange={handleExcelChange}
        />
      </div>
    </div>
  );
};

export default UploadFilesPanel;
