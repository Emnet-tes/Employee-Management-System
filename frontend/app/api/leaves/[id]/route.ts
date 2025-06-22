import { deleteLeave, updateLeave } from "@/lib/sanity/utils/leaves";
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await params.id;
  const updates = await req.json();
  const updated = await updateLeave(id, updates);
  return Response.json(updated);
}
