import { Attendance, AttendanceInput } from "@/types/attendance";
import { groq } from "next-sanity";
import { client } from "../client";

export async function getAttendances(): Promise<Attendance[]> {
  return client.fetch(
    groq`*[_type == "attendance"]{
      _id,
      _createdAt,
      _updatedAt,
      employee->{
        _id,
        name,
        email,
      },
      date,
      checkIn,
      checkOut,
      
    }`
  );
}

export async function getAttendanceById(
  id: string
): Promise<Attendance | null> {
  return client.fetch(
    groq`*[_type == "attendance" && _id == $id][0]{
      _id,
      _createdAt,
      _updatedAt,
      employee->{
        _id,
        name,
        email,
      },
      date,
      checkIn,
      checkOut,
    }`,
    { id }
  );
}

export async function createAttendance(
  attendance: AttendanceInput
): Promise<Attendance | null> {
  console.log("token",process.env.SANITY_API_TOKEN)
  const newDoc = await client.create({
    _type: "attendance",
    employee: { _type: "reference", _ref: attendance.employeeId },
    date: attendance.date,
    checkIn: attendance.checkIn || null,
    checkOut: attendance.checkOut || null,
  });

  // Fetch the populated attendance with expanded employee
  return getAttendanceById(newDoc._id);
}

export async function updateAttendance(
  id: string,
  attendance: AttendanceInput
): Promise<Attendance | null> {
  const updatedDoc = await client.patch(id)
    .set({
      employee: { _type: "reference", _ref: attendance.employeeId },
      date: attendance.date,
      checkIn: attendance.checkIn || null,
      checkOut: attendance.checkOut || null,
    })
    .commit();

  // Fetch the populated attendance with expanded employee
  return getAttendanceById(updatedDoc._id);
}
export async function deleteAttendance(id: string): Promise<void> {
  await client.delete(id);
}