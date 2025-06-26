import { NextRequest, NextResponse } from "next/server";
import {
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
} from "@/lib/sanity/utils/notification";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const notifications = await getUserNotifications(userId);
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notification = await createNotification(body);
  return NextResponse.json(notification);
}

export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing notification id" }, { status: 400 });

  const updated = await markNotificationAsRead(id);
  return NextResponse.json(updated);
}