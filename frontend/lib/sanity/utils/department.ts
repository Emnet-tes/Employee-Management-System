import { Department } from "@/types/department";
import { client } from "../client";

export async function getAllDepartments(): Promise<Department[]> {
  const query = `*[_type == "department"]{
    _id,
    _createdAt,
    _updatedAt,
    name,
    description
  } | order(name asc)`;

  const results = await client.fetch(query);
  return results as Department[];
}
export async function getDepartmentById(id: string): Promise<Department | null> {
  const query = `*[_type == "department" && _id == $id][0]{
    _id,
    _createdAt,
    _updatedAt,
    name,
    description
  }`;

  const department = await client.fetch(query, { id });
  return department || null;
}
export async function createDepartment(department: Omit<Department, "_id" | "_createdAt" | "_updatedAt">): Promise<Department> {
  const newDoc = await client.create({
    _type: "department",
    ...department,
  });

  const populated = await getDepartmentById(newDoc._id);
  return populated as Department;
}
export async function updateDepartment(id: string, department: Partial<Omit<Department, "_id" | "_createdAt" | "_updatedAt">>): Promise<Department | null> {
  const updatedDoc = await client.patch(id).set(department).commit();

  if (!updatedDoc) return null;

  const populated = await getDepartmentById(updatedDoc._id);
  return populated as Department;
}
export async function deleteDepartment(id: string): Promise<{_id:string}| null> {
  try {
    const result = client.delete(id);
    return result;
  } catch (error) {
    console.error("Error deleting department:", error);
    return null;
  }
}