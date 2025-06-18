"use client";

import React, { useEffect, useState } from "react";
import { Performance } from "@/types/performance";

const ManagerPerformancePage = ({ session }: { session: any }) => {
  const [reviews, setReviews] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/performance?reviewerId=${session.user.employeeId}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) return <p className="p-4">Loading performance data...</p>;

  if (reviews.length === 0) {
    return <p className="p-4">No reviews created by you yet.</p>;
  }

  return (
    <div className="p-4 overflow-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Goals</th>
            <th className="border px-4 py-2">KPIs</th>
            <th className="border px-4 py-2">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{review?.employee?.name}</td>
              <td className="border px-4 py-2">
                {new Date(review?.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{review.rating} / 10</td>
              <td className="border px-4 py-2">
                <ul className="list-disc list-inside">
                  {review?.goals?.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2">
                <ul className="list-disc list-inside">
                  {review?.kpis?.map((kpi, index) => (
                    <li key={index}>
                      {kpi.kpi} - Target: {kpi.target}, Achieved: {kpi.achieved}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2">{review.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerPerformancePage;
