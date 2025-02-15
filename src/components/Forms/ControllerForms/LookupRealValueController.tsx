// src/components/ControllerForms/Lookuprealvalue.tsx

import React, { useState, useEffect } from "react";
import { useApi } from "../../../context/ApiContext";
import DynamicSelector from "../../utilities/DynamicSelector";
import PostPickerList from "./PostPickerList/PostPickerList";
import DataTable from "../../TableDynamic/DataTable";
import AppServices from "../../../services/api.services";
import {
  EntityField,
  EntityType,
  GetEnumResponse,
  Role,
} from "../../../services/api.services";

// تعریف prop های مورد نیاز برای کامپوننت
interface LookuprealvalueProps {
  data?: {
    metaType1?: string | null; // ID مربوط به EntityType
    metaType2?: string | null; // ID مربوط به فیلد نمایش
    metaType4?: string; // اطلاعات جدول به‌صورت JSON
    LookupMode?: string | null;
    BoolMeta1?: boolean; // مشخص‌کننده Old Lookup
    metaType5?: string; // برای نگهداری مقادیر پیش‌فرض (به صورت Pipe-Separated)
  };
  onMetaChange?: (updatedMeta: any) => void;
}

// تعریف نوع هر ردیف جدول Lookup
interface TableRow {
  ID: string;
  SrcFieldID: string | null;
  FilterOpration: string | null;
  FilterText: string;
  DesFieldID: string | null;
}

const Lookuprealvalue: React.FC<LookuprealvalueProps> = ({
  data,
  onMetaChange,
}) => {
  const {
    getAllEntityType,
    getEntityFieldByEntityTypeId,
    getEnum,
    getAllProject,
  } = useApi();

  // state اصلی مربوط به metaTypes (حذف metaType3 و removeSameName)
  const [metaTypesLookUp, setMetaTypesLookUp] = useState({
    metaType1: data?.metaType1 ?? null,
    metaType2: data?.metaType2 ?? null,
    metaType4: data?.metaType4 ?? "",
    LookupMode: data?.LookupMode ?? "",
    metaType5: data?.metaType5 ?? "",
  });

  // مدیریت Old Lookup
  const [oldLookup, setOldLookup] = useState(data?.BoolMeta1 ?? false);

  // مدیریت مقادیر پیش‌فرض (برای PostPickerList)
  const [defaultValueIDs, setDefaultValueIDs] = useState<string[]>(
    data?.metaType5 ? data.metaType5.split("|") : []
  );
  useEffect(() => {
    setMetaTypesLookUp((prev) => ({
      ...prev,
      metaType5: defaultValueIDs.join("|"),
    }));
  }, [defaultValueIDs]);

  // لیست‌های مربوط به EntityType و فیلدها
  const [getInformationFromList, setGetInformationFromList] = useState<
    EntityType[]
  >([]);
  const [columnDisplayList, setColumnDisplayList] = useState<EntityField[]>([]);
  const [srcFieldList, setSrcFieldList] = useState<EntityField[]>([]);
  const [desFieldList, setDesFieldList] = useState<EntityField[]>([]);
  const [modesList, setModesList] = useState<
    { value: string; label: string }[]
  >([]);
  const [operationList, setOperationList] = useState<
    { value: string; label: string }[]
  >([]);

  // داده‌های جدول Lookup
  const [tableData, setTableData] = useState<TableRow[]>([]);

  // لیست Roles (برای PostPickerList)
  const [roleRows, setRoleRows] = useState<Role[]>([]);

  // flag برای اطمینان از مقداردهی اولیه جدول تنها یک‌بار
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // مقداردهی اولیه جدول (در حالت ویرایش) تنها یک‌بار
  useEffect(() => {
    if (
      !initialDataLoaded &&
      data &&
      data.metaType4 &&
      data.metaType4.trim() !== ""
    ) {
      try {
        const parsed = JSON.parse(data.metaType4);
        const normalized = Array.isArray(parsed)
          ? parsed.map((item: any) => ({
              ...item,
              SrcFieldID:
                item.SrcFieldID != null ? String(item.SrcFieldID) : "",
              FilterOpration:
                item.FilterOpration != null ? String(item.FilterOpration) : "",
              DesFieldID:
                item.DesFieldID != null ? String(item.DesFieldID) : "",
              FilterText: item.FilterText || "",
            }))
          : [];
        setTableData(normalized);
      } catch (err) {
        console.error("Error parsing data.metaType4 JSON:", err);
        setTableData([]);
      } finally {
        setInitialDataLoaded(true);
      }
    }
  }, [data, initialDataLoaded]);

  // به‌روزرسانی metaType4 هنگام تغییر tableData
  useEffect(() => {
    try {
      const asString = JSON.stringify(tableData);
      setMetaTypesLookUp((prev) => ({ ...prev, metaType4: asString }));
    } catch (error) {
      console.error("Error serializing table data:", error);
    }
  }, [tableData]);

  // دریافت EntityType ها
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllEntityType();
        setGetInformationFromList(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Error fetching entity types:", error);
      }
    })();
  }, [getAllEntityType]);

  // دریافت فیلدهای مربوط به EntityType انتخاب‌شده
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

  // دریافت Enums برای Modes و FilterOpration
  useEffect(() => {
    (async () => {
      try {
        const lookModeResponse: GetEnumResponse = await AppServices.getEnum({
          str: "lookMode",
        });
        const modes = Object.entries(lookModeResponse).map(([key, val]) => ({
          value: String(val),
          label: key,
        }));
        setModesList(modes);
      } catch (error) {
        console.error("Error fetching lookMode:", error);
      }

      try {
        const filterOperationResponse: GetEnumResponse =
          await AppServices.getEnum({ str: "FilterOpration" });
        const ops = Object.entries(filterOperationResponse).map(
          ([key, val]) => ({
            value: String(val),
            label: key,
          })
        );
        setOperationList(ops);
      } catch (error) {
        console.error("Error fetching FilterOpration:", error);
      }
    })();
  }, [getEnum]);

  // دریافت Roles (برای PostPickerList)
  useEffect(() => {
    (async () => {
      try {
        const roles = await getAllProject();
        setRoleRows(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    })();
  }, [getAllProject]);

  // ارسال مقادیر به کامپوننت پدر (در صورت وجود)
  useEffect(() => {
    if (onMetaChange) {
      const cloned = { ...metaTypesLookUp };
      cloned.metaType1 = cloned.metaType1 ? String(cloned.metaType1) : "";
      cloned.metaType2 = cloned.metaType2 ? String(cloned.metaType2) : "";
      cloned.LookupMode = cloned.LookupMode ?? "";
      cloned.oldLookup = oldLookup;
      onMetaChange(cloned);
    }
  }, [metaTypesLookUp, oldLookup, onMetaChange]);

  // مدیریت نام‌های پیش‌فرض (برای PostPickerList)
  const [defaultValueNames, setDefaultValueNames] = useState<string[]>([]);
  useEffect(() => {
    const newNames = defaultValueIDs.map((id) => {
      const found = roleRows.find((r) => String(r.ID) === String(id));
      return found ? found.ProjectName : `Unknown ID ${id}`;
    });
    setDefaultValueNames(newNames);
  }, [defaultValueIDs, roleRows]);

  const handleAddDefaultValueID = (id: string) => {
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

  // Event handlers برای تغییر Select ها
  const handleSelectInformationFrom = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMetaTypesLookUp((prev) => ({
      ...prev,
      metaType1: e.target.value || null,
    }));
  };

  const handleSelectColumnDisplay = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMetaTypesLookUp((prev) => ({
      ...prev,
      metaType2: e.target.value || null,
    }));
  };

  const handleSelectMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLookupMode = e.target.value || "";
    setMetaTypesLookUp((prev) => ({
      ...prev,
      LookupMode: newLookupMode,
    }));
  };

  // افزودن ردیف جدید به جدول Lookup
  const onAddNew = () => {
    const newRow: TableRow = {
      ID: crypto.randomUUID(),
      SrcFieldID: "",
      FilterOpration: "",
      FilterText: "",
      DesFieldID: "",
    };
    setTableData((prev) => [...prev, newRow]);
  };

  // به‌روزرسانی سلول‌های جدول هنگام تغییر مقدار
  const handleCellValueChanged = (event: any) => {
    const updatedRow = event.data;
    setTableData((prev) =>
      prev.map((row) => (row.ID === updatedRow.ID ? updatedRow : row))
    );
  };

  return (
    <div className="flex flex-col gap-8 p-2 bg-gradient-to-r from-pink-100 to-blue-100 rounded shadow-lg">
      {/* بخش بالایی: Selectors و تنظیمات */}
      <div className="flex gap-8">
        {/* سمت چپ */}
        <div className="flex flex-col space-y-6 w-1/2">
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

          <DynamicSelector
            name="modes"
            label="Modes"
            options={modesList}
            selectedValue={metaTypesLookUp.LookupMode || ""}
            onChange={handleSelectMode}
          />

          <PostPickerList
            defaultValues={defaultValueNames}
            onAddID={handleAddDefaultValueID}
            onRemoveIndex={handleRemoveDefaultValueIndex}
            fullWidth={true}
          />
        </div>

        {/* سمت راست: فقط Old Lookup */}
        <div className="flex flex-col space-y-6 w-1/2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={oldLookup}
              onChange={(e) => setOldLookup(e.target.checked)}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <label className="text-gray-700 font-medium">Old Lookup</label>
          </div>
        </div>
      </div>

      {/* بخش پایینی: جدول Lookup */}
      <div className="mb-100">
        <DataTable
          columnDefs={[
            {
              headerName: "Src Field",
              field: "SrcFieldID",
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
              field: "FilterOpration",
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
              field: "FilterText",
              editable: true,
            },
            {
              headerName: "Des Field",
              field: "DesFieldID",
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
          showAddIcon={true} // نمایش آیکون افزودن ردیف
          showDeleteIcon={false}
          onAdd={onAddNew}
          onEdit={() => {}}
          onDelete={() => {}}
          onDuplicate={() => {}}
          onCellValueChanged={handleCellValueChanged}
          domLayout="autoHeight"
          isRowSelected={false}
          showSearch={false}
        />
      </div>
    </div>
  );
};

export default Lookuprealvalue;
