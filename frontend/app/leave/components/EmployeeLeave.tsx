"use client";
import { getLeaveByEmployeeId } from "@/lib/sanity/utils/leaves";
import { Leave } from "@/types/leaves";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Loading from "@/app/_component/Loading";
import { timeDifference } from "@/app/utils/utils";
import { getLeaveColumns } from "./LeaveColumns";
import Table from "@/app/_component/Table";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { Employee } from "@/types/employee";

export interface LeaveFormValues {
  type: "sick" | "vacation" | "wfh";
  startDate: string;
  endDate: string;
  reason: string;
}

interface Props {
  employeeId: string;
  departmentId: string;
}
const EmployeeLeave = ({ employeeId, departmentId }: Props) => {
  const [manager,setManager] = useState<Employee[] | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  const form = useForm<LeaveFormValues>();
  const { register, handleSubmit, reset, formState } = form;
  const { errors, isValid, isSubmitting } = formState;

  async function onSubmit(data: LeaveFormValues) {
    if (data.endDate < data.startDate) {
      alert("End date cannot be before start date");
      return;
    }
    // Calculate number of days
    const timeDiff = timeDifference(data.startDate, data.endDate);
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          departmentId: departmentId,
          employeeId: employeeId,
          days: totalDays, // +1 to include both start and end dates
          status: "pending",
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Leave request submitted!");
      try{
        if (manager) {
          await Promise.all(
            manager.map(async (mang) => {
              await fetch("/api/notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recipientId: mang._id,
                  type: "leave_request",
                  message: `New leave request from Employee for ${totalDays} days`,
                }),
              });
            })
          );
        }
       
      }catch(err){console.error("Failed to send notification", err);
        alert("Failed to send notification to manager.");
      }

      await fetchLeaves();
      setShowModal(false);
      reset();
    } catch (err) {
      console.error("Leave request failed:", err);
      alert("Failed to submit leave request.");
    }
  }

  async function fetchLeaves() {
    setLoading(true);
    try {
      const data = await getLeaveByEmployeeId(employeeId);
      setLeaves(data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
      setLeaves([]);
    } finally {
      setLoading(false); 
      console.log("Leaves fetched:", loading);
    }
  }
  

    const columns = useMemo(
      () =>
        getLeaveColumns({
          showActions: false
        }),
      []
    );

  // Fetch leaves on mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchLeaves();
      const employees: Employee[] = await getEmployees();
      const manager = employees.filter(
        (emp) =>
          emp.department?._id === departmentId && emp.role.title === "manager"
      );
      setManager(manager || null);
    };
    fetchData();
  }, []);

  // Delete a leave
  // async function handleDelete(id: string) {
  //   await fetch(`/api/leaves/${id}`, { method: "DELETE" });
  //   setLeaves(leaves.filter((leave) => leave._id !== id));
  // }
  return (
    <div className="text-black p-4 gap-4 flex flex-col">
      {loading ? (
        <Loading />
      ) : leaves.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No leave records found.
        </div>
      ) : (
        <div className="">
        <h1 className=" text-lg font-semibold mb-4">
          Employee Leaves Requests
        </h1>
        <Table data={leaves} columns={columns} />
      </div>
      )}

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
                <label className="block text-sm font-medium" htmlFor="type">
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
                <label className="block text-sm font-medium" htmlFor="endDate">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate", { required: "End date is required" })}
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
                  {...register("reason", { required: "Reason is required" })}
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
  );
};

export default EmployeeLeave;
