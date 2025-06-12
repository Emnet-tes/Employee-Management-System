export type Attendance = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
};
