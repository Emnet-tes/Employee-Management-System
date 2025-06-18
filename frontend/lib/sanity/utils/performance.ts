import { client } from "../client";
import { Performance } from "@/types/performance";

// Create
type PerformanceInput = {
  employeeId: string;
  reviewerId: string;
  date: string;
  kpis: string[];
  feedback: string;
  rating: number;
};

export async function createPerformance(
  data: PerformanceInput
): Promise<Performance> {
  const newDoc = await client.create({
    _type: "performance",
    employee: { _type: "reference", _ref: data.employeeId },
    reviewer: { _type: "reference", _ref: data.reviewerId },
    date: data.date,
    kpis: data.kpis,
    feedback: data.feedback,
    rating: data.rating,
  });

  const query = `*[_type == "performance" && _id == $id][0]{
    _id,
    _type,
    date,
    kpis,
    feedback,
    rating,
    employee->{
      _id,
      name,
      position
    },
    reviewer->{
      _id,
      name,
      position
    }
  }`;

  const populated = await client.fetch(query, { id: newDoc._id });
  return populated as Performance;
}

// Read all
export async function getAllPerformances(): Promise<Performance[]> {
  const query = `
  *[_type == "performance"]{
    _id,
    date,
    rating,
    feedback,
    goals,
    kpis,
    employee->{
      name,
      email
    },
    reviewer->{
      name
    }
  } | order(date desc)
`;

  const results = await client.fetch(query);
  return results as Performance[];
}

// Read by ID
export async function getPerformanceById(
  id: string
): Promise<Performance | null> {
  const query = `*[_type == "performance" && _id == $id][0]{
    _id,
    _type,
    date,
    kpis,
    feedback,
    rating,
    employee->{
      _id,
      name,
      position
    },
    reviewer->{
      _id,
      name,
      position
    }
  }`;

  const result = await client.fetch(query, { id });
  return result as Performance | null;
}

// Update
type PerformanceUpdateInput = {
  employeeId?: string;
  reviewerId?: string;
  date?: string;
  kpis?: string[];
  feedback?: string;
  rating?: number;
};

export async function updatePerformance(
  id: string,
  updates: PerformanceUpdateInput
): Promise<Performance> {
  const patch: Record<string, any> = {};

  if (updates.employeeId) {
    patch["employee"] = { _type: "reference", _ref: updates.employeeId };
  }
  if (updates.reviewerId) {
    patch["reviewer"] = { _type: "reference", _ref: updates.reviewerId };
  }
  if (updates.date) patch["date"] = updates.date;
  if (updates.kpis) patch["kpis"] = updates.kpis;
  if (updates.feedback) patch["feedback"] = updates.feedback;
  if (typeof updates.rating === "number") patch["rating"] = updates.rating;

  await client.patch(id).set(patch).commit();

  const query = `*[_type == "performance" && _id == $id][0]{
    _id,
    _type,
    date,
    kpis,
    feedback,
    rating,
    employee->{
      _id,
      name,
      position
    },
    reviewer->{
      _id,
      name,
      position
    }
  }`;

  const result = await client.fetch(query, { id });
  return result as Performance;
}

// Delete
export async function deletePerformance(id: string): Promise<{ _id: string }> {
  const result = await client.delete(id);
  return result;
}

export async function getPerformancesByReviewer(reviewerId: string): Promise<Performance[]> {
  const query = `
    *[_type == "performance" && reviewer._ref == $reviewerId]{
      _id,
      date,
      rating,
      feedback,
      goals,
      kpis,
      employee->{
        name,
        email
      },
      reviewer->{
        name
      }
    } | order(date desc)
  `;
  const results = await client.fetch(query, { reviewerId });
  return results as Performance[];
}

export async function getPerformanceByEmployeeId(employeeId: string): Promise<Performance[]> {
  const query = `
    *[_type == "performance" && employee._ref == $employeeId]{
      _id,
      date,
      rating,
      feedback,
      goals,
      kpis,
      reviewer->{
        name
      }
    } | order(date desc)
  `;
   const results = await client.fetch(query, { employeeId });
  return results as Performance[];
}

