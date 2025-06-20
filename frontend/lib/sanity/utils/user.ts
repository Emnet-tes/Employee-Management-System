import { client } from "../client";
import { User } from "@/types/user"; // Define this TypeScript type accordingly
import bcrypt from "bcryptjs";
type CreateUserInput = {
  email: string;
  password: string;
  name: string;
  roleId: string;
};

// Create a new user
export async function createUser(data: CreateUserInput): Promise<User> {
  const existingUser = await client.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email: data.email }
  );

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  
  
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await client.create({
    _type: "user",
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: {
      _type: "reference",
      _ref: data.roleId,
    },
  });

  const query = `*[_type == "user" && _id == $id][0]{
  _id,
  email,
  employee->{_id},
  role->{
    _id,
    name
  }
}`;

  const createdUser = await client.fetch(query, { id: newUser._id });
  return createdUser;
}

// Fetch all users
export async function getAllUsers(): Promise<User[]> {
  const query = `*[_type == "user"]{
    _id,
    email,
    role->{
      _id,
      name
    }
  }`;

  return await client.fetch(query);
}

// Get user by ID
export async function getUserById(id: string): Promise<User> {
  const query = `*[_type == "user" && _id == $id][0]{
    _id,
    email,
    name,
    role->{
      _id,
      name
    }
  }`;

  return await client.fetch(query, { id });
}

// Update user
export async function updateUser(
  id: string,
  updates: {
    email?: string;
    password?: string;
    roleId?: string;
    name?: string;
  }
): Promise<User> {
  const patch: Record<string, any> = {};

  // Check for duplicate email
  if (updates.email) {
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email && _id != $id][0]`,
      { email: updates.email, id }
    );
    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }
    patch.email = updates.email;
  }

  // Check for duplicate name
  if (updates.name) {
    const existingUser = await client.fetch(
      `*[_type == "user" && name == $name && _id != $id][0]`,
      { name: updates.name, id }
    );
    if (existingUser) {
      throw new Error("A user with this name already exists.");
    }
    patch.name = updates.name;
  }

  if (updates.roleId) {
    patch.role = { _type: "reference", _ref: updates.roleId };
  }

  await client.patch(id).set(patch).commit();

  return await getUserById(id);
}

// Delete user
export async function deleteUser(id: string): Promise<{ _id: string }> {
  return await client.delete(id);
}
