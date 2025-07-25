import React from "react";
import DynamicModal from "../utilities/DynamicModal";
import { classNames } from "primereact/utils";

interface ListSelectorProps {
  title: string;
  className?: string;
  columnDefs: any[];
  rowData?: { ID: string | number; Name: string; DisplayName?: string }[];
  selectedIds: (string | number)[];
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  showSwitcher?: boolean;
  isGlobal: boolean;
  onGlobalChange?: (isGlobal: boolean) => void;
  ModalContentComponent: React.FC<any>;
  modalContentProps?: any;
  loading?: boolean;
}

const ListSelector: React.FC<ListSelectorProps> = ({
  title,
  className,
  columnDefs,
  rowData = [],
  selectedIds,
  onSelectionChange,
  showSwitcher = false,
  isGlobal = false,
  onGlobalChange,
  ModalContentComponent,
  modalContentProps = {},
  loading = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  // متنی که باید نمایش داده شود
  const getLabel = (row: any) => row?.DisplayName ?? row?.Name ?? "";

  const handleRowSelect = (data: any) => {
    const id = data.ID;
    if (!selectedIds.includes(id)) {
      onSelectionChange([...selectedIds, id]);
    }
    setIsDialogOpen(false);
    setSelectedRow(null);
  };

  const handleRemove = (id: string | number) => {
    onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const selectedItems = rowData.filter((row) => selectedIds.includes(row.ID));

  return (
    <div className={classNames("w-full", className)}>
      <div className="flex justify-between items-center p-2 rounded-t-md bg-gradient-to-r from-purple-600 to-indigo-500 h-10">
        <div className="flex items-center gap-2">
          {showSwitcher && (
            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer">
                <div
                  className={classNames(
                    "w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-300",
                    isGlobal ? "bg-pink-500" : "bg-gray-400"
                  )}
                  onClick={() => onGlobalChange && onGlobalChange(!isGlobal)}
                  style={{ minWidth: 36 }}
                >
                  <div
                    className={classNames(
                      "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300",
                      isGlobal ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </div>
                <span className="text-white text-xs ml-2 select-none">
                  Global
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-white">{title}</h3>
          <button
            className={classNames(
              "bg-purple-600 text-white px-1 py-1 rounded text-xs transition-colors duration-300 h-7 w-7 flex items-center justify-center",
              "hover:bg-purple-500",
              isGlobal ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""
            )}
            onClick={() => setIsDialogOpen(true)}
            aria-label={`افزودن ${title}`}
            disabled={isGlobal}
          >
            +
          </button>
        </div>
      </div>

      <div className="relative h-32 overflow-y-auto bg-gray-200 rounded-b-md p-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <svg
              className="animate-spin h-5 w-5 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : selectedItems.length === 0 ? (
          <p className="text-gray-500 text-xs text-center">No item is selected</p>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item.ID}
                className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <span className="text-gray-700 text-xs">{getLabel(item)}</span>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={() => handleRemove(item.ID)}
                  aria-label={`حذف ${getLabel(item)}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DynamicModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="large"
      >
        <ModalContentComponent
          {...modalContentProps}
          columnDefs={columnDefs}
          rowData={rowData}
          selectedRow={selectedRow}
          onRowDoubleClick={(row: any) => {
            handleRowSelect(row);
          }}
          onRowClick={(row: any) => {
            setSelectedRow(row);
          }}
          onSelectButtonClick={() => {
            if (selectedRow) handleRowSelect(selectedRow);
          }}
          isSelectDisabled={!selectedRow}
          onClose={() => setIsDialogOpen(false)}
        />
      </DynamicModal>
    </div>
  );
};

export default ListSelector;
