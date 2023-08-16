import { Router } from "express";
import provideInput from "../middlewares/provideInput";
import { updateAdminInputValidation } from "../utils/validations/admin";
import { paramsValidation, resolveValidation } from "../utils/validations";
import { isSuperAdmin } from "../middlewares/admin";
import errorHandler from "../handlers/errorHandler";
// admin-related handler function
import updateAdmin from "../handlers/admin/updateAdmin";
// super-admin-only handler functions
import getAnAdmin from "../handlers/admin/getAnAdmin";
import getAllAdmin from "../handlers/admin/getAllAdmin";
import deleteAnAdmin from "../handlers/admin/deleteAnAdmin";
// all member-related handler functions
import getMember from "../handlers/member/getMember";
import deleteMember from "../handlers/member/deleteMember";
import updateMember from "../handlers/member/updateMember";
import getAllMembers from "../handlers/member/getAllMembers";
import { updateMemberInputValidation } from "../utils/validations/member";

const adminRouter = Router();

// all member-related routes
adminRouter.get('/member', getAllMembers);
adminRouter.get('/member/:id', paramsValidation, resolveValidation, getMember);
adminRouter.put(
    '/member/:id', 
    provideInput,
    paramsValidation, 
    updateMemberInputValidation, 
    resolveValidation, 
    updateMember
);
adminRouter.delete('/member:id', paramsValidation, resolveValidation, deleteMember);

// all admin-focused routes
adminRouter.get('/admin', isSuperAdmin, getAllAdmin);
adminRouter.get('/admin/:id', paramsValidation, resolveValidation, isSuperAdmin, getAnAdmin);
adminRouter.put(
    '/admin', 
    provideInput, 
    updateAdminInputValidation, 
    resolveValidation, 
    updateAdmin
);
adminRouter.put(
    '/admin/:id', 
    provideInput, 
    paramsValidation, 
    updateAdminInputValidation, 
    resolveValidation, 
    isSuperAdmin, 
    updateAdmin
);
adminRouter.delete('/admin/:id', paramsValidation, resolveValidation, isSuperAdmin, deleteAnAdmin);

adminRouter.use(errorHandler);

export default adminRouter;
