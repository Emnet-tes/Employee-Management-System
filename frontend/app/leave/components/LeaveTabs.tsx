import React, { useState, useMemo } from "react";
import Table from "@/app/_component/Table";
import { getLeaveColumns } from "./LeaveColumns";
import { Leave } from "@/types/leaves";

interface Props {
  leaves: Leave[];
  managerLeaves: Leave[];
  onStatusChange: () => void;
  openModal: () => void;
  managerId: string;
}

const LeaveTabs = ({
  leaves,
  managerLeaves,
  onStatusChange,
  openModal,
}: Props) => {
  const [activeTab, setActiveTab] = useState<"employees" | "manager">(
    "employees"
  );

  const employeeColumns = useMemo(
    () =>
      getLeaveColumns({
        showActions: true,
        onApprove: async (id) => {
          await handleStatusUpdate(id, "approved");
        },
        onReject: async (id) => {
          await handleStatusUpdate(id, "rejected");
        },
      }),
    []
  );

  const managerColumns = useMemo(
    () => getLeaveColumns({ showActions: false }),
    []
  );

  const handleStatusUpdate = async (
    leaveId: string,
    status: "approved" | "rejected"
  ) => {
    await fetch(`/api/leaves/${leaveId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onStatusChange();
  };

  return (
    <>
      <div className="flex mb-6 border-b w-fit border-gray-400">
        <button
          className={`text-black px-4 py-2 rounded-t-lg mr-2 ${activeTab === "employees" ? "border-b-2 border-blue-600" : ""}`}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
        <button
          className={`text-black px-4 py-2 rounded-t-lg ${activeTab === "manager" ? "border-b-2 border-blue-600" : ""}`}
          onClick={() => setActiveTab("manager")}
        >
          Manager
        </button>
      </div>

      {activeTab === "employees" ? (
        <Table data={leaves} columns={employeeColumns} />
      ) : (
        <div>
          <Table data={managerLeaves} columns={managerColumns} />
          <button
            onClick={openModal}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Leave Request
          </button>
        </div>
      )}
    </>
  );
};

export default LeaveTabs;
