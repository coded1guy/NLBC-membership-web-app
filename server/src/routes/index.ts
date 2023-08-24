import { Router } from "express";
// admin middleware
import { isAdmin, isSuperAdmin } from "../middlewares/admin";
// handlers
import memberRouter from "./member";
import adminRouter from "./admin";
import superRouter from "./super";

const router = Router();

router.use('', isAdmin, adminRouter);
router.use('', isSuperAdmin, superRouter);
router.use('', memberRouter);

export default router;
