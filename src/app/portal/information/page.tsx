"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Exhibition_list,
  Education,
  Grant,
  Biography,
} from "../../../../lib/wordpress";

interface ExhibitionForm {
  title: string;
  year: string;
  exhibition_type: string;
  venue: string;
  city: string;
  description: string;
}

export default function InformationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [biography, setBiography] = useState<Biography | null>(null);
  const [exhibitionList, setExhibitionList] = useState<Exhibition_list[]>([]);

  const [eduForm, setEduForm] = useState({
    school: "",
    start_year: "",
    end_year: "",
    city: "",
  });
  const [grantForm, setGrantForm] = useState({ title: "", year: "" });
  const [bioForm, setBioForm] = useState("");
  const [exhibitionsForm, setExhibitionsForm] = useState<ExhibitionForm>({
    title: "",
    year: "",
    exhibition_type: "",
    venue: "",
    city: "",
    description: "",
  });

  // Editing states
  const [editingEduId, setEditingEduId] = useState<number | null>(null);
  const [editingGrantId, setEditingGrantId] = useState<number | null>(null);

  const [editEduValues, setEditEduValues] = useState(eduForm);
  const [editGrantValues, setEditGrantValues] = useState(grantForm);
  const [editingExhibitionId, setEditingExhibitionId] = useState<number | null>(
    null
  );
  const [editExhibitionValues, setEditExhibitionValues] =
    useState<ExhibitionForm>(exhibitionsForm);

  async function safeJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const fetchAll = useCallback(async () => {
    const [eduRes, grantRes, bioRes, exhibitionRes] = await Promise.all([
      fetch("/api/admin/information/education"),
      fetch("/api/admin/information/grant"),
      fetch("/api/admin/information/biography"),
      fetch("/api/admin/information/exhibition_list"),
    ]);

    const [eduData, grantData, bioData, exhibitionData] = await Promise.all([
      safeJson(eduRes) || [],
      safeJson(grantRes) || [],

      safeJson(bioRes) || null,
      safeJson(exhibitionRes) || [],
    ]);

    setEducations(Array.isArray(eduData) ? eduData : []);
    setGrants(Array.isArray(grantData) ? grantData : []);
    setExhibitionList(Array.isArray(exhibitionData) ? exhibitionData : []);
    setBiography(bioData);
    if (bioData?.acf?.bio) setBioForm(bioData.acf.bio);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // --- CREATE HANDLERS ---
  async function addEducation(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/information/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: eduForm.school || "Education",
        acf: eduForm,
      }),
    });
    if (res.ok) {
      setEduForm({ school: "", start_year: "", end_year: "", city: "" });
      fetchAll();
    }
  }

  async function addGrant(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/information/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acf: grantForm }),
    });
    if (res.ok) {
      setGrantForm({ title: "", year: "" });
      fetchAll();
    }
  }

  async function addExhibitionList(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/information/exhibition_list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: exhibitionsForm.title,
        year: exhibitionsForm.year,
        exhibition_type: exhibitionsForm.exhibition_type,
        venue: exhibitionsForm.venue,
        city: exhibitionsForm.city,
        description: exhibitionsForm.description,
      }),
    });
    if (res.ok) {
      setExhibitionsForm({
        title: "",
        year: "",
        exhibition_type: "",
        venue: "",
        city: "",
        description: "",
      });
      fetchAll();
    }
  }

  async function saveBiography(e: React.FormEvent) {
    e.preventDefault();
    if (!biography) return;
    const res = await fetch("/api/admin/information/biography", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: biography.id, acf: { bio: bioForm } }),
    });
    if (res.ok) fetchAll();
  }

  // --- DELETE HANDLERS ---
  async function deleteEducation(id: number) {
    if (!confirm("Delete this education?")) return;
    await fetch("/api/admin/information/education", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  }

  async function deleteExhibitionList(id: number) {
    if (!confirm("Delete this Exhibition?")) return;
    await fetch("/api/admin/information/exhibition_list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  }

  async function deleteGrant(id: number) {
    if (!confirm("Delete this grant?")) return;
    await fetch("/api/admin/information/grant", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  }

  // --- EDIT HANDLERS ---
  async function saveEducation(id: number) {
    const res = await fetch("/api/admin/information/education", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, acf: editEduValues }),
    });
    if (res.ok) {
      setEditingEduId(null);
      fetchAll();
    }
  }

  async function saveGrant(id: number) {
    const res = await fetch("/api/admin/information/grant", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, acf: editGrantValues }),
    });
    if (res.ok) {
      setEditingGrantId(null);
      fetchAll();
    }
  }

  async function saveExhibitionList(id: number) {
    const res = await fetch("/api/admin/information/exhibition_list", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: editExhibitionValues.title,
        year: editExhibitionValues.year,
        exhibition_type: editExhibitionValues.exhibition_type,
        venue: editExhibitionValues.venue,
        city: editExhibitionValues.city,
        description: editExhibitionValues.description,
      }),
    });

    if (res.ok) {
      setEditingExhibitionId(null);
      fetchAll();
    }
  }

  return (
    <div className="font-haas text-base space-y-12 z-0">
      {/* BIOGRAPHY */}
      <section>
        <h2 className="uppercase mb-2">Biography</h2>
        <form onSubmit={saveBiography} className="flex flex-col gap-2 max-w-lg">
          <textarea
            value={bioForm}
            onChange={(e) => setBioForm(e.target.value)}
            className="border p-2"
            rows={5}
          />
          <button className="bg-blue-600 text-white py-1 rounded">
            Save Biography
          </button>
        </form>
      </section>

      {/* EXHIBITION LIST */}
      <ul className="flex flex-col w-full lg:w-1/2">
        {exhibitionList.map((ex) => (
          <li
            key={ex.id}
            className="flex flex-col md:flex-row justify-between border p-2 rounded gap-2"
          >
            {editingExhibitionId === ex.id ? (
              <>
                <input
                  value={editExhibitionValues.title}
                  onChange={(e) =>
                    setEditExhibitionValues({
                      ...editExhibitionValues,
                      title: e.target.value,
                    })
                  }
                  className="border p-1 w-full md:w-1/6"
                />
                <input
                  value={editExhibitionValues.year}
                  onChange={(e) =>
                    setEditExhibitionValues({
                      ...editExhibitionValues,
                      year: e.target.value,
                    })
                  }
                  className="border p-1 w-full md:w-1/6"
                />
                <input
                  value={editExhibitionValues.exhibition_type}
                  onChange={(e) =>
                    setEditExhibitionValues({
                      ...editExhibitionValues,
                      exhibition_type: e.target.value,
                    })
                  }
                  className="border p-1 w-full md:w-1/6"
                />
                <input
                  value={editExhibitionValues.venue}
                  onChange={(e) =>
                    setEditExhibitionValues({
                      ...editExhibitionValues,
                      venue: e.target.value,
                    })
                  }
                  className="border p-1 w-full md:w-1/6"
                />
                <input
                  value={editExhibitionValues.city}
                  onChange={(e) =>
                    setEditExhibitionValues({
                      ...editExhibitionValues,
                      city: e.target.value,
                    })
                  }
                  className="border p-1 w-full md:w-1/6"
                />
                <textarea
                  value={editExhibitionValues.description}
                  onChange={(e) =>
                    setEditExhibitionValues({
                      ...editExhibitionValues,
                      description: e.target.value,
                    })
                  }
                  className="border p-1 w-full md:w-1/6"
                  rows={2}
                />
                <div className="flex gap-1 mt-2 md:mt-0">
                  <button
                    onClick={() => saveExhibitionList(ex.id)}
                    className="bg-green-600 text-white px-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingExhibitionId(null)}
                    className="bg-gray-400 text-white px-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>
                  <strong>{ex.title.rendered}</strong> ({ex.acf.year}) —{" "}
                  {ex.acf.city}, {ex.acf.venue}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingExhibitionId(ex.id);
                      setEditExhibitionValues({
                        ...(ex.acf as ExhibitionForm),
                      });
                    }}
                    className="bg-yellow-500 text-white px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExhibitionList(ex.id)}
                    className="bg-red-600 text-white px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* EDUCATION */}
      <section className="w-full">
        <h2 className="uppercase mb-2">Education</h2>
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <form
            onSubmit={addEducation}
            className="flex flex-col gap-2 w-full lg:w-1/2"
          >
            <input
              placeholder="School"
              value={eduForm.school}
              onChange={(e) =>
                setEduForm({ ...eduForm, school: e.target.value })
              }
              className="border p-2"
            />
            <input
              placeholder="Start Year"
              value={eduForm.start_year}
              onChange={(e) =>
                setEduForm({ ...eduForm, start_year: e.target.value })
              }
              className="border p-2"
            />
            <input
              placeholder="End Year"
              value={eduForm.end_year}
              onChange={(e) =>
                setEduForm({ ...eduForm, end_year: e.target.value })
              }
              className="border p-2"
            />
            <input
              placeholder="City"
              value={eduForm.city}
              onChange={(e) => setEduForm({ ...eduForm, city: e.target.value })}
              className="border p-2"
            />
            <button className="bg-blue-600 text-white py-1 rounded">
              Add Education
            </button>
          </form>

          <ul className="flex flex-col items-start justify-start w-full lg:w-1/2">
            {educations.map((edu) => (
              <li
                key={edu.id}
                className="flex justify-between border p-2 rounded w-full gap-2"
              >
                {editingEduId === edu.id ? (
                  <>
                    <input
                      value={editEduValues.school}
                      onChange={(e) =>
                        setEditEduValues({
                          ...editEduValues,
                          school: e.target.value,
                        })
                      }
                      className="border p-1 w-1/4"
                    />
                    <input
                      value={editEduValues.start_year}
                      onChange={(e) =>
                        setEditEduValues({
                          ...editEduValues,
                          start_year: e.target.value,
                        })
                      }
                      className="border p-1 w-1/4"
                    />
                    <input
                      value={editEduValues.end_year}
                      onChange={(e) =>
                        setEditEduValues({
                          ...editEduValues,
                          end_year: e.target.value,
                        })
                      }
                      className="border p-1 w-1/4"
                    />
                    <input
                      value={editEduValues.city}
                      onChange={(e) =>
                        setEditEduValues({
                          ...editEduValues,
                          city: e.target.value,
                        })
                      }
                      className="border p-1 w-1/4"
                    />
                    <button
                      onClick={() => saveEducation(edu.id)}
                      className="bg-green-600 text-white px-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingEduId(null)}
                      className="bg-gray-400 text-white px-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      {edu.acf.school}, {edu.acf.start_year} -{" "}
                      {edu.acf.end_year}, {edu.acf.city}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingEduId(edu.id);
                          setEditEduValues({ ...edu.acf });
                        }}
                        className="bg-yellow-500 text-white px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="bg-red-600 text-white px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GRANTS */}
      <section className="w-full">
        <h2 className="uppercase mb-2">Grants</h2>
        <div className="flex flex-col lg:flex-row gap-3 w-full justify-start items-start">
          <form
            onSubmit={addGrant}
            className="flex flex-col gap-2 w-full lg:w-1/2"
          >
            <input
              placeholder="Title"
              value={grantForm.title}
              onChange={(e) =>
                setGrantForm({ ...grantForm, title: e.target.value })
              }
              className="border p-2"
            />
            <input
              placeholder="Year"
              value={grantForm.year}
              onChange={(e) =>
                setGrantForm({ ...grantForm, year: e.target.value })
              }
              className="border p-2"
            />
            <button className="bg-blue-600 text-white py-1 rounded">
              Add Grant
            </button>
          </form>
          <ul className="flex flex-col w-full lg:w-1/2">
            {grants.map((grant) => (
              <li
                key={grant.id}
                className="flex justify-between border p-2 rounded gap-2"
              >
                {editingGrantId === grant.id ? (
                  <>
                    <input
                      value={editGrantValues.title}
                      onChange={(e) =>
                        setEditGrantValues({
                          ...editGrantValues,
                          title: e.target.value,
                        })
                      }
                      className="border p-1 w-1/2"
                    />
                    <input
                      value={editGrantValues.year}
                      onChange={(e) =>
                        setEditGrantValues({
                          ...editGrantValues,
                          year: e.target.value,
                        })
                      }
                      className="border p-1 w-1/4"
                    />
                    <button
                      onClick={() => saveGrant(grant.id)}
                      className="bg-green-600 text-white px-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingGrantId(null)}
                      className="bg-gray-400 text-white px-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      {grant.acf.title} ({grant.acf.year})
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingGrantId(grant.id);
                          setEditGrantValues({ ...grant.acf });
                        }}
                        className="bg-yellow-500 text-white px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGrant(grant.id)}
                        className="bg-red-600 text-white px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
