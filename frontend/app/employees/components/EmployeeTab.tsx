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
import { uploadToServer } from "@/app/utils/utils";
import { useForm } from "react-hook-form";


interface EmployeeFormState {
  name: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  roleId: string;
  startDate?: string;
  employmentStatus?: string;
  photo?: FileList;
  documents?: FileList;
}


const EmployeeTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState
  } = useForm<EmployeeFormState>();

  const {errors,isSubmitting} = formState;
  

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<
    { asset: { url: string },_key:string }[]
  >([]);
  const [removedDocumentKeys, setRemovedDocumentKeys] = useState<string[]>([]);

  
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () =>
      getEmployeeColumns({
        showActions: true,
        onEdit: openModal,
        onDelete: handleDelete,
        showDocuments: true,
        onShowDocuments: handleShowDocuments,
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

  function handleRemoveDocument(docKey: string) {
    setRemovedDocumentKeys((prev) => [...prev, docKey]);
  }

  function handleShowDocuments(employee: Employee){
    setSelectedDocuments(employee?.documents ?? []);
    setIsModalOpen(true);
  };
  

  const closeDocumentModal = () => {
    setIsModalOpen(false);
    setSelectedDocuments([]);
  };


  function openModal(employee?: Employee) {
    if (employee) {
      setEditingEmployee(employee);
      reset({
        name: employee.name ?? "",
        email: employee.user?.email ?? "",
        phone: employee.phone ?? "",
        position: employee.position ?? "",
        departmentId: employee.department?._id ?? "",
        roleId: employee.role?._id ?? "",
        startDate: employee.startDate ?? "",
        employmentStatus: employee.employmentStatus ?? "active",
      });
      setSelectedDocuments(employee.documents ?? []);
      setRemovedDocumentKeys([]); 
      setIsEditMode(true);
    } else {
      setEditingEmployee(null);
      reset({});
      setIsEditMode(false);
      setRemovedDocumentKeys([]);
    }
    setShowModal(true);
  }
  
  function closeModal() {
    setShowModal(false);
    setEditingEmployee(null);
    reset({});
  }
  
  async function onFormSubmit(data: EmployeeFormState) {
    setLoading(true);
    if (isEditMode && editingEmployee) {
      const newDocumentFiles = data.documents ? Array.from(data.documents) : [];
      const uploadedDocs = [];
      for (const doc of newDocumentFiles) {
        if (doc.size > 0) {
          uploadedDocs.push(await uploadToServer(doc, "file"));
        }
      }
      const keptDocs =
        editingEmployee?.documents?.filter(
          (doc) => !removedDocumentKeys.includes(doc._key)
        ) ?? [];

      const documents = [
        ...keptDocs.map((doc) => ({
          _type: "file",
          asset: { _type: "reference", _ref: doc.asset?._ref },
          _key: doc._key,
        })),
        ...uploadedDocs.map((doc) => ({
          _type: "file",
          asset: { _type: "reference", _ref: doc._id },
          _key: doc._id,
        })),
      ];
      try {
        const EmpRes = await fetch(`/api/employee/${editingEmployee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editingEmployee.user._id,
            roleId: data.roleId as string,
            name: data.name as string,
            phone: data.phone as string,
            photo: editingEmployee.photo,
            employmentStatus: data.employmentStatus as string,
            departmentId: data.departmentId as string,
            position: data.position as string,
            startDate: data.startDate as string,
            documents,}),
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
      const startDate = new Date().toISOString().slice(0, 10);
      const photoFile = data?.photo && (data.photo as FileList)[0];
      const documentFiles = data?.documents
        ? Array.from(data.documents as FileList)
        : [];

        const uploadedPhoto =
          photoFile && photoFile.size > 0
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
          name: data.name,
          email: data.email,
          password: "defaultPassword123",
          roleId: data.roleId,
        }),
      });
      if (!userRes.ok) {
        setLoading(false);
        return alert("Email already exists or invalid");
      }

      const user = await userRes.json();
      const empRes = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          roleId: data.roleId,
          name: data.name,
          phone: data.phone,
          startDate,
          photo: uploadedPhoto
            ? {
                _type: "image",
                asset: { _type: "reference", _ref: uploadedPhoto._id },
              }
            : undefined,
          employmentStatus: "active",
          departmentId: data.departmentId,
          position: data.position,
          documents: uploadedDocs.map((doc) => ({
            _type: "file",
            asset: { _type: "reference", _ref: doc._id },
            _key: doc._id,
          })),
        }),
      });

      if (!empRes.ok) {
        setLoading(false);
        return alert("Failed to create employee");
      }
    }

    const emp = await getEmployees();
    setEmployees(emp || []);
    closeModal();
    setLoading(false);
  }
  async function handleDelete(employeeId: string, userId: string) {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    await fetch(`/api/employee/${employeeId}`, { method: "DELETE" });
    await fetch(`/api/user/${userId}`, { method: "DELETE" });
    const emp = await getEmployees();
    setEmployees(emp || []);
    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h2>
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Name"
                    className="input-style w-full border rounded-md p-2"
                    id="name"
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name?.message}
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: { value: true, message: "Email is required" },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="input-style w-full border rounded-md p-2"
                    disabled={isEditMode}
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email?.message}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "Phone number is required",
                      },
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    })}
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    className="input-style w-full border rounded-md p-2"
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone?.message}
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="position"
                  >
                    Position
                  </label>
                  <input
                    {...register("position", {
                      required: {
                        value: true,
                        message: "Position is required",
                      },
                    })}
                    type="text"
                    placeholder="Position"
                    id="position"
                    className="input-style w-full border rounded-md p-2"
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {errors.position?.message}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="employmentStatus"
                  >
                    Employment Status
                  </label>
                  <select
                    {...register("roleId", {
                      required: { value: true, message: "Role is required" },
                    })}
                    id="roleId"
                    className="input-style w-full border rounded-md p-2"
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500 text-xs mt-1">
                    {errors.roleId?.message}
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="departmentId"
                  >
                    Department
                  </label>
                  <select
                    {...register("departmentId", {
                      required: {
                        value: true,
                        message: "Department is required",
                      },
                    })}
                    className="input-style w-full border rounded-md p-2"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500 text-xs mt-1">
                    {errors.departmentId?.message}
                  </p>
                </div>
              </div>
              {isEditMode &&
                selectedDocuments.filter(
                  (doc) => !removedDocumentKeys.includes(doc._key)
                ).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mt-4">
                      Existing Documents
                    </label>
                    <ul className="mb-2">
                      {selectedDocuments
                        .filter(
                          (doc) => !removedDocumentKeys.includes(doc._key)
                        )
                        .map((doc, idx) => (
                          <li
                            key={doc._key}
                            className="flex items-center justify-between mb-1"
                          >
                            <a
                              href={doc.asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800 text-sm"
                            >
                              Document {idx + 1}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(doc._key)}
                              className="ml-2 text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-6">
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <input
                      {...register("photo", {
                        required: { value: true, message: "Photo is required" },
                      })}
                      type="file"
                      id="photo"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors.photo?.message}
                    </p>
                  </div>
                )}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mt-4"
                    htmlFor="documents"
                  >
                    Documents
                  </label>
                  <input
                    type="file"
                    id="documents"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    {...register("documents")}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditMode ?  (isSubmitting ? "updating":"Update")  : (isSubmitting ? "creating":"Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 h-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Employee Documents</h2>
            {selectedDocuments.length ? (
              <ul className="space-y-2">
                {selectedDocuments.map((doc, index) => (
                  <li key={index}>
                    <a
                      href={doc.asset?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Document {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents found.</p>
            )}
            <button
              onClick={closeDocumentModal}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
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
