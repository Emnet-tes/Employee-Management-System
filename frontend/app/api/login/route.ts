import { client } from "@/lib/sanity/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Remove password before sending response
  const { password: _password, ...userWithoutPassword } = user;
  _password; 

  return NextResponse.json(userWithoutPassword, { status: 200 });
}
