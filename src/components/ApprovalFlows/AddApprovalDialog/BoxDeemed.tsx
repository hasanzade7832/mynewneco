import React, { useState, useEffect } from "react";
import DynamicSelector from "../../utilities/DynamicSelector";
import AppServices, { GetEnumResponse } from "../../../services/api.services";

interface DeemedSectionProps {
  deemDay: number;
  setDeemDay: (val: number) => void;
  deemCondition: number;
  setDeemCondition: (val: number) => void;
  deemAction: number;
  setDeemAction: (val: number) => void;
  previewsStateId: number | null;
  setPreviewsStateId: (val: number | null) => void;
  goToPreviousStateID: number | null;
  setGoToPreviousStateID: (val: number | null) => void;
  boxTemplates: { ID: number; Name: string }[];
  disableMain?: boolean;
  showAdminSection?: boolean;
}

const DeemedSection: React.FC<DeemedSectionProps> = ({
  deemDay,
  setDeemDay,
  deemCondition,
  setDeemCondition,
  deemAction,
  setDeemAction,
  previewsStateId,
  setPreviewsStateId,
  goToPreviousStateID,
  setGoToPreviousStateID,
  boxTemplates,
  disableMain = false,
  showAdminSection = true,
}) => {
  const [fromOptions, setFromOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [statusOptions, setStatusOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [loadingEnums, setLoadingEnums] = useState<boolean>(false);
  const [errorEnums, setErrorEnums] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnums = async () => {
      setLoadingEnums(true);
      setErrorEnums(null);
      try {
        // دریافت DeemCondition (برای From)
        const response1: GetEnumResponse = await AppServices.getEnum({
          str: "DeemCondition",
        });
        const fromOpts = Object.entries(response1).map(([key, val]) => ({
          value: Number(val),
          label: key,
        }));
        setFromOptions(fromOpts);
      } catch (error) {
        console.error("Error fetching DeemCondition enums:", error);
        setErrorEnums("خطا در دریافت DeemCondition");
      }
      try {
        // دریافت DeemAction (برای The status will set to)
        const response2: GetEnumResponse = await AppServices.getEnum({
          str: "DeemAction",
        });
        const statusOpts = Object.entries(response2).map(([key, val]) => ({
          value: Number(val),
          label: key,
        }));
        setStatusOptions(statusOpts);
      } catch (error) {
        console.error("Error fetching DeemAction enums:", error);
        setErrorEnums("خطا در دریافت DeemAction");
      } finally {
        setLoadingEnums(false);
      }
    };
    fetchEnums();
  }, []);

  // گزینه‌های مربوط به Previous State از boxTemplates
  const previousStateOptions = boxTemplates.map((box) => ({
    value: box.ID,
    label: box.Name,
  }));

  return (
    <div className="mt-4">
      {/* باکس A: ورودی‌های اصلی Deemed */}
      <div className="bg-gray-200 p-2 rounded mb-4">
        <div className="flex flex-col space-y-4">
          {/* After */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">After</span>
            <input
              type="number"
              value={deemDay}
              onChange={(e) => setDeemDay(Number(e.target.value))}
              className="border border-gray-300 rounded p-1 w-16 text-sm"
              disabled={disableMain}
            />
          </div>

          {/* From (DeemCondition) */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">From</span>
            <DynamicSelector
              options={fromOptions}
              selectedValue={deemCondition.toString()}
              onChange={(e) => setDeemCondition(Number(e.target.value))}
              label=""
              className="w-40"
              disabled={disableMain}
            />
          </div>

          {/* The status will set to (DeemAction) */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              The status will set to
            </span>
            <DynamicSelector
              options={statusOptions}
              selectedValue={deemAction.toString()}
              onChange={(e) => setDeemAction(Number(e.target.value))}
              label=""
              className="w-40"
              disabled={disableMain}
            />
          </div>

          {/* Previous State */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Previous State</span>
            <DynamicSelector
              options={previousStateOptions}
              selectedValue={
                previewsStateId !== null ? previewsStateId.toString() : ""
              }
              onChange={(e) =>
                setPreviewsStateId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              label=""
              className="w-40"
              disabled={disableMain}
            />
          </div>
        </div>
        {loadingEnums && (
          <p className="text-xs text-gray-600 mt-2">Loading enums...</p>
        )}
        {errorEnums && (
          <p className="text-xs text-red-600 mt-2">{errorEnums}</p>
        )}
      </div>

      {/* باکس B: بخش "If user clicks on a button with command ..." همیشه نمایش داده می‌شود */}
      <div className="bg-gray-100 p-2 rounded">
        <p className="text-sm text-gray-700 mb-2">
          If user clicks on a button with command{" "}
          <span className="font-bold">"Go to Previous State By Admin"</span>,
          the previous state will set to:
        </p>
        <DynamicSelector
          options={previousStateOptions}
          selectedValue={
            goToPreviousStateID !== null ? goToPreviousStateID.toString() : ""
          }
          onChange={(e) =>
            setGoToPreviousStateID(
              e.target.value ? Number(e.target.value) : null
            )
          }
          label=""
          className="w-40"
          // این قسمت همواره فعال است
        />
      </div>
    </div>
  );
};

export default DeemedSection;
