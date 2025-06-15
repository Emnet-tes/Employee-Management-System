export interface Leave {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  type: "sick" | "vacation" | "wfh";
  status: "pending" | "approved" | "rejected";
  startDate: string;
  endDate: string;
  reason: string;
}
export interface LeaveInput {
  employeeId: string;
  type: "sick" | "vacation" | "wfh";
  status: "pending" | "approved" | "rejected";
  startDate: string;
  endDate: string;
  reason: string;
}
