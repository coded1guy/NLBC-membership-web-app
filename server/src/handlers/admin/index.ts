// declared error scope
export const adminScope: string = 'admin';

export const adminReturnData = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  password: false,
  role: true,
  status: true,
  lastLoggedIn: true,
  createdAt: true,
  updatedAt: true,
};

export { default as createAdmin } from './createAdmin';
export { default as logAdminIn } from './logAdminIn';
export { default as getAnAdmin } from './getAnAdmin';
export { default as getAllAdmin } from './getAllAdmin';
export { default as updateAdmin } from './updateAdmin';
export { default as deleteAnAdmin } from './deleteAnAdmin';
