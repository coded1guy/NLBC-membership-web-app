import { Router } from "express";
import { updateAdminInputValidation } from "../utils/validations/admin";
import { paramsValidation, resolveValidation } from "../utils/validations";
import { deleteAnAdmin, getAllAdmin, getAnAdmin, updateAdmin } from "../handlers/admin";
import errorHandler from "../handlers/errorHandler";
import { isSuperAdmin } from "../middlewares/admin";
import provideInput from "../middlewares/provideInput";

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
