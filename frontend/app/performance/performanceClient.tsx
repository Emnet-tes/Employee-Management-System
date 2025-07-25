"use client";

import React, { useEffect, useState } from "react";
import { Performance } from "@/types/performance";
import Loading from "../_component/Loading";

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

  if (loading) return <Loading />;

  return (
    <div className="p-4 overflow-x-auto w-full">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Employee Performance
      </h2>
      <table className="min-w-[600px] w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              Employee
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              Reviewer
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              Date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              Rating
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              Goals
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              KPIs
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-black">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews?.map((review) => (
            <tr key={review._id} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-black">
                {review?.employee?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-black">
                {review?.reviewer?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-black">
                {new Date(review.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-black">
                {review.rating} / 10
              </td>
              <td className="border border-gray-300 px-4 py-2 text-black">
                <ul className="list-disc list-inside text-black">
                  {review?.goals?.map((goal, index) => (
                    <li key={index} className="text-black">
                      {goal}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-black">
                <ul className="list-disc list-inside text-black">
                  {review?.kpis?.map((kpiObj, index) => (
                    <li key={index} className="text-black">
                      {kpiObj.kpi} - Target: {kpiObj.target}, Achieved:{" "}
                      {kpiObj.achieved}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-black">
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
