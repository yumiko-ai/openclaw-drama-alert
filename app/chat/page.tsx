"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X, File, Image, FileText, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: { name: string; type: string; url: string }[];
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  preview?: string;
}

const PRESETS = [
  { name: "Exposed", template: "{NAME} GOT EXPOSED" },
  { name: "Drama", template: "{NAME} IN DRAMA" },
  { name: "Breaking", template: "BREAKING: {NAME}" },
  { name: "Reacts", template: "{NAME} REACTS" },
  { name: "Clapped", template: "{NAME} GOT CLAPPED" },
  { name: "Done", template: "{NAME} IS DONE" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm your DramaAlert AI assistant. Drag in a reference image or describe what you want, and I'll help you create an epic thumbnail. What do you have in mind?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useState(() => {
    scrollToBottom();
  });

  const handleFileUpload = useCallback(async (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const id = Math.random().toString(36).slice(2);
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

      newFiles.push({
        id,
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        preview,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const sendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: uploadedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: f.preview || "",
      })),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input, uploadedFiles),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (message: string, files: UploadedFile[]) => {
    const hasImage = files.some(f => f.type.startsWith("image/"));
    
    if (hasImage) {
      return `I can see you uploaded a reference image! Here are some suggestions for your DramaAlert:\n\n**Style Ideas:**\n- Add shock expression with dramatic lighting\n- Use red accent colors for urgency\n- Include timestamp for "breaking" feel\n\n**Headline Options:**\n- ${PRESETS[0].template.replace("{NAME", "NAME")}
n- ${PRESETS[2].template.replace("{NAME", "NAME")}
n- Create custom: [NAME] + [ACTION]\n\nWould you like me to generate a thumbnail based on this reference?`;
    }
    
    return `I'd love to help you create a DramaAlert! To get the best results, try uploading a reference image or tell me:\n\n1. **Who** is the subject?\n2. **What** happened? (exposed, drama, reacts, etc.)\n3. **Style** preference (classic, modern, shocked, angry)\n\nOr choose a preset below and I'll help you customize it!`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("text/") || type.includes("document")) return FileText;
    return File;
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="drama-card p-4 mb-4">
        <h3 className="text-sm font-semibold text-white/60 mb-3">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPreset(preset.template)}
              className={`drama-button text-sm py-2 px-3 ${
                selectedPreset === preset.template ? "bg-red-600" : ""
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto drama-card p-4 space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div className={message.role === "user" ? "chat-user" : "chat-assistant"}>
              {message.files && message.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.files.map((file, idx) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-sm"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs text-white/40 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="chat-assistant flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating thumbnail ideas...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="drama-card p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Reference images:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 group"
                >
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={`drop-zone p-1 ${isDragOver ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="drama-card rounded-xl p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Describe your thumbnail idea..."
              className="flex-1 drama-input"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              className="drama-button flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            Drag reference images to upload • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
