import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { authenticateRequest, corsHeaders, handleOptions } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUTPUT_DIR = "/tmp/generator-output";

async function ensureDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (e) {
    // Directory exists
  }
}

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const { user, error: authError } = await authenticateRequest(request);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: authError || "Unauthorized" },
        { status: 401, headers: corsHeaders() }
      );
    }

    await ensureDir();

    const body = await request.json();
    const {
      image_url,
      name,
      action,
      subtext,
      name_size,
      action_size,
      subtext_size,
      padding,
    } = body;

    if (!image_url) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const safeName = name || "SOMEONE";
    const safeAction = action || "GOT EXPOSED";
    const safeSubtext = subtext || "EXCLUSIVE BREAKING NEWS";
    const safeNameSize = name_size || 55;
    const safeActionSize = action_size || 110;
    const safeSubtextSize = subtext_size || 22;
    const safePadding = padding || 55;

    const filename = `drama_${uuidv4().slice(0, 8)}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Fetch image from URL
    const response = await fetch(image_url);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch image" },
        { status: 400, headers: corsHeaders() }
      );
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const imgWidth = metadata.width || 500;
    const imgHeight = metadata.height || 625;

    // Resize to fit target dimensions
    const targetWidth = 500;
    const targetHeight = 625;
    const resizedBuffer = await sharp(imageBuffer)
      .resize(targetWidth, targetHeight, { fit: "cover", position: "center" })
      .toBuffer();

    // Add text overlay using SVG
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${hours}:${minutes}`;

    const svgText = `
      <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Red border at bottom -->
        <rect x="0" y="${targetHeight - 4}" width="${targetWidth}" height="4" fill="#ff0000"/>

        <!-- Logo - red circle with DRAMA -->
        <circle cx="40" cy="40" r="24" fill="#ff0000"/>
        <text x="40" y="45" font-family="Arial" font-size="11" font-weight="bold" fill="white" text-anchor="middle">DRAMA</text>

        <!-- Timestamp - bottom right -->
        <text x="${targetWidth - 20}" y="${targetHeight - 16}" font-family="monospace" font-size="11" fill="white" text-anchor="end">
          <tspan fill="#ff0000">●</tspan> ${timestamp}
        </text>

        <!-- Name (white, Impact font) -->
        <text x="${targetWidth / 2}" y="${targetHeight - safePadding - safeActionSize - 10}" 
              font-family="Impact, Arial Black, sans-serif" 
              font-size="${safeNameSize}" 
              fill="white" 
              text-anchor="middle"
              style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ${escapeXml(safeName)}
        </text>

        <!-- Action (red, Impact font) -->
        <text x="${targetWidth / 2}" y="${targetHeight - safePadding}" 
              font-family="Impact, Arial Black, sans-serif" 
              font-size="${safeActionSize}" 
              fill="#ff0000" 
              text-anchor="middle"
              style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ${escapeXml(safeAction)}
        </text>

        <!-- Subtext (white, Arial Narrow) -->
        <text x="${targetWidth / 2}" y="${targetHeight - 30}" 
              font-family="Arial Narrow, Arial, sans-serif" 
              font-size="${safeSubtextSize}" 
              font-weight="700"
              fill="white" 
              letter-spacing="3"
              text-anchor="middle"
              style="text-shadow: 2px 2px 3px rgba(0,0,0,0.8);">
          ${escapeXml(safeSubtext)}
        </text>
      </svg>
    `;

    const resultBuffer = await sharp(resizedBuffer)
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    await fs.writeFile(outputPath, resultBuffer);

    // Return the image as base64
    const base64 = resultBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json(
      {
        success: true,
        url: dataUrl,
        filename,
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
