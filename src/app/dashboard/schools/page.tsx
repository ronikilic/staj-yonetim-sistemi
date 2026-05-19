"use client";

import { useEffect, useState } from "react";

type School = {
  id: number;
  createdAt: string;
  value: {
    name: string;
    city: string;
    type: string;
  };
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchSchools() {
    const response = await fetch("/api/schools");
    const data = await response.json();

    setSchools(data);
  }

  useEffect(() => {
    fetchSchools();
  }, []);

  async function saveSchool() {
    if (!name || !city || !type) {
      alert("Tüm alanları doldur");
      return;
    }

    if (editingId) {
      await fetch("/api/schools", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name,
          city,
          type,
        }),
      });

      setEditingId(null);
    } else {
      await fetch("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          city,
          type,
        }),
      });
    }

    setName("");
    setCity("");
    setType("");

    fetchSchools();
  }

  async function deleteSchool(id: number) {
    await fetch("/api/schools", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    fetchSchools();
  }

  function editSchool(school: School) {
    setEditingId(school.id);

    setName(school.value.name);
    setCity(school.value.city);
    setType(school.value.type);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Okul CRUD Paneli
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Okul Güncelle" : "Yeni Okul Ekle"}
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="Okul Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Şehir"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Tür"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <button
          onClick={saveSchool}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Güncelle" : "Okul Ekle"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Okul Adı</th>
              <th className="p-3">Şehir</th>
              <th className="p-3">Tür</th>
              <th className="p-3">İşlem</th>
            </tr>
          </thead>

          <tbody>
            {schools.map((school) => (
              <tr
                key={school.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{school.id}</td>

                <td className="p-3">
                  {school.value.name}
                </td>

                <td className="p-3">
                  {school.value.city}
                </td>

                <td className="p-3">
                  {school.value.type}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => editSchool(school)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() =>
                      deleteSchool(school.id)
                    }
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}