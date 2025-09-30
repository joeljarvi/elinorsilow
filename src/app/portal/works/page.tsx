"use client";
import { useState, useEffect } from "react";
import { Work } from "../../../../lib/wordpress";
import Image from "next/image";

type EditWork = {
  title: string;
  year: string;
  medium: string;
  exhibition: string;
  dimensions: string;
  materials: string;
  file?: File | null;
};

export default function WorksPage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [exhibition, setExhibition] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [materials, setMaterials] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [works, setWorks] = useState<Work[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ [key: number]: EditWork }>({});

  useEffect(() => {
    fetchWorks();
  }, []);

  async function fetchWorks() {
    setLoadingWorks(true);
    const res = await fetch("/api/admin/work/list");
    const data: Work[] = await res.json(); // typed

    const normalized: Work[] = data.map((w) => ({
      ...w,
      id: Number(w.id),
      image_url: w._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
    }));

    setWorks(normalized);

    // initialize edit values
    const initial: { [key: number]: EditWork } = {};
    normalized.forEach((w) => {
      initial[w.id] = {
        title: w.title.rendered,
        year: w.acf.year?.toString() || "",
        medium: w.acf.medium || "",
        exhibition: w.acf.exhibition || "",
        dimensions: w.acf.dimensions || "",
        materials: w.acf.materials || "",
        file: null,
      };
    });
    setEditValues(initial);

    setLoadingWorks(false);
  }

  async function uploadImage(file: File): Promise<number | null> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data.id ?? null;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let mediaId: number | null = null;
    if (file) mediaId = await uploadImage(file);

    const res = await fetch("/api/admin/work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        acf: { year, medium, exhibition, dimensions, materials },
        featured_media: mediaId ?? undefined,
      }),
    });

    setLoading(false);
    if (res.ok) {
      setTitle("");
      setYear("");
      setMedium("");
      setExhibition("");
      setDimensions("");
      setMaterials("");
      setFile(null);
      fetchWorks();
    } else {
      alert("Failed to create work");
    }
  }

  async function handleEditSave(work: Work) {
    const values = editValues[work.id];

    // get existing media ID if any
    let mediaId = work._embedded?.["wp:featuredmedia"]?.[0]?.id;

    // upload new image if selected
    if (values.file) {
      const uploadedId = await uploadImage(values.file);
      if (uploadedId) mediaId = uploadedId;
    }

    const res = await fetch("/api/admin/work", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: work.id,
        title: values.title,
        acf: {
          year: values.year,
          medium: values.medium,
          exhibition: values.exhibition,
          dimensions: values.dimensions,
          materials: values.materials,
        },
        featured_media: mediaId,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      // normalize image_url
      const normalized = {
        ...updated,
        image_url:
          updated._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
      };

      // update state
      setWorks((prev) => prev.map((w) => (w.id === work.id ? normalized : w)));
      setEditingId(null);
    } else {
      alert("Failed to save changes");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this work?")) return;
    const res = await fetch("/api/admin/work", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchWorks();
    else alert("Delete failed");
  }

  return (
    <div className="p-3 font-haas text-base">
      <div className="flex flex-col lg:flex-row gap-2 w-full items-start justify-start ">
        <form
          onSubmit={handleCreate}
          className="flex flex-col  gap-3 w-full lg:w-1/2 "
        >
          <h2 className="text-base uppercase mb-3">Create New Work</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Medium"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Exhibition"
            value={exhibition}
            onChange={(e) => setExhibition(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Dimensions"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Materials"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="border p-2"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className=" p-2 border"
          />
          <button
            className="bg-blue-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Work"}
          </button>
        </form>
        <div className="flex flex-col w-full lg:w-1/2 gap-3">
          <h3 className="text-base uppercase mb-3 ">Existing Works</h3>
          {loadingWorks ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-4">
              {works.map((w) => (
                <li
                  key={w.id}
                  className="border rounded p-2 flex flex-col gap-2"
                >
                  {editingId === w.id ? (
                    <>
                      <input
                        className="border p-1"
                        value={editValues[w.id]?.title}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              title: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        className="border p-1"
                        value={editValues[w.id]?.year}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              year: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        className="border p-1"
                        value={editValues[w.id]?.medium}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              medium: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        className="border p-1"
                        value={editValues[w.id]?.exhibition}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              exhibition: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        className="border p-1"
                        value={editValues[w.id]?.dimensions}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              dimensions: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        className="border p-1"
                        value={editValues[w.id]?.materials}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              materials: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [w.id]: {
                              ...editValues[w.id],
                              file: e.target.files?.[0] || null,
                            },
                          })
                        }
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleEditSave(w)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          onClick={() => setEditingId(Number(w.id))}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        {w.image_url && (
                          <Image
                            src={w.image_url}
                            width={64}
                            height={64}
                            className="object-cover rounded"
                            alt=""
                          />
                        )}
                        <div>
                          <span className="font-medium">
                            {w.title.rendered}
                          </span>
                          {w.acf.year && (
                            <span className="ml-2 text-gray-500">
                              ({w.acf.year})
                            </span>
                          )}
                          {w.acf.medium && (
                            <span className="ml-2 text-sm italic">
                              {w.acf.medium}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => setEditingId(w.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => handleDelete(w.id)}
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
      </div>
    </div>
  );
}
