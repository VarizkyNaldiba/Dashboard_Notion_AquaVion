import React from "react";
import { Task } from "@/data/mockData";

interface TableViewProps {
  tasks: Task[];
}

export default function TableView({ tasks }: TableViewProps) {
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
    <div className="overflow-x-auto w-full pb-10">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-[var(--color-notion-border)] text-[var(--color-notion-text-gray)]">
            <th className="font-normal py-2 px-3 w-[80px]">WBS Code</th>
            <th className="font-normal py-2 px-3 min-w-[250px]">Task Name</th>
            <th className="font-normal py-2 px-3 w-[150px]">Status</th>
            <th className="font-normal py-2 px-3 w-[120px]">Person</th>
            <th className="font-normal py-2 px-3 w-[120px]">Phase</th>
            <th className="font-normal py-2 px-3 w-[120px]">Level</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-[var(--color-notion-border)] hover:bg-[var(--color-notion-hover)] transition-colors group"
            >
              <td className="py-2.5 px-3 text-[var(--color-notion-text-gray)]">{task.wbsCode}</td>
              <td className="py-2.5 px-3 font-medium">{task.title}</td>
              <td className="py-2.5 px-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium inline-block ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {task.person.length > 0 ? task.person[0].charAt(0) : "?"}
                  </div>
                  <span>{task.person.join(", ")}</span>
                </div>
              </td>
              <td className="py-2.5 px-3 text-[var(--color-notion-text-gray)]">{task.phase}</td>
              <td className="py-2.5 px-3">
                <span className="text-[var(--color-notion-text-gray)] border border-[var(--color-notion-border)] rounded px-1.5 py-0.5 text-xs bg-[var(--color-notion-bg)]">
                  {task.level}
                </span>
              </td>
            </tr>
          ))}
          {/* New Row Placeholder */}
          <tr className="hover:bg-[var(--color-notion-hover)] transition-colors cursor-pointer text-[var(--color-notion-text-gray)]">
            <td className="py-2.5 px-3" colSpan={6}>
              + New
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
