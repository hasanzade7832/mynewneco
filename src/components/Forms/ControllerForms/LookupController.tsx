// src/components/LookUpForms.tsx
import React, { useState, useEffect } from "react";
import { useApi } from "../../../context/ApiContext";

// کامپوننت‌های سفارشی شما:
import DynamicSelector from "../../utilities/DynamicSelector";
import PostPickerList from "./PostPickerList";
import DataTable from "../../TableDynamic/DataTable";

// تایپ‌های موردنیاز
import {
  EntityField,
  EntityType,
  GetEnumResponse,
  Role,
} from "../../../services/api.services";

import AppServices from "../../../services/api.services";

interface LookUpFormsProps {
  data?: {
    metaType1?: string | null; // ID مربوط به EntityType
    metaType2?: string | null; // ID مربوط به فیلد نمایش
    metaType3?: string;        // نمایش drop|radio|check
    metaType4?: string;        // داده‌های جدول به‌صورت JSON
    LookupMode?: string | null;
    CountInReject?: boolean;
    BoolMeta1?: boolean;
    // اضافه کردن metaType5 برای حالت ویرایش
    metaType5?: string;
  };
  onMetaChange?: (updatedMeta: any) => void;
}

// شکل هر ردیف جدول Lookup
interface TableRow {
  ID: string;                // شناسه ردیف
  srcField: string | null;   // ID فیلد مبدأ
  operation: string | null;  // مقدار Operation (فیلتر)
  filterText: string;        // متن فیلتر
  desField: string | null;   // ID فیلد مقصد
}

const LookUpForms: React.FC<LookUpFormsProps> = ({ data, onMetaChange }) => {
  // API methods از کانتکست
  const {
    getAllEntityType,
    getEntityFieldByEntityTypeId,
    getEnum,
    getAllProject,
  } = useApi();

  // state اصلی شبیه metaTypesLookUp
  const [metaTypesLookUp, setMetaTypesLookUp] = useState({
    metaType1: data?.metaType1 ?? null,   // EntityType ID
    metaType2: data?.metaType2 ?? null,   // Field ID
    metaType3: data?.metaType3 ?? "",     // نوع نمایش
    metaType4: data?.metaType4 ?? "",     // اطلاعات جدول (JSON)
    LookupMode: data?.LookupMode ?? "",
  });

  // مقداردهی اولیه چک‌باکس‌ها
  const [removeSameName, setRemoveSameName] = useState(data?.CountInReject ?? false);
  const [oldLookup, setOldLookup] = useState(data?.BoolMeta1 ?? false);

  // ------ بخش مهم: مدیریت metaType5 (Pipe-Separated IDs) ------
  // در حالت ویرایش اگر data?.metaType5 وجود داشت، آن را با split("|") در state می‌ریزیم:
  const [defaultValueIDs, setDefaultValueIDs] = useState<string[]>(
    data?.metaType5 ? data.metaType5.split("|") : []
  );

  // هر زمان defaultValueIDs آپدیت شود، آن را در metaType5 قرار می‌دهیم
  useEffect(() => {
    setMetaTypesLookUp((prev) => ({
      ...prev,
      // به‌صورت pipe جدا می‌کنیم
      metaType5: defaultValueIDs.join("|"),
    }));
  }, [defaultValueIDs]);

  // لیست کامل موجودیت‌ها
  const [getInformationFromList, setGetInformationFromList] = useState<EntityType[]>([]);
  // لیست فیلدهای نمایش
  const [columnDisplayList, setColumnDisplayList] = useState<EntityField[]>([]);
  // لیست فیلدهای srcField
  const [srcFieldList, setSrcFieldList] = useState<EntityField[]>([]);
  // لیست فیلدهای desField
  const [desFieldList, setDesFieldList] = useState<EntityField[]>([]);
  // لیست Modeها
  const [modesList, setModesList] = useState<{ value: string; label: string }[]>([]);
  // لیست Operationها
  const [operationList, setOperationList] = useState<{ value: string; label: string }[]>([]);
  // داده‌های جدول
  const [tableData, setTableData] = useState<TableRow[]>([]);
  // لیست Roles (مثال)
  const [roleRows, setRoleRows] = useState<Role[]>([]);

  // -----------------------------
  // parse اولیه از metaType4 به tableData
  // -----------------------------
  useEffect(() => {
    if (metaTypesLookUp.metaType4) {
      try {
        const parsed = JSON.parse(metaTypesLookUp.metaType4) as TableRow[];
        if (Array.isArray(parsed)) {
          setTableData(parsed);
        }
      } catch (err) {
        console.error("Error parsing metaTypesLookUp.metaType4 JSON:", err);
      }
    } else {
      setTableData([]);
    }
  }, [metaTypesLookUp.metaType4]);

  // -----------------------------
  // گرفتن لیست EntityTypeها
  // -----------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllEntityType();
        setGetInformationFromList(res);
      } catch (error) {
        console.error("Error fetching entity types:", error);
      }
    })();
  }, [getAllEntityType]);

  // -----------------------------
  // وقتی metaType1 تغییر کرد => فیلدها را می‌گیریم
  // -----------------------------
  useEffect(() => {
    (async () => {
      const { metaType1 } = metaTypesLookUp;
      if (metaType1) {
        try {
          const idAsNumber = Number(metaType1);
          if (!isNaN(idAsNumber)) {
            const fields = await getEntityFieldByEntityTypeId(idAsNumber);
            setColumnDisplayList(fields);
            setSrcFieldList(fields);
            setDesFieldList(fields);
          }
        } catch (error) {
          console.error("Error fetching fields by entity type ID:", error);
        }
      } else {
        setColumnDisplayList([]);
        setSrcFieldList([]);
        setDesFieldList([]);
      }
    })();
  }, [metaTypesLookUp.metaType1, getEntityFieldByEntityTypeId]);

  // -----------------------------
  // دریافت Mode (lookMode) و Operation (FilterOpration)
  // -----------------------------
  useEffect(() => {
    (async () => {
      try {
        // lookMode
        const lookModeResponse: GetEnumResponse = await AppServices.getEnum({ str: "lookMode" });
        const modes = Object.entries(lookModeResponse).map(([key, val]) => ({
          value: String(val),
          label: key,
        }));
        setModesList(modes);
      } catch (error) {
        console.error("Error fetching lookMode:", error);
      }

      try {
        // FilterOpration
        const filterOperationResponse: GetEnumResponse = await AppServices.getEnum({
          str: "FilterOpration",
        });
        const ops = Object.entries(filterOperationResponse).map(([key, val]) => ({
          value: String(val),
          label: key,
        }));
        setOperationList(ops);
      } catch (error) {
        console.error("Error fetching FilterOpration:", error);
      }
    })();
  }, [getEnum]);

  // -----------------------------
  // فراخوانی getAllProject برای نمایش/مثال PostPickerList
  // -----------------------------
  useEffect(() => {
    (async () => {
      try {
        const roles = await getAllProject();
        console.log("Fetched roles:", roles);
        setRoleRows(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    })();
  }, [getAllProject]);

  // -----------------------------
  // ارسال مقادیر به والد (onMetaChange)
  // -----------------------------
  useEffect(() => {
    if (onMetaChange) {
      const cloned = { ...metaTypesLookUp };
      // تبدیل مقادیر metaType1, metaType2 به رشته
      cloned.metaType1 = cloned.metaType1 ? String(cloned.metaType1) : "";
      cloned.metaType2 = cloned.metaType2 ? String(cloned.metaType2) : "";
      cloned.LookupMode = cloned.LookupMode ?? "";
      // اضافه‌کردن وضعیت چک‌باکس‌ها
      cloned.removeSameName = removeSameName;
      cloned.oldLookup = oldLookup;

      // در نهایت فراخوانی
      onMetaChange(cloned);
    }
  }, [metaTypesLookUp, removeSameName, oldLookup, onMetaChange]);

  // ----------------------------------
  // متدهای مربوط به DataTable (Add Row)
  // ----------------------------------
  const onAddItem = () => {
    const newRow: TableRow = {
      ID: crypto.randomUUID(),
      srcField: null,
      operation: null,
      filterText: "",
      desField: null,
    };
    setTableData((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
  };

  // ذخیره نهایی اطلاعات جدول در metaType4
  const handleSubmitRows = () => {
    try {
      const asString = JSON.stringify(tableData);
      setMetaTypesLookUp((prev) => ({ ...prev, metaType4: asString }));
      alert("Table data saved to metaType4 successfully!");
    } catch (error) {
      console.error("Error serializing table data:", error);
      alert("Error in saving table data.");
    }
  };

  // ----------------------------------
  // Event Handlers Select
  // ----------------------------------
  const handleSelectInformationFrom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetaTypesLookUp((prev) => ({ ...prev, metaType1: e.target.value || null }));
  };

  const handleSelectColumnDisplay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetaTypesLookUp((prev) => ({ ...prev, metaType2: e.target.value || null }));
  };

  const handleSelectMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLookupMode = e.target.value || "";
    setMetaTypesLookUp((prev) => ({
      ...prev,
      LookupMode: newLookupMode,
    }));
  };

  const handleChangeDisplayType = (type: string) => {
    setMetaTypesLookUp((prev) => ({ ...prev, metaType3: type }));
  };

  // ----------------------------------
  // مدیریت نام‌های پیش‌فرض برای نمایش (با استفاده از IDهای ذخیره شده)
  // ----------------------------------
  const [defaultValueNames, setDefaultValueNames] = useState<string[]>([]);

  useEffect(() => {
    // در هر تغییر defaultValueIDs یا roleRows، نام‌ها را مجدداً می‌سازیم
    const newNames = defaultValueIDs.map((id) => {
      const found = roleRows.find((r) => String(r.ID) === String(id));
      // فرض بر این است که در roleRows نام پروژه در فیلد ProjectName ذخیره شده است
      return found ? found.ProjectName : `Unknown ID ${id}`;
    });
    setDefaultValueNames(newNames);
  }, [defaultValueIDs, roleRows]);

  // توابع برای اضافه و حذف ID در defaultValueIDs
  const handleAddDefaultValueID = (id: string) => {
    // اگر آیتم تکراری نباشد اضافه شود
    setDefaultValueIDs((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };
  const handleRemoveDefaultValueIndex = (index: number) => {
    setDefaultValueIDs((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <div className="flex flex-col gap-8 p-4 bg-gradient-to-r from-pink-100 to-blue-100 rounded shadow-lg">
      {/* بخش بالایی: Selectors و تنظیمات */}
      <div className="flex gap-8">
        {/* بخش سمت چپ */}
        <div className="flex flex-col space-y-6 w-1/2">
          {/* Get information from */}
          <DynamicSelector
            name="getInformationFrom"
            label="Get information from"
            options={getInformationFromList.map((ent) => ({
              value: String(ent.ID),
              label: ent.Name,
            }))}
            selectedValue={metaTypesLookUp.metaType1 || ""}
            onChange={handleSelectInformationFrom}
          />

          {/* What Column To Display */}
          <DynamicSelector
            name="displayColumn"
            label="What Column To Display"
            options={columnDisplayList.map((field) => ({
              value: String(field.ID),
              label: field.DisplayName,
            }))}
            selectedValue={metaTypesLookUp.metaType2 || ""}
            onChange={handleSelectColumnDisplay}
          />

          {/* Modes */}
          <DynamicSelector
            name="modes"
            label="Modes"
            options={modesList}
            selectedValue={metaTypesLookUp.LookupMode || ""}
            onChange={handleSelectMode}
          />

          {/* Default Value (پست پیکر) */}
          <PostPickerList
            // ارسال نام‌های پیش‌فرض محاسبه‌شده به عنوان defaultValues (تنها ProjectNameها)
            defaultValues={defaultValueNames}
            // Callbacks برای اضافه/حذف
            onAddID={handleAddDefaultValueID}
            onRemoveIndex={handleRemoveDefaultValueIndex}
            fullWidth={true}
          />
        </div>

        {/* بخش سمت راست */}
        <div className="flex flex-col space-y-6 w-1/2">
          {/* Display choices using */}
          <div className="space-y-2">
            <label className="block font-medium">Display choices using:</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="displayType"
                  value="drop"
                  checked={metaTypesLookUp.metaType3 === "drop"}
                  onChange={() => handleChangeDisplayType("drop")}
                />
                Drop-Down Menu
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="displayType"
                  value="radio"
                  checked={metaTypesLookUp.metaType3 === "radio"}
                  onChange={() => handleChangeDisplayType("radio")}
                />
                Radio Buttons
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="displayType"
                  value="check"
                  checked={metaTypesLookUp.metaType3 === "check"}
                  onChange={() => handleChangeDisplayType("check")}
                />
                Checkboxes (allow multiple selections)
              </label>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={removeSameName}
                onChange={(e) => setRemoveSameName(e.target.checked)}
              />
              Remove Same Name
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={oldLookup}
                onChange={(e) => setOldLookup(e.target.checked)}
              />
              Old Lookup
            </label>
          </div>
        </div>
      </div>

      {/* بخش پایینی: جدول Lookup */}
      <div className="-mt-1">
        <DataTable
          columnDefs={[
            {
              headerName: "Src Field",
              field: "srcField",
              editable: true,
              cellEditor: "agSelectCellEditor",
              cellEditorParams: {
                values: srcFieldList.map((f) => String(f.ID)),
              },
              valueFormatter: (params: any) => {
                const matched = srcFieldList.find(
                  (f) => String(f.ID) === String(params.value)
                );
                return matched ? matched.DisplayName : params.value;
              },
            },
            {
              headerName: "Operation",
              field: "operation",
              editable: true,
              cellEditor: "agSelectCellEditor",
              cellEditorParams: {
                values: operationList.map((op) => op.value),
              },
              valueFormatter: (params: any) => {
                const matched = operationList.find(
                  (op) => String(op.value) === String(params.value)
                );
                return matched ? matched.label : params.value;
              },
            },
            {
              headerName: "Filter Text",
              field: "filterText",
              editable: true,
            },
            {
              headerName: "Des Field",
              field: "desField",
              editable: true,
              cellEditor: "agSelectCellEditor",
              cellEditorParams: {
                values: desFieldList.map((f) => String(f.ID)),
              },
              valueFormatter: (params: any) => {
                const matched = desFieldList.find(
                  (f) => String(f.ID) === String(params.value)
                );
                return matched ? matched.DisplayName : params.value;
              },
            },
          ]}
          rowData={tableData}
          setSelectedRowData={() => {}}
          showDuplicateIcon={false}
          showEditIcon={false}
          showAddIcon={false}
          showDeleteIcon={false}
          showSearch={false}
          domLayout="autoHeight"
          isRowSelected={false}
          showAddNew={true}
          onAddNew={onAddItem}
        />
      </div>

      {/* دکمه‌ی ذخیره‌سازی داده‌های جدول */}
      <div className="mt-4">
        <button
          onClick={handleSubmitRows}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Table Data
        </button>
      </div>
    </div>
  );
};

export default LookUpForms;
