import { hashPassword } from '../../utils/auth';
import prisma from '../../db';
import uploadProfileImage from '../../utils/uploads/profileImage';
import { defineError, defineCatchType } from '../../utils/defineError';
import { memberScope } from '.';

// Handler for createMember route
const createMember = async (req, res, next) => {
  // declaring and initializing variables
  let member: object;
  let profileImageUrl;

  // simple function for error handling while querying the db
  const sendError = function (type, error) {
    error = defineError(memberScope, type, error);
    next(error);
  };

  // destructuring required input values from the req.body
  const {
    firstName,
    middleName,
    lastName,
    age,
    email,
    phoneNumber,
    address,
    password,
    membershipStatus,
    employmentStatus,
    maritalStatus,
    dateOfBirth,
    anniversary,
  } = req.body;

  // If req.file is present, handle the upload to cloudinary
  if (req.file) {
    try {
      profileImageUrl = await uploadProfileImage(
        req.file.buffer,
        `${firstName}-${lastName}-profile-image`
      );
      if (!profileImageUrl) {
        throw new Error("Didn't get the profile Image url.");
      }
    } catch (e) {
      return sendError('imageUpload', e);
    }
  }

  // querying the database
  try {
    member = await prisma.member.create({
      data: {
        profileImageUrl,
        firstName,
        middleName,
        lastName,
        age,
        email,
        phoneNumber,
        address,
        password: await hashPassword(password),
        membershipStatus,
        employmentStatus,
        maritalStatus,
        dateOfBirth,
        anniversary,
      },
    });
  } catch (e) {
    return sendError(defineCatchType(e, 'create'), e);
  }

  // success output
  const userId: string = member['id'];
  return res.status(201).json({
    message: `Created new member.`,
  });
};
export default createMember;
