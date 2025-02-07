// src/services/api.constant.ts
export const apiConst = Object.freeze({
  webLogin: "api/Login/LoginO",
  sendOtp: "api/SendOtp",
  loginWithOtp: "api/loginWithOtp",
  tokenSetup: "api/tokenSetup",
  getIdByUserToken: "api/user/GetByToken",
  getAllConfiguration: "api/Setting/GetAll",
  insertConfiguration: "api/Setting/Insert",
  updateConfiguration: "api/Setting/Update",
  deleteConfiguration: "api/Setting/Delete",
  getAllDefaultRibbons: "api/Menu/GetAll",
  getAllAfbtn: "api/AFBtn/GetAll",
  insertAFBtn: "api/AFBtn/Insert",
  updateAFBtn: "api/AFBtn/Update",
  deleteAFBtn: "api/AFBtn/Delete",
  uploadFile: "api/File/Upload",
  insert: "api/File/Insert",
  download: "api/File/Download",
  getFile: "api/File/GetById",
  getCommand: "api/Command/GetAll",
  insertCommand: "api/Command/Insert",
  deleteCommand: "api/Command/Delete",
  updateCommand: "api/Command/Update",
  getEnum: "api/GetEnumByName",
  getAllMenu: "api/Menu/GetAll",
  insertMenu: "api/Menu/Insert",
  updateMenu: "api/Menu/Update",
  deleteMenu: "api/Menu/Delete",
  getAllMenuTab: "api/MenuTab/GetByMenuId",
  insertMenuTab: "api/MenuTab/Insert",
  updateMenuTab: "api/MenuTab/Update",
  deleteMenuTab: "api/MenuTab/Delete",
  getAllMenuGroup: "api/MenuGroup/GetAllByMenuTabID",
  insertMenuGroup: "api/MenuGroup/Insert",
  updateMenuGroup: "api/MenuGroup/Update",
  deleteMenuGroup: "api/MenuGroup/Delete",
  getAllMenuItem: "api/MenuItem/GetAllByMenuGroupId",
  insertMenuItem: "api/MenuItem/Insert",
  updateMenuItem: "api/MenuItem/Update",
  deleteMenuItem: "api/MenuItem/Delete",
  getAllUser: "api/User/GetAll",
  insertUser: "api/User/Insert",
  updateUser: "api/User/Update",
  deleteUser: "api/User/Delete",
  changePassword: "api/User/ChangePasswordByAdmin",
  getAllRoles: "api/Post/GetAll",
  insertRole: "api/Post/Insert",
  updateRole: "api/Post/Update",
  deleteRole: "api/Post/Delete",
  getAllCompany: "api/Company/GetAll",
  insertCompany: "api/Company/Insert",
  deleteCompany: "api/Company/Delete",
  updateCompany: "api/Company/Update",
  getAllPostCat: "api/PostCat/GetAll",
  addPostCat: "api/PostCat/Insert",
  editPostCat: "api/PostCat/Update",
  deletePostCat: "api/PostCat/Delete",
  getAllProject: "api/Project/GetAll",
  deleteProject: "api/Project/Delete",
  getAllForPostAdmin: "/api/Post/GetAllForAdmin",
  getAllProgramTemplate: "api/ProgramTemplate/GetAll",
  insertProgramTemplate: "api/ProgramTemplate/Insert",
  updateProgramTemplate: "api/ProgramTemplate/Update",
  deleteProgramTemplate: "api/ProgramTemplate/Delete",
  getAllProgramType: "api/ProgramType/GetAll",
  insertProgramType: "api/ProgramType/Insert",
  updateProgramType: "api/ProgramType/Update",
  deleteProgramType: "api/ProgramType/Delete",
  getAllOdpWithExtra: "api/KnowledgeType/GetAllWithExtraData",
  insertOdp: "api/KnowledgeType/Insert",
  updateOdp: "api/KnowledgeType/Update",
  deleteOdp: "api/KnowledgeType/Delete",
  getAllEntityCollection: "api/EntityCollection/GetAll",
  insertntityCollection: "api/EntityCollection/Insert",
  updatelEntityCollection: "api/EntityCollection/Update",
  deleteEntityCollection: "api/EntityCollection/Delete",
  getAllCalendar: "api/Calendar/GetAll",
  insertCalendar: "api/Calendar/Insert",
  updateCalendar: "api/Calendar/Update",
  deleteCalendar: "api/Calendar/Delete",
  getAllProjectsWithCalendar: "api/Project/GetAllWithCalendar",
  getPostSmall: "api/post/GetAllSmall",
  getPostsinProjectServices: "api/AccessProject/GetAllByPrjId",
  insertAccessProject: "api/AccessProject/Insert",
  updateAccessProject: "api/AccessProject/Update",
  deleteAccessProject: "api/AccessProject/Delete",
  getAllNameMenu: "api/Setting/GetAll",
  insertNameMenu: "api/Setting/Insert",
  deleteNameMenu: "api/Setting/Delete",
  getAllWfTemplate: "api/WFTemplate/GetAll",
  addApprovalFlow: "api/WFTemplate/Insert",
  deleteApprovalFlow: "api/WFTemplate/Delete",
  editApprovalFlow: "api/WFTemplate/Update",
  getAllEntityType: "api/EntityType/GetAll",
  getEntityFieldByEntityTypeId: "api/EntityField/GetByEntityTypeId",
  insertEntityField: "api/EntityField/Insert",
  updateEntityField: "api/EntityField/Update",
  deleteEntityField: "api/EntityField/Delete",
  getTableTransmittal: "api/EntityType/GetAllComplete",
  insertEntityType: "api/EntityType/Insert",
  deleteEntityType: "api/EntityType/Delete",
  updateEntityType: "api/EntityType/Update",
  duplicateEntityType: "api/EntityType/Duplicate",
  getAllCatA: "api/EntityCateA/GetAll",
  insertCatA: "api/EntityCateA/Insert",
  deleteCatA: "api/EntityCateA/Delete",
  editCatA: "api/EntityCateA/Update",
  getAllCatB: "api/EntityCateB/GetAll",
  insertCatB: "api/EntityCateB/Insert",
  deleteCatB: "api/EntityCateB/Delete",
  editCatB: "api/EntityCateB/Update",
  getAllBoxTemplatesByWfTemplateId: "api/WFBoxTemplate/GetAllByWFTemplatId",
  insertWFBoxTemplate: "api/WFBoxTemplate/Insert",
  updateWFBoxTemplate: "api/WFBoxTemplate/Update",
  deleteWFBoxTemplate: "api/WFBoxTemplate/Delete",
  getApprovalContextData: "api/WFApprovTemplate/GetAllByTemplateBoxId",
});
