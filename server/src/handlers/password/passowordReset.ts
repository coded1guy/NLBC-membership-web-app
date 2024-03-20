import prisma from '../../db';
import { hashPassword } from '../../utils';

const passwordReset = async (req, res, next) => {
  const { token } = req.params;
  const { scope, newPassword } = req.body;
  const password = hashPassword(newPassword);
  let updatedUser;
  let user;

  if (!token) {
    const error = new Error(`Bad request, provide reset token.`);
    error['scope'] = scope;
    error['type'] = 'get';
    return next(error);
  }

  try {
    user = await prisma.resetPassword.findUnique({ where: { token } });

    if (user === null) {
      throw new Error(`${scope} does not exist.`);
    }
  } catch (e) {
    e.scope = scope;
    e.type = 'notExist';
  }

  if (user.email) {
    if (scope === 'member') {
      try {
        updatedUser = await prisma.member.update({
          where: { email: user.email },
          data: { password },
        });

        if (updatedUser === null) {
          throw new Error();
        }
      } catch (e) {
        e.type = 'server';
        e.scope = 'scope';
        return next(e);
      }
    } else if (scope === 'admin') {
      try {
        updatedUser = await prisma.admin.update({
          where: { email: user.email },
          data: { password },
        });

        if (updatedUser === null) {
          throw new Error();
        }
      } catch (e) {
        e.type = 'server';
        e.scope = 'scope';
        return next(e);
      }
    }
  }

  if (updatedUser.email) {
    try {
      const deleteResetData = await prisma.resetPassword.delete({
        where: { email: updatedUser.email },
      });

      if (deleteResetData === null) {
        throw new Error();
      }
    } catch (e) {
      e.type = 'server';
      e.scope = 'scope';
      return next(e);
    }
  }

  return res.status(200).json({ message: 'Password reset successful!' });
};
export default passwordReset;
