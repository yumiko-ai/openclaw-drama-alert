"use client";

import { useState } from "react";
import { FileText, Plus, Clock, AlertCircle, CheckCircle, Circle } from "lucide-react";

interface DocketItem {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  priority: "high" | "medium" | "low";
  category: string;
  date: string;
}

const MOCK_DOCKET: DocketItem[] = [
  { id: "1", title: "New thumbnail templates for gaming", status: "in-progress", priority: "high", category: "Design", date: "Today" },
  { id: "2", title: "Twitter/X automation script", status: "pending", priority: "high", category: "Dev", date: "Tomorrow" },
  { id: "3", title: "Update drama alert bot rules", status: "pending", priority: "medium", category: "Content", date: "This week" },
  { id: "4", title: "Competitor analysis report", status: "completed", priority: "low", category: "Analytics", date: "Done" },
  { id: "5", title: "YouTube thumbnail presets", status: "pending", priority: "medium", category: "Design", date: "Next week" },
  { id: "6", title: "Stream overlay updates", status: "pending", priority: "low", category: "Design", date: "Next week" },
];

const CATEGORIES = ["All", "Design", "Dev", "Content", "Analytics", "System"];

export default function DocketTopics() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState(MOCK_DOCKET);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/20";
      default: return "text-white/60";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <Circle className="w-5 h-5 text-white/30" />;
    }
  };

  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter(item => item.category === selectedCategory);

  const stats = {
    total: items.length,
    completed: items.filter(i => i.status === "completed").length,
    inProgress: items.filter(i => i.status === "in-progress").length,
    pending: items.filter(i => i.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Docket Topics
          </h2>
          <p className="text-white/60 text-sm">Project tracker & task management</p>
        </div>

        <button className="drama-button flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Topic
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="drama-card p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-white/60">Total</div>
        </div>
        <div className="drama-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-white/60">Completed</div>
        </div>
        <div className="drama-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
          <div className="text-sm text-white/60">In Progress</div>
        </div>
        <div className="drama-card p-4 text-center">
          <div className="text-2xl font-bold text-white/40">{stats.pending}</div>
          <div className="text-sm text-white/60">Pending</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`drama-button text-xs py-2 px-3 ${
              selectedCategory === cat ? "bg-blue-600" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`drama-card p-4 flex items-center gap-4 ${
              item.status === "completed" ? "opacity-60" : ""
            }`}
          >
            {getStatusIcon(item.status)}

            <div className="flex-1">
              <div className="font-semibold">{item.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
                <span className="text-xs text-white/40">{item.category}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/60">{item.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Placeholder */}
      <div className="drama-card p-6 border-dashed border-2 border-white/20">
        <div className="text-center text-white/60">
          <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Click "Add Topic" to create new tasks</p>
          <p className="text-sm mt-1">Organize your projects and track progress</p>
        </div>
      </div>
    </div>
  );
}
