import { Router } from "express";
import { updateAdminInputValidation } from "./utils/validations/admin";
import { paramsValidation, resolveValidation } from "./utils/validations";
import { deleteAnAdmin, getAllAdmin, getAnAdmin, updateAdmin } from "./handlers/admin";
import errorHandler from "./handlers/errorHandler";
import { mustBeMaster } from "./middlewares/admin";
import provideInput from "./middlewares/provideInput";
const router = Router();

// all member-related routes
router.get('/allMember', (req, res) => {
    res.json({ message: "welcome to all members" })
})
router.get('/member/:id', (req, res) => {})
router.put('/allMember', provideInput, (req, res) => {})
router.delete('/member', (req, res) => {})
router.delete('/allMember', (req, res) => {})

// all admin-focused routes
router.get('/allAdmin', mustBeMaster, getAllAdmin)
router.get('/admin/:id', paramsValidation, resolveValidation, mustBeMaster, getAnAdmin)
router.put(
    '/admin', 
    provideInput, 
    updateAdminInputValidation, 
    resolveValidation, 
    updateAdmin
);
router.put(
    '/admin/:id', 
    provideInput, 
    paramsValidation, 
    updateAdminInputValidation, 
    resolveValidation, 
    mustBeMaster, 
    updateAdmin
);
router.delete('/admin/:id', paramsValidation, resolveValidation, mustBeMaster, deleteAnAdmin)


router.use(errorHandler);

export default router;
