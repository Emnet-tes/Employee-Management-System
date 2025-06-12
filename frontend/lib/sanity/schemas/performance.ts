export default {
  name: "performance",
  type: "document",
  title: "Performance Review",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
    { name: "reviewer", type: "reference", to: [{ type: "employee" }] },
    { name: "date", type: "date" },
    { name: "kpis", type: "array", of: [{ type: "string" }] },
    { name: "feedback", type: "text" },
    { name: "rating", type: "number" },
  ],
};
