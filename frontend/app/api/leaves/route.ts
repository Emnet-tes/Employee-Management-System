import { createNotification } from "@/lib/sanity/utils/notification";

const { createLeave, getAllLeaves } = await import("@/lib/sanity/utils/leaves");

export async function GET() {
  try {
    const leaves = await getAllLeaves();
    return new Response(JSON.stringify(leaves), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const leave = await createLeave(data);
    await createNotification({
      recipientId: data.employeeId,
      type: "schedule",
      message: `You have been assigned a new schedule for ${data.date} (${data.shift})`,
    });
    return new Response(JSON.stringify(leave), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
