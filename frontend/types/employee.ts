import { File, Image } from "sanity";

export type Employee = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  email: string;
  phone: string;
  photo?: Image | "";
  employmentStatus: string;
  role: {
    _id?: string;
    title: string;
  };
  startDate: string;
  department: {
    _id?: string;
    name: string;
    description: string;
  };
  documents?: File[];
};

export type EmployeeInput = {
  name: string;
  email: string;
  phone: string;
  photo?: Image | "";
  employmentStatus: string;
  roleId: string;
  departmentId: string;
  startDate: string;
  documents?: File[];
};
