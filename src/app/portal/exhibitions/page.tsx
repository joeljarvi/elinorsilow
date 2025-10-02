"use client";
import { useState, useEffect } from "react";
import { Exhibition, AcfImage } from "../../../../lib/wordpress";

type EditExhibition = {
  title: string;
  start_date: string;
  end_date: string;
  exhibition_type?: string;
  venue: string;
  city: string;
  description: string;
  credits: string;
  files: (File | null)[];
  works: string[];
};

type ExhibitionWithImage = Exhibition & {
  image_url: string;
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
  const [works, setWorks] = useState<string[]>(Array(10).fill(""));
  const [loading, setLoading] = useState(false);

  const [exhibitions, setExhibitions] = useState<ExhibitionWithImage[]>([]);

  const [loadingExhibitions, setLoadingExhibitions] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    [key: number]: EditExhibition;
  }>({});

  useEffect(() => {
    fetchExhibitions();
  }, []);

  async function fetchExhibitions() {
    setLoadingExhibitions(true);
    const res = await fetch("/api/admin/exhibitions/list");
    const data = await res.json();
    setExhibitions(data);

    const initial: { [key: number]: EditExhibition } = {};
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
        works: Array(10).fill(""),
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

    const res = await fetch("/api/admin/exhibitions", {
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
          work_1: works[0] || "",
          work_2: works[1] || "",
          work_3: works[2] || "",
          work_4: works[3] || "",
          work_5: works[4] || "",
          work_6: works[5] || "",
          work_7: works[6] || "",
          work_8: works[7] || "",
          work_9: works[8] || "",
          work_10: works[9] || "",
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
      setWorks(Array(10).fill("")); // ✅ reset works
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

    const res = await fetch("/api/admin/exhibitions", {
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
    const res = await fetch("/api/admin/exhibitions", {
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
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
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

        {/* New exhibition file inputs with previews */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="file"
              onChange={(e) => {
                const newFiles = [...files];
                newFiles[i] = e.target.files?.[0] || null;
                setFiles(newFiles);
              }}
              className="p-2 border"
            />
            {files[i] && (
              <img
                src={URL.createObjectURL(files[i]!)}
                alt={`Preview ${i + 1}`}
                className="h-16 w-16 object-cover rounded border"
              />
            )}
          </div>
        ))}

        {Array.from({ length: 10 }).map((_, i) => (
          <input
            key={i}
            placeholder={`Work ${i + 1} ID`}
            value={works[i] || ""}
            onChange={(e) => {
              const newWorks = [...works];
              newWorks[i] = e.target.value;
              setWorks(newWorks);
            }}
            className="border p-2"
          />
        ))}

        <button
          className="bg-blue-600 text-white py-2 rounded mt-2"
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

                  {/* File inputs with previews for editing */}
                  {Array.from({ length: 10 }).map((_, i) => {
                    const existingImage = (ex.acf as any)[`image_${i + 1}`]
                      ?.url;
                    const newFile = editValues[ex.id]?.files[i];

                    return (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) => {
                            const newFiles = [...editValues[ex.id].files];
                            newFiles[i] = e.target.files?.[0] || null;
                            setEditValues({
                              ...editValues,
                              [ex.id]: {
                                ...editValues[ex.id],
                                files: newFiles,
                              },
                            });
                          }}
                          className="p-1 border"
                        />
                        {newFile ? (
                          <img
                            src={URL.createObjectURL(newFile)}
                            alt={`New preview ${i + 1}`}
                            className="h-16 w-16 object-cover rounded border"
                          />
                        ) : existingImage ? (
                          <img
                            src={existingImage}
                            alt={`Existing preview ${i + 1}`}
                            className="h-16 w-16 object-cover rounded border"
                          />
                        ) : null}
                      </div>
                    );
                  })}

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
                  <div className="flex items-center gap-2">
                    {ex.image_url && (
                      <img
                        src={ex.image_url}
                        alt={ex.title.rendered}
                        className="h-20 w-20 object-cover rounded border"
                      />
                    )}
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
