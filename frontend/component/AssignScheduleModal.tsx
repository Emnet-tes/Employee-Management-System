"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { Employee } from "@/types/employee";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AssignScheduleModal({
  isOpen,
  onClose,
  employees,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSuccess?: () => void;
}) {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [shift, setShift] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = employees.map((emp) => ({
    value: emp._id,
    label: emp.name,
  }));

  const selectedOption = options.find((opt) => opt.value === employeeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const scheduleData = {
      employeeId,
      date,
      shift,
      startTime,
      endTime,
      notes,
    };

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      if (res.ok) {
        toast.success("Schedule assigned successfully!");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200); // Wait for toast to show before closing
      } else {
        toast.error("Failed to assign schedule");
        console.error("Failed to assign schedule");
      }
    } catch (error) {
      toast.error("Error assigning schedule");
      console.error("Error assigning schedule", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Work Schedule">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-black">
            Employee
          </label>
          <Select
            options={options}
            value={selectedOption}
            onChange={(selected) => setEmployeeId(selected?.value || "")}
            className="text-sm text-black"
            classNamePrefix="react-select"
            isSearchable
            styles={{
              control: (base) => ({ ...base, color: "black" }),
              singleValue: (base) => ({ ...base, color: "black" }),
              input: (base) => ({ ...base, color: "black" }),
              menu: (base) => ({ ...base, color: "black" }),
              option: (base) => ({ ...base, color: "black" }),
            }}
          />
        </div>

        <div>
          <label className="block font-semibold text-black">Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded text-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-black">Shift</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="e.g. Morning, Evening, Night"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold text-black">Start Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded text-black"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold text-black">End Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded text-black"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-black">Notes</label>
          <textarea
            className="w-full border px-3 py-2 rounded text-black"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Assigning..." : "Assign Schedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
