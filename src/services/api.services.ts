// src/services/api.services.ts
import httpClient from "./api.config";
import { apiConst } from "./api.constant";

// رابط‌های نمونه
export interface AppSetting {
  ID: number;
  Name: string;
  LetterBtns: string;
}

export interface MyUser {
  ID: string;
  TTKK: string;
  Username: string;
  Name: string;
  Email: string;
  userType?: number;
}

export interface WebLoginResponse {
  data: { MyUser: any; tokenLife: any };
  AppSetting: AppSetting;
  MyUser: MyUser;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginWithOtpResponse {
  AppSetting: AppSetting;
  MyUser: MyUser;
}

export interface WebLoginRequest {
  UserName: string;
  Password: string;
  SeqKey: string;
}

export interface SendOtpRequest {
  UserName: string;
  Password: string;
  SeqKey: string;
}

export interface LoginWithOtpRequest {
  UserName: string;
  Password: string;
  SeqKey: string;
}

export interface TokenSetupResponse {
  data: number;
}

// داده Configuration
export interface ConfigurationItem {
  ID: number;
  Name: string;
  Description: string;
  DefaultBtn?: string;
  LetterBtns?: string;
  MeetingBtns?: string;
  FirstIDProgramTemplate:number;
  SelMenuIDForMain:number;
  IsVisible:boolean;
  LastModified:string;
  EnityTypeIDForLessonLearn:number;
  EnityTypeIDForTaskCommnet:number;
  EnityTypeIDForProcesure:number
}

// داده Menu (برای Default Ribbon)
export interface DefaultRibbonItem {
  ID: number;
  Name: string;
  // سایر فیلدها ...
}

// داده ProgramTemplate
export interface ProgramTemplateItem {
  ID: number;
  Name: string;
  // سایر فیلدها ...
}

// داده EntityType
export interface EntityTypeItem {
  ID: number;
  Name: string;
  Category: string; // فرض بر این است که دسته‌بندی وجود دارد
  // سایر فیلدها ...
}

export interface WfTemplateItem {
  ID: number;
  Name: string;
  // سایر فیلدها ...
}

export interface AFBtnItem {
  ID: number;
  Name: string;
  // سایر فیلدها ...
}

class ApiService {
  // مثال‌های مربوط به لاگین/OTP
  async webLogin(userData: WebLoginRequest): Promise<WebLoginResponse> {
    const response = await httpClient.post<WebLoginResponse>(
      apiConst.webLogin,
      userData
    );
    return response.data;
  }

  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const response = await httpClient.post<SendOtpResponse>(
      apiConst.sendOtp,
      data
    );
    return response.data;
  }

  async loginWithOtp(data: LoginWithOtpRequest): Promise<LoginWithOtpResponse> {
    const response = await httpClient.post<LoginWithOtpResponse>(
      apiConst.loginWithOtp,
      data
    );
    return response.data;
  }

  async tokenSetup(): Promise<TokenSetupResponse> {
    const response = await httpClient.post<TokenSetupResponse>(
      apiConst.tokenSetup
    );
    return response.data;
  }

  // مثال‌های مربوط به هر ساب‌تب
  async getAllConfigurations(): Promise<ConfigurationItem[]> {
    const response = await httpClient.post<ConfigurationItem[]>(
      apiConst.getAllConfiguration
    );
    return response.data;
  }

  async insertConfiguration(data: ConfigurationItem): Promise<ConfigurationItem> {
    const response = await httpClient.post<ConfigurationItem>(
      apiConst.insertConfiguration,
      data
    );
    return response.data;
  }

  async updateConfiguration(data: ConfigurationItem): Promise<ConfigurationItem> {
    const response = await httpClient.post<ConfigurationItem>(
      apiConst.updateConfiguration,
      data
    );
    return response.data;
  }

  async getAllProgramTemplates(): Promise<ProgramTemplateItem[]> {
    const response = await httpClient.post<ProgramTemplateItem[]>(
      apiConst.getAllProgramTemplate
    );
    return response.data;
  }

  // فرضیه: برای Default Ribbon یک endpoint مشابه اضافه شده است
  async getAllDefaultRibbons(): Promise<DefaultRibbonItem[]> {
    const response = await httpClient.post<DefaultRibbonItem[]>(
      apiConst.getAllDefaultRibbons
    );
    return response.data;
  }

  async getTableTransmittal(): Promise<EntityTypeItem[]> {
    const response = await httpClient.post<EntityTypeItem[]>(
      apiConst.getTableTransmittal
    );
    return response.data;
  }

  // دریافت تمام WF Templates (برای LessonLearnedAfTemplate)
  async getAllWfTemplate(): Promise<WfTemplateItem[]> {
    const response = await httpClient.post<WfTemplateItem[]>(
      apiConst.getAllWfTemplate
    );
    return response.data;
  }

  async getAllAfbtn(): Promise<AFBtnItem[]> {
    const response = await httpClient.post<AFBtnItem[]>(apiConst.getAllAfbtn);
    return response.data;
  }

  // متدهای دیگری که نیاز دارید ...
}

const AppServices = new ApiService();
export default AppServices;
