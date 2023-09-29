import prisma from '../../db';
import { defineError, defineCatchType } from '../../utils/defineError';
import { adminScope, adminReturnData } from '.';

// Handler for the super admin to get an admin
export const getAnAdmin = async (req, res, next) => {
  // declaring and initializing variables
  const { id } = req.params;
  let admin: object;

  // simple function for error handling while querying the db
  const sendError = function (type, error, message = '') {
    error = defineError(adminScope, type, error, message);
    next(error);
  };

  // querying the database
  try {
    admin = await prisma.admin.findUnique({
      where: { id },
      select: { ...adminReturnData },
    });
    if (admin === null) {
      return sendError('id', null);
    }
  } catch (e) {
    return sendError(defineCatchType(e, 'get'), e);
  }

  // success output
  return res.status(200).json({
    message: 'Admin was gotten successfully.',
    data: admin,
  });
};

export default getAnAdmin;
