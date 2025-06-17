import React from 'react'
import { Clock, Briefcase, Edit } from "lucide-react";
const TimeCard = () => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 my-4">
      {/* Clock In */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-green-50 flex-shrink-0">
          <Clock size={36} color="green" />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            9:30 am
          </span>
          <span className="text-gray-500 text-sm truncate">Clock In</span>
        </div>
        <Edit
          size={18}
          color="skyblue"
          className="ml-auto flex-shrink-0 cursor-pointer"
        />
      </div>

      {/* Clock Out */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-blue-50 flex-shrink-0">
          <Clock size={36} color="teal" />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            9:30 pm
          </span>
          <span className="text-gray-500 text-sm truncate">Clock Out</span>
        </div>
        <Edit
          size={18}
          color="skyblue"
          className="ml-auto flex-shrink-0 cursor-pointer"
        />
      </div>

      {/* Total Working Hr */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
          <Briefcase size={36} color="salmon" />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            75 hr
          </span>
          <span className="text-gray-500 text-sm truncate">
            Total Working hr
          </span>
        </div>
      </div>

      {/* Total Over Time */}
      <div className="bg-white h-28 p-4 flex items-center rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
          <Briefcase size={36} color="salmon" />
        </div>
        <div className="flex flex-col justify-center px-2 overflow-hidden whitespace-nowrap">
          <span className="text-gray-800 font-semibold text-base truncate">
            20 hr
          </span>
          <span className="text-gray-500 text-sm truncate">
            Total Over Time
          </span>
        </div>
      </div>
    </div>
  );
}

export default TimeCard