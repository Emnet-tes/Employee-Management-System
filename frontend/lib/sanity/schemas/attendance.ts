const attendanceSchema = {
  name: "attendance",
  type: "document",
  title: "Attendance",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
    { name: "date", type: "date" },
    { name: "checkIn", type: "datetime" },
    { name: "checkOut", type: "datetime" },
    { name: "status", type: "string", options: { list: ["Present", "Absent", "on leave"] }, default: "Absent" },
  ],
};

export default attendanceSchema;
