import { getAttendances } from '@/lib/sanity/utils/attendance';
import React from 'react'

const page = async() => {
  const attendances = await getAttendances();
  console.log(attendances,"djsj");
  return (
    <div>{attendances.map((attendance) => (
      <div key={attendance._id}>
        <h2>{attendance.employee.name}</h2>
        <p>Date: {new Date(attendance.date).toLocaleDateString()}</p>
        <p>Check In: {attendance.checkIn}</p>
        <p>Check Out: {attendance.checkOut}</p>
        <p>Created At: {attendance._createdAt}</p>
        </div>
    ))}
      </div>
  )
}

export default page