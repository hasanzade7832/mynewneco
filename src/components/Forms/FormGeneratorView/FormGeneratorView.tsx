import React from "react";
import { EntityField } from "../../../services/api.services";
import CtrTextBoxView from "./CtrTextBoxView";
import RichTextControllerView from "./RichTextControllerView";
import ChoiceController from "./ChoiceControllerView"
import NumberController from "./NumberControllerView"
import DateTimeSelector from "./DateTimeSelectorView"
import PersianCalendarPickerView from "./PersianCalendarPickerView"
import LookUpFormsView from "./LookUpFormsView";
import LookUpRealValueView from "./LookUpRealValueView"
import LookUpAdvanceTableView from "./LookUpAdvanceTableView";
import LookUpImageView from "./LookUpImageView";
import AdvanceLookupAdvanceTableView from "./AdvanceLookupAdvanceTableView";
import HyperLinkView from "./HyperLinkView";
import YesNoView from "./YesNoView";
import SelectUserInPostView from "./SelectUserInPostView";
import AttachFileView from "./AttachFileView";
import PictureBoxView from "./PictureBoxView";
import PostPickerListView from "./PostPickerListView";
import TableControllerView from "./TableControllerView";
import PfiLookupView from "./PfiLookUpView";
import SeqenialNumberView from "./SeqenialNumberView";
import AdvanceTableView from "./AdvanceTableControllerView";
import WordPanelView from "./WordPanelView";
import ExcelPanelView from "./ExcellPanelView";
import CalculatedFieldView from "./CalculatedFieldView";
import ExcellCalculatorView from "./ExcellCalculatorView";
import TabView from "./TabView";
import MapView from "./MapView";

const viewComponentMapping: { [key: number]: React.FC<any> } = {
  15: CtrTextBoxView,
  1: RichTextControllerView,
  2: ChoiceController,
  3:NumberController,
  4:DateTimeSelector,
  21:PersianCalendarPickerView,
  5:LookUpFormsView,
  34:LookUpRealValueView,
  35:LookUpAdvanceTableView,
  30:LookUpImageView,
  36:AdvanceLookupAdvanceTableView,
  7:HyperLinkView,
  6:YesNoView,
  8:SelectUserInPostView,
  9:AttachFileView,
  26:PictureBoxView,
  19:PostPickerListView,
  10:TableControllerView,
  16:PfiLookupView,
  20:SeqenialNumberView,
  22:AdvanceTableView,
  24:WordPanelView,
  25:ExcelPanelView,
  27:CalculatedFieldView,
  29:ExcellCalculatorView,
  32:TabView,
  28:MapView
};

interface FormGeneratorViewProps {
  isOpen: boolean;
  onClose: () => void;
  entityFields: EntityField[];
  selectedRow?: any;
}

const FormGeneratorView: React.FC<FormGeneratorViewProps> = ({
  isOpen,
  onClose,
  entityFields,
  selectedRow,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">View Form</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
        <div className="form-generator-view">
          {entityFields.map((field, index) => {
            const ViewComponent = viewComponentMapping[field.ColumnType];
            if (!ViewComponent) return null;
            return (
              <div key={index} className="mb-4">
                <ViewComponent data={field} selectedRow={selectedRow} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormGeneratorView;
