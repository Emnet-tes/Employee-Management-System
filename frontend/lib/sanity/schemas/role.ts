
const role = {
  name: "role",
  type: "document",
  title: "Role",
  fields: [
    { name: "title", type: "string" },
    { name: "description", type: "text" },
    { name: "permissions", type: "array", of: [{ type: "string" }] }, 
  ],
};

export default role;