import { deleteLeave } from "@/lib/sanity/utils/leaves";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const { id } = await params;
  await deleteLeave(id);
  return new Response("Leave deleted successfully", { status: 200 });
}
