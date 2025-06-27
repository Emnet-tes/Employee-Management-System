import { Employee, EmployeeInput } from "@/types/employee";
import { groq } from "next-sanity";
import { client } from "../client";

export async function getEmployees(): Promise<Employee[]> {
  return client.fetch(
    groq`*[_type == "employee"]{
      _id,
      _createdAt,
      _updatedAt,
      phone,
      photo,
      name,
      employmentStatus,
      role->{ _id,title },
      startDate,
      position,
      department->{_id, name, description },
      user->{
        _id,
        name,
        email
      },
     "documents": documents[]{
       _key,
    "assetRef": asset._ref,
      asset->{_id, url}
}

    }`
  );
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const query = groq`*[_type == "employee" && _id == $id][0]{
    _id,
    _createdAt,
    _updatedAt,
    phone,
    photo,
    name,
    employmentStatus,
    role->{ _id,title },
    startDate,
    position,
    department->{ _id,name, description },
    user->{
      _id,
      name,
      email
    },
    "documents": documents[]{
      asset->{ _id, url },
      }
  }`;

  const employee = await client.fetch(query, { id });
  return employee || null;
}

export async function getEmployeesByUserId(id: string): Promise<Employee> {
  const query = groq`*[_type == "employee" && user._ref == $id][0]{
    user->{ _id, name, email },
    name,
    phone,
    photo,
    employmentStatus,
    role->{ _id,title },
    position,
    startDate,
    "documents": documents[]{
      asset->{ _id, url },
      },
    department->{ _id,name, description },
    _id,
    _createdAt,
    _updatedAt
    }`;
  const employees = await client.fetch(query, { id });
  return employees as Employee;
}



export async function createEmployee(
  employee: EmployeeInput
): Promise<Employee> {
  const newDoc = await client.create({
    _type: "employee",
    user: { _type: "reference", _ref: employee.userId },
    role: { _type: "reference", _ref: employee.roleId },
    name: employee.name,
    phone: employee.phone,
    photo: employee.photo,
    employmentStatus: employee.employmentStatus,
    department: { _type: "reference", _ref: employee.departmentId },
    position: employee.position,
    startDate: employee.startDate,
    documents: employee.documents || [],
  });

  const populated = await getEmployeeById(newDoc._id);
  return populated as Employee;
}

export async function updateEmployee(
  id: string,
  employee: Partial<EmployeeInput>
): Promise<Employee | null> {
  const patchData: Record<string, unknown> = { ...employee };

  if (employee.userId) {
    patchData.user = { _type: "reference", _ref: employee.userId };
  }
  if (employee.roleId) {
    patchData.role = { _type: "reference", _ref: employee.roleId };
  }
  if (employee.departmentId) {
    patchData.department = { _type: "reference", _ref: employee.departmentId };
  }
  if (employee.photo) {
    patchData.photo = employee.photo;
  }
  if (employee.documents) {
    patchData.documents = employee.documents;
  }
  if (employee.startDate) {
    patchData.startDate = employee.startDate;
  }
  if (employee.phone) {
    patchData.phone = employee.phone;
  }
  if (employee.position) {
    patchData.position = employee.position;
  }

  const updatedDoc = await client.patch(id).set(patchData).commit();

  if (!updatedDoc) {
    throw new Error(`Failed to update employee with id ${id}`);
  }

  const populated = await getEmployeeById(updatedDoc._id);
  return populated as Employee;
}

export async function deleteEmployee(
  id: string
): Promise<{ _id: string } | null> {
  const result = await client.delete(id);
  if (!result) {
    throw new Error(`Failed to delete employee with id ${id}`);
  }
  return result;
}
