import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`flex items-center justify-center p-2 rounded-xl transition-colors duration-300 border 
        ${darkMode 
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
          : "bg-gray-100 border-gray-300 hover:bg-gray-200"
        }`}
    >
      {darkMode ? (
        <Sun className="text-yellow-400 w-5 h-5" />
      ) : (
        <Moon className="text-gray-700 w-5 h-5" />
      )}
    </button>
  );
}
