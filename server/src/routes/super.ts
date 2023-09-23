import { Router } from "express";
// admin-related handler function
import { updateAdminSchema } from "../utils/validations/schemas/admin";
import { adminScope, updateAdmin } from "../handlers/admin";
// super-admin-only handler functions
import {getAnAdmin, getAllAdmin, deleteAnAdmin} from "../handlers/admin";
// general id params schema
import { userIdSchema } from "../utils/validations/schemas";
// general schema validation middleware
import schemaValidation from '../middlewares/schemaValidation';
// error handler
import errorHandler from "../handlers/errorHandler";

const superRouter = Router();

// all super-admin-focused routes
superRouter.get('/admin', getAllAdmin);
superRouter.get('/admin/:id', [schemaValidation(adminScope, userIdSchema, "params")], getAnAdmin);

superRouter.put(
    '/admin/:id', 
    [
        schemaValidation(adminScope, userIdSchema, "params"), 
        schemaValidation(adminScope, updateAdminSchema, "body")
    ], 
    updateAdmin
);
superRouter.delete('/admin/:id', [schemaValidation(adminScope, userIdSchema, "params")], deleteAnAdmin);

superRouter.use(errorHandler);

export default superRouter;
