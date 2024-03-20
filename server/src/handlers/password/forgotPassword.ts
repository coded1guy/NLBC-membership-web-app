import crypto from 'crypto';
import prisma from '../../db';
import { sendEmail, resetPasswordEmail } from '../../utils';

const forgotPassword = async (req, res, next) => {
  const { email, scope } = req.body;

  let user, forgetfulUser, token, expiry;
  // user does not exist

  if (scope === 'member') {
    try {
      user = await prisma.member.findUnique({
        where: { email },
      });

      if (user === null) {
        throw new Error(`Couldn't find any ${scope} with that ${email}.`);
      }
    } catch (e) {
      e.type = 'get';
      e.scope = scope;
      return next(e);
    }
  } else if (scope === 'admin') {
    try {
      user = await prisma.admin.findUnique({
        where: { email },
      });

      if (user === null) {
        throw new Error(`Couldn't find any ${scope} with that ${email}.`);
      }
    } catch (e) {
      e.type = 'get';
      e.scope = scope;
      return next(e);
    }
  }

  if (user) {
    token = crypto.randomBytes(20).toString('hex');
    expiry = Date.now() + 3600000;

    try {
      forgetfulUser = await prisma.resetPassword.upsert({
        where: {
          email,
        },
        update: {
          token,
          scope,
          expiry,
        },
        create: {
          email,
          token,
          scope,
          expiry,
        },
      });

      if (forgetfulUser === null) {
        throw new Error(`Error resetting ${scope}'s password.`);
      }
    } catch (e) {
      e.type = 'forget';
      e.scope = scope;
      return next(e);
    }
  }

  const host = 'https://www.nlbc.com/resetPassword';

  try {
    await sendEmail({
      to: user.email,
      title: 'Password Reset Request',
      body: resetPasswordEmail(
        `${user.firstName} ${user.lastName}`,
        `${host}/${token}`
      ),
      isHTML: true,
    });
  } catch {}
};
export default forgotPassword;
