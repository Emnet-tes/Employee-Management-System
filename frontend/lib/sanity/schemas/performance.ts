const performance = {
  name: "performance",
  type: "document",
  title: "Performance Review",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
    { name: "reviewer", type: "reference", to: [{ type: "employee" }] },
    { name: "date", type: "date" },
    {
      name: "kpis",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "kpi", type: "string" },
            { name: "target", type: "number" },
            { name: "achieved", type: "number" },
          ],
        },
      ],
    },
    { name: "goals", type: "array", of: [{ type: "string" }] },
    { name: "feedback", type: "text" },
    { name: "rating", type: "number" },
  ],
};

export default performance;