import { Router } from "express";
// member validation schema and handler
import { updateMemberSchema } from "../utils/validations/schemas/member";
import { memberScope } from "../handlers/member";
import updateMember from "../handlers/member/updateMember";
// general id params schema
import { userIdSchema } from "../utils/validations/schemas";
// general schema validation middleware
import schemaValidation from '../middlewares/schemaValidation';
// error handler
import errorHandler from "../handlers/errorHandler";

const memberRouter = Router();

// routes accessible by members
memberRouter.put(
    '/member', 
    [schemaValidation(memberScope, userIdSchema, "params")], 
    [schemaValidation(memberScope, updateMemberSchema, "body")], 
    updateMember
);

memberRouter.use(errorHandler);

export default memberRouter;
