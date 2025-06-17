const LeaveTable = () => {
  const leaveData = [
    {
      srNo: 1,
      fromDate: "24/11/2023",
      toDate: "02/12/2023",
      days: 8,
      leaveType: "Sick Leave",
      reason: "....................",
      status: "Approved",
    },
  ];

  return (
    <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-md">
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Sr.No</th>
            <th className="p-2 border">From Date</th>
            <th className="p-2 border">To Date</th>
            <th className="p-2 border">No. of Days</th>
            <th className="p-2 border">Leave Type</th>
            <th className="p-2 border">Reason for Leave</th>
            <th className="p-2 border">Status</th>
          </tr>
          
        </thead>
        <tbody>
          {leaveData.map((leave, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="p-2 border text-center">{leave.srNo}</td>
              <td className="p-2 border text-center">{leave.fromDate}</td>
              <td className="p-2 border text-center">{leave.toDate}</td>
              <td className="p-2 border text-center">{leave.days}</td>
              <td className="p-2 border text-center">{leave.leaveType}</td>
              <td className="p-2 border text-center">{leave.reason}</td>
              <td className="p-2 border text-center font-bold text-green-600">
                {leave.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;