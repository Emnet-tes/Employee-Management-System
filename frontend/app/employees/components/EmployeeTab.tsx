"use client";

import { getAllDepartments } from "@/lib/sanity/utils/department";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { getAllRoles } from "@/lib/sanity/utils/role";
import { X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../_component/Loading";

import { getEmployeeColumns } from "./EmployeeColumns";
import Table from "../../_component/Table";
import { Employee } from "@/types/employee";
import { Role } from "@/types/role";
import { Department } from "@/types/department";

const EmployeeTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  interface EmployeeFormState {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    departmentId?: string;
    roleId?: string;
    startDate?: string;
    employmentStatus?: string;
  }
  const [formState, setFormState] = useState<EmployeeFormState>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () =>
      getEmployeeColumns({
        showActions: true,
        onEdit: openModal,
        onDelete: handleDelete,
      }),
    []
  );

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
    if (!res.ok) return alert("Failed to upload file");
    return await res.json();
  }

  function openModal(employee?: Employee) {
    if (employee) {
      setEditingEmployee(employee);
      setFormState({
        name: employee.user?.name ?? "",
        email: employee.user?.email ?? "",
        phone: employee.phone ?? "",
        position: employee.position ?? "",
        departmentId: employee.department?._id ?? "",
        roleId: employee.role?._id ?? "",
        startDate: employee.startDate ?? "",
        employmentStatus: employee.employmentStatus ?? "active",
      });
      setIsEditMode(true);
    } else {
      setEditingEmployee(null);
      setFormState({});
      setIsEditMode(false);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingEmployee(null);
    setFormState({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (isEditMode && editingEmployee) {
      try {
        const EmpRes = await fetch(`/api/employee/${editingEmployee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editingEmployee.user._id,
            roleId: formState.roleId as string,
            name: formState.name as string,
            phone: formState.phone as string,
            photo: editingEmployee.photo,
            employmentStatus: formState.employmentStatus as string,
            departmentId: formState.departmentId as string,
            position: formState.position as string,
            startDate: formState.startDate as string,
            documents: (editingEmployee?.documents?.map((doc) => ({
              _type: "file",
              asset: { _type: "reference", _ref: doc.asset?._ref },
              _key: doc._key,
            })) ?? []) as {
              _type: "file";
              asset: { _type: "reference"; _ref: string };
              _key: string;
            }[],
          }),
        });
        if (!EmpRes.ok) throw new Error();
        const updatedEmp = await EmpRes.json();
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === updatedEmp._id ? updatedEmp : emp))
        );
        closeModal();
      } catch {
        alert("Failed to update employee");
      }
    } else {
      const form = e.currentTarget;
      const data = new FormData(form);
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const phone = data.get("phone") as string;
      const position = data.get("position") as string;
      const departmentId = data.get("departmentId") as string;
      const roleId = data.get("roleId") as string;
      const startDate = new Date().toISOString().slice(0, 10);

      const photoFile = data.get("photo") as File;
      const documentFiles = data.getAll("documents") as File[];

      const uploadedPhoto =
        photoFile.size > 0
          ? await uploadToServer(photoFile, "image")
          : undefined;
      const uploadedDocs = [];
      for (const doc of documentFiles) {
        if (doc.size > 0) {
          uploadedDocs.push(await uploadToServer(doc, "file"));
        }
      }

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
      if (!userRes.ok) return alert("Email already exists or invalid");

      const user = await userRes.json();
      const empRes = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          roleId,
          name,
          phone,
          photo: uploadedPhoto
            ? {
                _type: "image",
                asset: { _type: "reference", _ref: uploadedPhoto._id },
              }
            : undefined,
          employmentStatus: "active",
          departmentId,
          position,
          startDate,
          documents: uploadedDocs.map((doc) => ({
            _type: "file",
            asset: { _type: "reference", _ref: doc._id },
            _key: doc._id,
          })),
        }),
      });

      if (!empRes.ok) return alert("Failed to create employee");
    }
    const emp = await getEmployees();
    setEmployees(emp || []);
    closeModal();
    setLoading(false);
  }

  async function handleDelete(employeeId: string, userId: string) {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    await fetch(`/api/user/${userId}`, { method: "DELETE" });
    await fetch(`/api/employee/${employeeId}`, { method: "DELETE" });
    const emp = await getEmployees();
    setEmployees(emp || []);
    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                defaultValue={formState.name}
                placeholder="Name"
                required
                className="input-style w-full border rounded-md p-2"
              />
              <input
                name="email"
                defaultValue={formState.email}
                placeholder="Email"
                type="email"
                required
                className="input-style w-full border rounded-md p-2"
                disabled={isEditMode}
              />
              <input
                name="phone"
                defaultValue={formState.phone}
                placeholder="Phone"
                required
                className="input-style w-full border rounded-md p-2"
              />
              <input
                name="position"
                defaultValue={formState.position}
                placeholder="Position"
                required
                className="input-style w-full border rounded-md p-2"
              />
              <select
                name="roleId"
                defaultValue={formState.roleId}
                required
                className="input-style w-full border rounded-md p-2"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
              <select
                name="departmentId"
                defaultValue={formState.departmentId}
                required
                className="input-style w-full border rounded-md p-2"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {!isEditMode && (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Documents
                  </label>
                  <input
                    name="documents"
                    type="file"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => openModal()}
        >
          Add Employee
        </button>
      </div>
      {employees.length === 0 && !loading ? (
        <div className="text-center text-gray-500">
          No employees found. Please add an employee.
        </div>
      ) : (
        <Table data={employees} columns={columns} />
      )}
    </div>
  );
};

export default EmployeeTab;
