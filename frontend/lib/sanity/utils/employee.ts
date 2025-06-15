import { Employee, EmployeeInput } from "@/types/employee";
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
    department->{name},
    "documents": documents[] 
    }`
  );
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const query = groq`*[_type == "employee" && _id == $id][0]{
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
  }`;

  const employee = await client.fetch(query, { id });
  return employee || null;
}

export async function createEmployee(employee:EmployeeInput): Promise<Employee> {
  const newDoc = await client.create({
    _type: "employee",
    role: { _type:"reference",_ref: employee.roleId },
    department: { _type: "reference", _ref: employee.departmentId },
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    photo: employee.photo,
    employmentStatus: employee.employmentStatus,
    startDate: employee.startDate,
    documents: employee.documents || [],
  });

  const populated = await getEmployeeById(newDoc._id);
  return populated as Employee;
}

export async function updateEmployee(id: string, employee: Partial<EmployeeInput>): Promise<Employee | null> {
  const updatedDoc = await client.patch(id)
    .set(employee)
    .commit();
  if (!updatedDoc) {
    throw new Error(`Failed to update employee with id ${id}`);
  }
  const populated = await getEmployeeById(updatedDoc._id);
  return populated as Employee;
}
export async function deleteEmployee(id: string): Promise<{ _id: string } | null> {
  const result = await client.delete(id);
  if (!result) {
    throw new Error(`Failed to delete employee with id ${id}`);
  }
  return result;
}
