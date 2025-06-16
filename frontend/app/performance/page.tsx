"use client";
import React, { useEffect, useState } from "react";
import {
  getAllPerformances,
  createPerformance,
} from "@/lib/sanity/utils/performance";
import { Card, CardContent } from "@/component/card";
import { Performance } from "@/types/performance"; // Assuming you have a type defined for performance

const PerformancePage = () => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    reviewerId: "",
    date: "",
    kpis: "",
    feedback: "",
    rating: 0,
  });

  // 👇 Change this mock role logic when auth is integrated
  const userRole: "admin" | "employee" = "employee"; // or 'manager' or 'employee'
  const currentUserId = "employee-id-123"; // should come from session

  useEffect(() => {
    async function loadPerformances() {
      const data = await getAllPerformances();
      // Filter if employee
      const filtered =
        userRole === "employee"
          ? data.filter((p: any) => p.employee._id === currentUserId)
          : data;
      setPerformances(filtered);
    }
    loadPerformances();
  }, [userRole]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      employeeId: formData.employeeId,
      reviewerId: formData.reviewerId,
      date: formData.date,
      kpis: formData.kpis.split(",").map((k) => k.trim()),
      feedback: formData.feedback,
      rating: parseFloat(formData.rating.toString()),
    };

    await createPerformance(data);
    alert("Performance review created!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* -------------------------------------------
          ADMIN/MANAGER: Create Performance Review
      -------------------------------------------- */}
      {userRole !== "employee" && (
        <Card>
          <CardContent>
            <h2 className="font-bold mb-2">Create Performance Review</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                className="border p-2 w-full"
              />
              <input
                type="text"
                placeholder="Reviewer ID"
                value={formData.reviewerId}
                onChange={(e) =>
                  setFormData({ ...formData, reviewerId: e.target.value })
                }
                className="border p-2 w-full"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="border p-2 w-full"
              />
              <input
                type="text"
                placeholder="KPIs (comma separated)"
                value={formData.kpis}
                onChange={(e) =>
                  setFormData({ ...formData, kpis: e.target.value })
                }
                className="border p-2 w-full"
              />
              <textarea
                placeholder="Feedback"
                value={formData.feedback}
                onChange={(e) =>
                  setFormData({ ...formData, feedback: e.target.value })
                }
                className="border p-2 w-full"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (0-5)"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                className="border p-2 w-full"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* -----------------------------------------
          ALL ROLES: View Performance Reviews
      ------------------------------------------ */}
      <Card className={userRole === "employee" ? "col-span-2" : ""}>
        <CardContent>
          <h2 className="font-bold mb-2">Performance Reviews</h2>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Reviewer</th>
                <th>KPIs</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((perf: any) => (
                <tr key={perf._id}>
                  <td>{perf.date}</td>
                  <td>{perf.employee?.name}</td>
                  <td>{perf.reviewer?.name}</td>
                  <td>{perf.kpis?.join(", ")}</td>
                  <td>{perf.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformancePage;
