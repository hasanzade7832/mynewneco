import React, { createContext, useContext, useState } from "react";
import {
  useApi,
  CommandItem,
  User,
  ConfigurationItem,
  Role,
  Company,
  PostCat,
  ProgramTemplateItem,
  ProgramType,
  OdpWithExtra,
} from "./ApiContext";
import { Calendar, EntityCollection } from "../services/api.services";

// Define CommandData if it's different from CommandItem
interface CommandData {
  id?: string;
  Name: string;
  Describtion: string;
  MainColumnIDName: string;
  GroupName: string;
  gridCmd: string;
  tabCmd: string;
  QR: string;
  ViewMode: string | null;
  DefaultColumns: string | null;
  ReportParam: string | null;
  ProjectIntensive: boolean;
  ColorColumn: string;
  InvisibleColumns: string;
  ApiColumns: string;
  SpParam: string;
  CmdType: number;
  ApiMode?: string;
}

interface ConfigurationData {
  id?: string;
  Name: string;
  FirstIDProgramTemplate: string;
  SelMenuIDForMain: string;
  Description?: string;
  IsVisible: boolean;
  LastModified?: string;
  DefaultBtn: string;
  LetterBtns: string;
  MeetingBtns: string;
  EnityTypeIDForLessonLearn: string;
  EnityTypeIDForTaskCommnet: string;
  EnityTypeIDForProcesure: string;
}

export interface UserData {
  ID?: string; // Changed from number to string to match User interface
  Username: string;
  Password?: string;
  ConfirmPassword?: string;
  Status: number;
  MaxWrongPass: number;
  Name: string;
  Family: string;
  Email: string;
  Website: string;
  Mobile: string;
  TTKK: string;
  userType: number;
  Code: string;
  IsVisible: boolean;
  LastModified: string;
  ModifiedById?: string;
  CreateDate?: string | null;
  LastLoginTime?: string | null;
  UserImageId?: string | null;
}

interface RoleData {
  ID?: string;
  Name: string;
  IsVisible: boolean;
  ModifiedById?: string;
  Description?: string | null;
  Type?: string | null;
  Grade?: string | null;
  Competencies?: string | null;
  Authorization?: string | null;
  Responsibility?: string | null;
  PostCode?: string | null;
  // اضافه کردن فیلدهای جدید
  OwnerID?: string | null;
  ParrentId?: string | null;
  isAccessCreateProject: boolean;
  isHaveAddressbar: boolean;
  isStaticPost: boolean;
  nCompanyID?: string | null;
  nMenuID?: string | null;
  nPostTypeID?: string | null;
  nProjectID?: string | null;
  status?: number;
}

interface CompanyData {
  ID?: number;
  Name: string;
  Description?: string;
  Type?: string | null;
  Information?: string | null;
  IsVisible: boolean;
  LastModified?: string;
  ModifiedById?: string | null;
}

interface RoleGroupData {
  ID?: number;
  Name: string;
  Description: string;
  IsGlobal: boolean;
  IsVisible: boolean;
  LastModified?: string;
  ModifiedById?: string | null;
  PostsStr?: string;
  ProjectsStr?: string;
}

// src/context/AddEditDeleteContext.tsx

interface ProgramTemplateData {
  ID?: number;
  ModifiedById?: string; // اضافه کردن فیلد MissingById
  Name: string;
  Duration: string;
  PCostAct: number;
  PCostAprov: number;
  IsGlobal: boolean;
  ProjectsStr?: string | null; // تغییر نوع به string | null
  IsVisible: boolean;
  nProgramTypeID: number;
  MetaColumnName?: string; // اگر ممکن است متا ستون نام خالی باشد
  LastModified?: string;
}

interface ProgramTypeData {
  ID?: number;
  Name: string;
  Describtion: string;
  IsVisible: boolean;
  LastModified?: string;
  ModifiedById?: string | null;
}

interface OdpData {
  ID?: number;
  Name: string;
  Address: string;
  EntityTypeName: string;
  IsVisible: boolean;
  LastModified: string | null;
  ModifiedById: string | null;
  ProgramTemplateIDName: string | null;
  WFTemplateName: string;
  nEntityTypeID: number;
  nProgramTemplateID: number | null;
  nWFTemplateID: number;
}

interface ProcedureData {
  ID?: number;
  Name: string;
  Description?: string | null;
  Configuration?: string | null;
  IsGlobal: boolean;
  IsVisible: boolean;
  LastModified?: string | null;
  ModifiedById?: string | null;
  ProjectsStr?: string | null;
}

interface CalendarData {
  ID?: number;
  Name: string;
  SpecialDay: string;
  dateTimeRoutine: string;
  IsVisible: boolean;
  CreateDate?: string;
  UpdateDate?: string;
  CreatorId?: string;
}

interface AddEditDeleteContextType {
  handleAdd: () => void;
  handleEdit: () => void;
  handleDuplicate: () => void;
  handleSaveConfiguration: (
    data: ConfigurationData
  ) => Promise<ConfigurationItem | null>;
  handleSaveCommand: (data: CommandData) => Promise<CommandItem | null>;
  handleSaveUser: (data: UserData) => Promise<User | null>;
  handleSaveRole: (data: RoleData) => Promise<Role | null>;
  handleSaveCompany: (data: CompanyData) => Promise<Company | null>;
  handleSaveRoleGroup: (data: RoleGroupData) => Promise<PostCat | null>;
  handleSaveProgramTemplate: (
    data: ProgramTemplateData
  ) => Promise<ProgramTemplateItem | null>;
  handleSaveProgramType: (data: ProgramTypeData) => Promise<ProgramType | null>;
  handleSaveOdp: (data: OdpData) => Promise<OdpWithExtra | null>;
  handleSaveProcedure: (data: ProcedureData) => Promise<EntityCollection | null>;
  handleSaveCalendar: (data: CalendarData) => Promise<Calendar | null>;


}

const AddEditDeleteContext = createContext<AddEditDeleteContextType>(
  {} as AddEditDeleteContextType
);

export const AddEditDeleteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const api = useApi();
  const [, setIsLoading] = useState(false);

  const handleAdd = () => {
    console.log("Add clicked from context");
    // Logic to open add form
  };

  const handleEdit = () => {
    console.log("Edit action triggered from context");
    // Logic to open edit form
  };
 
  const handleDuplicate = () => {
    console.log("Duplicate action triggered from context");
    // Logic to duplicate a record
  };

  const handleSaveConfiguration = async (
    data: ConfigurationData
  ): Promise<ConfigurationItem | null> => {
    setIsLoading(true);
    try {
      const newConfig: ConfigurationItem = {
        ...(data.id && { ID: parseInt(data.id) }),
        Name: data.Name,
        FirstIDProgramTemplate: parseInt(data.FirstIDProgramTemplate) || 0,
        SelMenuIDForMain: parseInt(data.SelMenuIDForMain) || 0,
        Description: data.Description || "",
        IsVisible: data.IsVisible,
        LastModified: data.LastModified || new Date().toISOString(),
        DefaultBtn: data.DefaultBtn || "",
        LetterBtns: data.LetterBtns || "",
        MeetingBtns: data.MeetingBtns || "",
        EnityTypeIDForLessonLearn:
          parseInt(data.EnityTypeIDForLessonLearn) || 0,
        EnityTypeIDForTaskCommnet:
          parseInt(data.EnityTypeIDForTaskCommnet) || 0,
        EnityTypeIDForProcesure: parseInt(data.EnityTypeIDForProcesure) || 0,
      };

      let result: ConfigurationItem;
      if (newConfig.ID) {
        result = await api.updateConfiguration(newConfig);
        console.log("Configuration updated:", result);
      } else {
        result = await api.insertConfiguration(newConfig);
        console.log("Configuration inserted:", result);
      }
      return result;
    } catch (error) {
      console.error("Error saving configuration:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCommand = async (
    data: CommandData
  ): Promise<CommandItem | null> => {
    setIsLoading(true);
    try {
      const newCmd: Partial<CommandItem> = {
        ...(data.id && { ID: parseInt(data.id) }),
        Name: data.Name,
        Describtion: data.Describtion || "",
        MainColumnIDName: data.MainColumnIDName || "",
        GroupName: data.GroupName || "",
        gridCmd: data.gridCmd || "",
        tabCmd: data.tabCmd || "",
        QR: data.QR || "",
        ViewMode: data.ViewMode || -1,
        DefaultColumns: data.DefaultColumns || null,
        ReportParam: data.ReportParam || null,
        ProjectIntensive:
          data.ProjectIntensive !== undefined ? data.ProjectIntensive : true,
        ColorColumn: data.ColorColumn || "",
        InvisibleColumns: data.InvisibleColumns || "",
        ApiColumns: data.ApiColumns || "",
        SpParam: data.SpParam || "",
        CmdType: data.CmdType || 0,
        ApiMode: data.ApiMode || "",
      };

      let updatedCmd: CommandItem;
      if (newCmd.ID) {
        updatedCmd = await api.updateCommand(newCmd as CommandItem);
        console.log("Command updated:", updatedCmd);
      } else {
        updatedCmd = await api.insertCommand(newCmd as CommandItem);
        console.log("Command inserted:", updatedCmd);
      }

      return updatedCmd;
    } catch (error) {
      console.error("Error saving command:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUser = async (data: UserData): Promise<User | null> => {
    setIsLoading(true);
    try {
      const userRequest: User = {
        ID: data.ID,
        Username: data.Username,
        Status: data.Status,
        MaxWrongPass: data.MaxWrongPass,
        Name: data.Name,
        Family: data.Family,
        Email: data.Email,
        Website: data.Website,
        Mobile: data.Mobile,
        TTKK: data.TTKK,
        userType: data.userType,
        Code: data.Code,
        IsVisible: data.IsVisible,
        LastModified: data.LastModified || new Date().toISOString(),
        ModifiedById: data.ModifiedById,
        CreateDate: data.CreateDate ?? null,
        LastLoginTime: data.LastLoginTime ?? null,
        UserImageId: data.UserImageId ?? null,
        // Conditionally include Password fields
        ...(data.Password && { Password: data.Password }),
        // Exclude ConfirmPassword when editing
        ...(!data.ID &&
          data.ConfirmPassword && { ConfirmPassword: data.ConfirmPassword }),
      };

      console.log("User Request Data:", userRequest); // For debugging

      let result: User;
      if (userRequest.ID !== undefined && userRequest.ID !== null) {
        // Updating existing user
        result = await api.updateUser(userRequest);
        console.log("User updated:", result);
      } else {
        // Creating new user
        result = await api.insertUser(userRequest);
        console.log("User inserted:", result);
      }

      return result;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRole = async (data: RoleData): Promise<Role | null> => {
    setIsLoading(true);
    try {
      if (data.ID) {
        // آبجکت برای update
        const updateRoleRequest: Role = {
          Name: data.Name,
          IsVisible: data.IsVisible,
          Authorization: data.Authorization,
          Competencies: data.Competencies,
          Description: data.Description,
          Grade: data.Grade,
          PostCode: data.PostCode,
          Responsibility: data.Responsibility,
          Type: data.Type,
          OwnerID: data.OwnerID || null,
          ParrentId: data.ParrentId || null,
          isAccessCreateProject: data.isAccessCreateProject || false,
          isHaveAddressbar: data.isHaveAddressbar || false,
          isStaticPost: data.isStaticPost,
          nCompanyID: data.nCompanyID || null,
          nMenuID: data.nMenuID || null,
          nPostTypeID: data.nPostTypeID || null,
          nProjectID: data.nProjectID || null,
          status: data.status || 1,
        };

        const result = await api.updateRole(updateRoleRequest);
        console.log("Role updated:", result);
        return result;
      } else {
        // آبجکت برای insert
        const insertRoleRequest: Role = {
          Name: data.Name,
          IsVisible: true,
          LastModified: new Date().toISOString(),
          Authorization: data.Authorization,
          Competencies: data.Competencies,
          Description: data.Description,
          Grade: data.Grade,
          PostCode: data.PostCode,
          Responsibility: data.Responsibility,
          Type: data.Type,
          isStaticPost: data.isStaticPost,
        };

        const result = await api.insertRole(insertRoleRequest);
        console.log("Role inserted:", result);
        return result;
      }
    } catch (error) {
      console.error("Error saving role:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCompany = async (
    data: CompanyData
  ): Promise<Company | null> => {
    setIsLoading(true);
    try {
      const companyRequest: Partial<Company> = {
        Name: data.Name,
        Description: data.Description,
        Type: data.Type,
        Information: data.Information,
        IsVisible: data.IsVisible,
        LastModified: data.LastModified || new Date().toISOString(),
        ModifiedById: data.ModifiedById,
      };

      // Add ID if it exists (for updates)
      if (data.ID) {
        companyRequest.ID = data.ID;
      }

      let result: Company;

      if (companyRequest.ID) {
        // Update existing company
        result = await api.updateCompany(companyRequest as Company);
        console.log("Company updated:", result);
      } else {
        // Add new company
        result = await api.insertCompany(companyRequest as Company);
        console.log("Company inserted:", result);
      }

      return result;
    } catch (error) {
      console.error("Error saving company:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoleGroup = async (
    data: RoleGroupData
  ): Promise<PostCat | null> => {
    setIsLoading(true);
    try {
      const roleGroupRequest: PostCat = {
        Name: data.Name,
        Description: data.Description,
        IsGlobal: data.IsGlobal,
        IsVisible: data.IsVisible,
        PostsStr: data.PostsStr || "",
        ProjectsStr: data.ProjectsStr || "",
      };

      // اگر ID وجود داشت، آن را به درخواست اضافه کن
      if (data.ID) {
        roleGroupRequest.ID = data.ID;
      }

      let result: PostCat;
      if (data.ID) {
        // اگر ID وجود دارد از متد update استفاده کن
        result = await api.updatePostCat(roleGroupRequest);
        console.log("Role Group updated:", result);
      } else {
        // اگر ID وجود ندارد از متد insert استفاده کن
        result = await api.insertPostCat(roleGroupRequest);
        console.log("Role Group inserted:", result);
      }

      return result;
    } catch (error) {
      console.error("Error saving role group:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProgramTemplate = async (
    data: ProgramTemplateData
  ): Promise<ProgramTemplateItem | null> => {
    setIsLoading(true);
    try {
      const programTemplate: ProgramTemplateItem = {
        ID: data.ID,
        ModifiedById: data.ModifiedById, // اضافه کردن فیلد ModifiedById
        Name: data.Name,
        Duration: data.Duration,
        PCostAct: data.PCostAct,
        PCostAprov: data.PCostAprov,
        IsGlobal: data.IsGlobal,
        ProjectsStr: data.ProjectsStr ?? null, // مدیریت null برای ProjectsStr
        IsVisible: data.IsVisible,
        nProgramTypeID: data.nProgramTypeID,
        MetaColumnName: data.MetaColumnName,
        LastModified: data.LastModified,
      };

      let result: ProgramTemplateItem;
      if (programTemplate.ID) {
        // ویرایش ProgramTemplate موجود
        result = await api.updateProgramTemplate(programTemplate);
        console.log("ProgramTemplate updated:", result);
      } else {
        // افزودن ProgramTemplate جدید
        result = await api.insertProgramTemplate(programTemplate);
        console.log("ProgramTemplate inserted:", result);
      }

      return result;
    } catch (error) {
      console.error("Error saving ProgramTemplate:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProgramType = async (
    data: ProgramTypeData
  ): Promise<ProgramType | null> => {
    setIsLoading(true);
    try {
      const programType: ProgramType = {
        ID: data.ID,
        Name: data.Name,
        Describtion: data.Describtion,
        IsVisible: data.IsVisible,
        LastModified: data.LastModified,
        ModifiedById: data.ModifiedById,
      };

      let result: ProgramType;
      if (programType.ID) {
        // Update existing ProgramType
        result = await api.updateProgramType(programType);
        console.log("ProgramType updated:", result);
      } else {
        // Add new ProgramType
        result = await api.insertProgramType(programType);
        console.log("ProgramType inserted:", result);
      }

      return result;
    } catch (error) {
      console.error("Error saving ProgramType:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOdp = async (data: OdpData): Promise<OdpWithExtra | null> => {
    setIsLoading(true);
    try {
      const odp: OdpWithExtra = {
        ID: data.ID || 0,
        Name: data.Name,
        Address: data.Address,
        EntityTypeName: data.EntityTypeName,
        IsVisible: data.IsVisible,
        LastModified: data.LastModified,
        ModifiedById: data.ModifiedById,
        ProgramTemplateIDName: data.ProgramTemplateIDName,
        WFTemplateName: data.WFTemplateName,
        nEntityTypeID: data.nEntityTypeID,
        nProgramTemplateID: data.nProgramTemplateID,
        nWFTemplateID: data.nWFTemplateID,
      };

      let result: OdpWithExtra;
      if (odp.ID) {
        result = await api.updateOdp(odp);
        console.log("ODP updated:", result);
      } else {
        result = await api.insertOdp(odp);
        console.log("ODP inserted:", result);
      }

      return result;
    } catch (error) {
      console.error("Error saving ODP:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProcedure = async (
    data: ProcedureData
  ): Promise<EntityCollection | null> => {
    setIsLoading(true);
    try {
      const procedure: EntityCollection = {
        ID: data.ID,
        Name: data.Name,
        Description: data.Description || null,
        Configuration: data.Configuration || null,
        IsGlobal: data.IsGlobal,
        IsVisible: data.IsVisible,
        LastModified: data.LastModified || new Date().toISOString(),
        ModifiedById: data.ModifiedById || null,
        ProjectsStr: data.ProjectsStr || null
      };
  
      let result: EntityCollection;
      if (procedure.ID) {
        // Update existing procedure
        result = await api.updateEntityCollection(procedure);
        console.log("Procedure updated:", result);
      } else {
        // Add new procedure
        result = await api.insertEntityCollection(procedure);
        console.log("Procedure inserted:", result);
      }
  
      return result;
    } catch (error) {
      console.error("Error saving Procedure:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCalendar = async (
    data: CalendarData
  ): Promise<Calendar | null> => {
    setIsLoading(true);
    try {
      const calendar: Calendar = {
        ID: data.ID,
        Name: data.Name,
        SpecialDay: data.SpecialDay,
        dateTimeRoutine: data.dateTimeRoutine,
        IsVisible: data.IsVisible,
        CreateDate: data.CreateDate || new Date().toISOString(),
        UpdateDate: data.UpdateDate || new Date().toISOString(),
        CreatorId: data.CreatorId
      };
  
      let result: Calendar;
      if (calendar.ID) {
        // Update existing calendar
        result = await api.updateCalendar(calendar);
        console.log("Calendar updated:", result);
      } else {
        // Add new calendar
        result = await api.insertCalendar(calendar);
        console.log("Calendar inserted:", result);
      }
  
      return result;
    } catch (error) {
      console.error("Error saving Calendar:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AddEditDeleteContext.Provider
      value={{
        handleAdd,
        handleEdit,
        handleDuplicate,
        handleSaveConfiguration,
        handleSaveCommand,
        handleSaveUser,
        handleSaveRole,
        handleSaveCompany,
        handleSaveRoleGroup,
        handleSaveProgramTemplate,
        handleSaveProgramType,
        handleSaveOdp,
        handleSaveProcedure,
        handleSaveCalendar
      }}
    >
      {children}
    </AddEditDeleteContext.Provider>
  );
};

export const useAddEditDelete = () => {
  return useContext(AddEditDeleteContext);
};
