'use client'
import { getAllDepartments } from "@/lib/sanity/utils/department";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { getAllRoles } from "@/lib/sanity/utils/role";
import { Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { buildImageUrl } from "./imageUrlBuilder";
const EmployeeTab = () => {
      const [employees, setEmployees] = useState<any[]>([]);
      const [roles, setRoles] = useState<any[]>([]);
      const [departments, setDepartments] = useState<any[]>([]);
      const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
      const [showEditModal, setShowEditModal] = useState(false);
      const [editForm, setEditForm] = useState<any>({});

      const [loading, setLoading] = useState(true);
    useEffect(() => {
      async function fetchData() {
        setLoading(true);
        const [emp, roleList, deptList] = await Promise.all([
          getEmployees(),
          getAllRoles(),
          getAllDepartments(),
        ]);
        setEmployees(emp || []);
        setRoles(roleList || []);
        setDepartments(deptList || []);
        setLoading(false);
      }
      fetchData();
    }, []);
    async function uploadToServer(file: File, type: "image" | "file") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Failed to upload file");
        return;
      }

      return await res.json(); // Sanity asset document
    }

    async function handleAddEmployee(formData: FormData) {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const position = formData.get("position") as string;
      const departmentId = formData.get("departmentId") as string;
      const roleId = formData.get("roleId") as string;
      const startDate = new Date().toISOString().slice(0, 10);

      const photoFile = formData.get("photo") as File;
      const documentFiles = formData.getAll("documents") as File[];

      let uploadedPhoto = undefined;
      if (photoFile && photoFile.size > 0) {
        uploadedPhoto = await uploadToServer(photoFile, "image");
      }

      let uploadedDocs = [];
      for (const doc of documentFiles) {
        if (doc.size > 0) {
          const uploaded = await uploadToServer(doc, "file");
          uploadedDocs.push(uploaded);
        }
      }

      // 1. Create user via API
      const userRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: "defaultPassword123",
          roleId,
        }),
      });

      if (!userRes.ok) {
        alert("Email aleady exists or invalid data");
        return;
      }

      const user = await userRes.json();

      // 2. Create employee via API
      if (user && user._id) {
        const empRes = await fetch("/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            roleId,
            name,
            phone,
            photo: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: uploadedPhoto?._id || "",
              },
            },
            employmentStatus: "active",
            departmentId,
            position,
            startDate,
            documents: uploadedDocs.map((doc) => ({
              _type: "file",
              asset: {
                _type: "reference",
                _ref: doc._id,
              },
              _key: doc._id,
            })),
          }),
        });
        if (!empRes.ok) {
          console.error("Employee creation failed");
          return;
        }
      }

      const emp = await getEmployees();

      setEmployees(emp || []);
    }

    function openEditModal(employee: any) {
      setEditingEmployee(employee);
      console.log("Editing employee:", employee);
      setEditForm({
        name: employee.user?.name ?? "",
        phone: employee.phone ?? "",
        position: employee.position ?? "",
        departmentId: employee.department?._id ?? "",
        roleId: employee.role?._id ?? "",
        startDate: employee.startDate ?? "",
        employmentStatus: employee.employmentStatus ?? "",
      });
      setShowEditModal(true);
    }

    function closeEditModal() {
      setShowEditModal(false);
      setEditingEmployee(null);
      setEditForm({});
    }

    async function handleEditEmployeeSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!editingEmployee) return;
      try {
        const EmpRes = await fetch(`/api/employee/${editingEmployee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editingEmployee.user._id,
            roleId: editForm.roleId,
            name: editForm.name,
            phone: editForm.phone,
            photo: editingEmployee.photo,
            employmentStatus: editForm.employmentStatus,
            departmentId: editForm.departmentId,
            position: editForm.position,
            startDate: editForm.startDate,
            documents: editingEmployee.documents.map((doc: any) => ({
              _type: "file",
              asset: {
                _type: "reference",
                _ref: doc.asset._ref,
              },
              _key: doc._key,
            })),
          }),
        });
        if (!EmpRes.ok) {
          alert("Failed to update employee");
          return;
        }
        const updatedEmp = await EmpRes.json();
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === updatedEmp._id ? updatedEmp : emp
          )
        );
        closeEditModal();
      } catch (error) {
        console.error("Error updating employee:", error);
        alert("Failed to update employee");
      }
    }

    async function handleDeleteEmployee(employeeId: string, userId: string) {
      if (!window.confirm("Are you sure you want to delete this employee?")) {
        return;
      }
      setLoading(true);
      // 2. Delete user via API
      if (userId) {
        const userRes = await fetch(`/api/user/${userId}`, {
          method: "DELETE",
        });
        if (!userRes.ok) {
          alert("Failed to delete user");
          setLoading(false);
          return;
        }
      }
     
      try {
        const res = await fetch(`/api/employee/${employeeId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          alert("Failed to delete employee");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee");
        setLoading(false);
        return;
      }

      setLoading(false);
      const emp = await getEmployees();
      setEmployees(emp || []);
    }
    if (loading) {
      return <div className="p-4">Loading...</div>;
    }
  return (
    <div className="p-6 space-y-6">
      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-full ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative ">
            <button
              className="absolute top right-2 text-gray-400 hover:text-gray-600"
              onClick={closeEditModal}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <form onSubmit={handleEditEmployeeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name ?? ""}
                  onChange={(e) =>
                    setEditForm((f: any) => ({ ...f, name: e.target.value }))
                  }
                  className="input-style w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone ?? ""}
                  onChange={(e) =>
                    setEditForm((f: any) => ({ ...f, phone: e.target.value }))
                  }
                  className="input-style w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  value={editForm.position ?? ""}
                  onChange={(e) =>
                    setEditForm((f: any) => ({
                      ...f,
                      position: e.target.value,
                    }))
                  }
                  className="input-style w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={editForm.roleId ?? ""}
                  onChange={(e) =>
                    setEditForm((f: any) => ({ ...f, roleId: e.target.value }))
                  }
                  className="input-style w-full"
                >
                  <option value="">Select a role</option>
                  {roles.map((role: any) => (
                    <option key={role._id} value={role._id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={editForm.departmentId ?? ""}
                  onChange={(e) =>
                    setEditForm((f: any) => ({
                      ...f,
                      departmentId: e.target.value,
                    }))
                  }
                  className="input-style w-full"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept: any) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold px-6 py-4 border-b text-gray-800">
          Employees List
        </h2>

        <div className="divide-y">
          {employees.map((employee: any) => (
            <div
              key={employee._id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              {/* Left: Photo + Info */}
              <div className="flex items-center gap-4">
                <Image
                  src={
                    employee.photo?.asset?._ref
                      ? buildImageUrl(employee.photo.asset._ref)
                      : "/loginImage.png"
                  }
                  alt="Employee Photo"
                  width={60}
                  height={60}
                  className="rounded-full object-cover border shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {employee.user?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {employee.user?.email}
                  </p>
                  <p className="text-sm text-gray-600">{employee.phone}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Role:</span>{" "}
                    {employee.role?.title || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      Department:
                    </span>{" "}
                    {employee.department?.name || "N/A"}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(employee)}
                  title="Edit"
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() =>
                    handleDeleteEmployee(employee._id, employee.user?._id)
                  }
                  title="Delete"
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Employee Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            await handleAddEmployee(formData);
            form.reset(); // Reset the form after submission
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter full name"
              className="input-style"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter email address"
              className="input-style"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Enter phone number"
              className="input-style"
            />
          </div>

          <div>
            <label
              htmlFor="roleId"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select id="roleId" name="roleId" required className="input-style">
              <option value="">Select a role</option>
              {roles.map((role: any) => (
                <option key={role._id} value={role._id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              required
              className="input-style"
            >
              <option value="">Select a department</option>
              {departments.map((dept: any) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <input
              id="position"
              name="position"
              type="text"
              required
              placeholder="Enter position title"
              className="input-style"
            />
          </div>

          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700"
            >
              Photo
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="input-style"
              required
            />
          </div>

          <div>
            <label
              htmlFor="documents"
              className="block text-sm font-medium text-gray-700"
            >
              Documents
            </label>
            <input
              id="documents"
              name="documents"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              multiple
              className="input-style"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            aria-label="Add new employee"
            title="Add Employee"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeTab