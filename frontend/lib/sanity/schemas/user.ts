import { Rule } from "@sanity/types";

const userSchema = {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Full Name",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "email",
      type: "string",
      title: "Email",
      validation: (Rule: Rule) => Rule.required().email(),
    },
    {
      name: "password",
      type: "string",
      title: "Password",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "role",
      type: "reference",
      to: [{ type: "role" }],
      title: "Role",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
};

export default userSchema;
