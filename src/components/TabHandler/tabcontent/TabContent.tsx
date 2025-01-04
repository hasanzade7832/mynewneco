// src/components/views/tabcontent/TabContent.tsx

import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  MouseEvent,
  useCallback,
  FC,
} from "react";
import DataTable from "../../TableDynamic/DataTable";
import PanelHeader from "../tabcontent/PanelHeader";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { showAlert } from "../../utilities/Alert/DynamicAlert";
import { ConfigurationHandle } from "../../General/Configuration/Configurations";
import { useApi } from "../../../context/ApiContext";

// کامپوننت کانفیرم
import DynamicConfirm from "../../utilities/DynamicConfirm";
import { CommandHandle } from "../../General/CommandSettings";

// اضافه کردن DynamicInput
import DynamicInput from "../../utilities/DynamicInput";
import { FaSave, FaEdit, FaTrash } from "react-icons/fa";

const LeftProjectAccess = React.lazy(
  () => import("../../Projects/ProjectAccess/Panel/LeftProjectAccess")
);
const RightProjectAccess = React.lazy(
  () => import("../../Projects/ProjectAccess/Panel/RightProjectAccess")
);

interface TabContentProps {
  component: React.LazyExoticComponent<React.ComponentType<any>> | null;
  columnDefs: any[];
  rowData: any[];
  onRowDoubleClick: (data: any) => void;
  selectedRow: any;
  activeSubTab: string;
  showDuplicateIcon: boolean;
  showEditIcon: boolean;
  showAddIcon: boolean;
  showDeleteIcon: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRowClick: (data: any) => void;
}

const TabContent: FC<TabContentProps> = ({
  component: Component,
  columnDefs,
  rowData,
  onRowDoubleClick,
  selectedRow,
  activeSubTab,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
  onRowClick,
  showDuplicateIcon,
  showEditIcon,
  showAddIcon,
  showDeleteIcon,
}) => {
  const api = useApi();
  const [panelWidth, setPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRightMaximized, setIsRightMaximized] = useState(false);
  const isMaximized = panelWidth >= 97;

  // دو رفرنس برای Configurations و Commands
  const configurationRef = useRef<ConfigurationHandle>(null);
  const commandRef = useRef<CommandHandle>(null);

  // برای DynamicConfirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmVariant, setConfirmVariant] = useState<"delete" | "edit">(
    "delete"
  );
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const togglePanelSize = () => {
    setIsRightMaximized(false);
    setPanelWidth((prevWidth) => (isMaximized ? 50 : 97));
  };

  const togglePanelSizeFromRight = (maximize: boolean) => {
    if (maximize) {
      setIsRightMaximized(true);
      setPanelWidth(2);
    } else {
      setIsRightMaximized(false);
      setPanelWidth(50);
    }
  };

  const startDragging = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | globalThis.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth =
        ((e.clientX - containerRect.left) / containerRef.current.clientWidth) *
        100;
      if (newWidth < 2) newWidth = 2;
      if (newWidth > 97) newWidth = 97;
      setIsRightMaximized(false);
      setPanelWidth(newWidth);
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDragging);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [isDragging, handleMouseMove, stopDragging]);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingSelectedRow, setPendingSelectedRow] = useState<any>(null);
  const [showRightAccessPanel, setShowRightAccessPanel] = useState(false);
  const [selectedSubItemForRight, setSelectedSubItemForRight] =
    useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchedRowData, setFetchedRowData] = useState<any[]>([]);

  // ----------------------------------------------------------------
  // متد fetchData: برای هر ساب‌تب، داده‌ی جدید را از API یا props بگیرید
  // ----------------------------------------------------------------
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeSubTab === "Configurations") {
        // برای Configuration
        const data = await api.getAllConfigurations();
        setFetchedRowData(data);
      }
      // *** اضافه کردن Commands ***
      else if (activeSubTab === "Commands") {
        const data = await api.getAllCommands();
        setFetchedRowData(data);
      }
      // *** اضافه کردن Ribbons ***
      else if (activeSubTab === "Ribbons") {
        const data = await api.getAllMenu();
        setFetchedRowData(data);
      }
      // به دلخواه: اگر زیرتب دیگری هم دارید، می‌توانید اینجا اضافه کنید
      else {
        setFetchedRowData(rowData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [api, activeSubTab, rowData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ----------------------------------------------------------------
  // Handle Insert (Save)
  // ----------------------------------------------------------------
  const handleInsert = async () => {
    try {
      if (activeSubTab === "Configurations" && configurationRef.current) {
        await configurationRef.current.save();
      } else if (activeSubTab === "Commands" && commandRef.current) {
        await commandRef.current.save();
      } else if (activeSubTab === "Ribbons") {
        await api.insertMenu({
          Name: nameInput,
          Description: descriptionInput,
          // می‌توانید مقادیر پیش‌فرض را تنظیم کنید یا داده‌های اضافی را جمع‌آوری کنید
          IsVisible: true, // مقدار پیش‌فرض نمونه
          // ModifiedById می‌تواند بر اساس کانتکست کاربر فعلی تنظیم شود
        });
        showAlert("success", null, "Saved", "Ribbon added successfully.");
        await fetchData(); // پس از ذخیره، مجدداً لیست را بگیرید
        setIsPanelOpen(false);
        setIsAdding(false);
        // ریست کردن ورودی‌ها
        setNameInput("");
        setDescriptionInput("");
      }
      // سایر عملیات...
    } catch (error) {
      console.error("Error saving:", error);
      showAlert("error", null, "Error", "Failed to save data.");
    }
  };

  // ----------------------------------------------------------------
  // Handle Update
  // ----------------------------------------------------------------
  const handleUpdate = async () => {
    try {
      if (activeSubTab === "Configurations" && configurationRef.current) {
        await configurationRef.current.save();
      } else if (activeSubTab === "Commands" && commandRef.current) {
        await commandRef.current.save();
      } else if (activeSubTab === "Ribbons") {
        if (selectedRow) {
          await api.updateMenu({
            ID: selectedRow.ID,
            Name: nameInput,
            Description: descriptionInput,
            // Include other required fields if necessary
            IsVisible: selectedRow.IsVisible, // Preserving existing value
            // ModifiedById می‌تواند بر اساس کانتکست کاربر فعلی تنظیم شود
          });
          showAlert("success", null, "Updated", "Ribbon updated successfully.");
          await fetchData();
          setIsPanelOpen(false);
          // ریست کردن ورودی‌ها
          setNameInput("");
          setDescriptionInput("");
        }
      }
      // سایر عملیات...
    } catch (error) {
      console.error("Error updating:", error);
      showAlert("error", null, "Error", "Failed to update data.");
    }
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    setIsAdding(false);
    resetRightPanel();
    // ریست کردن ورودی‌ها
    setNameInput("");
    setDescriptionInput("");
  };

  const resetRightPanel = () => {
    setShowRightAccessPanel(false);
    setSelectedSubItemForRight(null);
  };

  const handleDoubleClick = (data: any) => {
    onRowDoubleClick(data);
    setIsAdding(false);
    setIsPanelOpen(true);
    if (activeSubTab === "Ribbons") {
      setNameInput(data.Name); // نام ویژگی اصلاح شده
      setDescriptionInput(data.Description); // نام ویژگی اصلاح شده
    }
  };

  const handleRowClickLocal = (data: any) => {
    setPendingSelectedRow(data);
    onRowClick(data);
    if (activeSubTab === "Ribbons") {
      setNameInput(data.Name); // نام ویژگی اصلاح شده
      setDescriptionInput(data.Description); // نام ویژگی اصلاح شده
    }
  };

  // ----------------------------------------------------------------
  // Handle Add Click
  // ----------------------------------------------------------------
  const handleAddClick = () => {
    setIsAdding(true);
    setIsPanelOpen(true);
    onAdd();
    resetRightPanel();
    if (activeSubTab === "Ribbons") {
      setNameInput("");
      setDescriptionInput("");
    }
  };

  // ----------------------------------------------------------------
  // Handle Delete Click
  // ----------------------------------------------------------------
  const handleDeleteClick = () => {
    if (!pendingSelectedRow) {
      alert("Please select a row to delete.");
      return;
    }
    setConfirmVariant("delete");
    setConfirmTitle("Delete Confirmation");
    setConfirmMessage("Are you sure you want to delete this ribbon?");
    setConfirmAction(() => async () => {
      try {
        await api.deleteMenu(pendingSelectedRow.ID);
        showAlert("success", null, "Deleted", "Ribbon deleted successfully.");
        await fetchData(); // بعد از Delete هم لیست را رفرش می‌کنیم
      } catch (error) {
        console.error("Error deleting:", error);
        showAlert("error", null, "Error", "Failed to delete data.");
      }
    });
    setConfirmOpen(true);
  };

  // ----------------------------------------------------------------
  // Handle Duplicate Click
  // ----------------------------------------------------------------
  const handleDuplicateClick = () => {
    if (selectedRow) {
      onDuplicate();
      if (activeSubTab === "Ribbons") {
        setNameInput(selectedRow.Name); // نام ویژگی اصلاح شده
        setDescriptionInput(selectedRow.Description); // نام ویژگی اصلاح شده
        setIsAdding(true);
        setIsPanelOpen(true);
      }
    } else {
      alert("Please select a row to duplicate.");
    }
  };

  const handleLeftProjectDoubleClick = (subItemRow: any) => {
    setSelectedSubItemForRight(subItemRow);
    setShowRightAccessPanel(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await confirmAction();
  };

  // Stateهای جدید برای Ribbons
  const [nameInput, setNameInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionInput(e.target.value);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden mt-2 border border-gray-300 rounded-lg mb-6 flex relative"
      style={{ height: "100%" }}
    >
      <DynamicConfirm
        isOpen={confirmOpen}
        variant={confirmVariant}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />

      {/* پنل سمت چپ */}
      <div
        className="flex flex-col overflow-auto bg-gray-100 box-border"
        style={{
          flex: `0 0 calc(${panelWidth}% - 1px)`,
          transition: isDragging ? "none" : "flex-basis 0.1s ease-out",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div className="flex items-center justify-between p-2 border-b border-gray-300 bg-gray-100 w-full">
          <div className="font-bold text-gray-700 text-sm">{activeSubTab}</div>
          <button
            onClick={togglePanelSize}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            {isMaximized ? (
              <FiMinimize2 size={18} />
            ) : (
              <FiMaximize2 size={18} />
            )}
          </button>
        </div>

        <div className="h-full p-4 overflow-auto relative">
          <DataTable
            columnDefs={columnDefs}
            rowData={fetchedRowData}
            onRowDoubleClick={handleDoubleClick}
            setSelectedRowData={handleRowClickLocal}
            showDuplicateIcon={showDuplicateIcon}
            showEditIcon={showEditIcon}
            showAddIcon={showAddIcon}
            showDeleteIcon={showDeleteIcon}
            onAdd={handleAddClick}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            onDuplicate={handleDuplicateClick}
            isLoading={isLoading}
          />

          {/* اضافه کردن فرم برای Ribbons */}
          {activeSubTab === "Ribbons" && (
            <div className="-mt-32 w-full p-4 bg-white rounded-md shadow-md absolute ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <DynamicInput
                  name="Name"
                  type="text"
                  value={nameInput}
                  placeholder="Enter name"
                  onChange={handleNameChange}
                  required
                />
                <DynamicInput
                  name="Description"
                  type="text"
                  value={descriptionInput}
                  placeholder="Enter description"
                  onChange={handleDescriptionChange}
                  required
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                {/* Save Button - Only for Inserting */}
                <button
                  onClick={handleInsert}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  <FaSave /> Save
                </button>

                {/* Update and Delete Buttons - Only for Editing */}
                {!isAdding && selectedRow && (
                  <>
                    {/* Update Button */}
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <FaEdit /> Update
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* جداکننده */}
      <div
        onMouseDown={startDragging}
        className="flex items-center justify-center cursor-ew-resize w-2"
        style={{ userSelect: "none", cursor: "col-resize", zIndex: 30 }}
      >
        <div className="h-full w-1 bg-[#dd4bae] rounded"></div>
      </div>

      {/* پنل سمت راست */}
      {isPanelOpen && (
        <div
          className={`flex-1 transition-opacity duration-100 bg-gray-100 ${
            isMaximized ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
          style={{
            transition: "opacity 0.1s ease-out",
            backgroundColor: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            overflowX: panelWidth <= 30 ? "auto" : "hidden",
            maxWidth: panelWidth <= 30 ? "100%" : "100%",
          }}
        >
          <div
            className="h-full p-4 flex flex-col "
            style={{
              minWidth: panelWidth <= 30 ? "300px" : "auto",
            }}
          >
            {activeSubTab !== "Ribbons" && (
              <PanelHeader
                isExpanded={false}
                toggleExpand={() => {}}
                onSave={
                  isAdding &&
                  (activeSubTab === "Configurations" ||
                    activeSubTab === "Commands" ||
                    activeSubTab === "Ribbons")
                    ? handleInsert
                    : undefined
                }
                onUpdate={
                  !isAdding &&
                  (activeSubTab === "Configurations" ||
                    activeSubTab === "Commands" ||
                    activeSubTab === "Ribbons")
                    ? handleUpdate
                    : undefined
                }
                onClose={handleClose}
                onTogglePanelSizeFromRight={togglePanelSizeFromRight}
                isRightMaximized={isRightMaximized}
              />
            )}

            {activeSubTab === "ProjectsAccess" && (
              <Suspense fallback={<div>Loading Projects Access...</div>}>
                <div className="flex-grow mt-5 flex flex-wrap gap-2 h-full overflow-y-auto">
                  <div className="flex flex-col bg-gray-200 rounded-l-lg overflow-hidden min-w-[300px] w-1/2 border-r border-gray-300 p-2">
                    <div className="h-full p-2 overflow-auto">
                      <LeftProjectAccess
                        selectedRow={selectedRow}
                        onDoubleClickSubItem={handleLeftProjectDoubleClick}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col bg-gray-200 rounded-r-lg overflow-hidden min-w-[300px] w-1/2 p-2 h-full">
                    <div className="h-full p-2 overflow-auto">
                      {showRightAccessPanel && selectedSubItemForRight ? (
                        <RightProjectAccess
                          selectedRow={selectedSubItemForRight}
                        />
                      ) : (
                        <div className="text-center text-gray-400 mt-10">
                          Double click on a left table row to show details here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Suspense>
            )}

            {activeSubTab !== "ProjectsAccess" && activeSubTab !== "Ribbons" && Component && (
              <div className="mt-5 flex-grow overflow-y-auto">
                <div style={{ minWidth: "600px" }}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Component
                      key={
                        isAdding
                          ? "add-mode"
                          : selectedRow
                          ? selectedRow.ID
                          : "no-selection"
                      }
                      selectedRow={isAdding ? null : selectedRow}
                      // ارجاع به رفرنس درست
                      ref={
                        activeSubTab === "Configurations"
                          ? configurationRef
                          : activeSubTab === "Commands"
                          ? commandRef
                          : null
                      }
                    />
                  </Suspense>
                </div>
              </div>
            )}

            {/* اگر پنل برای Ribbons باز باشد */}
            {activeSubTab === "Ribbons" && Component && (
              <div className="mt-5 flex-grow overflow-y-auto">
                <div style={{ minWidth: "600px" }}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Component
                      key={
                        isAdding
                          ? "add-mode"
                          : selectedRow
                          ? selectedRow.ID
                          : "no-selection"
                      }
                      selectedRow={isAdding ? null : selectedRow}
                      // ارجاع به رفرنس درست
                      ref={
                        activeSubTab === "Ribbons"
                          ? null
                          : activeSubTab === "Commands"
                          ? commandRef
                          : null
                      }
                    />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabContent;
