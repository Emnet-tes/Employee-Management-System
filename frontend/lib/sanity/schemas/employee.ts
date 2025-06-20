import { Rule } from "@sanity/types";

export default {
  name: "employee",
  type: "document",
  title: "Employee",
  fields: [
    {
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User Account",
      validation: (Rule:Rule) => Rule.required(),
    },
    {
      name: "role",
      type: "reference",
      to: [{ type: "role" }],
      title: "Role",
      validation: (Rule:Rule) => Rule.required(),
    },
    { name: "name", type: "string", title: "Full Name" },
    { name: "phone", type: "string", title: "Phone Number" },
    { name: "photo", type: "image", title: "Profile Photo" },
    {
      name: "employmentStatus",
      type: "string",
      title: "Employment Status",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Terminated", value: "terminated" },
          { title: "On Leave", value: "on_leave" },
        ],
      },
    },
    {
      name: "department",
      type: "reference",
      to: [{ type: "department" }],
      title: "Department",
    },
    { name: "position", type: "string", title: "Position" },
    { name: "startDate", type: "date", title: "Start Date" },
    {
      name: "documents",
      type: "array",
      title: "Documents",
      of: [{ type: "file" }],
    },
  ],
};
