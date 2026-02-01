"use client";

import { useState } from "react";
import { ExternalLink, Download, RefreshCw, Image, Sparkles, Upload } from "lucide-react";

const TEMPLATES = [
  { id: "classic", name: "Classic", description: "Red border, Impact font" },
  { id: "modern", name: "Modern", description: "Clean design, subtle effects" },
  { id: "shocked", name: "Shocked", description: "High contrast, dramatic" },
  { id: "minimal", name: "Minimal", description: "Simple and clean" },
];

const ACTIONS = [
  "GOT EXPOSED", "IN DRAMA", "REACTS", "IS DONE", "GOT CLAPPED", 
  "BREAKING NEWS", "CAUGHT IN 4K", "SCANDAL", "SPLASHED", "DEMOLISHED"
];

export default function GeneratorPage() {
  const [name, setName] = useState("");
  const [action, setAction] = useState("GOT EXPOSED");
  const [imageUrl, setImageUrl] = useState("");
  const [template, setTemplate] = useState("classic");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateThumbnail = async () => {
    if (!name || !imageUrl) return;
    
    setIsGenerating(true);
    
    const width = 500;
    const height = 625;
    const encodedName = encodeURIComponent(name);
    const encodedAction = encodeURIComponent(action);
    const encodedUrl = encodeURIComponent(imageUrl);
    
    const url = `http://100.88.15.95:5050/?image=${encodedUrl}&headline=${encodedName}%20${encodedAction}`;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedUrl(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`);
    setIsGenerating(false);
    
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 drama-title">Thumbnail Generator</h1>
          <p className="text-white/60">Create professional DramaAlert-style thumbnails</p>
        </div>
        <a
          href="http://100.88.15.95:5050"
          target="_blank"
          rel="noopener noreferrer"
          className="drama-button flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open Web Generator
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="drama-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-red-500" />
              Source Image
            </h3>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="drama-input w-full mb-3"
            />
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-white/40" />
              <p className="text-white/60 text-sm">Drag & drop or click to upload</p>
            </div>
          </div>

          <div className="drama-card p-6">
            <h3 className="text-lg font-semibold mb-4">Text Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Name (White)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="XQC, Trainwreck, etc."
                  className="drama-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-2 block">Action (Red)</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="drama-input w-full"
                >
                  {ACTIONS.map((act) => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 flex-wrap">
                {ACTIONS.slice(0, 5).map((act) => (
                  <button
                    key={act}
                    onClick={() => setAction(act)}
                    className={`drama-button text-xs py-1 px-2 ${
                      action === act ? "bg-red-600" : ""
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="drama-card p-6">
            <h3 className="text-lg font-semibold mb-4">Style Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`drama-card p-4 text-left ${
                    template === t.id ? "border-red-500 bg-red-500/10" : ""
                  }`}
                >
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-white/60">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateThumbnail}
            disabled={!name || !imageUrl || isGenerating}
            className="drama-button w-full flex items-center justify-center gap-2 text-lg py-4"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
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

        <div className="drama-card p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          
          {name && action ? (
            <div className="aspect-[4/5] drama-border bg-[#1a1a2e] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-3 left-3 w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-white/40">LOGO</span>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1">
                <div className="live-dot"></div>
                <span className="text-xs text-white/60">LIVE</span>
              </div>

              <div className="text-center px-6">
                <div className="text-white text-4xl mb-2">{name}</div>
                <div className="drama-title text-5xl">{action}</div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-white/40 text-sm">EXCLUSIVE BREAKING NEWS</span>
              </div>

              <div className="absolute bottom-3 right-3 text-white/60 text-xs">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="aspect-[4/5] bg-white/5 rounded-xl flex items-center justify-center">
              <p className="text-white/40">Enter a name and action to see preview</p>
            </div>
          )}

          {generatedUrl && (
            <div className="mt-4 flex gap-3">
              <button className="drama-button flex-1 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="drama-button flex-1 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 drama-card p-6">
        <h3 className="text-lg font-semibold mb-4">💡 Quick Tips</h3>
        <ul className="space-y-2 text-white/60">
          <li>• Use high-contrast images for better visibility</li>
          <li>• Keep names short (under 12 characters)</li>
          <li>• "GOT EXPOSED" and "REACTS" are the most popular presets</li>
          <li>• Open the web generator for advanced customization</li>
        </ul>
      </div>
    </div>
  );
}
