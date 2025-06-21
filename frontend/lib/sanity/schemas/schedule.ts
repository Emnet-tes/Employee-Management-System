export default {
  name: "schedule",
  type: "document",
  title: "Work Schedule",
  fields: [
    { name: "employee", type: "reference", to: [{ type: "employee" }] },
    {
      name: "shift",
      type: "string",
      options: {
        list: ["Morning", "Afternoon", "Night"],
      },
    },
    { name: "date", type: "date" },
    {
      name: "startTime",
      type: "string",
      title: "Start Time", 
    },
    {
      name: "endTime",
      type: "string",
      title: "End Time", 
    },
    { name: "notes", type: "text" },
  ],
};
