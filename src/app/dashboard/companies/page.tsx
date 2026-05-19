"use client";

import { useEffect, useState } from "react";

type Company = {
  id: number;
  createdAt: string;
  value: {
    name: string;
    sector: string;
    city: string;
  };
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchCompanies() {
    const response = await fetch("/api/companies");
    const data = await response.json();

    setCompanies(data);
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function saveCompany() {
    if (!name || !sector || !city) {
      alert("Tüm alanları doldur");
      return;
    }

    if (editingId) {
      await fetch("/api/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name,
          sector,
          city,
        }),
      });

      setEditingId(null);
    } else {
      await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sector,
          city,
        }),
      });
    }

    setName("");
    setSector("");
    setCity("");

    fetchCompanies();
  }

  async function deleteCompany(id: number) {
    await fetch("/api/companies", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    fetchCompanies();
  }

  function editCompany(company: Company) {
    setEditingId(company.id);

    setName(company.value.name);
    setSector(company.value.sector);
    setCity(company.value.city);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        İşletme CRUD Paneli
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "İşletme Güncelle" : "Yeni İşletme Ekle"}
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="İşletme Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Sektör"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Şehir"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <button
          onClick={saveCompany}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Güncelle" : "İşletme Ekle"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">İşletme</th>
              <th className="p-3">Sektör</th>
              <th className="p-3">Şehir</th>
              <th className="p-3">İşlem</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{company.id}</td>

                <td className="p-3">
                  {company.value.name}
                </td>

                <td className="p-3">
                  {company.value.sector}
                </td>

                <td className="p-3">
                  {company.value.city}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => editCompany(company)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() =>
                      deleteCompany(company.id)
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