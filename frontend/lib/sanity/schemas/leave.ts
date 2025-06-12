export default {
  name: "leave",
  type: "document",
  title: "Leave Request",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
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
    { name: "reason", type: "text" },
  ],
};
