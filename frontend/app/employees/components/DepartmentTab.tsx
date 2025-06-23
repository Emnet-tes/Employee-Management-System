"use client";

import React, { useEffect, useState } from "react";
import { getAllDepartments } from "@/lib/sanity/utils/department";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { createPortal } from "react-dom";
import Loading from "../../_component/Loading";

interface Department {
  _id: string;
  name: string;
  description: string;
}

const DepartmentTab = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    const deptList = await getAllDepartments();
    setDepartments(deptList || []);
    setLoading(false);
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const method = editId ? "PATCH" : "POST";
      const endpoint = editId ? `/api/department/${editId}` : "/api/department";

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await fetchDepartments();
      setFormData({ name: "", description: "" });
      setEditId(null);
      setAddModalOpen(false);
      setEditModalOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    await fetch(`/api/department/${id}`, { method: "DELETE" });
    await fetchDepartments();
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({
        row,
      }: import("@tanstack/react-table").CellContext<Department, unknown>) =>
        row.original.name,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({
        row,
      }: import("@tanstack/react-table").CellContext<Department, unknown>) =>
        row.original.description,
    },
    {
      header: "Actions",
      cell: ({
        row,
      }: import("@tanstack/react-table").CellContext<Department, unknown>) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-600 w-fit text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
            onClick={() => {
              setEditId(row.original._id);
              setFormData({
                name: row.original.name,
                description: row.original.description,
              });
              setEditModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className="bg-red-600  w-fit text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700"
            onClick={() => handleDelete(row.original._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: departments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 space-y-6 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Departments</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Department
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="p-4  w-3/4 rounded-md  bg-white shadow ">
         
          <table className="text-left w-full border">
            <thead className="bg-gray-200 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 ">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 ">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(addModalOpen || editModalOpen) &&
        createPortal(
          <div className="fixed inset-0 text-black bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 w-full max-w-md rounded shadow">
              <h3 className="text-lg font-bold mb-4">
                {editModalOpen ? "Edit Department" : "Add Department"}
              </h3>
              <form onSubmit={handleAddOrEdit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Department Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddModalOpen(false);
                      setEditModalOpen(false);
                      setFormData({ name: "", description: "" });
                      setEditId(null);
                    }}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {formLoading ? "Saving..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DepartmentTab;
