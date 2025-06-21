"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { Employee } from "@/types/employee";
import Select from "react-select";
import employee from "@/lib/sanity/schemas/employee";
type KPI = {
  kpi: string;
  target: number;
  achieved: number;
};

export default function AddReviewModal({
  isOpen,
  onClose,
  employeeId,
  onSuccess,
  employees,
}: {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  onSuccess?: () => void;
  employees: Employee[];
}) {
  //   const { data: session } = useSession();

  const [rating, setRating] = useState<number>(1);
  const [feedback, setFeedback] = useState("");
  const [goals, setGoals] = useState<string[]>([""]);
  const [kpis, setKpis] = useState<KPI[]>([
    { kpi: "", target: 0, achieved: 0 },
  ]);
  console.log("Employees:", employees);
  const options = employees.map((emp) => ({
    value: emp._id,
    label: emp.name ,
  }));

  const selectedOption = options.find((opt) => opt.value === employeeId);
  const [revieweeId, setRevieweeId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      employeeId: revieweeId,
      reviewerId: employeeId,
      date: new Date().toISOString().split("T")[0],
      rating,
      feedback,
      goals,
      kpis,
    };

    try {
      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Performance Review">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Employee</label>
          <Select
            options={options}
            value={selectedOption}
            onChange={(selected) => setRevieweeId(selected?.value || "")}
            className="text-sm text-black"
            isSearchable
          />
        </div>
        {/* Rating */}
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />

        {/* Feedback */}
        <div>
          <label className="block font-semibold">Feedback</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>

        {/* Goals */}
        <div>
          <label className="block font-semibold">Goals</label>
          {goals.map((goal, idx) => (
            <input
              key={idx}
              className="w-full border px-3 py-2 mb-2 rounded"
              value={goal}
              onChange={(e) => {
                const newGoals = [...goals];
                newGoals[idx] = e.target.value;
                setGoals(newGoals);
              }}
              required
            />
          ))}
          <button
            type="button"
            className="text-sm text-blue-600 mt-1"
            onClick={() => setGoals([...goals, ""])}
          >
            + Add Goal
          </button>
        </div>

        {/* KPIs */}
        <div>
          <label className="block font-semibold">KPIs</label>
          {kpis.map((kpi, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
              <input
                placeholder="KPI"
                value={kpi.kpi}
                onChange={(e) => {
                  const newKpis = [...kpis];
                  newKpis[idx].kpi = e.target.value;
                  setKpis(newKpis);
                }}
                className="border px-2 py-1 rounded"
                required
              />
              <input
                placeholder="Target"
                type="number"
                value={kpi.target}
                onChange={(e) => {
                  const newKpis = [...kpis];
                  newKpis[idx].target = Number(e.target.value);
                  setKpis(newKpis);
                }}
                className="border px-2 py-1 rounded"
                required
              />
              <input
                placeholder="Achieved"
                type="number"
                value={kpi.achieved}
                onChange={(e) => {
                  const newKpis = [...kpis];
                  newKpis[idx].achieved = Number(e.target.value);
                  setKpis(newKpis);
                }}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-blue-600 mt-1"
            onClick={() =>
              setKpis([...kpis, { kpi: "", target: 0, achieved: 0 }])
            }
          >
            + Add KPI
          </button>
        </div>

        {/* Submit/Cancel Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  );
}
