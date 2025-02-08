// src/components/FormG.tsx
import React from "react";
import { Rule } from "../../services/formGeneratorHelper";

// وارد کردن کامپوننت‌های داینامیک
import CtrTextBox from "./ControllerForms/TextController";
import CtrTextArea from "./ControllerForms/RichTextController";
import CtrRadio from "./ControllerForms/ChoiceController";
import CtrInputNumber from "./ControllerForms/NumberController";
import CtrSelect from "./ControllerForms/ChoiceController";
// … سایر کامپوننت‌ها (به نام‌هایی مانند CtrSelect, CtrDatePicker, …)

interface FormGProps {
  ctrForm: Rule[];
  selectedRow?: any;
  getFileName?: (fileName: string) => void;
  emitmetaTypes: (meta: any) => void;
}

const componentMapping: { [key: string]: React.FC<any> } = {
  CtrTextBox,
  CtrTextArea,
  CtrRadio,
  CtrInputNumber,
  CtrSelect
  // … نگاشت سایر کامپوننت‌ها بر اساس rule.name
};

const FormG: React.FC<FormGProps> = ({
  ctrForm,
  selectedRow,
  getFileName,
  emitmetaTypes,
}) => {
  return (
    <div className="form-g">
      <div className="box-card">
        <div className="form-g-container">
          {ctrForm.map((child, i) => {
            const Component = componentMapping[child.name];
            if (!Component) return null;
            return (
              <Component
                key={i}
                data={child}
                selectedRow={selectedRow}
                getFileName={getFileName}
                emitmetaTypes={emitmetaTypes}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormG;
