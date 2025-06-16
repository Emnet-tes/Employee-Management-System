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
      type: "string",
      title: "Role",
      options: {
        list: ["Admin", "Manager", "Employee"],
      },
    },
    {
      name: "employee",
      type: "reference",
      to: [{ type: "employee" }],
      title: "Employee Profile",
    },
  ],
};
