import prisma from '../../db';
import { defineError, defineCatchType } from '../../utils/defineError';
import { adminScope, adminReturnData } from '.';

const getAllAdmin = async (req, res, next) => {
  // declaring and initializing variables
  let admin,
    adminCount: number,
    lastId: string | null = null;
  let { limit, cursorId } = req.query;
  limit = +limit;

  // simple function for error handling while querying the db
  const sendError = function (type, error) {
    error = defineError(adminScope, type, error);
    next(error);
  };

  // defining the database query options
  let queryOptions: object = {
    take: limit | 20,
    skip: 1,
    orderBy: { createdAt: 'desc' },
    select: { ...adminReturnData },
  };
  if (cursorId) {
    queryOptions['cursor'] = cursorId;
  }

  // querying the database
  try {
    [admin, adminCount] = await prisma.$transaction([
      prisma.admin.findMany({ ...queryOptions }),
      prisma.admin.count(),
    ]);

    if (admin === null || admin.length < 1) {
      sendError('noList', null);
      return;
    }
  } catch (e) {
    sendError(defineCatchType(e, 'get'), e);
    return;
  }

  // get the last id of the set of admin returned to get the cursor for next page
  if (admin.length === limit && admin.length < adminCount) {
    lastId = admin[admin.length - 1].id;
  }

  // success output
  res.status(200).json({
    message: 'Admin list was gotten successfully.',
    result: {
      total: adminCount,
      lastId,
      data: admin,
    },
  });
  return;
};

export default getAllAdmin;
