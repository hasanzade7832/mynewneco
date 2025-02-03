// AddSubApprovalFlowModal.tsx

import React, { useState, useRef, useEffect } from "react";
import DynamicModal from "../../utilities/DynamicModal";
import ApprovalFlowsTab, {
  ApprovalFlowsTabRef,
  ApprovalFlowsTabData,
} from "./ApprovalFlowsTab";
import AlertTab from "./AlertTab";
import { BoxTemplate } from "../../../services/api.services";
import { useApi } from "../../../context/ApiContext";

interface AddSubApprovalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: BoxTemplate | null;
  boxTemplates?: BoxTemplate[];
  workflowTemplateId?: number;
  onBoxTemplateInserted?: () => void; // دیگر شیء پاس نمی‌دهیم
}

const AddSubApprovalFlowModal: React.FC<AddSubApprovalFlowModalProps> = ({
  isOpen,
  onClose,
  editData,
  boxTemplates = [],
  workflowTemplateId = 0,
  onBoxTemplateInserted,
}) => {
  const [activeTab, setActiveTab] = useState<"approval" | "alert">("approval");
  const api = useApi();

  const approvalFlowsTabRef = useRef<ApprovalFlowsTabRef | null>(null);

  const handleApprovalFlowsTabRef = (instance: ApprovalFlowsTabRef | null) => {
    approvalFlowsTabRef.current = instance;
  };

  useEffect(() => {
    if (!isOpen) {
      // ریست‌های لازم
    }
  }, [isOpen]);

  const handleSaveOrUpdate = async () => {
    try {
      if (!approvalFlowsTabRef.current) {
        console.error("ApprovalFlowsTab ref is not attached!");
        return;
      }
      const formData: ApprovalFlowsTabData =
        approvalFlowsTabRef.current.getFormData();

      if (!formData) {
        console.error("No data from ApprovalFlowsTab!");
        return;
      }

      if (formData.tableData.length === 0) {
        alert("No row in Approval Context table!");
        return;
      }

      // اولین سطر را نمونه می‌گیریم
      const firstRow = formData.tableData[0];
      if (!firstRow.postID) {
        alert("No postID found in the first row!");
        return;
      }

      let payload: any;
      if (editData) {
        // ویرایش
        payload = {
          WFApproval: {
            Code: firstRow.code || null,
            ID: editData.ID,
            IsRequired: firstRow.required,
            IsVeto: firstRow.veto,
            nPostID: firstRow.postID,
            nPostTypeID: null,
            nWFBoxTemplateID: editData.ID,
            PCost: firstRow.cost1 || 0,
            Weight: firstRow.weight1 || 0,
          },
          WFBT: {
            ActDuration: parseInt(formData.actDurationValue, 10) || 0,
            ActionMode: 1,
            BFID: 0,
            DeemAction: 0,
            DeemCondition: 0,
            DeemDay: 0,
            DeemedEnabled: false,
            ID: editData.ID,
            IsStage: false,
            IsVisible: true,
            Left: 0,
            MaxDuration: parseInt(formData.actDurationValue, 10) || 0,
            MinNumberForReject: parseInt(formData.minRejectValue, 10) || 0,
            Name: formData.nameValue || "",
            nWFTemplateID: workflowTemplateId,
            PredecessorStr: null,
            PreviousStateId: null,
            Top: 0,
          },
        };

        const result = await api.updateBoxTemplate(payload);
        console.log("BoxTemplate updated:", result);

        // به والد سیگنال می‌دهیم لیست را رفرش کند
        if (onBoxTemplateInserted) {
          onBoxTemplateInserted();
        }
      } else {
        // درج
        payload = {
          WFApproval: {
            Code: null,
            ID: 0,
            IsRequired: null,
            IsVeto: null,
            IsVisible: true,
            LastModified: new Date().toISOString(),
            nPostID: firstRow.postID,
            nPostTypeID: null,
            nWFBoxTemplateID: 0,
            PCost: 0,
            Weight: 0,
          },
          WFBT: {
            ActDuration: parseInt(formData.actDurationValue, 10) || 0,
            ActionMode: 1,
            BFID: 0,
            DeemAction: 0,
            DeemCondition: 0,
            DeemDay: 0,
            DeemedEnabled: false,
            ID: 0,
            IsStage: false,
            IsVisible: true,
            Left: 0,
            MaxDuration: parseInt(formData.actDurationValue, 10) || 0,
            MinNumberForReject: parseInt(formData.minRejectValue, 10) || 0,
            Name: formData.nameValue || "",
            nWFTemplateID: workflowTemplateId,
            PredecessorStr: null,
            PreviousStateId: null,
            Top: 0,
          },
        };

        const result = await api.insertBoxTemplate(payload);
        console.log("BoxTemplate inserted:", result);

        // به والد سیگنال می‌دهیم
        if (onBoxTemplateInserted) {
          onBoxTemplateInserted();
        }
      }

      onClose();
    } catch (error) {
      console.error("Error in save/update BoxTemplate:", error);
    }
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose}>
      <div
        role="tablist"
        className="tabs tabs-boxed bg-gradient-to-r from-[#EA479B] via-[#A256F6] to-[#E8489E] text-white"
      >
        <button
          role="tab"
          className={`tab ${activeTab === "approval" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("approval")}
        >
          Approval Flows
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "alert" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("alert")}
        >
          Alerts
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "approval" && (
          <ApprovalFlowsTab
            ref={handleApprovalFlowsTabRef}
            editData={editData}
            boxTemplates={boxTemplates}
          />
        )}
        {activeTab === "alert" && <AlertTab />}
      </div>

      <div className="flex justify-center mt-6 space-x-3">
        <button
          onClick={handleSaveOrUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          {editData ? "Edit" : "Save"}
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </DynamicModal>
  );
};

export default AddSubApprovalFlowModal;
