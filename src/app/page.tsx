"use client";

import React, { useEffect, useState } from "react";
import DashboardMetrics from "@/components/DashboardMetrics";
import { Task, mockTasks } from "@/data/mockData";
import { LayoutDashboard, Users, Activity, Settings, Bell, Search, RefreshCw, AlertCircle, Filter, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "team">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNotionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notion");
      if (!res.ok) {
        console.warn("Failed to fetch from Notion API. Using Mock Data instead.");
        setError("Failed to fetch from Notion API. Using Mock Data instead.");
        setTasks(mockTasks);
        setUsingMock(true);
        return;
      }
      const data = await res.json();
      if (data.error) {
        console.warn(data.error);
        setError(data.error);
        setTasks(mockTasks);
        setUsingMock(true);
        return;
      }
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
        setUsingMock(false);
      } else {
        console.warn("No tasks found in Notion.");
        setTasks(mockTasks);
        setUsingMock(true);
      }
    } catch (err: any) {
      console.warn("Error fetching Notion data:", err.message);
      setError(err.message);
      setTasks(mockTasks);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotionData();
  }, []);

  // Reset pagination when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, phaseFilter, sortConfig]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Not Started":
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const uniquePhases = ["All", ...Array.from(new Set(tasks.map(t => t.phase))).filter(p => p && p !== "-").sort()];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.wbsCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.person && task.person.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPhase = phaseFilter === "All" || task.phase === phaseFilter;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aVal: any = a[sortConfig.key as keyof Task];
    let bVal: any = b[sortConfig.key as keyof Task];

    if (sortConfig.key === "person") {
      aVal = a.person?.[0] || "";
      bVal = b.person?.[0] || "";
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const paginatedTasks = sortedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sleek Sidebar */}
      <aside className="w-[80px] lg:w-[260px] glass-panel border-y-0 border-l-0 flex-shrink-0 flex flex-col items-center lg:items-start py-6 z-10 transition-all duration-300">
        <div className="flex items-center gap-3 px-0 lg:px-6 mb-10 w-full justify-center lg:justify-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AquaVion
          </span>
        </div>

        <nav className="flex flex-col gap-2 w-full px-3 lg:px-4 flex-1">
          <button 
            onClick={() => setActiveMenu("dashboard")}
            className={`flex items-center justify-center lg:justify-start gap-3 w-full p-3 rounded-lg transition-all ${activeMenu === "dashboard" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium hidden lg:block">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveMenu("team")}
            className={`flex items-center justify-center lg:justify-start gap-3 w-full p-3 rounded-lg transition-all ${activeMenu === "team" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"}`}
          >
            <Users size={20} />
            <span className="font-medium hidden lg:block">Task Deliverables</span>
          </button>
          <button className="flex items-center justify-center lg:justify-start gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent">
            <Settings size={20} />
            <span className="font-medium hidden lg:block">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 glass-panel border-t-0 border-x-0 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">
              {activeMenu === "dashboard" ? "Project Overview" : "Team & Tasks"}
            </h1>
            {usingMock && !loading && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={12} />
                Demo Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks or people..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 w-64 transition-colors"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 ml-2 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-7xl mx-auto pb-12">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {activeMenu === "dashboard" ? "Metrics" : "Task Deliverables"}
                </h2>
                <p className="text-sm text-slate-400">
                  {activeMenu === "dashboard" ? "Current status of PBL Smt 6" : "All registered tasks from the database"}
                </p>
              </div>
              <button 
                onClick={fetchNotionData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Sync Notion
              </button>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
                <RefreshCw size={32} className="animate-spin text-blue-500" />
                <p>Fetching live data from Notion...</p>
              </div>
            ) : (
              <>
                {activeMenu === "dashboard" ? (
                  <DashboardMetrics tasks={filteredTasks} />
                ) : (
                  <div className="flex flex-col gap-5">
                    {/* Filters Toolbar */}
                    <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between glass-panel p-4 rounded-xl border border-white/10">
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-400 mr-1">
                          <Filter size={16} />
                          <span className="text-sm font-medium">Status:</span>
                        </div>
                        {["All", "Not Started", "In Progress", "Review", "Done"].map(status => (
                          <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all border ${
                              statusFilter === status 
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                                : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-400 mr-1">
                          <Filter size={16} />
                          <span className="text-sm font-medium">Phase:</span>
                        </div>
                        <select 
                          value={phaseFilter} 
                          onChange={(e) => setPhaseFilter(e.target.value)}
                          className="bg-[#0f1115] border border-white/10 text-slate-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors outline-none cursor-pointer"
                        >
                          {uniquePhases.map(phase => (
                            <option key={phase} value={phase}>{phase}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                      <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                              <th className="font-semibold text-slate-300 py-4 px-6 w-[80px] cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => handleSort('wbsCode')}>
                                WBS <SortIcon columnKey="wbsCode" />
                              </th>
                              <th className="font-semibold text-slate-300 py-4 px-6 min-w-[250px] cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => handleSort('title')}>
                                Task Name <SortIcon columnKey="title" />
                              </th>
                              <th className="font-semibold text-slate-300 py-4 px-6 w-[150px] cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => handleSort('status')}>
                                Status <SortIcon columnKey="status" />
                              </th>
                              <th className="font-semibold text-slate-300 py-4 px-6 w-[150px] cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => handleSort('person')}>
                                Assignee <SortIcon columnKey="person" />
                              </th>
                              <th className="font-semibold text-slate-300 py-4 px-6 w-[120px] cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => handleSort('phase')}>
                                Phase <SortIcon columnKey="phase" />
                              </th>
                              <th className="font-semibold text-slate-300 py-4 px-6 w-[120px] cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => handleSort('progress')}>
                                Progress <SortIcon columnKey="progress" />
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 relative">
                            {paginatedTasks.length > 0 ? (
                              paginatedTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">{task.wbsCode}</td>
                                  <td className="py-4 px-6 font-medium text-slate-200">{task.title}</td>
                                  <td className="py-4 px-6">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                                      {task.status}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <div className="flex -space-x-2">
                                        {(task.person && task.person.length > 0 ? task.person : ["Unassigned"]).slice(0, 3).map((p, idx) => (
                                          <div key={idx} className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white border border-[#0f1115] relative z-10 hover:z-20 transition-all" title={p}>
                                            {p.charAt(0)}
                                          </div>
                                        ))}
                                        {(task.person && task.person.length > 3) && (
                                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-[#0f1115] relative z-0">
                                            +{task.person.length - 3}
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-slate-300 text-xs truncate max-w-[100px]">
                                        {(task.person && task.person.length > 0 ? task.person : ["Unassigned"]).join(", ")}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6 text-slate-400">{task.phase}</td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <div className="w-full bg-slate-700 rounded-full h-1.5 max-w-[60px]">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(task.progress || 0) * 100}%` }}></div>
                                      </div>
                                      <span className="text-xs text-slate-400">{Math.round((task.progress || 0) * 100)}%</span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-400">
                                  No tasks match your filter criteria.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination Controls */}
                      {sortedTasks.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.01]">
                          <div className="text-xs text-slate-400">
                            Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, sortedTasks.length)}</span> of <span className="font-medium text-white">{sortedTasks.length}</span> results
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                            >
                              <ChevronLeft size={14} /> Previous
                            </button>
                            <button 
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages || totalPages === 0}
                              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                            >
                              Next <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
