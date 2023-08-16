import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// router 
import router from './routes';
// utils function
import { checkAuthorization } from './utils/auth';
import { resolveValidation } from './utils/validations';
// admin authentication middleware and handler function
import { createAdminInputValidation, logAdminInInputValidation } from './utils/validations/admin';
import createAdmin from './handlers/admin/createAdmin';
import logAdminIn from './handlers/admin/logAdminIn';
// member authentication middleware and handler function
import { createMemberInputValidation, loginMemberInputValidation } from './utils/validations/member';
import loginMember from './handlers/member/loginMember';
import createMember from './handlers/member/createMember';
// error handler function
import errorHandler from './handlers/errorHandler';

// initialize out express app
const app = express();
// set up general middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// endpoint to test server availability
app.get('/', (req, res) => {
    res.json({ message: "welcome to my server" });
});
// member auth endpoint
app.post('/createMember', createMemberInputValidation, resolveValidation, createMember);
app.post('/loginMember', loginMemberInputValidation, resolveValidation, loginMember);

// admin auth endpoint
app.post('/createAdmin', createAdminInputValidation, resolveValidation, createAdmin);
app.post('/logAdminIn', logAdminInInputValidation, resolveValidation, logAdminIn);

// entry-point into the api endpoint. This need JWT-token for authorization.
app.use('/api', checkAuthorization, router);
// setting the error handler globally
app.use(errorHandler);

export default app;
