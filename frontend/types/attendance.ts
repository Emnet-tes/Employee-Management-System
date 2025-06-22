export type Attendance = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "Present" | "Absent" | "Leave";
  employee: {
    _id: string;
    name: string;
    email: string;
    role: {
      _id: string;
      title: string;
    }
    department?: {
      _id: string;
      name: string;
    } | null;
  };
};

export type AttendanceInput = {
  employeeId: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: "Present" | "Absent" | "Leave";
};
