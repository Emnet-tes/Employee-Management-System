import { Leavesummery } from '@/constant';
import React from 'react'

const LeaveSummery = () => {
  return (
    <div className="flex flex-col w-full mx-auto bg-white p-4 rounded-2xl shadow-sm justify-center items-center">
      <h2 className="text-lg font-bold mb-4 text-black">Leave Summary</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Leavesummery.map((leave) => (
          <div
            key={leave.name}
            className="flex flex-col gap-4 justify-center items-center text-black w-32 h-32 text-lg border border-gray-300 rounded-full"
          >
            <p className="text-sm">{leave.name}</p>
            <div className="flex items-center justify-center w-15 h-15 text-lg bg-gray-300 rounded-full">
              {leave.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveSummery