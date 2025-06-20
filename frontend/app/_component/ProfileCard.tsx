"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { buildImageUrl } from "../employees/imageUrlBuilder";
import { getEmployeesByUserId } from "@/lib/sanity/utils/employee";
import { Employee } from "@/types/employee";

interface Props {
  id: string;
  email: string;
  name: string;
}

const ProfileCard = ({ id, email,name  }: Props) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState(email);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const data = await getEmployeesByUserId(id);
        setEmployee(data);

        // Only set default form values once when employee is fetched
        if (data) {
          setEditName(data.name || "");
          setEditEmail(data.user?.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      }
    }

    fetchEmployee();
  }, [id]); // Only fetch when id changes

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const updated = await res.json();
      setEmployee((prev) => prev && { ...prev, name: updated.name });
      console.log("User updated successfully:", employee);
      setShowModal(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user info.");
    }
  };

  if (!employee) {
    return <div className="p-4 text-gray-500">Loading profile...</div>;
  }

  const profileImage = employee.photo?.asset?._ref
    ? buildImageUrl(employee.photo.asset._ref)
    : "/loginImage.png";

  return (
    <>
      <div className="flex items-center p-6 max-w-md text-black bg-white rounded-lg shadow">
        <img
          src={profileImage}
          alt={employee.name}
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div className="ml-4">
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-gray-600">{editEmail}</p>
        </div>
        <Pencil
          size={18}
          color="skyblue"
          className="ml-auto cursor-pointer"
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
