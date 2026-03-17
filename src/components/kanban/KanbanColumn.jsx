import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

const columnConfig = {
  todo: {
    title: "To Do",
    accent: "bg-slate-400",
    bg: "bg-slate-50/50",
  },
  in_progress: {
    title: "In Progress",
    accent: "bg-blue-400",
    bg: "bg-blue-50/30",
  },
  done: {
    title: "Done",
    accent: "bg-emerald-400",
    bg: "bg-emerald-50/30",
  },
};

export default function KanbanColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const config = columnConfig[status];

  return (
    <div className={`flex flex-col rounded-2xl ${config.bg} border border-slate-100 min-w-[300px] w-[340px] max-h-[calc(100vh-180px)]`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${config.accent}`} />
          <h3 className="font-semibold text-slate-700 text-sm tracking-wide">
            {config.title}
          </h3>
          <span className="text-xs text-slate-400 font-medium bg-white rounded-full px-2 py-0.5 border border-slate-100">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-white"
          onClick={() => onAddTask(status)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Cards */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3 pb-3 min-h-[60px] transition-colors duration-200 rounded-b-2xl ${
              snapshot.isDraggingOver ? "bg-slate-100/50" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-8">
                <p className="text-xs text-slate-300">No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}