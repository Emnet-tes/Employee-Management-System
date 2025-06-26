'use client';
import React, { useEffect, useState } from "react";
import Loading from "@/app/_component/Loading";
import LeaveTabs from "./LeaveTabs";
import LeaveRequestModal from "./LeaveRequestModal";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { getAllLeaves, getLeaveByEmployeeId } from "@/lib/sanity/utils/leaves";
import { Leave } from "@/types/leaves";
import { Employee } from "@/types/employee";

const ManagerLeave = ({
  managerId,
  departmentId,
}: {
  managerId: string;
  departmentId: string;
}) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [managerLeaves, setManagerLeaves] = useState<Leave[]>([]);
  const [admin, setAdmin] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    const allLeaves = await getAllLeaves();
    const manager = await getLeaveByEmployeeId(managerId);
    const departmentLeaves = allLeaves.filter(
      (leave) =>
        leave.department._id === departmentId &&
        leave.employee._id !== managerId
    );
    setLeaves(departmentLeaves);
    setManagerLeaves(manager);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
    getEmployees().then((res) => {
      const admins = res.filter((emp) => emp.role?.title === "admin");
      setAdmin(admins);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <LeaveTabs
        leaves={leaves}
        managerLeaves={managerLeaves}
        onStatusChange={fetchLeaves}
        openModal={() => setShowModal(true)}
        managerId={managerId}
      />
      {showModal && (
        <LeaveRequestModal
          onClose={() => setShowModal(false)}
          onSubmitted={fetchLeaves}
          departmentId={departmentId}
          managerId={managerId}
          adminList={admin}
        />
      )}
    </div>
  );
};

export default ManagerLeave;
