// import { Role } from "@/types/role";
import { client } from "../client";

export type Role = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  permissions: string[];
};

export async function getAllRoles(): Promise<Role[]> {
  const query = `*[_type == "role"]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    description,
    permissions
  } | order(title asc)`;

  const results = await client.fetch(query);
  return results as Role[];
}

export async function getRoleById(id: string): Promise<Role | null> {   
  const query = `*[_type == "role" && _id == $id][0]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    description,
    permissions
  }`;

  const role = await client.fetch(query, { id });
  return role || null;
}
export async function createRole(role: Omit<Role, "_id" | "_createdAt" | "_updatedAt">): Promise<Role> {
    const newDoc = await client.create({
        _type: "role",
        ...role,
    });
    
    const populated = await getRoleById(newDoc._id);
    return populated as Role;
    }   

export async function updateRole(id: string, role: Partial<Omit<Role, "_id" | "_createdAt" | "_updatedAt">>): Promise<Role | null> {
    const updatedDoc = await client.patch(id).set(role).commit();

    if (!updatedDoc) return null;

    const populated = await getRoleById(updatedDoc._id);
    return populated as Role;
}
export async function deleteRole(id: string): Promise<{ _id: string } | null> {
  try {
    const result = client.delete(id);
    return result;
  } catch (error) {
    console.error("Error deleting department:", error);
    return null;
  }
}
