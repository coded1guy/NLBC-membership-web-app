import { Router } from "express";
// admin-related handler function
import { updateAdminSchema } from "../utils/validations/schemas/admin";
import { adminScope } from "../handlers/admin";
import updateAdmin from "../handlers/admin/updateAdmin";
// super-admin-only handler functions
import getAnAdmin from "../handlers/admin/getAnAdmin";
import getAllAdmin from "../handlers/admin/getAllAdmin";
import deleteAnAdmin from "../handlers/admin/deleteAnAdmin";
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
