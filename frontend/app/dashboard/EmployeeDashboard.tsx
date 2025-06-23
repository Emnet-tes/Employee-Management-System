"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/component/card";
import { getAttendancesByEmployeeId } from "@/lib/sanity/utils/attendance";
import { getLeaveById } from "@/lib/sanity/utils/leaves";
import { getPerformanceById } from "@/lib/sanity/utils/performance";
import Loading from "../_component/Loading";

interface EmployeeDashboardProps {
  session: any;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ session }) => {
  const [attendanceHistory, setAttendanceHistory] = useState<
    { date: string; status: string }[]
  >([]);
  const [leaveSummary, setLeaveSummary] = useState({
    available: 0,
    taken: 0,
    annual: 0,
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const employeeId = session?.user?.employeeId;
      if (!employeeId) return;

      const records = (await getAttendancesByEmployeeId(employeeId)) || [];
      const sorted = records.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAttendanceHistory(sorted.slice(0, 14));
      const leavesRaw = (await getLeaveById(employeeId)) || [];
      const leaves = Array.isArray(leavesRaw)
        ? leavesRaw
        : [leavesRaw].filter(Boolean);
      const taken = leaves.filter((l: any) => l.status === "approved").length;
      const annual = 6;
      setLeaveSummary({ available: annual - taken, taken, annual });
    }

    fetchData();
  }, [session]);

  useEffect(() => {
    const fetchEmployeeReviews = async () => {
      if (!session?.user?.employeeId) return;
      try {
        const res = await fetch(
          `/api/performance?employeeId=${session.user.employeeId}`
        );
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.log("Error fetching employee performance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeReviews();
  }, [session]);

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 text-black">
      {/* Attendance History */}
      <Card className="col-span-1 lg:col-span-2">
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-black">
            My Attendance (Last 2 Weeks)
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {attendanceHistory.map((record, idx) => (
              <div
                key={idx}
                className={`h-10 flex items-center justify-center rounded text-white text-sm font-medium ${
                  record.status === "Present"
                    ? "bg-green-500"
                    : record.status === "Absent"
                      ? "bg-red-500"
                      : "bg-gray-400"
                }`}
              >
                {new Date(record.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Summary */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-black">Leave Summary</h2>
          <ul className="text-black">
            <li>Available: {leaveSummary.available}</li>
            <li>Taken: {leaveSummary.taken}</li>
            <li>Annual: {leaveSummary.annual}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-black">
            Performance Overview
          </h2>
          {loading ? (
            <p className="text-black">Loading...</p>
          ) : reviews && reviews.length > 0 ? (
            <div>
              <p>
                <strong>Date:</strong> {reviews[0].date}
              </p>
              <p>
                <strong>Rating:</strong> {reviews[0].rating}
              </p>
              <p>
                <strong>Feedback:</strong> {reviews[0].feedback}
              </p>
              <div className="mt-2">
                <p className="font-semibold text-black">Goals:</p>
                <ul className="list-disc list-inside text-black">
                  {reviews[0].goals?.map((goal: string, i: number) => (
                    <li key={i} className="text-black">
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-black">No performance data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
