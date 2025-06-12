import { createRole, getAllRoles } from "@/lib/sanity/utils/role";

export async function GET() {
  try {
    const roles = await getAllRoles();
    return new Response(JSON.stringify(roles), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const leave = await createRole(data);
    return new Response(JSON.stringify(leave), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
