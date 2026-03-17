import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, User } from "lucide-react";

const priorityConfig = {
  low: { label: "Low", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Med", className: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "High", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function TaskCard({ task, index, onEdit, onDelete }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative bg-white rounded-xl border border-slate-200/80 p-4 mb-3 transition-shadow duration-200 ${
            snapshot.isDragging
              ? "shadow-xl shadow-slate-200/50 ring-2 ring-slate-300/40 rotate-[1.5deg]"
              : "shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm leading-snug">
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold px-2 py-0 border ${priority.className}`}
                >
                  {priority.label}
                </Badge>
                {task.assignee && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[80px]">{task.assignee}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-600"
                onClick={() => onEdit(task)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-rose-500"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}