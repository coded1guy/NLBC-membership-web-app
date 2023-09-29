import prisma from '../../db';
import { defineError, defineCatchType } from '../../utils/defineError';
import { memberScope, memberReturnData } from '.';

const getAllMembers = async (req, res, next) => {
  // declaring and initializing variables
  let members, membersCount: number;
  let lastId: string | null = null;

  // query parameters
  let {
    limit,
    cursorId,
    firstName,
    middleName,
    lastName,
    age,
    email,
    phoneNumber,
    address,
    membershipStatus,
    employmentStatus,
    maritalStatus,
    homeFellowship,
    dateOfBirth,
    anniversary,
  } = req.query;

  // type conversion
  age = +age;
  limit = +limit;

  // all filter parameters
  let allFilterItems = [
    { firstName },
    { middleName },
    { lastName },
    { age },
    { email },
    { phoneNumber },
    { address },
    { membershipStatus },
    { employmentStatus },
    { maritalStatus },
    { homeFellowship },
    { dateOfBirth },
    { anniversary },
  ];

  // filters out fields that have not been filled
  allFilterItems = allFilterItems.filter((filterItem) => {
    const itemValues = Object.values(filterItem);
    if (itemValues[0]) {
      return filterItem;
    }
  });

  // setting up the where property of the prisma call
  let whereOptions: object = {};
  if (allFilterItems.length === 1) {
    whereOptions = {
      where: {
        ...allFilterItems[0],
      },
    };
  } else if (allFilterItems.length > 1) {
    whereOptions = {
      where: {
        AND: allFilterItems,
      },
    };
  }

  // simple function for error handling while querying the db
  const sendError = function (type, error) {
    error = defineError(memberScope, type, error);
    next(error);
  };

  // defining the database query options
  let cursorOptions: object = {};
  if (cursorId) {
    cursorOptions = {
      cursor: { id: cursorId },
    };
  }
  console.log(cursorOptions);

  // querying the database
  try {
    [members, membersCount] = await prisma.$transaction([
      prisma.member.findMany({
        take: limit | 20,
        skip: 1,
        orderBy: { createdAt: 'desc' },
        select: { ...memberReturnData },
        ...cursorOptions,
        ...whereOptions,
      }),
      prisma.member.count(),
    ]);

    if (members === null || members.length < 1) {
      sendError('noList', null);
      return;
    }
  } catch (e) {
    sendError(defineCatchType(e, 'get'), e);
    return;
  }

  // get the last id of the set of members returned to get the cursor for next page
  if (members.length === limit && members.length < membersCount) {
    lastId = members[members.length - 1].id;
  }

  // success output
  return res.status(200).json({
    message: 'members list was gotten successfully.',
    result: {
      total: membersCount,
      lastId,
      data: members,
    },
  });
};
export default getAllMembers;
