
import { client } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const formData = await req.formData();
  const type = formData.get("type");
  const file = formData.get("file") as File;

  if (!file || (type !== "image" && type !== "file")) {
    return NextResponse.json(
      { error: "Missing file or invalid type" },
      { status: 400 }
    );
  }

  try {
    const uploadedAsset = await client.assets.upload(type as "image" | "file", file, {
      filename: file.name,
    });

    return NextResponse.json(uploadedAsset, { status: 200 });
  } catch (err) {
    console.error("Sanity Upload Failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
