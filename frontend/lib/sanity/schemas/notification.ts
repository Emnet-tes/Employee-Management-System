export default {
  name: "notification",
  type: "document",
  title: "Notification",
  fields: [
    {
      name: "recipient",
      type: "reference",
      to: [{ type: "employee" }],
      title: "Recipient",
    },
    {
      name: "message",
      type: "string",
      title: "Message",
    },
    {
      name: "read",
      type: "boolean",
      title: "Read",
      initialValue: false,
    },
    {
      name: "timestamp",
      type: "datetime",
      title: "Timestamp",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: ["schedule", "leave_request", "leave_status"],
      },
    },
  ],
};
