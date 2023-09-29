import { memberScope, memberReturnData } from '.';
import prisma from '../../db';
import { defineError, defineCatchType } from '../../utils/defineError';

// Handler for the super admin to delete a member
const deleteMember = async (req, res, next) => {
  // declaring and initializing variables
  const { id } = req.params;
  let member: object | null;

  // simple function for error handling while querying the db
  const sendError = function (type, error) {
    error = defineError(memberScope, type, error);
    next(error);
  };

  // querying the database
  try {
    member = await prisma.member.delete({
      where: { id },
      select: { ...memberReturnData },
    });

    if (member === null) {
      return sendError('id', null);
    }
  } catch (e) {
    return sendError(defineCatchType(e, 'delete'), e);
  }

  // success output
  return res.status(200).json({
    message: 'member was deleted successfully.',
    data: member,
  });
};

export default deleteMember;
