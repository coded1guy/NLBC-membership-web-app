import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { body } from "express-validator";

import router from './router';
import { checkAuthorization } from './utils/auth';
import { createAdminInputValidation, logAdminInInputValidation } from './utils/validations/admin';
import { resolveValidation } from './utils/validations/resolveValidation';
import { createMember, logMemberIn } from './handlers/member';
import { createAdmin, logAdminIn } from './handlers/admin';

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "welcome to my server" });
});
// member auth paths
app.post('/createMember', createMember);
app.post('/loginMember', logMemberIn);

// admin auth paths
app.post('/createAdmin', createAdminInputValidation, resolveValidation, createAdmin);
app.post('/logAdminIn', logAdminInInputValidation, resolveValidation, logAdminIn);

// auth-required paths
app.use('/api', checkAuthorization, router);

export default app;
