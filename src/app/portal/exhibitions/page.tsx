"use client";
import { useState, useEffect } from "react";

type AcfImage = { id: number; url: string; alt?: string };

type Exhibition = {
  id: number;
  title: { rendered: string };
  acf: {
    title: string;
    start_date: string;
    end_date: string;
    exhibition_type: string;
    venue: string;
    city: string;
    description?: string;
    credits?: string;
    image_1?: AcfImage;
    image_2?: AcfImage;
    image_3?: AcfImage;
    image_4?: AcfImage;
    image_5?: AcfImage;
    image_6?: AcfImage;
    image_7?: AcfImage;
    image_8?: AcfImage;
    image_9?: AcfImage;
    image_10?: AcfImage;
    work_1?: string;
    work_2?: string;
    work_3?: string;
    work_4?: string;
    work_5?: string;
    work_6?: string;
    work_7?: string;
    work_8?: string;
    work_9?: string;
    work_10?: string;
  };
};

export default function ExhibitionsPage() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exhibitionType, setExhibitionType] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [files, setFiles] = useState<(File | null)[]>(Array(10).fill(null));
  const [loading, setLoading] = useState(false);

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    fetchExhibitions();
  }, []);

  async function fetchExhibitions() {
    setLoadingExhibitions(true);
    const res = await fetch("/api/admin/exhibitions/list");
    const data = await res.json();
    setExhibitions(data);

    const initial: typeof editValues = {};
    data.forEach((ex: Exhibition) => {
      initial[ex.id] = {
        title: ex.title.rendered,
        start_date: ex.acf.start_date || "",
        end_date: ex.acf.end_date || "",
        exhibition_type: ex.acf.exhibition_type || "",
        venue: ex.acf.venue || "",
        city: ex.acf.city || "",
        description: ex.acf.description || "",
        credits: ex.acf.credits || "",
        files: Array(10).fill(null),
      };
    });
    setEditValues(initial);
    setLoadingExhibitions(false);
  }

  async function uploadImage(file: File): Promise<AcfImage | null> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { id: data.id, url: data.source_url };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const uploadedImages: { [key: string]: AcfImage } = {};
    await Promise.all(
      files.map(async (file, i) => {
        if (file) {
          const uploaded = await uploadImage(file);
          if (uploaded) uploadedImages[`image_${i + 1}`] = uploaded;
        }
      })
    );

    const res = await fetch("/api/admin/exhibition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        acf: {
          title,
          start_date: startDate,
          end_date: endDate,
          exhibition_type: exhibitionType,
          venue,
          city,
          description,
          credits,
          ...uploadedImages,
        },
      }),
    });

    setLoading(false);
    if (res.ok) {
      setTitle("");
      setStartDate("");
      setEndDate("");
      setExhibitionType("");
      setVenue("");
      setCity("");
      setDescription("");
      setCredits("");
      setFiles(Array(10).fill(null));
      fetchExhibitions();
    } else alert("Failed to create exhibition");
  }

  async function handleEditSave(ex: Exhibition) {
    const values = editValues[ex.id];

    const uploadedImages: { [key: string]: AcfImage } = {};
    await Promise.all(
      (values.files as (File | null)[]).map(async (file, i) => {
        if (file) {
          const uploaded = await uploadImage(file);
          if (uploaded) uploadedImages[`image_${i + 1}`] = uploaded;
        }
      })
    );

    const res = await fetch("/api/admin/exhibition", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: ex.id,
        title: values.title,
        acf: { ...values, ...uploadedImages },
      }),
    });

    if (res.ok) {
      fetchExhibitions();
      setEditingId(null);
    } else alert("Failed to save changes");
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this exhibition?")) return;
    const res = await fetch("/api/admin/exhibition", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchExhibitions();
    else alert("Delete failed");
  }

  return (
    <div className="p-3 font-haas text-base">
      <h2 className="text-base uppercase mb-3">Create New Exhibition</h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-2 max-w-md">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Exhibition Type"
          value={exhibitionType}
          onChange={(e) => setExhibitionType(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2"
        />
        <textarea
          placeholder="Credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="border p-2"
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <input
            key={i}
            type="file"
            onChange={(e) => {
              const newFiles = [...files];
              newFiles[i] = e.target.files?.[0] || null;
              setFiles(newFiles);
            }}
            className="p-2 border"
          />
        ))}
        <button
          className="bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Exhibition"}
        </button>
      </form>

      <h3 className="text-base uppercase mt-6 mb-3">Existing Exhibitions</h3>
      {loadingExhibitions ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {exhibitions.map((ex) => (
            <li key={ex.id} className="border rounded p-2 flex flex-col gap-2">
              {editingId === ex.id ? (
                <>
                  <input
                    className="border p-1"
                    value={editValues[ex.id]?.title}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          title: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="date"
                    className="border p-1"
                    value={editValues[ex.id]?.start_date}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          start_date: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="date"
                    className="border p-1"
                    value={editValues[ex.id]?.end_date}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          end_date: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    className="border p-1"
                    value={editValues[ex.id]?.exhibition_type}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          exhibition_type: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    className="border p-1"
                    value={editValues[ex.id]?.venue}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          venue: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    className="border p-1"
                    value={editValues[ex.id]?.city}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: { ...editValues[ex.id], city: e.target.value },
                      })
                    }
                  />
                  <textarea
                    className="border p-1"
                    value={editValues[ex.id]?.description}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          description: e.target.value,
                        },
                      })
                    }
                  />
                  <textarea
                    className="border p-1"
                    value={editValues[ex.id]?.credits}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [ex.id]: {
                          ...editValues[ex.id],
                          credits: e.target.value,
                        },
                      })
                    }
                  />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <input
                      key={i}
                      type="file"
                      onChange={(e) => {
                        const newFiles = [...editValues[ex.id].files];
                        newFiles[i] = e.target.files?.[0] || null;
                        setEditValues({
                          ...editValues,
                          [ex.id]: { ...editValues[ex.id], files: newFiles },
                        });
                      }}
                      className="p-1 border"
                    />
                  ))}
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleEditSave(ex)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-medium">{ex.title.rendered}</span>
                    <span className="ml-2 text-gray-500">
                      ({ex.acf.start_date} - {ex.acf.end_date})
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => setEditingId(ex.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(ex.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
