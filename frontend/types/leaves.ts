export interface Leave {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  department: {
    _id: string;
    name: string;
  };
  type: "sick" | "vacation" | "wfh";
  status: "pending" | "approved" | "rejected";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
}
export interface LeaveInput {
  employeeId: string;
  departmentId: string;
  type: "sick" | "vacation" | "wfh";
  status: "pending" | "approved" | "rejected";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
}
