// src/components/General/ButtonComponent.tsx

import React, { useState, useCallback } from 'react';
import DataTable from '../../TableDynamic/DataTable';
import DynamicInput from '../../utilities/DynamicInput';
import DynamicRadioGroup from '../../utilities/DynamicRadiogroup';
import DynamicButton from '../../utilities/DynamicButtons';
import FileUploadHandler, { InsertModel } from '../../../services/FileUploadHandler';
import { useApi } from '../../../context/ApiContext';
import { AFBtnItem } from '../../../services/api.services';

interface ButtonComponentProps {
  columnDefs: { headerName: string; field: string }[];
  rowData: any[];
  onRowDoubleClick: (data: any) => void;
  onRowClick: (data: any) => void;
  onSelectButtonClick: () => void;
  isSelectDisabled: boolean;
  onClose: () => void;
  onSelectFromButton: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  columnDefs,
  rowData,
  onRowDoubleClick,
  onRowClick,
}) => {
  const api = useApi(); // برای متدهای API

  // مقادیر فرم
  const [selectedState, setSelectedState] = useState<string>('accept');
  const [selectedCommand, setSelectedCommand] = useState<string>('accept');
  const [nameValue, setNameValue] = useState('');
  const [stateTextValue, setStateTextValue] = useState('');
  const [tooltipValue, setTooltipValue] = useState('');
  const [orderValue, setOrderValue] = useState('');

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isRowClicked, setIsRowClicked] = useState<boolean>(false);

  // مقدار فایل آپلودی
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // شمارنده ریست
  const [resetCounter, setResetCounter] = useState<number>(0);

  // آپشن رادیو
  const RadioOptionsState = [
    { value: 'accept', label: 'Accept' },
    { value: 'reject', label: 'Reject' },
    { value: 'close', label: 'Close' },
  ];
  const RadioOptionsCommand = [
    { value: 'accept', label: 'Accept' },
    { value: 'reject', label: 'Reject' },
    { value: 'close', label: 'Close' },
    { value: 'client', label: 'Previous State Client' },
    { value: 'admin', label: 'Previous State Admin' },
  ];

  // دوبار کلیک روی ردیف جدول
  const handleRowDoubleClickLocal = (data: any) => {
    setSelectedRow(data);
    onRowDoubleClick(data);
  };

  // کلیک روی ردیف جدول
  const handleRowClickLocal = (data: any) => {
    try {
      setSelectedRow(data);
      onRowClick(data);
      setIsRowClicked(true);

      setNameValue(data.Name || '');
      setStateTextValue(data.StateText || '');
      setTooltipValue(data.Tooltip || '');
      setOrderValue(data.Order || '');

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

      // تنظیم selectedFileId به ID رکورد
      if (data.IconImageId) {
        setSelectedFileId(data.IconImageId);
      } else {
        setSelectedFileId(null);
        handleReset();
      }
    } catch (error) {
      console.error('خطا در handleRowClickLocal:', error);
    }
  };

  // مپ کردن مقدار StateForDeemed به رادیو
  const mapWFStateForDeemedToRadio = (val: number) => {
    switch (val) {
      case 1:
        return 'accept';
      case 2:
        return 'reject';
      case 3:
        return 'close';
      default:
        return 'accept';
    }
  };

  // مپ کردن مقدار WFCommand به رادیو
  const mapWFCommandToRadio = (val: number) => {
    switch (val) {
      case 1:
        return 'accept';
      case 2:
        return 'close';
      case 3:
        return 'reject';
      case 4:
        return 'client';
      case 5:
        return 'admin';
      default:
        return 'accept';
    }
  };

  // رادیو => عدد
  const radioToWFStateForDeemed = (radioVal: string): number => {
    switch (radioVal) {
      case 'accept':
        return 1;
      case 'reject':
        return 2;
      case 'close':
        return 3;
      default:
        return 1;
    }
  };
  const radioToWFCommand = (radioVal: string): number => {
    switch (radioVal) {
      case 'accept':
        return 1;
      case 'close':
        return 2;
      case 'reject':
        return 3;
      case 'client':
        return 4;
      case 'admin':
        return 5;
      default:
        return 1;
    }
  };

  // تابع ریست کامپوننت آپلود
  const handleReset = useCallback(() => {
    setResetCounter((prev) => prev + 1);
  }, []);

  // دکمه Add
  const handleAddClick = async () => {
    try {
      const newAFBtn: AFBtnItem = {
        ID: 0, // فرض بر این است که سرور این مقدار را مدیریت می‌کند
        Name: nameValue,
        Tooltip: tooltipValue,
        StateText: stateTextValue,
        Order: parseInt(orderValue || '0'),
        WFStateForDeemed: radioToWFStateForDeemed(selectedState),
        WFCommand: radioToWFCommand(selectedCommand),
        IconImageId: selectedFileId, // مقدار ID جدید است
        IsVisible: true,
        LastModified: null,
        ModifiedById: null,
      };

      await api.insertAFBtn(newAFBtn);
      alert('آیتم جدید با موفقیت درج شد.');

      handleReset();
    } catch (error) {
      console.error('خطا در درج آیتم AFBtn:', error);
      alert('خطایی در درج رخ داد.');
    }
  };

  // دکمه Edit
  const handleEditClick = async () => {
    if (!selectedRow || !selectedRow.ID) {
      alert('لطفاً یک ردیف را از جدول انتخاب کنید.');
      return;
    }
    try {
      const updatedAFBtn: AFBtnItem = {
        ID: selectedRow.ID,
        Name: nameValue,
        Tooltip: tooltipValue,
        StateText: stateTextValue,
        Order: parseInt(orderValue || '0'),
        WFStateForDeemed: radioToWFStateForDeemed(selectedState),
        WFCommand: radioToWFCommand(selectedCommand),
        IconImageId: selectedFileId,
        IsVisible: true,
        LastModified: null,
        ModifiedById: null,
      };

      await api.updateAFBtn(updatedAFBtn);
      alert('آیتم با موفقیت ویرایش شد.');

      handleReset();
    } catch (error) {
      console.error('خطا در ویرایش آیتم AFBtn:', error);
      alert('خطایی در ویرایش رخ داد.');
    }
  };

  // آپلود موفق
  const handleUploadSuccess = (insertModel: InsertModel) => {
    // استفاده از ID جدید برای selectedFileId
    const newFileId = insertModel.ID || null;

    // به‌روز رسانی سطر انتخابی (در صورت نیاز)
    if (selectedRow) {
      const updatedRow = { ...selectedRow, IconImageId: newFileId };
      setSelectedRow(updatedRow);
    }

    // تنظیم selectedFileId برای Add/Edit
    setSelectedFileId(newFileId);

    // ریست کردن preview
    handleReset();
  };

  return (
    <div className='w-full h-full flex flex-col overflow-x-hidden bg-white rounded-lg p-4'>
      {/* جدول بالا */}
      <div className='mb-4 w-full overflow-hidden'>
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
          domLayout='autoHeight'
        />
      </div>

      {/* فرم */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <DynamicInput
              name='Name'
              type='text'
              value={nameValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNameValue(e.target.value)
              }
              className='sm:mr-2'
            />
            <DynamicInput
              name='StateText'
              type='text'
              value={stateTextValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStateTextValue(e.target.value)
              }
              className='sm:ml-2'
            />

            <DynamicInput
              name='Tooltip'
              type='text'
              value={tooltipValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTooltipValue(e.target.value)
              }
              className='sm:mr-2'
            />
            <DynamicInput
              name='Order'
              type='text'
              value={orderValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOrderValue(e.target.value)
              }
              className='sm:ml-2'
            />
          </div>

          {/* رادیو گروپ‌ها */}
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-2'>
            <DynamicRadioGroup
              key={`state-${isRowClicked ? 'controlled' : 'uncontrolled'}`}
              title='State:'
              name='stateGroup'
              options={RadioOptionsState}
              selectedValue={selectedState}
              onChange={(value) => setSelectedState(value)}
              isRowClicked={isRowClicked}
              className=''
            />
            <DynamicRadioGroup
              key={`command-${isRowClicked ? 'controlled' : 'uncontrolled'}`}
              title='Command:'
              name='commandGroup'
              options={RadioOptionsCommand}
              selectedValue={selectedCommand}
              onChange={(value) => setSelectedCommand(value)}
              isRowClicked={isRowClicked}
              className=''
            />
          </div>
        </div>

        {/* آپلود فایل */}
        <div className='lg:col-span-1 flex flex-col items-start mt-4 lg:mt-0'>
          <FileUploadHandler
            selectedFileId={selectedFileId}
            onUploadSuccess={handleUploadSuccess}
            resetCounter={resetCounter}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* دکمه‌های پایین */}
      <div className='mt-6 flex justify-start space-x-4'>
        <DynamicButton text='Add' onClick={handleAddClick} isDisabled={false} />
        <DynamicButton text='Edit' onClick={handleEditClick} isDisabled={false} />
      </div>
    </div>
  );
};

export default ButtonComponent;
