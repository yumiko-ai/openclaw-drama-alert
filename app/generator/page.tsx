"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, Loader2, Sparkles, Download, RefreshCw, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function GeneratorPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("CLAVICULAR");
  const [action, setAction] = useState("CRASHED");
  const [subtext, setSubtext] = useState("EXCLUSIVE BREAKING NEWS");
  const [nameSize, setNameSize] = useState(55);
  const [actionSize, setActionSize] = useState(110);
  const [subtextSize, setSubtextSize] = useState(22);
  const [padding, setPadding] = useState(55);
  const [lineHeight, setLineHeight] = useState(0.9);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 30000);
    return () => clearInterval(interval);
  }, []);

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

    const formData = new FormData();
    formData.append("mode", "url");
    formData.append("image_url", imageUrl);
    formData.append("name", name);
    formData.append("action", action);
    formData.append("subtext", subtext);
    formData.append("name_size", nameSize.toString());
    formData.append("action_size", actionSize.toString());
    formData.append("subtext_size", subtextSize.toString());
    formData.append("padding", padding.toString());
    formData.append("line_height", lineHeight.toString());

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultUrl(data.url);
      } else {
        alert("Error: " + data.message);
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>
        <a
          href="http://100.88.15.95:5050"
          target="_blank"
          rel="noopener noreferrer"
          className="drama-button flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Legacy Generator
        </a>
      </div>

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
                  <label className="text-xs text-white/40">Font Size: {nameSize}px</label>
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
                  <label className="text-xs text-white/40">Font Size: {actionSize}px</label>
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
                  <label className="text-xs text-white/40">Font Size: {subtextSize}px</label>
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
                <label className="text-xs text-white/40">Padding: {padding}px</label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </div>

              {/* Line Height */}
              <div>
                <label className="text-xs text-white/40">Line Height: {lineHeight}</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.05"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
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
              ref={previewRef}
              className="relative bg-black rounded-lg overflow-hidden"
              style={{ aspectRatio: "500/625" }}
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

              {/* Overlay */}
              <div
                className="absolute left-0 right-0 px-4 flex flex-col items-center"
                style={{ bottom: `${padding}px` }}
              >
                <span
                  className="text-white font-Impact text-center whitespace-pre-wrap"
                  style={{
                    fontSize: `${nameSize}px`,
                    lineHeight: lineHeight,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    fontFamily: "Impact, Arial Black, sans-serif",
                  }}
                >
                  {name}
                </span>
                <span
                  className="text-[#ff0000] font-Impact text-center whitespace-pre-wrap"
                  style={{
                    fontSize: `${actionSize}px`,
                    lineHeight: lineHeight,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    fontFamily: "Impact, Arial Black, sans-serif",
                  }}
                >
                  {action}
                </span>
              </div>

              {/* Bottom Text */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center">
                <span
                  className="text-white font-['Arial_Narrow'] font-bold tracking-widest text-center"
                  style={{
                    fontSize: `${subtextSize}px`,
                    textShadow: "2px 2px 3px rgba(0,0,0,0.8)",
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
    </div>
  );
}
