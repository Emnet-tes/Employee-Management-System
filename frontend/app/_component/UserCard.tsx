import { Building, CalendarRange, Computer, User } from 'lucide-react';
import React from 'react'

const UserCard = () => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 my-4">
      {/* Clock In */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-green-50 flex-shrink-0">
          <User size={36} color="orange" />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            101
          </span>
          <span className="text-gray-500 text-sm truncate">Employee No</span>
        </div>
      </div>

      {/* Clock Out */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-blue-50 flex-shrink-0">
          <CalendarRange size={36} color="orange" />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            it department
          </span>
          <span className="text-gray-500 text-sm truncate">Department</span>
        </div>
      </div>

      {/* Total Working Hr */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
          <Building
            size={18}
            color="red"
            className="ml-auto flex-shrink-0 cursor-pointer"
          />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            03/10/2025
          </span>
          <span className="text-gray-500 text-sm truncate">
            Joining Date
          </span>
        </div>
      </div>

      {/* Total Over Time */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
          <Computer
            size={18}
            color="green"
            className="ml-auto flex-shrink-0 cursor-pointer"
          />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            Ui / Ux designer
          </span>
          <span className="text-gray-500 text-sm truncate">
            Designation
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserCard