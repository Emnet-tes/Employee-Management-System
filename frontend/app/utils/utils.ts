import { client } from "@/lib/sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export function calculateWorkHours(
  checkIn: string | undefined,
  checkOut: string | undefined
) {
  if (!checkIn || !checkOut) return "-";

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) return "-";

  let diffMs = outDate.getTime() - inDate.getTime();

  // Handle overnight (checkOut on next day)
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
}


export function buildImageUrl(
  imageAsset: string | { _type: string; asset: { _ref: string } }
) {
  const builder = imageUrlBuilder(client);
  return builder.image(imageAsset).url();
}

export function timeDifference(
  startDate: string | Date,
  endDate: string | Date
): number {
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return timeDiff
}

export async function uploadToServer(file: File, type: "image" | "file") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return console.error("Failed to upload file");
    return await res.json();
  }