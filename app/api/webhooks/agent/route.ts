import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, corsHeaders, handleOptions } from "@/lib/api";

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

    const body = await request.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Alert type is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate alert type
    const validTypes = ["alert", "news", "trend", "milestone", "system"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid alert type. Valid types: ${validTypes.join(", ")}` },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Process the webhook
    // In a full implementation, you would:
    // 1. Store the alert in Supabase
    // 2. Push real-time update via Supabase realtime
    // 3. Send notifications if needed

    const alert = {
      id: `alert_${Date.now()}`,
      type,
      data: data || {},
      userId: user.userId,
      createdAt: new Date().toISOString(),
    };

    console.log("Agent webhook received:", alert);

    return NextResponse.json(
      {
        success: true,
        message: "Alert received",
        alertId: alert.id,
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const { user, error: authError } = await authenticateRequest(request);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: authError || "Unauthorized" },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Return recent alerts (placeholder - would query Supabase in full implementation)
    const alerts = [
      {
        id: "alert_1",
        type: "system",
        data: { title: "System Ready", description: "All services operational" },
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(
      { success: true, alerts },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Get alerts error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
