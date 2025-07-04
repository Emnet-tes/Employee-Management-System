"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { Employee } from "@/types/employee";
import Select from "react-select";
import employee from "@/lib/sanity/schemas/employee";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kpiError, setKpiError] = useState<string>("");
  console.log("Employees:", employees);
  const options = employees.map((emp) => ({
    value: emp._id,
    label: emp.name,
  }));

  const selectedOption = options.find((opt) => opt.value === employeeId);
  const [revieweeId, setRevieweeId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate KPIs: target >= achieved for all
    for (const kpi of kpis) {
      if (kpi.achieved > kpi.target) {
        setKpiError(
          "Each KPI's target must be greater than or equal to achieved."
        );
        return;
      }
    }
    setKpiError("");
    setIsSubmitting(true);
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
        toast.success("Review submitted successfully!");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        let errorMsg = "Failed to submit review";
        try {
          const data = await res.json();
          if (data && data.error) errorMsg = data.error;
        } catch (e) {}
        toast.error(errorMsg);
        console.error("Failed to submit review", errorMsg);
      }
    } catch (error) {
      toast.error("Error submitting review");
      console.error("Error submitting review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Performance Review">
      <ToastContainer />
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
          className="w-full border px-3 py-2 rounded text-black"
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
            className="w-full border px-3 py-2 rounded text-black"
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
              className="w-full border px-3 py-2 mb-2 rounded text-black"
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
            className="text-sm text-blue-600 mt-1 cursor-pointer"
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
                className="border px-2 py-1 rounded text-black"
                required
              />
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Target</label>
                <input
                  placeholder="Target"
                  type="number"
                  value={kpi.target}
                  onChange={(e) => {
                    const newKpis = [...kpis];
                    newKpis[idx].target = Number(e.target.value);
                    setKpis(newKpis);
                  }}
                  className="border px-2 py-1 rounded text-black"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Achieved</label>
                <input
                  placeholder="Achieved"
                  type="number"
                  value={kpi.achieved}
                  onChange={(e) => {
                    const newKpis = [...kpis];
                    newKpis[idx].achieved = Number(e.target.value);
                    setKpis(newKpis);
                  }}
                  className="border px-2 py-1 rounded text-black"
                  required
                />
              </div>
            </div>
          ))}
          {kpiError && (
            <div className="text-red-600 text-sm mb-2">{kpiError}</div>
          )}
          <button
            type="button"
            className="text-sm text-blue-600 mt-1 cursor-pointer"
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
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
