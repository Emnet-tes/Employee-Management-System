import { Calendar } from "lucide-react";

const LeaveForm = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl ">
      <h2 className="text-xl font-bold mb-6 text-center">Leave Application</h2>

      {/* Employee Info */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-700">Employee ID:</h2>
          <p className="font-bold text-gray-900">101</p>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-gray-700">Name:</h2>
          <p className="font-bold text-gray-900">Krishna Kumar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Type & Designation */}
        <div>
          <label className="block font-semibold">Leave Type:</label>
          <select className="w-full p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>Sick Leave</option>
            <option>Casual Leave</option>
            <option>Annual Leave</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Designation:</label>
          <input
            type="text"
            value="React JS Developer"
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Date Pickers */}
        <div className="relative">
          <label className="block font-semibold">From Date:</label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 pl-10"
            />
            <Calendar className="absolute left-2 top-3 text-gray-500 w-5 h-5" />
          </div>
        </div>
        <div className="relative">
          <label className="block font-semibold">To Date:</label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 pl-10"
            />
            <Calendar className="absolute left-2 top-3 text-gray-500 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mt-6">
        <label className="block font-semibold">Reason:</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
          Submit
        </button>
      </div>
    </div>
  );
};

export default LeaveForm;
