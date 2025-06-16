export type User = {
  _id: string;
  _type: 'user';
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Employee';
  employee?: {
    _ref: string;
    _type: 'reference';
  };
};
