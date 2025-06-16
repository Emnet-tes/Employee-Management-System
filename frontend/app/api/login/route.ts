import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "@/lib/sanity/client"

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const query = `*[_type == "user" && email == $email][0]{
    _id,
    email,
    password,
    role->{
      _id,
      name
    }
  }`;

  const user = await client.fetch(query, { email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // Remove password before sending response
  const { password: _, ...userWithoutPassword } = user;

  return NextResponse.json(userWithoutPassword, { status: 200 });
}
