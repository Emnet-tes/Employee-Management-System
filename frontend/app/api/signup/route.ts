import { NextResponse } from "next/server";
import { createUser } from "@/lib/sanity/utils/user";
import { client } from "@/lib/sanity/client";

export async function POST(req: Request) {
  const { email, password , name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // Optional: check if user already exists (add logic if needed)
  const employeeRole = await client.fetch(
    `*[_type == "role" && title == "employee"][0]{ _id }`
  );
  if (!employeeRole?._id) {
    throw new Error("Default employee role not found in Sanity.");
  }
  const defaultRoleId = employeeRole?._id; // Get this from your `role` document in Sanity
  const newUser = await createUser({ email, password, roleId: defaultRoleId  , name });

  return NextResponse.json(newUser, { status: 201 });
}
