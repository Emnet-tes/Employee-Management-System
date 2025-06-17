import { Pencil, PencilIcon } from "lucide-react";

const ProfileCard = () => {
  return (
    <div className="flex items-center p-6 max-w-md text-black">
      {/* Profile Image */}
      <img
        src="profile-image-url.jpg"
        alt="Krishna Kumar"
        className="w-16 h-16 rounded-full border"
      />

      {/* Profile Info */}
      <div className="ml-4">
        <h2 className="text-lg font-bold">Krishna Kumar</h2>
        <p className="text-gray-600">krishnasharma930@gmail.com</p>
      </div>
      <Pencil
        size={18}
        color="skyblue"
        className="ml-auto cursor-pointer"
      />
    </div>
  );
};

export default ProfileCard;
