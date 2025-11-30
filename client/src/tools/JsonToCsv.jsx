import { useState } from "react";
import { ArrowRightLeft, Upload, Download } from "lucide-react";
import { saveToHistory } from "../components/SaveToHistory";

const JsonToCsv = () => {
  const [mode, setMode] = useState("jsonToCsv"); // "jsonToCsv" or "csvToJson"
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [fileName, setFileName] = useState("");

  const toggleMode = () => {
    setMode(mode === "jsonToCsv" ? "csvToJson" : "jsonToCsv");
    setInputData("");
    setOutputData("");
    setFileName("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => setInputData(event.target.result);
    reader.readAsText(file);
  };

  const convertJsonToCsv = (jsonString) => {
    try {
      const json = JSON.parse(jsonString);
      if (!Array.isArray(json)) throw new Error("JSON must be an array of objects");
      const headers = Object.keys(json[0]);
      const csv = [
        headers.join(","),
        ...json.map((row) =>
          headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
        ),
      ].join("\n");
      setOutputData(csv);
    } catch (err) {
      alert("Invalid JSON: " + err.message);
    }
  };

  const convertCsvToJson = (csvString) => {
    try {
      const lines = csvString.split("\n").filter(Boolean);
      const headers = lines[0].split(",");
      const json = lines.slice(1).map((line) => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] ? values[i].replace(/^"|"$/g, "") : "";
        });
        return obj;
      });
      setOutputData(JSON.stringify(json, null, 2));
    } catch (err) {
      alert("Invalid CSV: " + err.message);
    }
  };

  const handleConvert = () => {
    if (!inputData) return alert("Please upload or enter data first");
    if (mode === "jsonToCsv") convertJsonToCsv(inputData);
    else convertCsvToJson(inputData);
    saveToHistory({
    toolName: "JSON ↔ CSV Converter",
    input: {
      mode,
      fileName: fileName || "manual input",
      inputPreview: inputData.slice(0, 200) + (inputData.length > 200 ? "..." : ""),
    }
  });
  };

  const handleDownload = () => {
    if (!outputData) return;
    const blob = new Blob([outputData], { type: "text/plain" });
    const link = document.createElement("a");
    const ext = mode === "jsonToCsv" ? "csv" : "json";
    link.download = fileName ? fileName.replace(/\.[^/.]+$/, `.${ext}`) : `data.${ext}`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center p-4">
      
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-6">
  <div className="p-8 text-center">
    <h1
      className="
        text-3xl md:text-4xl font-extrabold mb-2
        bg-gradient-to-r
        from-[var(--tool-header-gradient-start)]
        to-[var(--tool-header-gradient-end)]
        bg-clip-text text-transparent
      "
    >
      JSON ↔ CSV Converter
    </h1>

    <p
      className="
        text-sm md:text-base mt-1
        bg-gradient-to-r
        from-[var(--tool-header-gradient-start)]
        to-[var(--tool-header-gradient-end)]
        bg-clip-text text-transparent
      "
    >
      Easily convert your data between JSON and CSV formats
    </p>
  </div>
</div>


      {/* Main Container */}
      <div className="max-w-4xl w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        
        {/* Mode Switch */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 bg-[var(--bg-secondary)] rounded-2xl p-4 md:p-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm">
            <Upload className="w-5 h-5 text-blue-500" />
            <span className="text-[var(--text)] font-semibold">{mode === "jsonToCsv" ? "JSON" : "CSV"}</span>
          </div>

          <button
            onClick={toggleMode}
            className="p-3 md:p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            title="Switch conversion direction"
          >
            <ArrowRightLeft className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm">
            <Download className="w-5 h-5 text-purple-500" />
            <span className="text-[var(--text)] font-semibold">{mode === "jsonToCsv" ? "CSV" : "JSON"}</span>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide">
            {mode === "jsonToCsv" ? "Upload JSON File" : "Upload CSV File"}
          </label>
          <input
            type="file"
            accept={mode === "jsonToCsv" ? ".json" : ".csv"}
            onChange={handleFileUpload}
            className="block w-full p-4 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] text-[var(--text)] cursor-pointer hover:border-blue-500 hover:bg-[var(--hover-bg)] transition-all"
          />
          {fileName && <p className="text-sm text-[var(--text-light)] mt-1">Loaded: {fileName}</p>}
        </div>

        {/* Input */}
        {inputData && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide">Input Data:</label>
            <textarea
              className="w-full h-40 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
          </div>
        )}

        {/* Convert Button */}
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            Convert Now
          </button>
        </div>

        {/* Output */}
        {outputData && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide">Converted Output:</label>
            <textarea
              readOnly
              className="w-full h-40 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] font-mono text-sm focus:outline-none"
              value={outputData}
            />
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonToCsv;
