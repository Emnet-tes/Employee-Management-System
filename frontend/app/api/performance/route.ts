import { NextRequest, NextResponse } from "next/server";
import {
  getAllPerformances,
  createPerformance,
  getPerformancesByReviewer,
  getPerformanceByEmployeeId,
} from "@/lib/sanity/utils/performance";

// GET: Fetch all performance reviews
// export async function GET() {
//   try {
//     const performances = await getAllPerformances();
//     return NextResponse.json(performances);
//   } catch (error) {
//     console.log("GET /api/performance error:", error);
//     return new NextResponse("Failed to fetch performances", { status: 500 });
//   }
// }

// POST: Create a new performance review
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newPerformance = await createPerformance(data);
    return NextResponse.json(newPerformance);
  } catch (error) {
    console.error("POST /api/performance error:", error);
    return new NextResponse("Failed to create performance review", {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  const reviewerId = req.nextUrl.searchParams.get("reviewerId");
  const employeeId = req.nextUrl.searchParams.get("employeeId");
  if (reviewerId) {
    const reviews = await getPerformancesByReviewer(reviewerId);
    return NextResponse.json(reviews);
  }

    if (employeeId) {
        const reviews = await getPerformanceByEmployeeId(employeeId);
        return NextResponse.json(reviews);
    }

  const reviews = await getAllPerformances();
  return NextResponse.json(reviews);
}
