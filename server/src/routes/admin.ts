import { Router } from "express";
// admin-related handler validation schema function
import { updateAdminSchema } from "../utils/validations/schemas/admin";
import { adminScope, updateAdmin } from "../handlers/admin";
// all member-related validation schema and handler functions
import { profileImageSchema, updateMemberSchema } from "../utils/validations/schemas/member";
import { memberScope } from "../handlers/member";
import {getMember, deleteMember, updateMember, getAllMembers} from "../handlers/member";
// multer upload middleware
import { uploadSingleFile } from "../middlewares/multer";
// general id params schema
import { userIdSchema } from "../utils/validations/schemas";
// general schema validation middleware
import schemaValidation from '../middlewares/schemaValidation';
// error handler
import errorHandler from "../handlers/errorHandler";

const adminRouter = Router();

// all member-related routes
adminRouter.get('/member', getAllMembers);
adminRouter.get('/member/:id', [schemaValidation(memberScope, userIdSchema, "params")], getMember);
adminRouter.put(
    '/member/:id', 
    uploadSingleFile('profileImage', 'member'), 
    [
        schemaValidation(memberScope, userIdSchema, "params"), 
        schemaValidation(memberScope, profileImageSchema, "file"), 
        schemaValidation(memberScope, updateMemberSchema, "body")
    ],
    updateMember
);
adminRouter.delete('/member:id', [schemaValidation(memberScope, userIdSchema, "params")], deleteMember);

// all admin-focused routes
adminRouter.put('/admin', [schemaValidation(adminScope, updateAdminSchema, "body")], updateAdmin);

adminRouter.use(errorHandler);

export default adminRouter;
