import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultTask = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "",
};

export default function TaskDialog({ open, onOpenChange, task, onSave }) {
  const [form, setForm] = useState(defaultTask);
  const isEditing = !!task?.id;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        assignee: task.assignee || "",
      });
    } else {
      setForm(defaultTask);
    }
  }, [task, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, title: form.title.trim() }, task?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-800">
            {isEditing ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Title
            </Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border-slate-200 focus:ring-slate-300"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Description
            </Label>
            <Textarea
              id="desc"
              placeholder="Add more details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl border-slate-200 resize-none h-20 focus:ring-slate-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Assignee
            </Label>
            <Input
              id="assignee"
              placeholder="Who's responsible?"
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="rounded-xl border-slate-200 focus:ring-slate-300"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-6"
              disabled={!form.title.trim()}
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}