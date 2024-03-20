import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// router
import router from './routes';
// utils function
import { checkAuthToken } from './middlewares';
// admin authentication middleware and handler function
import {
  createAdminSchema,
  loginAdminSchema,
} from './utils/validations/schemas/admin';
import { adminScope, createAdmin, logAdminIn } from './handlers/admin';
// member authentication middleware and handler function
import {
  createMemberSchema,
  loginMemberSchema,
  profileImageSchema,
} from './utils/validations/schemas/member';
import { memberScope, createMember, loginMember } from './handlers/member';
import logout from './handlers/logout';
// general schema validation middleware
import schemaValidation from './middlewares/schemaValidation';
// error handler function
import errorHandler from './handlers/errorHandler';
// singleImage file middleware
import { uploadSingleFile } from './middlewares/multer';
import { sendEmail, runEmailTransaction } from './utils';

// initialize out express app
const app = express();
// rate limiter init
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    return req.ip;
  },
});
// set up general middlewares
app.use(cors());
app.use(limiter);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// endpoint to test server availability
app.get('/', (req, res) => {
  res.json({
    message: 'welcome to the NLBC membership management Platform API',
  });
});
// api health
app.get('/health', (req, res) => {
  return res.status(200).json({
    message: 'API ok',
    version: '1.0',
  });
});
app.post('/test-email', async (req, res) => {
  const emails = req.body.email;
  if (!emails) {
    return res.status(400).send('email list required');
  }
  const emailArr = emails.split(',');
  let emailList = [];
  emailArr.forEach((emailAddress) => {
    emailList.push(
      sendEmail({
        to: `${emailAddress}`,
        title: 'test mail',
        body: "let's test the email",
        isHTML: false,
      })
    );
  });
  let msg = await runEmailTransaction(emailList);
  res.send(msg);
});
// member auth endpoint
app.post(
  '/createMember',
  uploadSingleFile('profileImage', 'member'),
  [
    schemaValidation(memberScope, profileImageSchema, 'file'),
    schemaValidation(memberScope, createMemberSchema, 'body'),
  ],
  createMember
);
app.post(
  '/loginMember',
  [schemaValidation(memberScope, loginMemberSchema, 'body')],
  loginMember
);

// admin auth endpoint
app.post(
  '/createAdmin',
  [schemaValidation(adminScope, createAdminSchema, 'body')],
  createAdmin
);
app.post(
  '/logAdminIn',
  [schemaValidation(adminScope, loginAdminSchema, 'body')],
  logAdminIn
);

// entry-point into the api endpoint. This need JWT-token for authorization.
app.use('/api', checkAuthToken, router);
// logout handler
app.get('/logout', checkAuthToken, logout);
// setting the error handler globally
app.use(errorHandler);
// 404-endpoint
app.use('', (req, res) =>
  res.status(404).send('404!, that is not a valid endpoint.')
);

export default app;
