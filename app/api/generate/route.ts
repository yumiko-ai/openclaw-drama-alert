import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUTPUT_DIR = "/tmp/generator-output";

// Ensure output directory exists
async function ensureDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (e) {
    // Directory exists
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDir();

    const formData = await request.formData();
    const mode = formData.get("mode") as string || "url";
    const name = formData.get("name") as string || "SOMEONE";
    const action = formData.get("action") as string || "GOT EXPOSED";
    const subtext = formData.get("subtext") as string || "EXCLUSIVE BREAKING NEWS";
    const nameSize = parseInt(formData.get("name_size") as string) || 55;
    const actionSize = parseInt(formData.get("action_size") as string) || 110;
    const subtextSize = parseInt(formData.get("subtext_size") as string) || 22;
    const padding = parseInt(formData.get("padding") as string) || 55;
    const lineHeight = parseFloat(formData.get("line_height") as string) || 0.9;

    const filename = `drama_${uuidv4().slice(0, 8)}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    let imageBuffer: Buffer;
    let overlayHeight = 0;

    if (mode === "url") {
      const imageUrl = formData.get("image_url") as string;
      if (!imageUrl) {
        return NextResponse.json({ success: false, message: "Image URL is required" }, { status: 400 });
      }

      // Fetch image from URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return NextResponse.json({ success: false, message: "Failed to fetch image" }, { status: 400 });
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // For Gemini mode, create a placeholder gradient
      imageBuffer = await sharp({
        create: {
          width: 500,
          height: 625,
          channels: 4,
          background: { r: 26, g: 26, b: 46, alpha: 1 },
        },
      })
        .png()
        .toBuffer();
    }

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const imgWidth = metadata.width || 500;
    const imgHeight = metadata.height || 625;

    // Resize to fit target dimensions while maintaining aspect ratio
    const targetWidth = 500;
    const targetHeight = 625;
    const resizedBuffer = await sharp(imageBuffer)
      .resize(targetWidth, targetHeight, { fit: "cover", position: "center" })
      .toBuffer();

    // Calculate overlay height based on padding
    overlayHeight = padding + Math.max(nameSize, actionSize) + 50;
    const totalHeight = targetHeight + overlayHeight;

    // Create the final image with overlay
    const finalBuffer = await sharp({
      create: {
        width: targetWidth,
        height: totalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
      .composite([
        {
          input: resizedBuffer,
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    // Add text overlay using SVG
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${hours}:${minutes}`;

    const svgText = `
      <svg width="${targetWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Red border at bottom of image -->
        <rect x="0" y="${targetHeight}" width="${targetWidth}" height="6" fill="#ff0000"/>
        
        <!-- Logo placeholder -->
        <circle cx="40" cy="${targetHeight + 30}" r="25" fill="#ff0000"/>
        <text x="40" y="${targetHeight + 38}" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">DRAMA</text>
        
        <!-- Timestamp -->
        <text x="${targetWidth - 30}" y="${totalHeight - 20}" font-family="monospace" font-size="12" fill="white" text-anchor="end">
          <tspan fill="#ff0000">●</tspan> ${timestamp}
        </text>
        
        <!-- Name (white, Impact font) -->
        <text x="${targetWidth / 2}" y="${targetHeight + padding + nameSize}" 
              font-family="Impact, Arial Black, sans-serif" 
              font-size="${nameSize}" 
              fill="white" 
              text-anchor="middle"
              style="line-height: ${lineHeight}; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ${escapeXml(name)}
        </text>
        
        <!-- Action (red, Impact font) -->
        <text x="${targetWidth / 2}" y="${targetHeight + padding + nameSize + actionSize + 10}" 
              font-family="Impact, Arial Black, sans-serif" 
              font-size="${actionSize}" 
              fill="#ff0000" 
              text-anchor="middle"
              style="line-height: ${lineHeight}; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ${escapeXml(action)}
        </text>
        
        <!-- Subtext (white, centered, smaller) -->
        <text x="${targetWidth / 2}" y="${totalHeight - 45}" 
              font-family="'Arial Narrow', Arial, sans-serif" 
              font-size="${subtextSize}" 
              font-weight="700"
              fill="white" 
              letter-spacing="3"
              text-anchor="middle"
              style="text-shadow: 2px 2px 3px rgba(0,0,0,0.8);">
          ${escapeXml(subtext)}
        </text>
      </svg>
    `;

    const resultBuffer = await sharp(finalBuffer)
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

    // Return the image as base64 for immediate display
    const base64 = resultBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
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
