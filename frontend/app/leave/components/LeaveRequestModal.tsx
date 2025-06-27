'use client';
import React from "react";

import { LeaveFormValues } from "./EmployeeLeave";
import { timeDifference } from "@/app/utils/utils";
import { Employee } from "@/types/employee";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  managerId: string;
  departmentId: string;
  onClose: () => void;
  onSubmitted: () => void;
  adminList: Employee[];
}

const LeaveRequestModal = ({
  managerId,
  departmentId,
  onClose,
  onSubmitted,
  adminList,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LeaveFormValues>({ mode: "onChange" });

  const onSubmit = async (data: LeaveFormValues) => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (data.startDate < currentDate || data.endDate < data.startDate) {
      toast.error("Invalid dates");
      return;
    }

    const totalDays =
      Math.ceil(
        timeDifference(data.startDate, data.endDate) / (1000 * 3600 * 24)
      ) + 1;
    // Validate if managerId and departmentId exist
    if (!managerId || !departmentId) {
      toast.error("Manager or Department ID is missing.");
      return;
    }

    const res = await fetch("/api/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      ...data,
      departmentId,
      employeeId: managerId,
      days: totalDays,
      status: "pending",
      }),
    });

    if (!res.ok) { toast.error("Failed to submit leave")
      
      return;}

    await Promise.all(
      adminList.map((admin) =>
        fetch("/api/notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: admin._id,
            type: "leave_request",
            message: `New leave request from Manager for ${totalDays} days`,
          }),
        })
      )
    );

    toast.success("Leave request submitted!");
    onClose();
    onSubmitted();
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4">Leave Request</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 "
        >
            <div className="mb-3">
              <label className="block text-sm font-medium " htmlFor="type">
                Type
              </label>
              <select
                id="type"
                itemType="text"
                {...register("type", { required: "Type is required" })}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="wfh">Work From Home</option>
              </select>
              <p className="text-red-500 text-sm mt-1">
                {errors.type?.message}
              </p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium" htmlFor="startDate">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate?.message}
              </p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium" htmlFor="endDate">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                {...register("endDate", {
                  required: "End date is required",
                })}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate?.message}
              </p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium" htmlFor="reason">
                Reason
              </label>
              <textarea
                id="reason"
                itemType="text"
                {...register("reason", {
                  required: "Reason is required",
                })}
                placeholder="Enter reason for leave"
                className="w-full border px-2 py-1 rounded"
                rows={3}
                required
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.reason?.message}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
