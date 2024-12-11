// DynamicSelector.tsx

import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { classNames } from "primereact/utils";

interface Option {
  value: string;
  label: string;
}

interface DynamicSelectorProps {
  options: Option[];
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  showButton?: boolean;
  onButtonClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  className?: string;
}

const DynamicSelector: React.FC<DynamicSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  label = "Select",
  showButton = false,
  onButtonClick,
  leftIcon,
  rightIcon,
  error = false,
  errorMessage = "",
  className,
}) => {
  return (
    <div className={classNames("relative flex items-center gap-2", className)}>
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <select
          value={selectedValue}
          onChange={onChange}
          className={classNames(
            "w-full border-b-2 pr-10 bg-transparent appearance-none focus:outline-none transition-colors duration-300 text-gray-800 text-sm sm:text-base rounded-none",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-purple-600 focus:border-indigo-500"
          )}
          aria-label={label}
        >
          <option value="" disabled hidden></option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="ml-10">
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 pointer-events-none">
          {rightIcon ? rightIcon : <FaChevronDown size={16} />}
        </div>

        <label
          className={classNames(
            "absolute transform transition-all duration-300 cursor-text pointer-events-none",
            "text-gray-600",
            selectedValue
              ? "top-0 text-sm -translate-y-full left-0"
              : "top-1/2 text-base -translate-y-1/2 left-0"
          )}
        >
          {label}
        </label>

        {error && errorMessage && (
          <p className="mt-1 text-red-500 text-xs">{errorMessage}</p>
        )}
      </div>

      {showButton && (
        <button
          type="button"
          className="btn btn-sm bg-purple-600 text-white hover:bg-indigo-500 px-3 py-2 rounded-md shadow-sm transition-colors duration-300"
          onClick={onButtonClick}
        >
          ...
        </button>
      )}
    </div>
  );
};

export default DynamicSelector;
