import { Router } from "express";
import adminRouter from "./admin";
import memberRouter from "./member";
import { isAdmin } from "../middlewares/admin";

const router = Router();

router.use('', isAdmin, adminRouter);
router.use('', memberRouter);

export default router;
