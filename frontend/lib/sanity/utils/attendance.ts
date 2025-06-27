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
        department->{
        _id,
        name
        },
        role->{
          _id,
          title
        }
      },
      date,
      checkIn,
      checkOut,
      status
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
        department->{
          name
        },  
        role->{
          _id,
          title
        }
      },
      date,
      checkIn,
      checkOut,
      status
    }`,
    { id }
  );
}
export async function getAttendancesByEmployeeId(
  employeeId: string,
  date?: string // optional date filter
): Promise<Attendance[] | null> {
  const filter = groq`*[_type == "attendance" && employee._ref == $employeeId ${date ? "&& date == $date" : ""
    }]{
    _id,
    _createdAt,
    _updatedAt,
    employee->{
      _id,
      name,
      email,
      department->{
        _id,
        name},
      role->{
      _id,
      title
      }
    },
    date,
    checkIn,
    checkOut,
    status
  }`;

  const params: Record<string, string> = { employeeId };
  if (date) params.date = date;
  return client.fetch(filter, params);
}


export async function createAttendance(
  attendance: AttendanceInput
): Promise<Attendance | null> {
  const newDoc = await client.create({
    _type: "attendance",
    employee: { _type: "reference", _ref: attendance.employeeId },
    date: attendance.date,
    checkIn: attendance.checkIn || null,
    checkOut: attendance.checkOut || null,
    status: attendance.status || "Absent",
  });

  // Fetch the populated attendance with expanded employee
  return getAttendanceById(newDoc._id);
}

export async function updateAttendance(
  id: string,
  attendance: AttendanceInput
): Promise<Attendance | null> {
  try {
    const updatedDoc = await client.patch(id)
      .set({
        checkOut: attendance.checkOut || null,
        status: attendance.status || "Absent",
      })
      .commit();

    // Fetch the populated attendance with expanded employee
    return getAttendanceById(updatedDoc._id);
  }
  catch (error) {
    console.error("Error updating attendance:", error);
    return null;
  }
}
export async function deleteAttendance(id: string): Promise<void> {
  await client.delete(id);
}