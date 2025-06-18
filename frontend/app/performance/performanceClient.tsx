"use client";

import React, { useEffect, useState } from "react";
import { Performance } from "@/types/performance";

const AdminPerformancePage = () => {
  const [reviews, setReviews] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/performance");
        const data = await res.json();
        console.log("Performance Data:", data);
        setReviews(data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading performance data...</p>;

  return (
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Employee</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Reviewer</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Goals</th>
            <th className="border border-gray-300 px-4 py-2 text-left">KPIs</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reviews?.map((review) => (
            <tr key={review._id} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {review?.employee?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {review?.reviewer?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(review.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {review.rating} / 10
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <ul className="list-disc list-inside">
                  {review?.goals?.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <ul className="list-disc list-inside">
                  {review?.kpis?.map((kpiObj, index) => (
                    <li key={index}>
                      {kpiObj.kpi} - Target: {kpiObj.target}, Achieved:{" "}
                      {kpiObj.achieved}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {review.feedback}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPerformancePage;
