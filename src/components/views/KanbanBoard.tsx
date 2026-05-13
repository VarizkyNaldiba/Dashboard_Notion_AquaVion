import React from "react";
import { Task } from "@/data/mockData";
import { MoreHorizontal, Plus } from "lucide-react";

interface KanbanBoardProps {
  tasks: Task[];
}

const STATUSES: Task["status"][] = ["Not Started", "In Progress", "Review", "Done"];

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Not Started":
        return "bg-[var(--color-tag-gray-bg)] text-[var(--color-tag-gray-text)]";
      case "In Progress":
        return "bg-[var(--color-tag-blue-bg)] text-[var(--color-tag-blue-text)]";
      case "Review":
        return "bg-[var(--color-tag-yellow-bg)] text-[var(--color-tag-yellow-text)]";
      case "Done":
        return "bg-[var(--color-tag-green-bg)] text-[var(--color-tag-green-text)]";
      default:
        return "bg-[var(--color-tag-gray-bg)] text-[var(--color-tag-gray-text)]";
    }
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 px-2 h-full">
      {STATUSES.map((status) => {
        const columnTasks = getTasksByStatus(status);
        
        return (
          <div key={status} className="flex flex-col min-w-[280px] w-[280px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
                  {status}
                </span>
                <span className="text-sm text-[var(--notion-text-gray)] font-medium">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[var(--notion-text-gray)]">
                <button className="p-1 hover:bg-[var(--notion-hover)] rounded">
                  <Plus size={16} />
                </button>
                <button className="p-1 hover:bg-[var(--notion-hover)] rounded">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-[var(--card-bg)] border border-[var(--notion-border)] p-3 rounded-md shadow-sm hover:shadow transition-shadow cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium leading-tight">{task.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center mt-3">
                    <span className="text-xs text-[var(--notion-text-gray)] border border-[var(--notion-border)] rounded px-1.5 py-0.5">
                      {task.wbsCode}
                    </span>
                    {task.categoryTag && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium bg-[var(--color-tag-${task.categoryColor}-bg)] text-[var(--color-tag-${task.categoryColor}-text)]`}
                      >
                        {task.categoryTag}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {task.person.length > 0 ? task.person[0].charAt(0) : "?"}
                      </div>
                      <span className="text-xs text-[var(--notion-text-gray)] truncate max-w-[80px]">
                        {task.person.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="flex items-center gap-2 text-sm text-[var(--notion-text-gray)] hover:bg-[var(--notion-hover)] p-2 rounded transition-colors text-left w-full mt-1">
                <Plus size={16} />
                New
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
