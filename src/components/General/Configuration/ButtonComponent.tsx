// src/components/ButtonComponent.tsx
import React, { useState, useEffect } from "react";
import DataTable from "../../TableDynamic/DataTable";
import DynamicInput from "../../utilities/DynamicInput";
import DynamicRadioGroup from "../../utilities/DynamicRadiogroup";
import ImageUploader from "../../utilities/ImageUploader"; // Import ImageUploader

interface ButtonComponentProps {
  onClose: () => void;
  onRowSelect: (data: any) => void;
  onSelectFromButton: (data: any, state: string, image?: File) => void;
  columnDefs: { headerName: string; field: string }[];
  rowData: any[];
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  onClose,
  onRowSelect,
  onSelectFromButton,
  columnDefs,
  rowData,
}) => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const radioOptions = [
    { value: "accept", label: "Accept" },
    { value: "reject", label: "Reject" },
    { value: "close", label: "Close" },
  ];

  useEffect(() => {
    if (radioOptions.length > 0) {
      setSelectedState(radioOptions[0].value);
    }
  }, [radioOptions]);

  const handleRowDoubleClick = (data: any) => {
    setSelectedRow(data);
    onRowSelect(data);
  };

  const handleRowClick = (data: any) => {
    setSelectedRow(data);
  };

  const handleSelectButtonClick = () => {
    if (selectedRow && selectedState) {
      onSelectFromButton(
        selectedRow,
        selectedState,
        uploadedImage || undefined
      );
      onClose();
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const isSelectDisabled = !selectedRow || !selectedState;

  return (
    <div className=" bg-white rounded-lg p-6">
      <div>
        <DataTable
          columnDefs={columnDefs}
          rowData={rowData}
          onRowDoubleClick={handleRowDoubleClick}
          setSelectedRowData={handleRowClick}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-12">
        <DynamicInput name="Input 1" type="text" value="" onChange={() => {}} />
        <DynamicInput name="Input 2" type="text" value="" onChange={() => {}} />
        <DynamicInput
          name="Input 3"
          type="number"
          value=""
          onChange={() => {}}
        />
        <DynamicInput name="Input 4" type="text" value="" onChange={() => {}} />
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <DynamicRadioGroup
          title="State:"
          name="stateGroup"
          options={radioOptions}
          selectedValue={selectedState}
          onChange={(value) => setSelectedState(value)}
        />
        <ImageUploader onUpload={handleImageUpload} />
      </div>

      <div className="modal-action justify-center mt-6 space-x-4">
        <button
          className={`btn w-48 ${
            isSelectDisabled
              ? "bg-blue-300 text-gray-500 cursor-not-allowed"
              : "btn-primary"
          }`}
          onClick={handleSelectButtonClick}
          disabled={isSelectDisabled}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default ButtonComponent;
