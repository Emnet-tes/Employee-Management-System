import { deleteRole } from "@/lib/sanity/utils/role";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  await deleteRole(id);
  return new Response("Leave deleted successfully", { status: 200 });
}
