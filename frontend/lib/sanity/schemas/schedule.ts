export default {
  name: "schedule",
  type: "document",
  title: "Work Schedule",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
    { name: "shift", type: "string" },
    { name: "date", type: "date" },
    { name: "notes", type: "text" },
  ],
};
