import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // TODO: Implement file upload to storage
    const response = {
      url: `/uploads/${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
