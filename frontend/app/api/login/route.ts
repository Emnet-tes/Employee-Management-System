import { client } from "@/lib/sanity/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password: inputPassword } = await req.json();

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

  if (!user || !(await bcrypt.compare(inputPassword , user.password))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword, { status: 200 });
}
