import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, files } = body;

    // TODO: Connect to OpenClaw AI API
    const response = `I received your message: "${message}". This is a placeholder response. In production, this would connect to the AI assistant.`;

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
