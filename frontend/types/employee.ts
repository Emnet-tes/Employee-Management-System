import { File, Image } from "sanity";

export type Employee = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  phone: string;
  photo: Image;
  employmentStatus: string;
  role: {
    _id: string;
    title: string;
  };
  position: string;
  startDate: string;
  department: {
    _id: string;
    name: string;
    description: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  documents?: {
    _key: string;
    asset: {
      _id: string;
      url: string;
      _ref: string;
    };
  }[];
};

export type EmployeeInput = {
  userId: string;
  name: string;
  phone: string;
  photo?: Image | "";
  position: string;
  employmentStatus: string;
  roleId: string;
  departmentId: string;
  startDate: string;
  documents?: File[];
};
