import { Employee } from "@/types/employee";
import { groq } from "next-sanity";
import { client } from "../client";

export async function getEmployees(): Promise<Employee[]> {
 
  return client.fetch(
    groq`*[_type == "employee" ]{
    _id,
    _createdAt,
    _updatedAt,
    name,
    email,
    phone,
    photo,
    employmentStatus,
    role->{
    title
    },
    startDate,
    "departmentName": department->name,
    "documents": documents[] 
    }`
  );
}
