import { useState, useEffect } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { useStore } from "../store";
import { Link, useNavigate } from "react-router-dom";
import ToolCard from "../components/ToolCard";
import axios from "axios";
import { Api } from "../Api";

export default function DashboardHome() {
  const { userInfo } = useStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [history, setHistory] = useState([]);
  const [recentTools, setRecentTools] = useState([]);
  const [toolUsage, setToolUsage] = useState({});
  const [stats, setStats] = useState({
    totalHistory: 0,
    mostUsedTool: "-",
    lastUsedTool: "-",
  });

  const nav = useNavigate();

  // Fetch user history
  const getHistory = async () => {
    try {
      const response = await axios.get(Api + "/history/", { withCredentials: true });
      if (response.data.success) {
        const sorted = [...response.data.history].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setHistory(sorted);

        // Last 3 unique tools for "Recently Used"
        const uniqueTools = [];
        const seen = new Set();
        for (let item of sorted) {
          if (!seen.has(item.toolName)) {
            uniqueTools.push(item.toolName);
            seen.add(item.toolName);
          }
          if (uniqueTools.length === 3) break;
        }
        setRecentTools(uniqueTools);

        // Tool usage count
        const usage = {};
        sorted.forEach((item) => {
          usage[item.toolName] = usage[item.toolName] ? usage[item.toolName] + 1 : 1;
        });
        setToolUsage(usage);

        // Stats
        const mostUsedTool = Object.keys(usage).reduce((a, b) =>
          usage[a] > usage[b] ? a : b
        , null);
        const lastUsedTool = sorted.length > 0 ? sorted[0].toolName : "-";
        setStats({
          totalHistory: sorted.length,
          mostUsedTool: mostUsedTool || "-",
          lastUsedTool: lastUsedTool,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  // All available tools (dashboard main)
  const tools = [
    { title: "API Tester", desc: "Send and inspect API requests", gradient: "from-blue-500 to-cyan-500", link: "tools/api-tester" },
    { title: "JSON ↔ CSV Converter", desc: "Convert JSON and CSV", gradient: "from-green-500 to-emerald-500", link: "tools/json-to-csv" },
    { title: "JWT Decoder", desc: "Decode JWT tokens", gradient: "from-purple-500 to-pink-500", link: "tools/jwt-decoder" },
    { title: "URL Tools", desc: "Encode & decode URLs", gradient: "from-orange-500 to-red-500", link: "tools/url-encoder" },
    { title: "Regex Tester", desc: "Debug regex", gradient: "from-yellow-500 to-orange-500", link: "tools/regex-tester" },
  ];

  return (
    <div className="w-full min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      {/* ---------------- TOP BAR ---------------- */}
      <div className="flex items-center justify-center md:justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <div className="flex items-center gap-6 hidden md:flex flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:scale-105 transition-all"
            onClick={() => nav("/dashboard/history")}
          >
            <Clock className="w-5 h-5" /> History
          </button>

          {/* Profile - only visible on large screens */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--border)] shadow hover:bg-[var(--hover-bg)] transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                {userInfo?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-sm font-semibold">{userInfo?.username || "User"}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xl z-50 space-y-2">
                <p className="text-sm text-[var(--text-light)] text-center">
                  {userInfo?.email || "user@gmail.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- STATS CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-md">
          <p className="text-[var(--text-light)] font-semibold">Total History Entries</p>
          <p className="text-2xl font-bold">{stats.totalHistory}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-md">
          <p className="text-[var(--text-light)] font-semibold">Most Used Tool</p>
          <p className="text-2xl font-bold">{stats.mostUsedTool}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-md">
          <p className="text-[var(--text-light)] font-semibold">Last Used Tool</p>
          <p className="text-2xl font-bold">{stats.lastUsedTool}</p>
        </div>
      </div>

      {/* ---------------- RECENTLY USED TOOLS ---------------- */}
      {recentTools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recently Used Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTools.map((tool) => {
              const t = tools.find((t) => t.title === tool);
              return (
                <Link key={tool} to={t?.link || "/"}>
                  <ToolCard
                    title={t?.title || tool}
                    desc={t?.desc || "Tool"}
                    gradient={t?.gradient || "from-gray-500 to-gray-400"}
                    usage={toolUsage[tool]}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- ALL TOOLS ---------------- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.link}>
              <ToolCard
                title={tool.title}
                desc={tool.desc}
                gradient={tool.gradient}
                usage={toolUsage[tool.title] || 0}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
