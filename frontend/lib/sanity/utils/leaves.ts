import { groq } from "next-sanity";
import { client } from "../client";
import { Leave, LeaveInput } from "@/types/leaves";


export async function getAllLeaves(): Promise<Leave[]> {
  return client.fetch(
    groq`*[_type == "leave"]{
      _id,
      _createdAt,
      _updatedAt,
      employee->{
        _id,
        name,
        email
      },
      type,
      status,
      startDate,
      endDate,
      reason
    }`
  );
}

export async function getLeaveById(id: string): Promise<Leave | null> {
  const query = groq`*[_type == "leave" && _id == $id][0]{
    _id,
    _createdAt,
    _updatedAt,
    employee->{
      _id,
      name,
      email
    },
    type,
    status,
    startDate,
    endDate,
    reason
  }`;
  const leave = await client.fetch(query, { id });
  return leave || null;
}

export async function getLeaveByEmployeeId(
  employeeId: string
): Promise<Leave[]> {
  return client.fetch(  
    groq`*[_type == "leave" && employee._ref == $employeeId]{
      _id,
      _createdAt,
      _updatedAt,
      employee->{
        _id,
        name,
        email
      },
      type,
      status,
      startDate,
      endDate,
      reason
    }`,
    { employeeId }
  );
}

export async function createLeave(leave: LeaveInput): Promise<Leave> {
  const newDoc = await client.create({
    _type: "leave",
    employee: { _type: "reference", _ref: leave.employeeId },
    type: leave.type,
    status: leave.status,
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason,
  });
  const createdLeave = await getLeaveById(newDoc._id);
  if (!createdLeave) {
    throw new Error("Failed to fetch the created leave");
  }
  return createdLeave;
}

export async function updateLeave(
  id: string,
  leave: Partial<LeaveInput>
): Promise<Leave | null> {
  const updatedDoc = await client.patch(id).set(leave).commit();
  return getLeaveById(updatedDoc._id);
}
export async function deleteLeave(id: string): Promise<void> {
  const deletedDoc = await client.delete(id);
  if (!deletedDoc) {
    throw new Error(`Failed to delete leave with id ${id}`);
  }
}