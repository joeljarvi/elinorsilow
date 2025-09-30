"use client";
import { useState, useEffect } from "react";

type Education = {
  id: number;
  acf: { title: string; start_year: string; end_year: string; city: string };
};

type Grant = {
  id: number;
  acf: { title: string; year: string };
};

type Biography = {
  id: string;
  acf: { bio: string };
};

export default function InformationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [biography, setBiography] = useState<Biography | null>(null);

  const [eduForm, setEduForm] = useState({
    title: "",
    start_year: "",
    end_year: "",
    city: "",
  });
  const [grantForm, setGrantForm] = useState({ title: "", year: "" });
  const [bioForm, setBioForm] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  // --- SAFELY PARSE JSON ---
  async function safeJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- FETCH ALL ---
  async function fetchAll() {
    const [eduRes, grantRes, bioRes] = await Promise.all([
      fetch("/api/admin/information/education"),
      fetch("/api/admin/information/grant"),
      fetch("/api/admin/information/biography"),
    ]);

    const [eduData, grantData, bioData] = await Promise.all([
      safeJson(eduRes) || [],
      safeJson(grantRes) || [],
      safeJson(bioRes) || null,
    ]);

    setEducations(Array.isArray(eduData) ? eduData : []);
    setGrants(Array.isArray(grantData) ? grantData : []);
    setBiography(bioData);
    if (bioData?.acf?.bio) setBioForm(bioData.acf.bio);
  }

  // --- CREATE HANDLERS ---
  async function addEducation(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/information/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acf: eduForm }),
    });
    if (res.ok) {
      setEduForm({ title: "", start_year: "", end_year: "", city: "" });
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

  async function deleteGrant(id: number) {
    if (!confirm("Delete this grant?")) return;
    await fetch("/api/admin/information/grant", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  }

  return (
    <div className=" font-haas text-base space-y-12 z-0">
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

      {/* EDUCATION */}
      <section className="w-full">
        <h2 className="uppercase mb-2">Education</h2>
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <form
            onSubmit={addEducation}
            className="flex flex-col gap-2 w-full lg:w-1/2"
          >
            <input
              placeholder="Title"
              value={eduForm.title}
              onChange={(e) =>
                setEduForm({ ...eduForm, title: e.target.value })
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

          <ul className=" flex flex-col items-start justify-start w-full lg:w-1/2">
            {educations.map((edu) => (
              <li
                key={edu.id}
                className="flex justify-between border p-2 rounded w-full"
              >
                <span>
                  {edu.acf.title}, {edu.acf.start_year} - {edu.acf.end_year},{" "}
                  {edu.acf.city}
                </span>
                <button
                  onClick={() => deleteEducation(edu.id)}
                  className="bg-red-600 text-white px-2 rounded"
                >
                  Delete
                </button>
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
                className="flex justify-between border p-2 rounded"
              >
                <span>
                  {grant.acf.title} ({grant.acf.year})
                </span>
                <button
                  onClick={() => deleteGrant(grant.id)}
                  className="bg-red-600 text-white px-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
