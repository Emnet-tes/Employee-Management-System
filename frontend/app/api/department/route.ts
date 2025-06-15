const { createDepartment, getAllDepartments } = await import(
  "@/lib/sanity/utils/department"
);

export async function GET() {
  try {
    const departments = await getAllDepartments();
    return new Response(JSON.stringify(departments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const leave = await createDepartment(data);
    return new Response(JSON.stringify(leave), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
