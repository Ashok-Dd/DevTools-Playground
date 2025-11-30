import { useState } from "react";
import { saveToHistory } from "../components/SaveToHistory";

export default function JwtDecoder() {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState("");

  const decodeJWT = () => {
    try {
      setError("");

      const parts = jwt.split(".");
      if (parts.length !== 3) {
        setError("Invalid JWT! A valid token must have 3 parts.");
        setDecoded(null);
        return;
      }

      const decodeBase64 = (str) => {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(str));
      };

      const [header, payload, signature] = parts;

      setDecoded({
        header: decodeBase64(header),
        payload: decodeBase64(payload),
        signature,
      });

      saveToHistory({
        toolName: "JWT Decoder" ,
        input : {jwt}
      })

    } catch (err) {
      setError("Failed to decode JWT. The token may be corrupted.");
      setDecoded(null);
    }
  };

  return (
    <div className="p-5 mt-8 md:mt-0 w-full flex justify-center">
      <div className="w-full max-w-4xl bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 shadow-lg">

        {/* Title */}
        <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
          🔐 JWT Decoder
        </h1>
        <p className="text-[var(--text-light)] mb-6">
          Paste a JWT token below to decode its header & payload.
        </p>

        {/* Input */}
        <textarea
          className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text)] min-h-[140px] outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="Paste your JWT token here..."
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
        />

        {/* Decode Button */}
        <button
          onClick={decodeJWT}
          className="w-full mt-4 py-3 rounded-xl text-white font-semibold 
          bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition"
        >
          Decode Token
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/40 text-red-500 rounded-xl">
            {error}
          </div>
        )}

        {/* Decoded Output */}
        {decoded && (
          <div className="mt-6 space-y-6">

            {/* Header */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                Header
              </h2>
              <pre className="rounded-xl bg-[var(--bg-secondary)] text-[var(--text)] p-4 border border-[var(--border)] overflow-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                Payload
              </h2>
              <pre className="rounded-xl bg-[var(--bg-secondary)] text-[var(--text)] p-4 border border-[var(--border)] overflow-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            {/* Signature */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                Signature
              </h2>
              <div className="rounded-xl bg-[var(--bg-secondary)] text-[var(--text-light)] p-4 border border-[var(--border)] break-all">
                {decoded.signature}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
