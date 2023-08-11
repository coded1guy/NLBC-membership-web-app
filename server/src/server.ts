import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from './routes';
import { checkAuthorization } from './utils/auth';
import { createAdminInputValidation, logAdminInInputValidation } from './utils/validations/admin';
import { resolveValidation } from './utils/validations';
import { createMember, logMemberIn } from './handlers/member';
// admin only handler function
import createAdmin from './handlers/admin/createAdmin';
import logAdminIn from './handlers/admin/logAdminIn';

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
