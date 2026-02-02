import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, corsHeaders, handleOptions } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase";

export async function OPTIONS() {
  return handleOptions();
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
        { success: true, generations: [], total: 0, source: "memory" },
        { headers: corsHeaders() }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const { data, error, count } = await supabase
      .from("generations")
      .select("id, name, action, subtext, image_url, generated_url, created_at", { count: "exact" })
      .eq("user_id", user.userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, generations: data, total: count },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Get generations error:", error);
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
    const { name, action, subtext, image_url, generated_url, config } = body;

    const supabase = getServerSupabase();

    if (!supabase) {
      // Return success without saving to database
      return NextResponse.json(
        { success: true, generation: { id: "local-1", name, action, subtext, generated_url, created_at: new Date().toISOString() }, source: "memory" },
        { status: 201, headers: corsHeaders() }
      );
    }

    const { data, error } = await supabase
      .from("generations")
      .insert({
        user_id: user.userId,
        name,
        action,
        subtext,
        image_url,
        generated_url,
        config: config || {},
      })
      .select("id, name, action, subtext, generated_url, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, generation: data },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Save generation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
