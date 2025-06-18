'use client';

import React from 'react';
import { Card, CardContent } from '@/component/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSession } from 'next-auth/react';

const attendanceData = [
  { name: 'Mon', Present: 1, Absent: 0, Off: 0 },
  { name: 'Tue', Present: 1, Absent: 0, Off: 0 },
  { name: 'Wed', Present: 1, Absent: 0, Off: 0 },
  { name: 'Thu', Present: 0, Absent: 0, Off: 1 },
  { name: 'Fri', Present: 1, Absent: 0, Off: 0 },
  { name: 'Sat', Present: 1, Absent: 0, Off: 0 },
  { name: 'Sun', Present: 0, Absent: 0, Off: 1 },
];

const leaveSummary = {
  available: 4,
  taken: 2,
  annual: 6,
};

interface EmployeeDashboardProps {
  session: any;}

const EmployeeDashboard : React.FC<EmployeeDashboardProps>= ({session}) => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* Welcome card */}
      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-xl font-semibold mb-1">
            Welcome, {session?.user?.name || session?.user?.email || 'Employee'}
          </h2>
          <p className="text-gray-600">Here's your activity overview.</p>
        </CardContent>
      </Card>

      {/* Attendance chart */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2">My Attendance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Present" fill="#4ade80" />
              <Bar dataKey="Absent" fill="#f87171" />
              <Bar dataKey="Off" fill="#a3a3a3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leave Summary */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-2">Leave Summary</h2>
          <ul>
            <li>Available: {leaveSummary.available}</li>
            <li>Taken: {leaveSummary.taken}</li>
            <li>Annual: {leaveSummary.annual}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
