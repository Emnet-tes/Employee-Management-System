import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserById } from "@/lib/sanity/utils/user";


export async function POST(req: NextRequest) {
  try {
    const { userId, currentPassword } = await req.json();

    const user = await getUserById(userId);

    if (!user?.password) {
      return NextResponse.json({ error: "No password set." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect current password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
