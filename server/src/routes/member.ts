import { Router } from "express";
// import { updateMemberInputValidation } from "../utils/validations/member";
import { paramsValidation, resolveValidation } from "../utils/validations";
import errorHandler from "../handlers/errorHandler";
import provideInput from "../middlewares/provideInput";

const memberRouter = Router();

// routes accessible by members
memberRouter.put('/allMember', provideInput, (req, res) => {})

memberRouter.use(errorHandler);

export default memberRouter;
