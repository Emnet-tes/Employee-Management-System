import { deleteRole } from "@/lib/sanity/utils/role";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
    const { params } = await context;
    const { id } = await params;
  await deleteRole(id);
  return new Response("Leave deleted successfully", { status: 200 });
}
