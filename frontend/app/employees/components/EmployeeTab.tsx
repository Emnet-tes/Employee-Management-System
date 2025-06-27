"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getAllDepartments } from "@/lib/sanity/utils/department";
import { getEmployees } from "@/lib/sanity/utils/employee";
import { getAllRoles } from "@/lib/sanity/utils/role";

import { uploadToServer } from "@/app/utils/utils";

import Table from "@/app/_component/Table";
import Loading from "@/app/_component/Loading";

import { getEmployeeColumns } from "./EmployeeColumns";

import EmployeeFormModal from "./EmployeeFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import { Employee, EmployeeFormState } from "@/types/employee";
import { Role } from "@/types/role";
import { Department } from "@/types/department";
import DocumentsModal from "./DocumentsModal";

const EmployeeTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [selectedDocuments, setSelectedDocuments] = useState<
    { _key: string; asset: { _id: string; url: string }; assetRef: string }[]
  >([]);
  const [removedDocumentKeys, setRemovedDocumentKeys] = useState<string[]>([]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    employeeId?: string;
    userId?: string;
  }>({ open: false });

  const { register, handleSubmit, reset, formState } =
    useForm<EmployeeFormState>();
    const openFormModal = (employee?: Employee) => {
      setIsEditMode(!!employee);
      setEditingEmployee(employee || null);
      setRemovedDocumentKeys([]);
      setSelectedDocuments(employee?.documents ?? []);
      reset({
        name: employee?.name ?? "",
        email: employee?.user?.email ?? "",
        phone: employee?.phone ?? "",
        position: employee?.position ?? "",
        departmentId: employee?.department?._id ?? "",
        roleId: employee?.role?._id ?? "",
        startDate: employee?.startDate ?? "",
        employmentStatus: employee?.employmentStatus ?? "active",
      });
      setShowFormModal(true);
    };
    const handleDeleteClick = (employeeId: string, userId: string) => {
      setDeleteDialog({ open: true, employeeId, userId });
    };
    const handleShowDocuments = (employee: Employee) => {
      setSelectedDocuments(employee.documents ?? []);
      setShowDocumentModal(true);
    };
  const columns = useMemo(
    () =>
      getEmployeeColumns({
        showActions: true,
        onEdit: openFormModal,
        onDelete: handleDeleteClick,
        showDocuments: true,
        onShowDocuments: handleShowDocuments,
      }),
    []
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [emp, roles, departments] = await Promise.all([
        getEmployees(),
        getAllRoles(),
        getAllDepartments(),
      ]);
      setEmployees(emp || []);
      setRoles(roles || []);
      setDepartments(departments || []);
      setLoading(false);
    }
    fetchData();
  }, []);

 

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingEmployee(null);
    reset({});
  };

  const handleRemoveDocument = (key: string) => {
    setRemovedDocumentKeys((prev) => [...prev, key]);
  };

  

  

  const handleDeleteConfirm = async () => {
    const { employeeId, userId } = deleteDialog;
    if (!employeeId || !userId) return;

    try {
      setLoading(true);
      await Promise.all([
        fetch(`/api/employee/${employeeId}`, { method: "DELETE" }),
        fetch(`/api/user/${userId}`, { method: "DELETE" }),
      ]);
      toast.success("Employee deleted successfully");
      const updated = await getEmployees();
      setEmployees(updated || []);
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false });
    }
  };

  const handleFormSubmit = async (data: EmployeeFormState) => {
    setLoading(true);

    if (isEditMode && editingEmployee) {
      // Edit Mode
      const newDocs = data.documents ? Array.from(data.documents) : [];
      const uploadedDocs = await Promise.all(
        newDocs.filter((f) => f.size > 0).map((f) => uploadToServer(f, "file"))
      );
      const keptDocs =
        editingEmployee.documents?.filter(
          (doc) => !removedDocumentKeys.includes(doc._key)
        ) ?? [];

      const documents = [
        ...keptDocs.map((doc) => ({
          _type: "file",
          asset: { _type: "reference", _ref: doc.assetRef },
          _key: doc._key,
        })),
        ...uploadedDocs.map((doc) => ({
          _type: "file",
          asset: { _type: "reference", _ref: doc._id },
          _key: doc._id,
        })),
      ];

      try {
        const res = await fetch(`/api/employee/${editingEmployee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editingEmployee.user._id,
            name: data.name,
            phone: data.phone,
            photo: editingEmployee.photo,
            employmentStatus: data.employmentStatus,
            departmentId: data.departmentId,
            position: data.position,
            roleId: data.roleId,
            startDate: data.startDate,
            documents,
          }),
        });

        if (!res.ok) throw new Error();
        const updated = await res.json();
        setEmployees((prev) =>
          prev.map((e) => (e._id === updated._id ? updated : e))
        );
        toast.success("Employee updated successfully");
        closeFormModal();
      } catch {
        toast.error("Failed to update employee");
      } finally {
        setLoading(false);
      }
    } else {
      // Create Mode
      const startDate = new Date().toISOString().slice(0, 10);
      const photoFile = data.photo?.[0];
      const documentFiles = data.documents ? Array.from(data.documents) : [];

      try {
        const uploadedPhoto = photoFile
          ? await uploadToServer(photoFile, "image")
          : undefined;

        const uploadedDocs = await Promise.all(
          documentFiles.map((doc) => uploadToServer(doc, "file"))
        );

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

        if (!userRes.ok) throw new Error("User creation failed");

        const user = await userRes.json();

        const empRes = await fetch("/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            name: data.name,
            phone: data.phone,
            startDate,
            roleId: data.roleId,
            employmentStatus: "active",
            departmentId: data.departmentId,
            position: data.position,
            photo: uploadedPhoto
              ? {
                  _type: "image",
                  asset: { _type: "reference", _ref: uploadedPhoto._id },
                }
              : undefined,
            documents: uploadedDocs.map((doc) => ({
              _type: "file",
              asset: { _type: "reference", _ref: doc._id },
              _key: doc._id,
            })),
          }),
        });

        if (!empRes.ok) throw new Error("Employee creation failed");

        toast.success("Employee created successfully");
        const updated = await getEmployees();
        setEmployees(updated || []);
        closeFormModal();
      } catch {
        toast.error("Failed to create employee");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => openFormModal()}
        >
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center text-gray-500">No employees found.</div>
      ) : (
        <Table data={employees} columns={columns} />
      )}

      {/* Modals */}
      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={closeFormModal}
        isEditMode={isEditMode}
        roles={roles}
        departments={departments}
        register={register}
        handleSubmit={handleSubmit}
        formState={formState}
        onSubmit={handleFormSubmit}
        selectedDocuments={selectedDocuments}
        removedDocumentKeys={removedDocumentKeys}
        onRemoveDocument={handleRemoveDocument}
      />

      <DocumentsModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documents={selectedDocuments}
      />

      <ConfirmDeleteModal
        isOpen={deleteDialog.open}
        onCancel={() => setDeleteDialog({ open: false })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default EmployeeTab;
