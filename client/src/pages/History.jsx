import { useEffect, useState } from "react";
import axios from "axios";
import { Api } from "../Api";
import { Trash2, Filter } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null); // modal popup state

  const getHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(Api + "/history/", {
        withCredentials: true,
      });

      if (response.data.success) {
        const sorted = [...response.data.history].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setHistory(sorted);
        setFiltered(sorted);
      } else {
        setError("Failed to load history.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // original delete
  const deleteItem = async (id) => {
    try {
      await axios.delete(Api + `/history/${id}`, { withCredentials: true });

      const updated = history.filter((item) => item._id !== id);
      setHistory(updated);
      setFiltered(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const shorten = (text) => {
    if (typeof text !== "string") text = JSON.stringify(text);
    return text.length > 50 ? text.slice(0, 50) + "..." : text;
  };

  const applyFilters = () => {
    let temp = [...history];
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (filter === "today") {
      temp = temp.filter(
        (i) => new Date(i.timestamp).toDateString() === today.toDateString()
      );
    }
    if (filter === "yesterday") {
      temp = temp.filter(
        (i) => new Date(i.timestamp).toDateString() === yesterday.toDateString()
      );
    }
    if (toolFilter !== "all") {
      temp = temp.filter((i) => i.toolName === toolFilter);
    }
    setFiltered(temp);
  };

  useEffect(() => {
    getHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, toolFilter, history]);

  const toolNames = [...new Set(history.map((i) => i.toolName))];

  return (
    <div className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 animate-slideDown">
          <h1 className="text-4xl font-bold">History</h1>
          <button
            onClick={getHistory}
            className="px-6 py-2 rounded-xl bg-[var(--primary)] text-white shadow-md hover:bg-[var(--primary-hover)] transition"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-md flex flex-col md:flex-row gap-4 justify-between items-center animate-slideDown">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Filter size={20} /> Filters
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
            </select>

            <select
              className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
            >
              <option value="all">All Tools</option>
              {toolNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="text-lg animate-pulse">Loading...</p>}
        {error && (
          <p className="text-red-400 p-3 bg-red-500/10 rounded-lg">{error}</p>
        )}

        {/* Cards */}
        <div className="flex flex-col gap-6 w-full">
        {filtered.map((item) => (
            <div
            key={item._id}
            className="relative w-full p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]
                        shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >

            {/* Delete Icon */}
            <button
                onClick={() => setDeleteTarget(item)}
                className="absolute top-3 right-3 p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/30 transition"
            >
                <Trash2 size={18} />
            </button>

            {/* Tool Name */}
            <p className="text-2xl font-semibold text-[var(--primary)]">
                {item.toolName} <span className="text-xs text-[var(--text-light)]">({new Date(item.timestamp).toLocaleString()})</span>

            </p>

            {/* Improved INPUT UI (Option 1 Clean Minimal) */}
            <div className="mt-5 space-y-3 text-sm">
                {Object.entries(item.input).map(([key, value]) => (
                <div
                    key={key}
                    className="flex items-center  gap-2  p-1 rounded-xl 
                             transition"
                >
                    <span className="text-[var(--primary)] font-semibold uppercase ">{key}</span>{" : "}
                    <span className=" text-[var(--text-light)] font-semibold break-all ">
                    {shorten(value)}
                    </span>
                </div>
                ))}
            </div>


            </div>
        ))}
        </div>


        {filtered.length === 0 && !loading && <p>No results found.</p>}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 animate-slideDown">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] p-6 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-semibold">Delete this entry?</h2>
            <p className="text-[var(--text-light)]">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  deleteItem(deleteTarget._id);
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--hover-bg)] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
