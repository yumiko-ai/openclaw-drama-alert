"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  MessageSquare,
  Send,
  X,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export default function GeneratorClient() {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("CLAVICULAR");
  const [action, setAction] = useState("CRASHED");
  const [subtext, setSubtext] = useState("EXCLUSIVE BREAKING NEWS");
  const [nameSize, setNameSize] = useState(55);
  const [actionSize, setActionSize] = useState(110);
  const [subtextSize, setSubtextSize] = useState(22);
  const [padding, setPadding] = useState(55);

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [timestamp, setTimestamp] = useState("");

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const updateTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setTimestamp(`${hours}:${minutes}`);
  };

  const generateThumbnail = async () => {
    if (!imageUrl) {
      alert("Please enter an image URL");
      return;
    }

    setIsGenerating(true);
    setResultUrl("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          name,
          action,
          subtext,
          name_size: nameSize,
          action_size: actionSize,
          subtext_size: subtextSize,
          padding,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResultUrl(data.url);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (resultUrl) {
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = `drama_alert_${Date.now()}.png`;
      link.click();
    }
  };

  const reset = () => {
    setResultUrl("");
    setImageUrl("");
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatting) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsChatting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showChat
                    ? "bg-[#ff0000]/20 text-[#ff0000]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">AI Chat</span>
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff0000]" />
                <span className="font-bold text-white">Generator</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="drama-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Thumbnail Generator
              </h2>

              <div className="space-y-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="drama-input w-full"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2">
                    Name (White, Small)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="drama-input w-full"
                  />
                  <div className="mt-2">
                    <label className="text-xs text-white/40">
                      Font Size: {nameSize}px
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={nameSize}
                      onChange={(e) => setNameSize(parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                {/* Action */}
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2">
                    Action (Red, Big)
                  </label>
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="drama-input w-full"
                  />
                  <div className="mt-2">
                    <label className="text-xs text-white/40">
                      Font Size: {actionSize}px
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={actionSize}
                      onChange={(e) => setActionSize(parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                {/* Subtext */}
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2">
                    Subtext
                  </label>
                  <input
                    type="text"
                    value={subtext}
                    onChange={(e) => setSubtext(e.target.value)}
                    className="drama-input w-full"
                  />
                  <div className="mt-2">
                    <label className="text-xs text-white/40">
                      Font Size: {subtextSize}px
                    </label>
                    <input
                      type="range"
                      min="14"
                      max="40"
                      value={subtextSize}
                      onChange={(e) => setSubtextSize(parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                {/* Padding */}
                <div>
                  <label className="text-xs text-white/40">
                    Padding: {padding}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={padding}
                    onChange={(e) => setPadding(parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateThumbnail}
                  disabled={isGenerating || !imageUrl}
                  className="drama-button w-full flex items-center justify-center gap-2 text-lg py-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Thumbnail
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview / Result */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="drama-card p-6">
              <h3 className="font-semibold mb-4">Live Preview</h3>
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ width: "500px", height: "625px" }}
              >
                {/* Background Image */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#1a1a2e] flex items-center justify-center">
                    <span className="text-white/40">Enter image URL above</span>
                  </div>
                )}

                {/* Text overlay */}
                <div
                  className="absolute left-0 right-0 flex flex-col items-center"
                  style={{ bottom: `${padding}px` }}
                >
                  <span
                    className="text-white text-center whitespace-pre-wrap"
                    style={{
                      fontSize: `${nameSize}px`,
                      fontFamily: "Impact, Arial Black, sans-serif",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    className="text-[#ff0000] text-center whitespace-pre-wrap"
                    style={{
                      fontSize: `${actionSize}px`,
                      fontFamily: "Impact, Arial Black, sans-serif",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {action}
                  </span>
                </div>

                {/* Subtext */}
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span
                    className="text-white font-bold tracking-widest"
                    style={{
                      fontSize: `${subtextSize}px`,
                      fontFamily: "Arial Narrow, Arial, sans-serif",
                      textShadow: "2px 2px 3px rgba(0,0,0,0.8)",
                      letterSpacing: "3px",
                    }}
                  >
                    {subtext}
                  </span>
                </div>

                {/* Logo */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff0000] flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DRAMA</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-[#ff0000] rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-mono">{timestamp}</span>
                </div>

                {/* Red border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff0000]"></div>
              </div>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="drama-card p-6">
                <h3 className="font-semibold mb-4">Generated Result</h3>
                <img
                  src={resultUrl}
                  alt="Generated thumbnail"
                  className="w-full rounded-lg border-2 border-[#ff0000]"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={downloadImage}
                    className="drama-button flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={reset}
                    className="drama-button flex-1 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] glass-card flex flex-col shadow-2xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#ff0000]" />
              <span className="font-semibold text-white">AI Assistant</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center text-white/40 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Ask me for content ideas, trends, or thumbnail suggestions!</p>
              </div>
            )}
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-[#ff0000] text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <span className="animate-pulse text-white/60">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Type a message..."
                className="drama-input flex-1"
                disabled={isChatting}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || isChatting}
                className="drama-button px-4"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
