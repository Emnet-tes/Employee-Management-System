export default {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name" },
    { name: "email", type: "string", title: "Email" },
    { name: "password", type: "string", title: "Password" },
    {
      name: "role",
      type: "reference",
      to: [{ type: "role" }],
      title: "Role",
    },
    {
      name: "employee",
      type: "reference",
      to: [{ type: "employee" }],
      title: "Employee Profile",
    },
  ],
};
