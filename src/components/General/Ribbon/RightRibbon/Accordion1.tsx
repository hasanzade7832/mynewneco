// src/components/Accordion1.tsx

import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import DynamicInput from "../../../utilities/DynamicInput";
import { FaSearch } from "react-icons/fa";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useSubTabDefinitions } from "../../../../context/SubTabDefinitionsContext";
import AppServices, { MenuTab } from "../../../../services/api.services"; // اطمینان حاصل کنید که مسیر صحیح است

interface Accordion1Props {
  onRowClick: (row: any) => void;
  onRowDoubleClick: (menuTabId: number) => void;
  isOpen: boolean;
  toggleAccordion: () => void;
}

interface RowData1 {
  ID: number;
  Name: string;
  Description: string;
  Order: number;
}

const Accordion1: React.FC<Accordion1Props> = ({
  onRowClick,
  onRowDoubleClick,
  isOpen,
  toggleAccordion,
}) => {
  const { subTabDefinitions, fetchDataForSubTab } = useSubTabDefinitions();
  const [selectedRow, setSelectedRow] = useState<RowData1 | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [rowData, setRowData] = useState<RowData1[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<RowData1>>({});

  const columnDefs: ColDef<RowData1>[] =
    subTabDefinitions["MenuTab"].columnDefs;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // فرض بر این است که nMenuId از یک منبع خاص گرفته می‌شود؛ در اینجا برای مثال، از 1 استفاده شده است
      // شما باید این مقدار را از انتخاب قبلی دریافت کنید
      const nMenuId = 1; // جایگزین کنید با مقدار واقعی اگر نیاز بود
      fetchDataForSubTab("MenuTab", { nMenuId })
        .then((data: RowData1[]) => {
          setRowData(data);
        })
        .catch((error: any) => {
          console.error("Error fetching MenuTabs:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setRowData([]);
      setSelectedRow(null);
      onRowClick(null);
      setIsEditing(false);
      setIsAdding(false);
      setFormData({});
    }
  }, [isOpen, fetchDataForSubTab, subTabDefinitions, onRowClick]);

  const filteredRowData = useMemo(() => {
    if (!searchText) return rowData;
    return rowData.filter((row) =>
      row.Name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, rowData]);

  const handleRowClick = (event: any) => {
    const row = event.data as RowData1;
    setSelectedRow(row);
    onRowClick(row);
  };

  const handleRowDoubleClickEvent = () => {
    if (selectedRow) {
      onRowDoubleClick(selectedRow.ID);
    }
  };

  const onEdit = async () => {
    if (!selectedRow) return;
    setIsEditing(true);
    setFormData({ ...selectedRow });
  };

  const onDelete = async () => {
    if (!selectedRow) return;
    const confirmDelete = window.confirm(
      `آیا از حذف MenuTab "${selectedRow.Name}" مطمئن هستید؟`
    );
    if (!confirmDelete) return;

    try {
      await AppServices.deleteMenuTab(selectedRow.ID);
      setRowData((prev) => prev.filter((row) => row.ID !== selectedRow.ID));
      setSelectedRow(null);
      onRowClick(null);
      alert("حذف موفقیت‌آمیز بود.");
    } catch (error) {
      console.error("Error deleting MenuTab:", error);
      alert("حذف با خطا مواجه شد.");
    }
  };

  const onAdd = () => {
    setIsAdding(true);
    const newId =
      rowData.length > 0 ? Math.max(...rowData.map((r) => r.ID)) + 1 : 1;
    const newRow: RowData1 = {
      ID: newId,
      Name: "",
      Description: "",
      Order: 0,
    };
    setFormData(newRow);
    setSelectedRow(newRow);
    onRowClick(newRow);
  };

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (isEditing) {
      // ویرایش MenuTab
      if (!formData.ID || !formData.Name) {
        alert("لطفاً نام را وارد کنید.");
        return;
      }
      try {
        const updatedMenuTab: MenuTab = {
          ID: formData.ID,
          Name: formData.Name,
          Description: formData.Description || "",
          Order: formData.Order || 0,
          nMenuId: 1, // باید مقدار واقعی را جایگزین کنید
          IsVisible: true, // یا مقدار مناسب
          ModifiedById: null, // جایگزین با مقدار واقعی
          LastModified: null,
        };
        const result = await AppServices.updateMenuTab(updatedMenuTab);
        setRowData((prev) =>
          prev.map((row) => (row.ID === result.ID ? result : row))
        );
        setIsEditing(false);
        setFormData({});
        alert("ویرایش با موفقیت انجام شد.");
      } catch (error) {
        console.error("Error updating MenuTab:", error);
        alert("ویرایش با خطا مواجه شد.");
      }
    } else if (isAdding) {
      // درج MenuTab جدید
      if (!formData.Name) {
        alert("لطفاً نام را وارد کنید.");
        return;
      }
      try {
        const newMenuTab: MenuTab = {
          ID: formData.ID!,
          Name: formData.Name,
          Description: formData.Description || "",
          Order: formData.Order || 0,
          nMenuId: 1, // باید مقدار واقعی را جایگزین کنید
          IsVisible: true, // یا مقدار مناسب
          ModifiedById: null, // جایگزین با مقدار واقعی
          LastModified: null,
        };
        const result = await AppServices.insertMenuTab(newMenuTab);
        setRowData((prev) => [...prev, result]);
        setIsAdding(false);
        setFormData({});
        alert("اضافه کردن با موفقیت انجام شد.");
      } catch (error) {
        console.error("Error inserting MenuTab:", error);
        alert("اضافه کردن با خطا مواجه شد.");
      }
    }
  };

  const handleFormCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setFormData({});
    if (isAdding) {
      setSelectedRow(null);
      onRowClick(null);
    }
  };

  return (
    <div
      className={`collapse bg-base-200 mb-4 ${isOpen ? "collapse-open" : ""}`}
    >
      <div
        className="collapse-title text-xl font-medium cursor-pointer flex justify-between items-center"
        onClick={toggleAccordion}
      >
        <span>Menu Tabs</span>
        {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </div>
      <div className="collapse-content">
        {isOpen && (
          <>
            {/* نوار جستجو و دکمه‌های عملیات */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit"
                  onClick={onEdit}
                  disabled={!selectedRow}
                >
                  <FiEdit size={25} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete"
                  onClick={onDelete}
                  disabled={!selectedRow}
                >
                  <FiTrash2 size={25} />
                </button>
                <button
                  className="text-green-600 hover:text-green-800 transition"
                  title="Add"
                  onClick={onAdd}
                >
                  <FiPlus size={25} />
                </button>
              </div>
            </div>

            {/* جدول داده‌ها */}
            <div
              className="ag-theme-quartz"
              style={{ height: "300px", width: "100%" }}
            >
              <AgGridReact<RowData1>
                columnDefs={columnDefs}
                rowData={filteredRowData}
                pagination={true}
                paginationPageSize={5}
                onRowClicked={handleRowClick}
                onRowDoubleClicked={handleRowDoubleClickEvent}
                rowSelection="single"
                animateRows={true}
                overlayLoadingTemplate='<span class="ag-overlay-loading-center">در حال بارگذاری...</span>'
                loadingOverlayComponentParams={{
                  loadingMessage: "در حال بارگذاری...",
                }}
              />
            </div>

            {/* فرم ویرایش یا افزودن */}
            {(isEditing || isAdding) && formData && (
              <div className="mt-4 p-4 border rounded bg-white">
                <h3 className="text-lg font-semibold mb-2">
                  {isEditing ? "ویرایش MenuTab" : "افزودن MenuTab جدید"}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <DynamicInput
                    name="Name"
                    type="text"
                    value={formData.Name || ""}
                    placeholder="نام"
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                    className="mt-2"
                  />
                  <DynamicInput
                    name="Description"
                    type="text"
                    value={formData.Description || ""}
                    placeholder="توضیحات"
                    onChange={(e) =>
                      handleInputChange("Description", e.target.value)
                    }
                    className="mt-2"
                  />
                  <DynamicInput
                    name="Order"
                    type="number"
                    value={formData.Order || 0}
                    placeholder="ترتیب"
                    onChange={(e) =>
                      handleInputChange(
                        "Order",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    onClick={handleFormCancel}
                  >
                    لغو
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={handleFormSubmit}
                  >
                    {isEditing ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Accordion1;
