
"use client";
import { EmployeeFormState } from "@/types/employee";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Role } from "@/types/role";
import { Department } from "@/types/department";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormState) => void;
  isEditMode: boolean;
  roles: Role[];
  departments: Department[];
  formState: ReturnType<typeof useForm<EmployeeFormState>>["formState"];
  register: ReturnType<typeof useForm<EmployeeFormState>>["register"];
  handleSubmit: ReturnType<typeof useForm<EmployeeFormState>>["handleSubmit"];
  selectedDocuments: {
    _key: string;
    asset: { _id: string; url: string };
    assetRef: string;
  }[];
  removedDocumentKeys: string[];
  onRemoveDocument: (key: string) => void; // ✅ Add this
}
  

export default function EmployeeFormModal({
  isOpen,
  onClose,
  isEditMode,
  roles,
  departments,
  register,
  handleSubmit,
  formState,
  onSubmit,
    selectedDocuments,
    removedDocumentKeys,
    onRemoveDocument,
  
}: Props) {
  const { errors, isSubmitting } = formState;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit Employee" : "Add Employee"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
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
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                    .filter((doc) => !removedDocumentKeys.includes(doc._key))
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
                          onClick={() => onRemoveDocument(doc._key)}
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
              {isEditMode
                ? isSubmitting
                  ? "updating"
                  : "Update"
                : isSubmitting
                  ? "creating"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
