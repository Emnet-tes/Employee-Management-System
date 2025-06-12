import { Attendance } from "@/types/attendance";
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
        photo
      },
      date,
      checkInTime,
      checkOutTime,
      
    }`
  );
}