
export default {
  name: "employee",
  type: "document",
  title: "Employee",
  fields: [
    { name: "name", type: "string" },
    { name: "email", type: "string" },
    { name: "phone", type: "string" },
    { name: "photo", type: "image" },
    {
      name: "employmentStatus",
      type: "string",
      options: { list: ["active", "terminated", "on leave"] },
    },
    { name: "department", type: "reference", to: [{ type: "department" }] },
    { name: "role", type: "reference", to: [{ type: "role" }] },
    { name: "startDate", type: "date" },
    { name: "documents", type: "array", of: [{ type: "file" }] },
  ],
};
