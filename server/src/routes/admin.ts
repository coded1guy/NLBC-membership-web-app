import { Router } from "express";
import provideInput from "../middlewares/provideInput";
import { updateAdminInputValidation } from "../utils/validations/admin";
import { paramsValidation, resolveValidation } from "../utils/validations";
import { isSuperAdmin } from "../middlewares/admin";
import errorHandler from "../handlers/errorHandler";
// all admin handler function
import updateAdmin from "../handlers/admin/updateAdmin";
// super admin only handler function
import getAnAdmin from "../handlers/admin/getAnAdmin";
import getAllAdmin from "../handlers/admin/getAllAdmin";
import deleteAnAdmin from "../handlers/admin/deleteAnAdmin";

const adminRouter = Router();

// all member-related routes
adminRouter.get('/member', (req, res) => {
    res.json({ message: "welcome to all members" })
});
adminRouter.get('/member/:id', (req, res) => {});

adminRouter.delete('/member', (req, res) => {});
adminRouter.delete('/member/all', isSuperAdmin, (req, res) => {});

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
