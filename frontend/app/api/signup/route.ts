import { NextResponse } from "next/server";
import { createUser } from "@/lib/sanity/utils/user";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // Optional: check if user already exists (add logic if needed)

  const defaultRoleId = "your-default-role-id"; // Get this from your `role` document in Sanity
  const newUser = await createUser({ email, password, roleId: defaultRoleId });

  return NextResponse.json(newUser, { status: 201 });
}
