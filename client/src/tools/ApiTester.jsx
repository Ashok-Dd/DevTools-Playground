import React, { useState } from "react";
import { Loader2, FileJson, AlertCircle, CheckCircle2 } from "lucide-react";
import { Api } from "../Api";
import { saveToHistory } from "../components/SaveToHistory";


export default function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [bodyMode, setBodyMode] = useState("json");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState(null);

  const methodColors = {
    GET: "#4ade80",
    POST: "#facc15",
    PUT: "#3b82f6",
    DELETE: "#ef4444",
  };

  async function sendRequest() {
    if (!url.trim()) {
      setError("URL cannot be empty");
      return;
    }

    setLoading(true);
    setResponse(null);
    setStatus(null);
    setTime(null);
    setError(null);
    setContentType(null);

    let finalBody = undefined;

    // Validate and parse JSON if in JSON mode
    if (method !== "GET" && bodyMode === "json" && body.trim()) {
      try {
        finalBody = JSON.parse(body);
      } catch {
        setError("❌ Invalid JSON format in request body");
        setLoading(false);
        return;
      }
    }

    // Use raw text in text mode
    if (method !== "GET" && bodyMode === "text" && body.trim()) {
      finalBody = body;
    }

    try {
      const res = await fetch(Api + "/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          method,
          headers: {
            "Content-Type":
              bodyMode === "json" && method !== "GET" && body.trim()
                ? "application/json"
                : undefined,
          },
          body: finalBody
        }),
      });
      

      // Handle non-JSON responses from our proxy
      let json;
      const text = await res.text();
      
      try {
        json = JSON.parse(text);
      } catch {
        setError("❌ Proxy server returned invalid response");
        setResponse(text);
        setStatus("Proxy Error");
        setLoading(false);
        return;
      }

      // Handle proxy-level errors
      if (!json.success) {
        setStatus("Request Failed");
        setError(json.message || json.error || "Unknown error occurred");
        setResponse(json.details || json.error || "No additional details");
        setLoading(false);
        return;
      }

      // Successful response
      setStatus(`${json.status} ${json.statusText}`);
      setTime(json.time);
      setContentType(json.contentType);






      // Format response based on content type
      if (json.contentType === "json") {
        setResponse(JSON.stringify(json.data, null, 2));
      } else {
        setResponse(json.data);
      }

      // Save to history
      saveToHistory({
        toolName: "API Tester",
        input: {
          method,
          url,
          body: finalBody || null,
          bodyMode,
        }
      });

    } catch (err) {
      setStatus("Network Error");
      setError("Failed to connect to proxy server");
      setResponse(err.message);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = body.substring(0, start) + "    " + body.substring(end);
      setBody(newValue);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      });
    }

    if (e.key === "{" || e.key === "[") {
      e.preventDefault();
      const pair = e.key === "{" ? "}" : "]";
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = body.substring(0, start) + e.key + pair + body.substring(end);
      setBody(newValue);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      });
    }
  }

  const isSuccessStatus = status && (status.startsWith("2") || status.includes("200") || status.includes("201"));

  return (
    <div
      className="min-h-screen p-6 flex flex-col"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">API Tester</h1>

      {/* Request Panel */}
      <div
        className="w-full max-w-4xl mx-auto p-6 rounded-2xl shadow-xl space-y-4"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        {/* Method + URL */}
        <div className="flex flex-col lg:flex-row gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="p-3 rounded-xl font-bold"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: methodColors[method],
              border: "2px solid var(--border)",
              width: "120px",
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            className="flex-1 p-3 rounded-xl border"
            style={{ 
              backgroundColor: "var(--bg-secondary)", 
              borderColor: "var(--border)",
              color: "var(--text)"
            }}
          />

          <button
            onClick={sendRequest}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-opacity"
            style={{ 
              backgroundColor: "var(--primary)", 
              color: "white",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Send"}
          </button>
        </div>

        {/* Body Mode Switch */}
        {method !== "GET" && (
          <div className="flex gap-3">
            <button
              onClick={() => setBodyMode("json")}
              className={`px-4 py-2 rounded-lg font-medium border transition-all ${
                bodyMode === "json" ? "opacity-100" : "opacity-50"
              }`}
              style={{ 
                borderColor: bodyMode === "json" ? "var(--primary)" : "var(--border)",
                borderWidth: bodyMode === "json" ? "2px" : "1px"
              }}
            >
              JSON
            </button>
            <button
              onClick={() => setBodyMode("text")}
              className={`px-4 py-2 rounded-lg font-medium border transition-all ${
                bodyMode === "text" ? "opacity-100" : "opacity-50"
              }`}
              style={{ 
                borderColor: bodyMode === "text" ? "var(--primary)" : "var(--border)",
                borderWidth: bodyMode === "text" ? "2px" : "1px"
              }}
            >
              Text
            </button>
          </div>
        )}

        {/* Request Body */}
        {method !== "GET" && (
          <>
            <p className="mb-2 font-medium text-sm opacity-70">Request Body</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                bodyMode === "json"
                  ? '{\n  "key": "value"\n}'
                  : "Enter raw text..."
              }
              className="w-full min-h-[200px] p-4 rounded-xl font-mono border outline-none resize-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text)",
                lineHeight: "1.6",
              }}
            />
          </>
        )}

        {/* Error Display */}
        {error && !loading && (
          <div 
            className="flex items-start gap-2 p-3 rounded-lg border"
            style={{ 
              backgroundColor: "#fef2f2", 
              borderColor: "#fecaca",
              color: "#991b1b" 
            }}
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Response Panel */}
      <div
        className="w-full max-w-4xl mx-auto mt-6 p-6 rounded-2xl shadow-xl relative"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        {/* Status + Time */}
        {(status || time) && (
          <div className="absolute top-4 right-4 text-sm flex items-center gap-4">
            {status && (
              <span
                className="font-semibold flex items-center gap-1"
                style={{ color: isSuccessStatus ? "#4ade80" : "#ef4444" }}
              >
                {isSuccessStatus ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {status}
              </span>
            )}
            {time && <span className="opacity-70">{time}</span>}
            {contentType && (
              <span 
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: "var(--bg-secondary)", 
                  color: "var(--text-light)" 
                }}
              >
                {contentType.toUpperCase()}
              </span>
            )}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">Response</h2>

        <div
            className="min-h-[200px] max-h-[500px]  overflow-auto p-4 rounded-xl font-mono border"
            style={{ 
                backgroundColor: "var(--bg-secondary)", 
                borderColor: "var(--border)" 
            }}
            >
            {loading ? (
                <div className="flex flex-col items-center gap-3 opacity-60">
                <Loader2 size={42} className="animate-spin" style={{ color: "var(--primary)" }} />
                <p>Sending request...</p>
                </div>
            ) : !response ? (
                <div className="flex flex-col min-h-[180px] justify-center items-center gap-2 opacity-40">
                <FileJson size={42} />
                <p>Response will appear here</p>
                </div>
            ) : (
                <pre 
                className="w-full text-left whitespace-pre-wrap break-words text-sm"
                style={{ color: "var(--text)", lineHeight: "1.6" }}
                >
                {response}
                </pre>
            )}
        </div>

      </div>
    </div>
  );
}