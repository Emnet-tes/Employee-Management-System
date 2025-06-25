const leave = {
  name: "leave",
  type: "document",
  title: "Leave Request",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
    { name: "department", type: "reference", to: [{ type: "department" }] },
    {
      name: "type",
      type: "string",
      options: { list: ["sick", "vacation", "wfh"] },
    },
    {
      name: "status",
      type: "string",
      options: { list: ["pending", "approved", "rejected"] },
    },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
    { name: "days", type: "number" },
    { name: "reason", type: "text" },
  ],
};

export default leave;
