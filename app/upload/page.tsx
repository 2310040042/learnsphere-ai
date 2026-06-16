"use client";

import { useState } from "react";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setText(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setText(data.text ?? "");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-4">Upload PDF for Extraction</h1>

      <input type="file" accept=".pdf" onChange={handleUpload} />

      {loading && <p className="mt-4">Processing...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {text && (
        <div className="mt-6">
          <h2 className="font-semibold">Extracted Text</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2">{text}</pre>
        </div>
      )}
    </main>
  );
}