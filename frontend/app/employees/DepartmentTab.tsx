import React, { useState } from 'react'
import { Pencil, Trash2 } from "lucide-react";
import { getAllDepartments } from "@/lib/sanity/utils/department";
const DepartmentTab = () => {
     const [addDeptLoading, setAddDeptLoading] = useState(false);
      const [editDeptId, setEditDeptId] = useState<string | null>(null);
      const [editDeptLoading, setEditDeptLoading] = useState(false);
      const [editDeptName, setEditDeptName] = useState("");
      const [editDeptDesc, setEditDeptDesc] = useState("");
      const [departments, setDepartments] = useState<any[]>([]);
       const [addDeptName, setAddDeptName] = useState("");
        const [addDeptDesc, setAddDeptDesc] = useState("");

      async function handleAddDepartment(e: React.FormEvent) {
        e.preventDefault();
        setAddDeptLoading(true);
        try {
          const depRes = await fetch("/api/department", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: addDeptName,
              description: addDeptDesc,
            }),
          });
          const deptList = await getAllDepartments();
          setDepartments(deptList || []);
          setAddDeptName("");
          setAddDeptDesc("");
        } finally {
          setAddDeptLoading(false);
        }
      }

      async function handleEditDepartment(id: string) {
        setEditDeptLoading(true);
        try {
          const depRes = await fetch(`/api/department/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: editDeptName,
              description: editDeptDesc,
            }),
          });
          if (!depRes.ok) {
            alert("Failed to update department");
            return;
          }

          const deptList = await getAllDepartments();
          setDepartments(deptList || []);
          setEditDeptId(null);
        } finally {
          setEditDeptLoading(false);
        }
      }

      async function handleDeleteDepartment(id: string) {
        if (!window.confirm("Are you sure you want to delete this department?"))
          return;
        try {
          const res = await fetch(`/api/department/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            alert("Failed to delete department");
            return;
          }
        } catch (error) {
          console.error("Error deleting department:", error);
          alert("Failed to delete department");
          return;
        }

        const deptList = await getAllDepartments();
        setDepartments(deptList || []);
      }
  return (
    <div>
      <div className=" ">
        <h2 className="text-xl font-semibold mb-4">Departments List</h2>
        <div className="gap-4 grid grid-cols-1 ">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="flex items-center justify-between bg-white rounded-lg shadow p-4"
            >
              {editDeptId === dept._id ? (
                <form
                  className="flex flex-col md:flex-row gap-2 w-full"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setEditDeptName(dept.name || "");
                    setEditDeptDesc(dept.description || "");
                    await handleEditDepartment(dept._id);
                  }}
                >
                  <input
                    type="text"
                    value={editDeptName}
                    onChange={(e) => setEditDeptName(e.target.value)}
                    className="input-style flex-1 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={editDeptDesc}
                    onChange={(e) => setEditDeptDesc(e.target.value)}
                    className="input-style flex-1 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    disabled={editDeptLoading}
                  >
                    {editDeptLoading ? "Submitting..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                    onClick={() => setEditDeptId(null)}
                    disabled={editDeptLoading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-gray-600">
                      {dept.description}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setEditDeptId(dept._id);
                        setEditDeptName(dept.name || "");
                        setEditDeptDesc(dept.description || "");
                      }}
                      title="Edit"
                      aria-label="Edit Department"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteDepartment(dept._id)}
                      title="Delete"
                      aria-label="Delete Department"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Add Department Form */}
      <form
        className="flex flex-col md:flex-row gap-2 mt-6 bg-white rounded-md shadow p-4"
        onSubmit={handleAddDepartment}
      >
        <input
          type="text"
          placeholder="Department Name"
          value={addDeptName}
          onChange={(e) => setAddDeptName(e.target.value)}
          className="input-style flex-1 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={addDeptDesc}
          onChange={(e) => setAddDeptDesc(e.target.value)}
          className="input-style flex-1  border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={addDeptLoading}
        >
          {addDeptLoading ? "Submitting..." : "Add Department"}
        </button>
      </form>
    </div>
  );
}

export default DepartmentTab