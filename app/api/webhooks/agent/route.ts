import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, corsHeaders, handleOptions } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
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

    const alert = {
      id: `alert_${Date.now()}`,
      type,
      data: data || {},
      userId: user.userId,
      createdAt: new Date().toISOString(),
    };

    console.log("Agent webhook received:", alert);

    // Save to Supabase if available
    const supabase = getServerSupabase();
    if (supabase) {
      await supabase.from("webhook_logs").insert({
        agent_id: user.userId,
        type,
        payload: data || {},
        success: true,
      });

      // Also create an alert
      await supabase.from("alerts").insert({
        type,
        title: data?.title || "New Alert",
        description: data?.description,
        image_url: data?.image_url,
        priority: data?.priority || "medium",
        user_id: user.userId,
      });
    }

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
    const { user, error: authError } = await authenticateRequest(request);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: authError || "Unauthorized" },
        { status: 401, headers: corsHeaders() }
      );
    }

    const supabase = getServerSupabase();

    if (!supabase) {
      return NextResponse.json(
        { success: true, alerts: [], source: "memory" },
        { headers: corsHeaders() }
      );
    }

    const { data, error } = await supabase
      .from("alerts")
      .select("id, type, title, description, image_url, priority, is_read, created_at")
      .eq("user_id", user.userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, alerts: data },
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
