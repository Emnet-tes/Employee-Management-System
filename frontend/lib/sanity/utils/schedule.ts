import { client } from "../client";
import { Schedule } from "@/types/schedule";

type ScheduleInput = {
  employeeId: string;
  shift: string;
  date: string;
  notes?: string;
};

export async function createSchedule(data: ScheduleInput): Promise<Schedule> {
  const newDoc = await client.create({
    _type: "schedule",
    employee: { _type: "reference", _ref: data.employeeId },
    shift: data.shift,
    date: data.date,
    notes: data.notes || "",
  });

  const query = `*[_type == "schedule" && _id == $id][0]{
    _id,
    _type,
    shift,
    date,
    notes,
    employee->{
      _id,
      name,
      position
    }
  }`;

  const populated = await client.fetch(query, { id: newDoc._id });
  return populated as Schedule;
}

export async function getAllSchedules(): Promise<Schedule[]> {
  const query = `*[_type == "schedule"]{
    _id,
    shift,
    date,
    notes,
    employee->{
      _id,
      name,
      position
    }
  } | order(date desc)`;

  const results = await client.fetch(query);
  return results as Schedule[];
}

export async function getScheduleById(id: string): Promise<Schedule | null> {
  const query = `*[_type == "schedule" && _id == $id][0]{
    _id,
    shift,
    date,
    notes,
    employee->{
      _id,
      name,
      position
    }
  }`;

  const result = await client.fetch(query, { id });
  return result as Schedule | null;
}

type ScheduleUpdateInput = {
  shift?: string;
  date?: string;
  notes?: string;
  employeeId?: string;
};

export async function updateSchedule(
  id: string,
  updates: {
    shift?: string;
    date?: string;
    notes?: string;
    employeeId?: string;
  }
): Promise<Schedule> {
  const patch: Record<string, any> = {};

  if (updates.shift) patch["shift"] = updates.shift;
  if (updates.date) patch["date"] = updates.date;
  if (updates.notes) patch["notes"] = updates.notes;
  if (updates.employeeId) {
    patch["employee"] = { _type: "reference", _ref: updates.employeeId };
  }

  await client.patch(id).set(patch).commit();

  const query = `*[_type == "schedule" && _id == $id][0]{
    _id,
    _type,
    shift,
    date,
    notes,
    employee->{
      _id,
      name,
      position
    }
  }`;

  const result = await client.fetch(query, { id });
  return result as Schedule;
}


export async function deleteSchedule(id: string): Promise<{ _id: string }> {
  const result = await client.delete(id);
  return result;
}
