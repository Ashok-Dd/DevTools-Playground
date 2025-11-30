import { useState, useEffect } from "react";
import {
  Menu,
  Code2,
  FileJson,
  Shield,
  Link2,
  Regex,
  LogOut,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import ThemeToggle from "./togglebutton";
import axios from "axios";
import { Api } from "../Api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const nav = useNavigate();
  const { userInfo, setUserInfo } = useStore();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    document.documentElement.classList.add("dark");

    if (isMobile) setIsOpen(false);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // 🟦 Navigation Mappings
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      color: "from-indigo-500 to-orange-500",
    },
    {
      icon: Code2,
      label: "API Tester",
      path: "/dashboard/tools/api-tester",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileJson,
      label: "JSON ↔ CSV",
      path: "/dashboard/tools/json-to-csv",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      label: "JWT Decoder",
      path: "/dashboard/tools/jwt-decoder",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Link2,
      label: "URL Tools",
      path: "/dashboard/tools/url-encoder",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Regex,
      label: "Regex Tester",
      path: "/dashboard/tools/regex-tester",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // 🟥 Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        Api + "/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setUserInfo(undefined);
        nav("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* MOBILE MENU BUTTON */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[200] p-3 rounded-xl 
                     bg-[var(--sidebar-bg)] border border-[var(--border)]
                     shadow-xl hover:bg-[var(--hover)] transition-all"
        >
          <Menu className="w-6 h-6 text-[var(--text)]" />
        </button>
      )}

      {/* BACKDROP */}
      {isMobile && isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/80 z-[100]"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          bg-[var(--sidebar-bg)] text-[var(--text)]
          flex flex-col border-r border-[var(--border)]
          shadow-xl transition-all duration-300
          ${isMobile ? `fixed top-0 left-0 h-full z-[150] ${isOpen ? "w-64" : "w-0"}` : `relative ${isOpen ? "w-64" : "w-20"}`}
          overflow-hidden
        `}
      >
        {/* HEADER */}
        <div className={`flex items-center p-4 border-b border-[var(--border)] ${isOpen ? "justify-start gap-3" : "justify-center"}`}>
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-[var(--hover)] transition-all">
            <Menu className="w-6 h-6" />
          </button>

          {isOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              DevTools
            </h1>
          )}
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === index;

            return (
              <div
                key={index}
                onClick={() => {
                  setActiveItem(index);
                  nav(item.path);
                  if (isMobile) setIsOpen(false); // 🔥 Close sidebar on mobile
                }}
                className={`
                  group flex items-center gap-4 p-3 rounded-xl cursor-pointer
                  transition-all duration-200 relative
                  ${isOpen ? "justify-start" : "justify-center"}
                  ${isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-[1.03]` : "hover:bg-[var(--hover)] text-[var(--text-light)]"}
                `}
              >
                <Icon className="w-5 h-5 min-w-[20px]" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="p-4 border-t border-[var(--border)] space-y-3">
          {isOpen && (
            <div className="flex gap-3">
              <ThemeToggle />
              {/* History Button for mobile */}
              <button
                className="flex md:hidden flex-1 items-center gap-2 px-4 py-2 rounded-xl 
              bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
              shadow-lg hover:scale-105 transition-all"
                onClick={() => {
                  nav("/dashboard/history");
                  if (isMobile) setIsOpen(false);
                }}
              >
                <Clock className="w-5 h-5" />
                History
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl
              bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl
              hover:scale-105 transition-all
              ${isOpen ? "justify-start" : "justify-center"}
            `}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
