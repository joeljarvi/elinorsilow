"use client";
import { useState, useEffect } from "react";
import {
  Exhibition,
  AcfImage,
  getAllExhibitions,
} from "../../../../lib/wordpress";
import {
  ExhibitionWithImage,
  normalizeExhibitions,
} from "@/app/api/admin/exhibitions/normalizeExhibitions";

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

  // Fetch and normalize
  useEffect(() => {
    async function loadExhibitions() {
      setLoadingExhibitions(true);
      try {
        const data = await getAllExhibitions();
        const normalized = normalizeExhibitions(data);
        setExhibitions(normalized);

        const initial: { [key: number]: EditExhibition } = {};
        normalized.forEach((ex) => {
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
            works: [
              ex.acf.work_1 || "",
              ex.acf.work_2 || "",
              ex.acf.work_3 || "",
              ex.acf.work_4 || "",
              ex.acf.work_5 || "",
              ex.acf.work_6 || "",
              ex.acf.work_7 || "",
              ex.acf.work_8 || "",
              ex.acf.work_9 || "",
              ex.acf.work_10 || "",
            ],
          };
        });
        setEditValues(initial);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingExhibitions(false);
      }
    }
    loadExhibitions();
  }, []);

  // Upload single file to WP media
  async function uploadImage(file: File): Promise<AcfImage | null> {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Media upload failed", res.statusText);
      return null;
    }

    const data = await res.json();
    if (!data || !data.id || !data.source_url) return null;

    return { id: data.id, url: data.source_url };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // upload all files first
    const uploadedImages: { [key: string]: AcfImage } = {};
    await Promise.all(
      files.map(
        (file, i) =>
          file &&
          uploadImage(file).then((u) => {
            if (u) uploadedImages[`image_${i + 1}`] = u;
          })
      )
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
      setWorks(Array(10).fill(""));
      const refreshed = (await getAllExhibitions()) as ExhibitionWithImage[];
      setExhibitions(refreshed);
    } else alert("Failed to create exhibition");
  }

  async function handleEditSave(ex: Exhibition) {
    const values = editValues[ex.id];
    const uploadedImages: { [key: string]: AcfImage } = {};

    await Promise.all(
      values.files.map(async (file, i) => {
        if (file) {
          const uploaded = await uploadImage(file);
          if (uploaded) uploadedImages[`image_${i + 1}`] = uploaded;
        }
      })
    );

    const acfPayload = {
      ...values,
      ...uploadedImages,
    };

    // remove 'files' property, WP can't handle it
    delete acfPayload.files;

    const res = await fetch("/api/admin/exhibitions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: ex.id,
        title: values.title,
        acf: acfPayload,
      }),
    });

    if (res.ok) {
      const data = await getAllExhibitions();
      const normalized = normalizeExhibitions(data);
      setExhibitions(normalized);
      setEditingId(null);
    } else {
      console.error(await res.text());
      alert("Failed to save changes");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this exhibition?")) return;
    const res = await fetch("/api/admin/exhibitions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const refreshed = (await getAllExhibitions()) as ExhibitionWithImage[];
      setExhibitions(refreshed);
    } else alert("Delete failed");
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
                  {/* Inline edit inputs */}
                  {Object.entries(editValues[ex.id]).map(([key, value]) => {
                    if (key === "files" || key === "works") return null;
                    return (
                      <input
                        key={key}
                        value={value as string}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [ex.id]: {
                              ...editValues[ex.id],
                              [key]: e.target.value,
                            },
                          })
                        }
                        className="border p-1"
                      />
                    );
                  })}
                  {/* File inputs for editing */}
                  {Array.from({ length: 10 }).map((_, i) => {
                    const existingImage = ex.acf[
                      `image_${i + 1}` as keyof typeof ex.acf
                    ] as AcfImage | undefined;
                    const newFile = editValues[ex.id].files[i];
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
                        ) : existingImage?.url ? (
                          <img
                            src={existingImage.url}
                            alt={
                              existingImage.alt || `Existing preview ${i + 1}`
                            }
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
