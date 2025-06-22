"use client";

import { Pencil, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getEmployeesByUserId } from "@/lib/sanity/utils/employee";
import { getUserById } from "@/lib/sanity/utils/user";
import { Employee } from "@/types/employee";
import { User } from "@/types/user";
import { buildImageUrl } from "../utils/utils";
import Loading from "./Loading";
import Image from "next/image";
interface Props {
  id: string;
 
}

const ProfileCard = ({ id }: Props) => {
  const [user, setUser] = useState< User| null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // new

  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true); // start loading
      const data = await getUserById(id);
      const employeeData = await getEmployeesByUserId(id);
      setUser(data);
      setEmployee(employeeData);
      if (data) {
        setEditName(data.name || "");
        setEditEmail(data?.email || "");
      }
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    } finally {
      setLoading(false); // stop loading
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    console.log("Upload response:", response);
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return await response.json();
  };

  const handleSave = async () => {
    try {
      setSaving(true); // start saving
      
      // Update user info
      const userRes = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
        }),
      });

      if (!userRes.ok) throw new Error("Failed to update user");

      // Handle image upload if selected
      if (selectedImage && employee) {
        const uploadedImage = await uploadImage(selectedImage);
        
        // Update employee with new photo using API endpoint
        const employeeRes = await fetch(`/api/employee/${employee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photo: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: uploadedImage._id
              }
            }
          }),
        });

        if (!employeeRes.ok) throw new Error("Failed to update employee photo");
      }

      await fetchEmployee(); // refresh after update
      setShowModal(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user info.");
    } finally {
      setSaving(false); // stop saving
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]); 

 

  if (loading) {
    return <Loading/>
  }

  const profileImage = employee?.photo?.asset?._ref
    ? buildImageUrl(employee.photo.asset._ref)
    : "/loginImage.png";

  return (
    <>
      <div className="flex items-center p-6 max-w-md text-black bg-white rounded-lg shadow">
        <Image
          src={profileImage}
          alt={user?.name ||"Profile Image"}
          width={40}
          height={40}
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div className="ml-4">
          <h2 className="text-lg font-bold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <Pencil
          size={18}
          color="skyblue"
          className="ml-auto cursor-pointer"
          onClick={() => {
            if (user) {
              setEditName(user.name || "");
              setEditEmail(user?.email || "");
            }
            setShowModal(true);
          }}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <button
              className="absolute top-5 right-5 cursor-pointer  text-black hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X />
            </button>
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div className=" mb-4">
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <Image
                    width={40}
                    height={40}
                    loading="lazy"
                    src={imagePreview || profileImage}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full border object-cover"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {selectedImage.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white cursor-pointer rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save"}
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
