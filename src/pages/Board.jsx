import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LayoutGrid, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskDialog from "../components/kanban/TaskDialog";

const COLUMNS = ["todo", "in_progress", "done"];

export default function Board() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("order", 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const getColumnTasks = (status) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStatus = destination.droppableId;
    const destTasks = getColumnTasks(newStatus).filter((t) => String(t.id) !== draggableId);
    const newOrder = destination.index;

    // Optimistic update
    queryClient.setQueryData(["tasks"], (old) =>
      old.map((t) =>
        String(t.id) === draggableId
          ? { ...t, status: newStatus, order: newOrder }
          : t
      )
    );

    updateMutation.mutate({ id: draggableId, data: { status: newStatus, order: newOrder } });
  };

  const handleAddTask = (status) => {
    setEditingTask({ status });
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = (id) => {
    deleteMutation.mutate(id);
  };

  const handleSave = (formData, existingId) => {
    if (existingId) {
      updateMutation.mutate({ id: existingId, data: formData });
    } else {
      const columnTasks = getColumnTasks(formData.status);
      createMutation.mutate({ ...formData, order: columnTasks.length });
    }
    setDialogOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Kanban Board</h1>
              <p className="text-xs text-slate-400">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleAddTask("todo")}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white gap-2 px-5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getColumnTasks(status)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSave}
      />
    </div>
  );
}