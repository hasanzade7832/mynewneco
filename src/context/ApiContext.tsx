// src/context/ApiContext.tsx

import React, { createContext, useContext } from "react";
import AppServices, {
  WebLoginRequest,
  WebLoginResponse,
  SendOtpRequest,
  SendOtpResponse,
  LoginWithOtpRequest,
  LoginWithOtpResponse,
  TokenSetupResponse,
  ConfigurationItem,
  ProgramTemplateItem,
  DefaultRibbonItem,
  EntityTypeItem,
  WfTemplateItem,
  AFBtnItem,
  CommandItem,
} from "../services/api.services";

// اینترفیس اکشن‌ها
interface ApiContextType {
  // OTP/Login
  webLogin: (data: WebLoginRequest) => Promise<WebLoginResponse>;
  sendOtp: (data: SendOtpRequest) => Promise<SendOtpResponse>;
  loginWithOtp: (data: LoginWithOtpRequest) => Promise<LoginWithOtpResponse>;
  tokenSetup: () => Promise<TokenSetupResponse>;

  // Configuration
  getAllConfigurations: () => Promise<ConfigurationItem[]>;
  insertConfiguration: (data: ConfigurationItem) => Promise<ConfigurationItem>;
  updateConfiguration: (data: ConfigurationItem) => Promise<ConfigurationItem>;
  deleteConfiguration: (id: number) => Promise<void>;

  // سایر سرویس‌ها
  getAllProgramTemplates: () => Promise<ProgramTemplateItem[]>;
  getAllDefaultRibbons: () => Promise<DefaultRibbonItem[]>;
  getTableTransmittal: () => Promise<EntityTypeItem[]>;
  getAllWfTemplate: () => Promise<WfTemplateItem[]>;
  getAllAfbtn: () => Promise<AFBtnItem[]>;
  getIdByUserToken: () => Promise<{ ID: number; Name: string }[]>;

  // AFBtn متدهای جدید
  insertAFBtn: (data: AFBtnItem) => Promise<AFBtnItem>;
  updateAFBtn: (data: AFBtnItem) => Promise<AFBtnItem>;
  deleteAFBtn: (id: number) => Promise<void>;

  // Command
  getAllCommands: () => Promise<CommandItem[]>;
  insertCommand: (data: CommandItem) => Promise<CommandItem>;
  updateCommand: (data: CommandItem) => Promise<CommandItem>;
  deleteCommand: (id: number) => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const APIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const api: ApiContextType = {
    // لاگین
    webLogin: AppServices.webLogin.bind(AppServices),
    sendOtp: AppServices.sendOtp.bind(AppServices),
    loginWithOtp: AppServices.loginWithOtp.bind(AppServices),
    tokenSetup: AppServices.tokenSetup.bind(AppServices),

    // Config
    getAllConfigurations: AppServices.getAllConfigurations.bind(AppServices),
    insertConfiguration: AppServices.insertConfiguration.bind(AppServices),
    updateConfiguration: AppServices.updateConfiguration.bind(AppServices),
    deleteConfiguration: AppServices.deleteConfiguration.bind(AppServices),

    // سایر
    getAllProgramTemplates:
      AppServices.getAllProgramTemplates.bind(AppServices),
    getAllDefaultRibbons: AppServices.getAllDefaultRibbons.bind(AppServices),
    getTableTransmittal: AppServices.getTableTransmittal.bind(AppServices),
    getAllWfTemplate: AppServices.getAllWfTemplate.bind(AppServices),
    getAllAfbtn: AppServices.getAllAfbtn.bind(AppServices),
    getIdByUserToken: AppServices.getIdByUserToken.bind(AppServices),

    // AFBtn متدهای جدید
    insertAFBtn: AppServices.insertAFBtn.bind(AppServices),
    updateAFBtn: AppServices.updateAFBtn.bind(AppServices),
    deleteAFBtn: AppServices.deleteAFBtn.bind(AppServices),

    // Commands
    getAllCommands: AppServices.getAllCommands.bind(AppServices),
    insertCommand: AppServices.insertCommand.bind(AppServices),
    updateCommand: AppServices.updateCommand.bind(AppServices),
    deleteCommand: AppServices.deleteCommand.bind(AppServices),
  };

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi باید داخل یک APIProvider استفاده شود");
  }
  return context;
};

// صادرات لازم برای تایپ‌ها
export type {
  ConfigurationItem,
  WebLoginResponse,
  SendOtpResponse,
  LoginWithOtpResponse,
  TokenSetupResponse,
  DefaultRibbonItem,
  ProgramTemplateItem,
  EntityTypeItem,
  WfTemplateItem,
  AFBtnItem,
  CommandItem,
};
