'use client';

import { useState } from "react";
import { Performance } from "@/types/performance";
import { createPerformance } from "@/lib/sanity/utils/performance";

type Props = {
  initialPerformances: Performance[];
};

export default function PerformanceClient({ initialPerformances }: Props) {
  const [loading, setLoading] = useState(false);
  const [performances, setPerformances] = useState(initialPerformances);

  const handleCreatePerformance = async () => {
    setLoading(true);
    try {
      const newPerformance = await createPerformance({
        employeeId: "your-employee-id-here",
        reviewerId: "your-reviewer-id-here",
        date: new Date().toISOString().split("T")[0],
        kpis: ["Meet deadlines", "Teamwork"],
        feedback: "Great progress and collaboration.",
        rating: 4.5,
      });

      setPerformances([newPerformance, ...performances]);
      alert("Performance created successfully!");
    } catch (error) {
      console.error("Error creating performance:", error);
      alert("Failed to create performance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={handleCreatePerformance}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Test Performance"}
      </button>

      <div className="mt-6">
        {performances.map((performance) => (
          <div key={performance._id} className="border-b py-2">
            <p>Reviewer: {performance.reviewer.name}</p>
            <p>Date: {performance.date}</p>
            <p>Rating: {performance.rating}</p>
            <p>KPIs: {performance.kpis}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
