import React from 'react'
import { classNames } from 'primereact/utils'

interface Option {
  value: string
  label: string
}

interface DynamicSelectorProps {
  name?: string
  options: Option[]
  selectedValue: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  label?: string
  showButton?: boolean
  onButtonClick?: () => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode // اگر ایکون سفارشی دارید
  error?: boolean
  errorMessage?: string
  className?: string
  disabled?: boolean
}

const DynamicSelector: React.FC<DynamicSelectorProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  label = 'Select',
  showButton = false,
  onButtonClick,
  leftIcon,
  error = false,
  errorMessage = '',
  className,
  disabled = false
}) => {
  return (
    <div
      className={classNames(
        'relative flex items-center gap-2 group',
        className,
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      )}
    >
      {/* لیبل شناور */}
      {label && (
        <label
          htmlFor={name}
          className='absolute -top-3 left-4 bg-pink-100 px-1 text-gray-600 text-xs sm:text-sm truncate w-24 sm:w-auto'
          title={label} // نمایش کامل متن در هنگام هاور
        >
          {label}
        </label>
      )}

      {/* آیکون سمت چپ اختیاری (در صورت نیاز) */}
      {leftIcon && (
        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 pointer-events-none'>
          {leftIcon}
        </div>
      )}

      {/* عنصر select */}
      <select
        className="select select-primary w-full"
        id={name}
        name={name}
        value={selectedValue}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      >
        <option value='' disabled hidden></option>
        {options.map(option => (
          <option key={option.value} value={option.value} className='truncate'>
            {option.label}
          </option>
        ))}
      </select>
      {/* دکمه اختیاری در انتهای کامپوننت (در صورت نیاز) */}
      {showButton && (
        <button
          type='button'
          onClick={onButtonClick}
          disabled={disabled}
          className={classNames(
            'bg-purple-600 text-white hover:bg-pink-500 px-4 py-2 rounded-md shadow-sm transition-colors duration-300 truncate flex items-center justify-center',
            disabled ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : ''
          )}
          title='اضافه کردن' // نمایش کامل متن در هنگام هاور
        >
          ...
        </button>
      )}

      {/* پیام خطا */}
      {error && errorMessage && (
        <p className='absolute mt-1 text-red-500 text-xs'>{errorMessage}</p>
      )}
    </div>
  )
}

export default DynamicSelector
