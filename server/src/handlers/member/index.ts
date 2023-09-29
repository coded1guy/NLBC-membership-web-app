// declared error scope
export const memberScope: string = 'member';

export const memberReturnData = {
  id: true,
  profileImageUrl: true,
  firstName: true,
  middleName: true,
  lastName: true,
  age: true,
  email: true,
  phoneNumber: true,
  address: true,
  password: false,
  membershipStatus: true,
  employmentStatus: true,
  maritalStatus: true,
  homeFellowship: true,
  dateOfBirth: true,
  anniversary: true,
  createdAt: true,
  updatedAt: true,
};

export { default as createMember } from './createMember';
export { default as loginMember } from './loginMember';
export { default as getMember } from './getMember';
export { default as getAllMembers } from './getAllMembers';
export { default as updateMember } from './updateMember';
export { default as deleteMember } from './deleteMember';
