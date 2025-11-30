import { useState } from "react";
import { saveToHistory } from "../components/SaveToHistory";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false, y: false });
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const toggleFlag = (flag) => {
    setFlags({ ...flags, [flag]: !flags[flag] });
  };

  const runRegex = async () => {
    try {
      if (!pattern.trim()) {
        setError("❌ Regex pattern is required.");
        return;
      }

      const activeFlags = Object.keys(flags).filter((f) => flags[f]).join("");
      if (!activeFlags) {
        setError("❌ At least one flag must be selected.");
        return;
      }

      if (!testString.trim()) {
        setError("❌ Test string cannot be empty.");
        return;
      }

      setError(null);
      const regex = new RegExp(pattern, activeFlags);
      const result = [...testString.matchAll(regex)];
      setMatches(result);

      // -----------------------------------------
      //  SAVE TO HISTORY AFTER SUCCESSFUL TEST
      // -----------------------------------------
      await saveToHistory({
        toolName: "Regex Tester",
        input: {
          pattern,
          flags: activeFlags,
          testString,
        },
      });
      // -----------------------------------------

    } catch (err) {
      setMatches([]);
      setError("❌ Invalid Regex: " + err.message);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg relative" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Regex Tester</h1>
          <button
            onClick={() => setShowInfo(true)}
            className="px-2.5 italic  rounded-full py-1  text-xs font-semibold shadow transition"
            style={{ background: "var(--primary)", color: "white" }}
          >
            i
          </button>
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="max-w-lg w-full p-6 rounded-xl relative animate-slideDown" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-3 right-3 text-xl font-bold"
                style={{ color: "var(--text)" }}
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-3">How to Use the Regex Tester</h2>
              <p className="text-sm mb-2">This tool helps you test regular expressions (regex) in real-time.</p>

              <ul className="list-disc pl-5 space-y-2 text-sm mb-3">
                <li><strong>Regex Pattern:</strong> Enter any regex such as <code>[a-z]+</code>.</li>
                <li><strong>Test String:</strong> The text where regex will search for matches.</li>
                <li><strong>Run Test:</strong> Runs regex and displays matches below.</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2 text-lg">About Flags</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>g – Global:</strong> Finds <u>all</u> matches, not just the first one.</li>
                <li><strong>i – Ignore Case:</strong> Case-insensitive matching (<code>A == a</code>).</li>
                <li><strong>m – Multiline:</strong> <code>^</code> and <code>$</code> work per line instead of whole text.</li>
                <li><strong>s – Dot All:</strong> Makes <code>.</code> match newline characters.</li>
                <li><strong>u – Unicode:</strong> Enables full Unicode matching.</li>
                <li><strong>y – Sticky:</strong> Matches from the exact lastIndex position only.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Regex Input */}
        <label className="font-medium">Regex Pattern</label>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="w-full p-3 rounded-xl mt-1 mb-4 shadow"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          placeholder="Enter regex like: [a-z]+"
        />

        {/* Flags */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {Object.keys(flags).map((flag) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-4 py-2 rounded-xl border shadow-sm transition text-sm ${
                flags[flag]
                  ? "scale-105 font-bold"
                  : "opacity-60"
              }`}
              style={{
                background: flags[flag] ? "var(--primary)" : "var(--hover-bg)",
                color: flags[flag] ? "white" : "var(--text)",
                borderColor: "var(--border)",
              }}
            >
              {flag}
            </button>
          ))}
        </div>

        {/* Test String */}
        <label className="font-medium">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-40 p-3 rounded-xl mt-1 mb-4 shadow"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          placeholder="Enter your test text here..."
        />

        {/* Run Button */}
        <button
          onClick={runRegex}
          className="w-full py-3 rounded-xl mt-2 text-lg font-semibold shadow"
          style={{ background: "var(--primary)", color: "white" }}
        >
          Run Test
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: "#ffdddd", color: "#8b0000" }}>
            Error: {error}
          </div>
        )}

        {/* Matches */}
        {matches.length > 0 && !error && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Matches Found:</h2>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div key={index} className="p-3 rounded-lg shadow-sm" style={{ background: "var(--hover-bg)", border: "1px solid var(--border)" }}>
                  <strong>{match[0]}</strong>
                  <div className="text-xs opacity-60">index: {match.index}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!error && matches.length === 0 && (
          <p className="mt-4 text-sm opacity-60">No matches yet...</p>
        )}
      </div>
    </div>
  );
};

export default RegexTester;
