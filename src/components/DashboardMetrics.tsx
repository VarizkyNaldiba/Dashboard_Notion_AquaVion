import React from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";
import { Task } from "@/data/mockData";
import { CheckCircle2, CircleDashed, Clock, AlertCircle } from "lucide-react";

interface MetricsProps {
  tasks: Task[];
}

export default function DashboardMetrics({ tasks }: MetricsProps) {
  const totalTasks = tasks.length;
  
  // 1. Status Counts
  const statusCounts = { "Done": 0, "In Progress": 0, "Review": 0, "Not Started": 0 };
  
  // 2. Priority Distribution
  const priorityCounts: Record<string, number> = {};
  
  // 3. Progress by Phase
  const phaseProgress: Record<string, { totalProgress: number, count: number, fullName: string }> = {};
  
  // 4. Progress and Task Sum by Person
  const personStats: Record<string, { totalProgress: number, taskCount: number, fullName: string }> = {};

  tasks.forEach(task => {
    // Status
    if (statusCounts[task.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[task.status as keyof typeof statusCounts]++;
    }
    
    // Priority
    const priority = task.priority || "Normal";
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    
    // Phase
    let phase = task.phase || "Unassigned";
    const phaseMatch = phase.match(/^(\d+)[\.\s-]/);
    if (phaseMatch) {
      phase = `Phase ${phaseMatch[1]}`;
    }
    if (!phaseProgress[phase]) phaseProgress[phase] = { totalProgress: 0, count: 0, fullName: task.phase || "Unassigned" };
    phaseProgress[phase].totalProgress += (task.progress || 0);
    phaseProgress[phase].count += 1;
    
    // Person (array of names)
    const persons = task.person && task.person.length > 0 ? task.person : ["Unassigned"];
    persons.forEach(personName => {
      const p = personName || "Unassigned";
      if (!personStats[p]) personStats[p] = { totalProgress: 0, taskCount: 0, fullName: p };
      personStats[p].totalProgress += (task.progress || 0);
      personStats[p].taskCount += 1;
    });
  });

  // Prepare Chart Data
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const PRIORITY_COLORS: Record<string, string> = {
    "High": "#ef4444",
    "Medium": "#f59e0b",
    "Low": "#10b981",
    "Normal": "#3b82f6"
  };

  const priorityData = Object.keys(priorityCounts).map(key => ({
    name: key,
    value: priorityCounts[key],
    color: PRIORITY_COLORS[key] || COLORS[0]
  }));

  const completedTasks = statusCounts["Done"] || 0;
  const uncompletedTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const completionData = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "Remaining", value: uncompletedTasks, color: "var(--card-border)" }
  ];

  const phaseData = Object.keys(phaseProgress).map(key => ({
    name: key,
    fullName: phaseProgress[key].fullName,
    // Calculate average progress as percentage
    progress: Math.round((phaseProgress[key].totalProgress / phaseProgress[key].count) * 100)
  })).sort((a, b) => a.name.localeCompare(b.name));

  const personData = Object.keys(personStats).map(key => ({
    name: key.split(' ')[0], // Use first name for brevity
    fullName: key,
    progress: Math.round((personStats[key].totalProgress / personStats[key].taskCount) * 100),
    tasks: personStats[key].taskCount
  })).sort((a, b) => b.tasks - a.tasks); // Sort by task count descending

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const title = payload[0]?.payload?.fullName || label;
      return (
        <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-slate-800 dark:text-white font-medium mb-1">{title}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} style={{ color: p.color || p.fill }} className="text-sm">
              {p.name}: <span className="font-bold">{p.value}{p.name === 'progress' || p.name === 'Avg Progress' ? '%' : ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Interpolate color from Blue (start) to Red (end)
  const getPhaseColor = (index: number, total: number) => {
    if (total <= 1) return "#3b82f6";
    const ratio = index / (total - 1);
    // Blue: 59, 130, 246 -> Red: 239, 68, 68
    const r = Math.round(59 + (239 - 59) * ratio);
    const g = Math.round(130 + (68 - 130) * ratio);
    const b = Math.round(246 + (68 - 246) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-blue-500/10 flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-3xl font-bold mb-1 text-slate-800 dark:text-white">{statusCounts["Done"]}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Completed</span>
        </div>
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
            <CircleDashed size={20} />
          </div>
          <span className="text-3xl font-bold mb-1 text-slate-800 dark:text-white">{statusCounts["In Progress"]}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">In Progress</span>
        </div>
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mb-3 text-amber-600 dark:text-amber-500">
            <AlertCircle size={20} />
          </div>
          <span className="text-3xl font-bold mb-1 text-slate-800 dark:text-white">{statusCounts["Review"]}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">In Review</span>
        </div>
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-500/10 flex items-center justify-center mb-3 text-slate-600 dark:text-slate-400">
            <Clock size={20} />
          </div>
          <span className="text-3xl font-bold mb-1 text-slate-800 dark:text-white">{statusCounts["Not Started"]}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Not Started</span>
        </div>
      </div>

      {/* Row 1: Completion Percentage, Priority Distribution & Progress by Phase */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-6">Task Completion</h3>
          <div className="flex-1 w-full relative flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-500">{completionPercentage}%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-6">Task Priorities</h3>
          <div className="flex-1 w-full relative flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">{totalTasks}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex flex-col lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-6">Progress by Phase</h3>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={phaseData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--foreground)" tick={{fill: 'var(--notion-text-gray)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--foreground)" tick={{fill: 'var(--notion-text-gray)', fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--card-border)'}} />
                <Bar dataKey="progress" name="Progress" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorPhase${index})`} />
                  ))}
                </Bar>
                <defs>
                  {phaseData.map((_, index) => {
                    const color = getPhaseColor(index, phaseData.length);
                    return (
                      <linearGradient key={`grad-${index}`} id={`colorPhase${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={1}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
                      </linearGradient>
                    );
                  })}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-6">Progress by Person</h3>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={personData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--foreground)" tick={{fill: 'var(--notion-text-gray)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--foreground)" tick={{fill: 'var(--notion-text-gray)', fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--card-border)'}} />
                <Bar dataKey="progress" name="Avg Progress" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-6">Tasks by Person</h3>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={personData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--foreground)" tick={{fill: 'var(--notion-text-gray)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--foreground)" tick={{fill: 'var(--notion-text-gray)', fontSize: 12}} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--card-border)'}} />
                <Bar dataKey="tasks" name="Total Tasks" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
