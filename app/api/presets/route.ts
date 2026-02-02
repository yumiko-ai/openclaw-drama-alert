import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, corsHeaders, handleOptions } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase";

// Default presets when Supabase is not configured
const DEFAULT_PRESETS = [
  { id: "default-1", name: "Standard", config: { nameSize: 55, actionSize: 110, subtextSize: 22, padding: 55 }, is_default: true },
  { id: "default-2", name: "Compact", config: { nameSize: 40, actionSize: 80, subtextSize: 18, padding: 40 }, is_default: false },
  { id: "default-3", name: "Large", config: { nameSize: 70, actionSize: 130, subtextSize: 26, padding: 70 }, is_default: false },
  { id: "default-4", name: "Drama King", config: { nameSize: 60, actionSize: 140, subtextSize: 24, padding: 65 }, is_default: false },
];

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    
    // Allow public access for default presets
    const url = new URL(request.url);
    const publicOnly = url.searchParams.get("public") === "true";

    if (!publicOnly && (authError || !user)) {
      return NextResponse.json(
        { success: false, error: authError || "Unauthorized" },
        { status: 401, headers: corsHeaders() }
      );
    }

    const supabase = getServerSupabase();

    // If Supabase is not configured, return default presets
    if (!supabase) {
      return NextResponse.json(
        { success: true, presets: DEFAULT_PRESETS, source: "defaults" },
        { headers: corsHeaders() }
      );
    }

    let query = supabase
      .from("presets")
      .select("id, name, config, is_default, created_at")
      .eq("is_public", true)
      .order("is_default", { ascending: false })
      .order("name");

    if (!publicOnly && user) {
      // Include user's private presets
      const { data: userPresets } = await supabase
        .from("presets")
        .select("id, name, config, is_default, created_at")
        .eq("user_id", user.userId);

      const { data: publicPresets } = await query;

      return NextResponse.json(
        { success: true, presets: [...(publicPresets || []), ...(userPresets || [])] },
        { headers: corsHeaders() }
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, presets: data },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Get presets error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
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
    const { name, config, is_public, is_default } = body;

    if (!name || !config) {
      return NextResponse.json(
        { success: false, error: "Name and config are required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const supabase = getServerSupabase();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503, headers: corsHeaders() }
      );
    }

    const { data, error } = await supabase
      .from("presets")
      .insert({
        name,
        config,
        is_public: is_public || false,
        is_default: is_default || false,
        user_id: user.userId,
      })
      .select("id, name, config, is_default, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, preset: data },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Create preset error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
