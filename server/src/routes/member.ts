import { Router } from "express";
// member validation schema and handler
import { profileImageSchema, updateMemberSchema } from "../utils/validations/schemas/member";
import { memberScope, updateMember } from "../handlers/member";
// general schema validation middleware
import schemaValidation from '../middlewares/schemaValidation';
// error handler
import errorHandler from "../handlers/errorHandler";
// singleImage file middleware
import { uploadSingleFile } from "../middlewares/multer";

const memberRouter = Router();

// routes accessible by members
memberRouter.put(
    '/member', 
    uploadSingleFile('profileImage', 'member'), 
    [
        schemaValidation(memberScope, profileImageSchema, "file"),
        schemaValidation(memberScope, updateMemberSchema, "body")
    ], 
    updateMember
);

memberRouter.use(errorHandler);

export default memberRouter;
