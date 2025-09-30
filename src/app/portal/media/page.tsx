"use client";
import { useState } from "react";

export default function MediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert(`✅ Uploaded: ${data.source_url}`);
    } else {
      alert("❌ Upload failed: " + JSON.stringify(data));
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Media</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
