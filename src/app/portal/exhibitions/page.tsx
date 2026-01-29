"use client";
import { useState, useEffect } from "react";
import {
  ExhibitionWithImage,
  normalizeExhibitions,
} from "@/app/api/admin/exhibitions/normalizeExhibitions";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ACF image structure (as returned by WordPress)
export type AcfImage = {
  id: number;
  url: string;
  alt?: string;
};

// ACF payload structure (as stored in the WP REST API)
export interface AcfPayload {
  title: string;
  start_date: string;
  end_date: string;
  exhibition_type?: string;
  venue: string;
  city: string;
  description: string;
  credits: string;
  exhibitionBgColor?: string;
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
  [key: string]: string | number | undefined;
}

// Editable exhibition (used in admin UI before saving)
export interface EditExhibition {
  title: string;
  start_date: string;
  end_date: string;
  exhibition_type?: string;
  venue: string;
  city: string;
  description: string;
  credits: string;
  exhibitionBgColor?: string;
  files: (File | null)[]; // for local uploads
  works: string[]; // corresponds to work_1...work_10
}

export default function ExhibitionsPage() {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<ExhibitionWithImage[]>([]);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    [key: number]: EditExhibition;
  }>({});
  const [exhibitionBgColors, setExhibitionBgColors] = useState<
    Record<number, string>
  >({}); // frontend-only colors

  // Form state
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

  async function loadExhibitions() {
    setLoadingExhibitions(true);
    try {
      const res = await fetch("/api/admin/exhibitions/list");
      if (!res.ok) throw new Error("Failed to fetch exhibitions");

      const data = await res.json();
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
          exhibitionBgColor: ex.acf.exhibitionBgColor || "",
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

  useEffect(() => {
    loadExhibitions();
  }, []);

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

    const uploadedImages: { [key: string]: number } = {};
    await Promise.all(
      files.map(async (file, i) => {
        if (file) {
          const uploaded = await uploadImage(file);
          if (uploaded) uploadedImages[`image_${i + 1}`] = uploaded.id;
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
          exhibitionBgColor,
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
      setExhibitionBgColors({}); // reset frontend colors
      await loadExhibitions();
    } else alert("Failed to create exhibition");
  }

  async function handleEditSave(exhibition: ExhibitionWithImage) {
    const values = editValues[exhibition.id];
    if (!values) return;
    let mediaId: number | undefined = exhibition.featured_media;

    // Check embedded media
    const embeddedMedia = exhibition._embedded?.["wp:featuredmedia"];
    if (Array.isArray(embeddedMedia) && embeddedMedia.length > 0) {
      mediaId = embeddedMedia[0].id;
    }

    // Upload new image if selected
    const firstFile = values.files[0];
    if (firstFile) {
      const uploadedId = await uploadImage(firstFile);
      if (uploadedId) mediaId = uploadedId;
    }

    // ✅ Prepare ACF payload
    const acfPayload: AcfPayload = {
      title: values.title,
      start_date: values.start_date,
      end_date: values.end_date,
      exhibition_type: values.exhibition_type,
      venue: values.venue,
      city: values.city,
      description: values.description,
      credits: values.credits,
      exhibitionBgColor: values.exhibitionBgColor,
      ...Object.fromEntries(
        values.works.map((work, i) => [`work_${i + 1}`, work || ""])
      ),
    };

    // ✅ Send update request
    const res = await fetch("/api/admin/exhibition", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: exhibition.id,
        title: values.title,
        acf: acfPayload,
        featured_media: mediaId,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      const normalized: ExhibitionWithImage = {
        ...updated,
        image_url:
          updated._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
      };

      setExhibitions((prev) =>
        prev.map((exh) => (exh.id === exhibition.id ? normalized : exh))
      );
      setEditingId(null);
    } else {
      alert("Failed to save exhibition");
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/exhibitions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) console.error(await res.text());
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className=" font-pressura text-base flex flex-col lg:flex-row gap-[0.25rem] w-full items-start justify-start p-[0.25rem] ">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-[0.5rem] w-full lg:w-1/2"
      >
        <h2 className="text-base uppercase mb-[0.5rem]">
          Create New Exhibition
        </h2>
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
        <input
          type="color"
          value={editValues[editingId]?.exhibitionBgColor || "#ffffff"} // default color
          onChange={(e) => {
            if (editingId === null) return;
            setEditValues({
              ...editValues,
              [editingId]: {
                ...editValues[editingId],
                exhibitionBgColor: e.target.value, // update state
              },
            });
          }}
          className="border p-1 w-12 h-10 rounded"
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
              <Image
                src={URL.createObjectURL(files[i]!)}
                alt={`Preview ${i + 1}`}
                width={64}
                height={64}
                className="object-cover rounded border"
                unoptimized
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
      <div className="flex flex-col items-start justify-start w-full lg:w-1/2 gap-[0.5rem]">
        <h3 className="text-base uppercase mb-[0.5rem]">
          Existing Exhibitions
        </h3>
        {loadingExhibitions ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {exhibitions.map((ex) => (
              <li
                key={ex.id}
                className="border rounded p-2 flex flex-col gap-2"
                style={{ backgroundColor: exhibitionBgColors[ex.id] || "#fff" }}
              >
                <div className="flex items-center gap-2">
                  {ex.image_url && (
                    <Image
                      src={ex.image_url}
                      alt={ex.title.rendered}
                      width={80}
                      height={80}
                      className="object-cover rounded border"
                    />
                  )}
                  <span className="font-medium">{ex.title.rendered}</span>
                  <span className="ml-2 text-gray-500">
                    ({ex.acf.start_date} - {ex.acf.end_date})
                  </span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditingId(ex.id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(ex.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
