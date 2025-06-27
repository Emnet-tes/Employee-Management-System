"use client";

import { useForm } from "react-hook-form";
import { Eye, X } from "lucide-react";
import bcrypt from "bcryptjs";
import Image from "next/image";
import { useState } from "react";
import { Employee } from "@/types/employee";
import { User } from "@/types/user";
import { buildImageUrl } from "@/app/utils/utils";


interface Props {
  user: User;
  employee: Employee | null;
  onClose: () => void;
  refresh?: () => void; 
}

type FormValues = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  photo?: FileList;
};

const EditProfileModal = ({ user, employee, onClose ,refresh}: Props) => {
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const photo = watch("photo");

  const onSubmit = async (data: FormValues) => {
    try {
      setSaving(true);
      const updates: Record<string, any> = {
        name: data.name,
        email: data.email,
      };
      // If password change is attempted
      if (data.currentPassword && data.newPassword) {
        // check if current password is correct
        
        const verifyRes = await fetch(`/api/user/verify-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            currentPassword: data.currentPassword,
          }),
        });

        if (!verifyRes.ok) {
          alert("Current password is incorrect.");
          return;
        }
        

        if (data.newPassword) {
          updates.password = await bcrypt.hash(data.newPassword, 10);
        }
      }
      await fetch(`/api/user/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      // Handle image upload
      if (data.photo && data.photo[0] && employee) {
        const formData = new FormData();
        formData.append("file", data.photo[0]);
        formData.append("type", "image");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploaded = await uploadRes.json();
        await fetch(`/api/employee/${employee._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photo: {
              _type: "image",
              asset: { _type: "reference", _ref: uploaded._id },
            },
          }),
        });
      }

      alert("Profile updated!");
      refresh?.(); 
      onClose();
      
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
        <button
          className="absolute top-5 right-5 cursor-pointer"
          onClick={onClose}
        >
          <X />
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) =>
                    setImagePreview(e.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Image
              src={
                imagePreview ||
                (employee?.photo?.asset?._ref
                  ? buildImageUrl(employee.photo.asset._ref)
                  : "/loginImage.png")
              }
              alt="preview"
              width={40}
              height={40}
              unoptimized
              className="w-[50px] h-[50px] mt-2 rounded-full border object-cover"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm" htmlFor="name">
              Name
            </label>
            <input
              {...register("name", { required: {value:true,message:"Name is required"} })}
            
              className="w-full border p-2 rounded"
            />

            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm" htmlFor="email">Email</label>
            <input
              {...register("email", { required: {value:true,message:"Email is required"}})}
              type="email"
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-sm" htmlFor="currentPassword ">Current Password</label>
            <input
              {...register("currentPassword")}
              type="password"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm"htmlFor="newPassword">New Password</label>
            <input
              {...register("newPassword", {
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/,
                  message:
                    "Password must be at least 8 characters, include letters and numbers",
                },
              })}
              type="password"
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword?.message}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
