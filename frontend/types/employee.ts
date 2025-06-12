import { File, Image } from "sanity";

export type Employee = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  email: string;
  phone: string;
  photo: Image | null; 
  employmentStatus: string;
  role: {
    title: string;
  };
  startDate: string;
  departmentName: string;
  documents: File[];
};
