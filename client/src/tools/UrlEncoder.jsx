import React, { useState } from "react";
import { saveToHistory } from "../components/SaveToHistory";

export default function UrlEncoder() {
  const [mode, setMode] = useState("encode"); // encode | decode
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function handleConvert() {
    try {
      if (!input.trim()) {
        setOutput("⚠️ Please enter some text.");
        return;
      }
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        const safe = input.replace(/\+/g, "%20");
        setOutput(decodeURIComponent(safe));
      }
      saveToHistory({
        toolName : "URL Tools" ,
        input : {
          url  : input ,
          mode : mode
        }
      })
    } catch (e) {
      setOutput("⚠️ Invalid input");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {}
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div
        className="w-full max-w-xl p-6 rounded-3xl shadow-2xl space-y-6 border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">URL Encoder / Decoder</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>
            Clean, minimal & theme-aware converter.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setMode("encode")}
            className={`px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 border ${
              mode === "encode"
                ? "scale-105"
                : "hover:scale-105 hover:shadow-md"
            }`}
            style={{
              backgroundColor:
                mode === "encode" ? "var(--primary)" : "var(--bg-secondary)",
              color: mode === "encode" ? "white" : "var(--text)",
              borderColor: "var(--border)",
            }}
          >
            Encode
          </button>

          <button
            onClick={() => setMode("decode")}
            className={`px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 border ${
              mode === "decode"
                ? "scale-105"
                : "hover:scale-105 hover:shadow-md"
            }`}
            style={{
              backgroundColor:
                mode === "decode" ? "var(--primary)" : "var(--bg-secondary)",
              color: mode === "decode" ? "white" : "var(--text)",
              borderColor: "var(--border)",
            }}
          >
            Decode
          </button>
        </div>

        {/* Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Input</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode"
                : "Enter encoded URL to decode"
            }
            className="w-full p-3 rounded-xl border text-sm shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          className="w-full py-3 rounded-2xl text-center font-semibold shadow-md hover:shadow-lg transition-all text-sm"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          {mode === "encode" ? "Encode" : "Decode"}
        </button>

        {/* Output */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Output</label>
          <div
            className="p-3 rounded-xl border min-h-[70px] break-words shadow-inner text-sm"
            style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
          >
            {output || <span className="opacity-50">Converted output appears here…</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={copyOutput}
            className="flex-1 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all text-sm"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            Copy
          </button>

          <button
            onClick={handleClear}
            className="py-2 px-4 rounded-xl font-medium border shadow-sm hover:shadow-md transition-all text-sm"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}