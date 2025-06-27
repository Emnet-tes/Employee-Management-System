"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { getEmployeesByUserId } from "@/lib/sanity/utils/employee";
import { getUserById } from "@/lib/sanity/utils/user";
import EditProfileModal from "./EditProfileModal";
import { Employee } from "@/types/employee";
import { User } from "@/types/user";
import { buildImageUrl } from "@/app/utils/utils";
import Loading from "@/app/_component/Loading";

interface Props {
  id: string;
}

const ProfileCard = ({ id }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getUserById(id);
      const empData = await getEmployeesByUserId(id);
      setUser(userData);
      setEmployee(empData);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const profileImage = employee?.photo?.asset?._ref
    ? buildImageUrl(employee.photo.asset._ref)
    : "/loginImage.png";

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex items-center p-6 max-w-md text-black bg-white rounded-lg shadow">
        <Image
          src={profileImage}
          alt={user?.name || "Profile"}
          width={40}
          height={40}
          unoptimized
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div className="ml-4">
          <h2 className="text-lg font-bold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <Pencil
          className="ml-auto cursor-pointer text-blue-500"
          size={18}
          onClick={() => setShowModal(true)}
        />
      </div>
      {showModal && user && (
        <EditProfileModal
          user={user}
          employee={employee}
          refresh={fetchEmployee}
          onClose={() => {
            setShowModal(false);
            // fetchEmployee();
          }}
        />
      )}
    </>
  );
};

export default ProfileCard;
