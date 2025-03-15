import React, { useState, useEffect, useCallback } from "react";
import DataTable from "../../TableDynamic/DataTable";
import DynamicInput from "../../utilities/DynamicInput";
import DynamicRadioGroup from "../../utilities/DynamicRadiogroup";
import DynamicButton from "../../utilities/DynamicButtons";
import FileUploadHandler, { InsertModel } from "../../../services/FileUploadHandler";
import { useApi } from "../../../context/ApiContext";
import { AFBtnItem } from "../../../services/api.services";

interface ButtonComponentProps {
  columnDefs: { headerName: string; field: string }[];
  onRowDoubleClick: (data: AFBtnItem) => void;
  onRowClick: (data: AFBtnItem) => void;
  onSelectButtonClick: () => void;
  isSelectDisabled: boolean;
  onClose: () => void;
  onSelectFromButton: () => void;
  refreshButtons: () => void; // تابع برای به‌روز‌رسانی لیست دکمه‌ها
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  columnDefs,
  onRowDoubleClick,
  onRowClick,
  onSelectButtonClick,
  isSelectDisabled,
  onClose,
  onSelectFromButton,
  refreshButtons,
}) => {
  const api = useApi();

  // وضعیت فرم
  const [selectedState, setSelectedState] = useState<string>("accept");
  const [selectedCommand, setSelectedCommand] = useState<string>("accept");
  const [nameValue, setNameValue] = useState("");
  const [stateTextValue, setStateTextValue] = useState("");
  const [tooltipValue, setTooltipValue] = useState("");
  const [orderValue, setOrderValue] = useState("");

  const [selectedRow, setSelectedRow] = useState<AFBtnItem | null>(null);
  const [isRowClicked, setIsRowClicked] = useState<boolean>(false);

  // مقدار فایل آپلودی
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // شمارنده ریست
  const [resetCounter, setResetCounter] = useState<number>(0);

  // داده‌های جدول (همیشه از API دریافت می‌شود)
  const [rowData, setRowData] = useState<AFBtnItem[]>([]);

  // وضعیت "Delete" button
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true);

  // وضعیت خطای تصویر
  const [imageError, setImageError] = useState<boolean>(false);

  // آپشن‌های رادیو
  const RadioOptionsState = [
    { value: "accept", label: "Accept" },
    { value: "reject", label: "Reject" },
    { value: "close", label: "Close" },
  ];
  const RadioOptionsCommand = [
    { value: "accept", label: "Accept" },
    { value: "reject", label: "Reject" },
    { value: "close", label: "Close" },
    { value: "client", label: "Previous State Client" },
    { value: "admin", label: "Previous State Admin" },
  ];

  const fetchAllAFBtn = async () => {
    try {
      const response = await api.getAllAfbtn();
      setRowData(response);
    } catch (error) {
      console.error("Error fetching AFBtn data:", error);
    }
  };

  useEffect(() => {
    fetchAllAFBtn();
  }, [api]);

  const handleReset = useCallback(() => {
    setNameValue("");
    setStateTextValue("");
    setTooltipValue("");
    setOrderValue("");
    setSelectedState(RadioOptionsState[0].value);
    setSelectedCommand(RadioOptionsCommand[0].value);
    setSelectedFileId(null);
    setSelectedRow(null);
    setIsRowClicked(false);
    setResetCounter((prev) => prev + 1);
    setIsDeleteDisabled(true);
    setImageError(false);
  }, [RadioOptionsState, RadioOptionsCommand]);

  const handleAddClick = async () => {
    try {
      const newAFBtn: AFBtnItem = {
        ID: 0,
        Name: nameValue,
        Tooltip: tooltipValue,
        StateText: stateTextValue,
        Order: parseInt(orderValue || "0"),
        WFStateForDeemed: radioToWFStateForDeemed(selectedState),
        WFCommand: radioToWFCommand(selectedCommand),
        IconImageId: selectedFileId,
        IsVisible: true,
        LastModified: null,
        ModifiedById: null,
      };
      await api.insertAFBtn(newAFBtn);
      alert("آیتم جدید با موفقیت درج شد.");
      await fetchAllAFBtn();
      if (refreshButtons) refreshButtons();
      handleReset();
    } catch (error) {
      console.error("Error inserting AFBtn:", error);
      alert("خطایی در درج رخ داد.");
    }
  };

  const handleEditClick = async () => {
    if (!selectedRow || !selectedRow.ID) {
      alert("لطفاً یک ردیف را انتخاب کنید.");
      return;
    }
    try {
      const updatedAFBtn: AFBtnItem = {
        ID: selectedRow.ID,
        Name: nameValue,
        Tooltip: tooltipValue,
        StateText: stateTextValue,
        Order: parseInt(orderValue || "0"),
        WFStateForDeemed: radioToWFStateForDeemed(selectedState),
        WFCommand: radioToWFCommand(selectedCommand),
        IconImageId: selectedFileId,
        IsVisible: true,
        LastModified: null,
        ModifiedById: null,
      };
      await api.updateAFBtn(updatedAFBtn);
      alert("آیتم با موفقیت ویرایش شد.");
      await fetchAllAFBtn();
      if (refreshButtons) refreshButtons();
      handleReset();
    } catch (error) {
      console.error("Error updating AFBtn:", error);
      alert("خطایی در ویرایش رخ داد.");
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedRow || !selectedRow.ID) {
      alert("لطفاً یک ردیف را انتخاب کنید.");
      return;
    }
    if (!window.confirm("آیا از حذف این آیتم مطمئن هستید؟")) {
      return;
    }
    try {
      await api.deleteAFBtn(selectedRow.ID);
      alert("آیتم با موفقیت حذف شد.");
      await fetchAllAFBtn();
      if (refreshButtons) refreshButtons();
      handleReset();
    } catch (error) {
      console.error("Error deleting AFBtn:", error);
      alert("خطایی در حذف رخ داد.");
    }
  };

  const handleNewClick = () => {
    handleReset();
  };

  const handleUploadSuccess = (insertModel: InsertModel) => {
    const newFileId = insertModel.ID || null;
    if (selectedRow) {
      const updatedRow = { ...selectedRow, IconImageId: newFileId };
      setSelectedRow(updatedRow);
    }
    setSelectedFileId(newFileId);
    fetchAllAFBtn();
  };

  useEffect(() => {
    if (selectedRow) {
      setIsDeleteDisabled(false);
    } else {
      setIsDeleteDisabled(true);
    }
  }, [selectedRow]);

  const mapWFStateForDeemedToRadio = (val: number) => {
    switch (val) {
      case 1:
        return "accept";
      case 2:
        return "reject";
      case 3:
        return "close";
      default:
        return "accept";
    }
  };

  const mapWFCommandToRadio = (val: number) => {
    switch (val) {
      case 1:
        return "accept";
      case 2:
        return "close";
      case 3:
        return "reject";
      case 4:
        return "client";
      case 5:
        return "admin";
      default:
        return "accept";
    }
  };

  const radioToWFStateForDeemed = (radioVal: string): number => {
    switch (radioVal) {
      case "accept":
        return 1;
      case "reject":
        return 2;
      case "close":
        return 3;
      default:
        return 1;
    }
  };
  const radioToWFCommand = (radioVal: string): number => {
    switch (radioVal) {
      case "accept":
        return 1;
      case "close":
        return 2;
      case "reject":
        return 3;
      case "client":
        return 4;
      case "admin":
        return 5;
      default:
        return 1;
    }
  };

  const handleRowDoubleClickLocal = (data: AFBtnItem) => {
    setSelectedRow(data);
    onRowDoubleClick(data);
  };

  const handleRowClickLocal = (data: AFBtnItem) => {
    setSelectedRow(data);
    onRowClick(data);
    setIsRowClicked(true);
    setNameValue(data.Name || "");
    setStateTextValue(data.StateText || "");
    setTooltipValue(data.Tooltip || "");
    setOrderValue(data.Order?.toString() || "");
    if (data.WFStateForDeemed !== undefined) {
      setSelectedState(mapWFStateForDeemedToRadio(data.WFStateForDeemed));
    } else {
      setSelectedState(RadioOptionsState[0].value);
    }
    if (data.WFCommand !== undefined) {
      setSelectedCommand(mapWFCommandToRadio(data.WFCommand));
    } else {
      setSelectedCommand(RadioOptionsCommand[0].value);
    }
    if (data.IconImageId) {
      setSelectedFileId(data.IconImageId);
      setImageError(false);
    } else {
      setSelectedFileId(null);
      setImageError(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        {/* بخش جدول */}
        <div className="mb-6 h-96 overflow-auto">
          <DataTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowDoubleClick={handleRowDoubleClickLocal}
            setSelectedRowData={handleRowClickLocal}
            showDuplicateIcon={false}
            onAdd={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            onDuplicate={() => {}}
            domLayout="normal"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DynamicInput
                name="Name"
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <DynamicInput
                name="StateText"
                type="text"
                value={stateTextValue}
                onChange={(e) => setStateTextValue(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <DynamicInput
                name="Tooltip"
                type="text"
                value={tooltipValue}
                onChange={(e) => setTooltipValue(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <DynamicInput
                name="Order"
                type="text"
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DynamicRadioGroup
                key={`state-${isRowClicked ? "controlled" : "uncontrolled"}`}
                title="State:"
                name="stateGroup"
                options={RadioOptionsState}
                selectedValue={selectedState}
                onChange={(value) => setSelectedState(value)}
                isRowClicked={isRowClicked}
                className="p-2 border rounded"
              />
              <DynamicRadioGroup
                key={`command-${isRowClicked ? "controlled" : "uncontrolled"}`}
                title="Command:"
                name="commandGroup"
                options={RadioOptionsCommand}
                selectedValue={selectedCommand}
                onChange={(value) => setSelectedCommand(value)}
                isRowClicked={isRowClicked}
                className="p-2 border rounded"
              />
            </div>
          </div>
          <div className="lg:col-span-1 flex flex-col items-center">
            <FileUploadHandler
              selectedFileId={selectedFileId}
              onUploadSuccess={handleUploadSuccess}
              resetCounter={resetCounter}
              onReset={handleReset}
            />
          </div>
        </div>
        {/* <div className="mt-4 flex justify-center">
          {selectedFileId ? (
            <>
              {!imageError ? (
                <img
                  src={`/api/getImage/${selectedFileId}`}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded shadow"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded">
                  <span className="text-sm text-gray-500">تصویر نامعتبر</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">هیچ تصویری انتخاب نشده است.</p>
          )}
        </div> */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <DynamicButton text="Add" onClick={handleAddClick} isDisabled={false} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition" />
          <DynamicButton text="Edit" onClick={handleEditClick} isDisabled={!selectedRow} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition" />
          <DynamicButton text="New" onClick={handleNewClick} isDisabled={false} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition" />
          <DynamicButton text="Delete" onClick={handleDeleteClick} isDisabled={isDeleteDisabled} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition" />
        </div>
      </div>
    </div>
  );
};

export default ButtonComponent;
