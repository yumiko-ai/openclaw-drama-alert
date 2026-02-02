import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, corsHeaders, handleOptions } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase";

// Simple AI chat response (placeholder for full AI integration)
const DRAMA_BOT_PROMPTS = {
  greeting: "Hey! I'm your DramaAlert AI assistant. I can help you with content ideas, thumbnail suggestions, and trend analysis.",
  help: "I can help you with:\n- Generating content ideas for your thumbnails\n- Suggesting catchy action phrases\n- Analyzing trends\n- Improving your drama titles",
  examples: [
    { name: "XQC", action: "RAGE QUITS", subtext: "LIVE REACTION" },
    { name: "HasanAbi", action: "DEBATES BACKFIRE", subtext: "VIEWERS SHOCKED" },
    { name: "Trainwreckstv", action: "EXPOSED BY SOURCE", subtext: "EVIDENCE LEAKED" },
  ],
};

function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return DRAMA_BOT_PROMPTS.greeting;
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
    return DRAMA_BOT_PROMPTS.help;
  }

  if (lowerMessage.includes("idea") || lowerMessage.includes("suggestion")) {
    const randomExample = DRAMA_BOT_PROMPTS.examples[
      Math.floor(Math.random() * DRAMA_BOT_PROMPTS.examples.length)
    ];
    return `Here's a drama idea:\n"${randomExample.name}" - ${randomExample.action}\nSubtext: ${randomExample.subtext}`;
  }

  if (lowerMessage.includes("trending") || lowerMessage.includes("trend")) {
    return "Trending drama formats:\n1. Streamers reacting to news\n2. Gaming controversies\n3. Drama between creators\n4. Political debates\n5. Charity stream mishaps";
  }

  if (lowerMessage.includes("action") || lowerMessage.includes("phrase")) {
    return "Catchy action phrases:\n- GOT EXPOSED\n- CRASHED OUT\n- RAGE QUITS\n- EXPOSED BY SOURCE\n- CAUGHT IN 4K\n- FULL DRAMA\n- GOES WILD\n- BREAKING NEWS";
  }

  return "I'm not sure about that. Try asking for ideas, trends, or help!";
}

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
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Generate AI response
    const aiResponse = generateAIResponse(message);

    // Save to chat history (Supabase)
    const supabase = getServerSupabase();

    if (supabase) {
      // Save user message
      await supabase.from("chat_messages").insert({
        user_id: user.userId,
        role: "user",
        content: message,
      });

      // Save AI response
      await supabase.from("chat_messages").insert({
        user_id: user.userId,
        role: "assistant",
        content: aiResponse,
      });
    }

    return NextResponse.json(
      {
        success: true,
        response: aiResponse,
        role: "assistant",
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Chat error:", error);
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
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", user.userId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, messages: data },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Get chat history error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
