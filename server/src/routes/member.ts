import { Router } from "express";
// global utils
import { paramsValidation, resolveValidation } from "../utils/validations";
// global middleware
import provideInput from "../middlewares/provideInput";
// member middleware and handler functions
import { updateMemberInputValidation } from "../utils/validations/member";
import updateMember from "../handlers/member/updateMember";
// error handler
import errorHandler from "../handlers/errorHandler";

const memberRouter = Router();

// routes accessible by members
memberRouter.put(
    '/member', 
    provideInput, 
    paramsValidation, 
    updateMemberInputValidation, 
    resolveValidation, 
    updateMember
);

memberRouter.use(errorHandler);

export default memberRouter;
