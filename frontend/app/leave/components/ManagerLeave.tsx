"use client";

import { LeaveFormValues } from "./EmployeeLeave";
import { timeDifference } from "@/app/utils/utils";
import { getAllLeaves, getLeaveByEmployeeId } from "@/lib/sanity/utils/leaves";
import { Leave } from "@/types/leaves";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/app/_component/Loading";
import { getLeaveColumns } from "./LeaveColumns";
import Table from "@/app/_component/Table";

interface Props {
  managerId: string;
  departmentId: string;
}

const ManagerLeave = ({ managerId, departmentId }: Props) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [managerLeave, setManagerLeave] = useState<Leave[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"employees" | "manager">(
    "employees"
  );

  const form = useForm<LeaveFormValues>();
  const { register, handleSubmit, reset, formState } = form;
  const { errors, isValid, isSubmitting } = formState;

  const columnsForEmployees = useMemo(
    () =>
      getLeaveColumns({
        showActions: true,
        onApprove: (leaveId: string) => handleStatusChange(leaveId, "approved"),
        onReject: (leaveId: string) => handleStatusChange(leaveId, "rejected"),
      }),
    []
  );
  const columnsForManager = useMemo(
    () => getLeaveColumns({ showActions: false }),
    []
  );
  async function fetchLeaves() {
    const response = await getAllLeaves();
    const mangerleaves = await getLeaveByEmployeeId(managerId);
    const filterByDepartment = response.filter(
      (leave) =>
        leave.department._id === departmentId &&
        leave.employee._id !== managerId
    );
    setManagerLeave(mangerleaves);
    setLeaves(filterByDepartment);
    return response;
  }

  const handleStatusChange = async (
    leaveId: string,
    status: "approved" | "rejected"
  ) => {
    console.log(`Updating leave ${leaveId} to status: ${status}`);
    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update leave status");
      }
      alert(`Leave ${status} successfully!`);
      // Re-fetch leaves after updating
      await fetchLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update leave status.");
    }
  };

  async function onSubmit(data: LeaveFormValues) {
    const currentDate = new Date().toISOString().split("T")[0];
    if (data.startDate < currentDate) {
      alert("Start date cannot be in the past");
      return;
    }
    if (data.endDate < data.startDate) {
      alert("End date cannot be before start date");
      return;
    }

    const timeDiff = timeDifference(data.startDate, data.endDate);
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          departmentId: departmentId,
          employeeId: managerId,
          days: Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1, // +1 to include both start and end dates
          status: "pending",
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Leave request submitted!");
      await fetchLeaves();
      setShowModal(false);
      reset();
    } catch (err) {
      console.error("Leave request failed:", err);
      alert("Failed to submit leave request.");
    }
  }

  useEffect(() => {
    setLoading(true);
    try {
      fetchLeaves();
    } finally {
      setLoading(false);
    }
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="text-black p-4 gap-4 flex flex-col">
      <div className="flex mb-6 border-b w-fit border-gray-400">
        <button
          className={`px-4 py-2 rounded-t-lg mr-2 ${activeTab === "employees" ? "border-b-2 border-blue-600" : ""}`}
          onClick={() => {
            setActiveTab("employees");
          }}
        >
          Employees
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${activeTab === "manager" ? "border-b-2 border-blue-600  " : ""}`}
          onClick={() => {
            setActiveTab("manager");
          }}
        >
          Manager
        </button>
      </div>
      {activeTab === "employees" && (
        <div>
          <h1 className=" text-lg font-semibold mb-4">
            Employee Leaves Requests
          </h1>
          <Table data={leaves} columns={columnsForEmployees} />
        </div>
      )}
      {activeTab === "manager" && (
        <div>
          <h1 className="text-lg font-semibold mb-4">My Leave Requests</h1>

          <Table data={managerLeave} columns={columnsForManager} />
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-fit cursor-pointer"
          >
            Leave Request
          </button>
          {showModal && (
            <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Leave Request</h2>
                <form
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="mb-3">
                    <label
                      className="block text-sm font-medium "
                      htmlFor="type"
                    >
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
                    <label
                      className="block text-sm font-medium"
                      htmlFor="startDate"
                    >
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
                    <label
                      className="block text-sm font-medium"
                      htmlFor="endDate"
                    >
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
                    <label
                      className="block text-sm font-medium"
                      htmlFor="reason"
                    >
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
                      onClick={() => setShowModal(false)}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerLeave;
