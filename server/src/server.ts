import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// router 
import router from './routes';
// utils function
import { checkAuthToken } from './middlewares';
// admin authentication middleware and handler function
import { createAdminSchema, loginAdminSchema } from './utils/validations/schemas/admin';
import { adminScope } from './handlers/admin';
import createAdmin from './handlers/admin/createAdmin';
import logAdminIn from './handlers/admin/logAdminIn';
// member authentication middleware and handler function
import { createMemberSchema, loginMemberSchema, profileImageSchema } from './utils/validations/schemas/member';
import { memberScope } from './handlers/member';
import createMember from './handlers/member/createMember';
import loginMember from './handlers/member/loginMember';
import logout from './handlers/logout';
// general schema validation middleware
import schemaValidation from './middlewares/schemaValidation';
// error handler function
import errorHandler from './handlers/errorHandler';
// singleImage file middleware
import { uploadSingleFile } from "./middlewares/multer";

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
app.post(
    '/createMember', 
    uploadSingleFile('profileImage', 'member'), 
    [
        schemaValidation(memberScope, profileImageSchema, "file"),
        schemaValidation(memberScope, createMemberSchema, "body")
    ], 
    createMember
    );
app.post('/loginMember', [schemaValidation(memberScope, loginMemberSchema, "body")], loginMember);

// admin auth endpoint
app.post('/createAdmin', [schemaValidation(adminScope, createAdminSchema, "body")], createAdmin);
app.post('/logAdminIn', [schemaValidation(adminScope, loginAdminSchema, "body")], logAdminIn);

// entry-point into the api endpoint. This need JWT-token for authorization.
app.use('/api', checkAuthToken, router);
// logout handler
app.get('/logout', checkAuthToken, logout);
// setting the error handler globally
app.use(errorHandler);

export default app;
