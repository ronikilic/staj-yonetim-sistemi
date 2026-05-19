"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  createdAt: string;
  value: {
    name: string;
    email: string;
    department: string;
  };
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchStudents() {
    const response = await fetch("/api/students");
    const data = await response.json();

    setStudents(data);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function saveStudent() {
    if (!name || !email || !department) {
      alert("Tüm alanları doldur");
      return;
    }

    if (editingId) {
      await fetch("/api/students", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name,
          email,
          department,
        }),
      });

      setEditingId(null);
    } else {
      await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          department,
        }),
      });
    }

    setName("");
    setEmail("");
    setDepartment("");

    fetchStudents();
  }

  async function deleteStudent(id: number) {
    await fetch("/api/students", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    fetchStudents();
  }

  function editStudent(student: Student) {
    setEditingId(student.id);

    setName(student.value.name);
    setEmail(student.value.email);
    setDepartment(student.value.department);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Öğrenci CRUD Paneli
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Öğrenci Güncelle" : "Yeni Öğrenci Ekle"}
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Bölüm"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <button
          onClick={saveStudent}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Güncelle" : "Öğrenci Ekle"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Email</th>
              <th className="p-3">Bölüm</th>
              <th className="p-3">İşlem</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{student.id}</td>

                <td className="p-3">
                  {student.value.name}
                </td>

                <td className="p-3">
                  {student.value.email}
                </td>

                <td className="p-3">
                  {student.value.department}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => editStudent(student)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() =>
                      deleteStudent(student.id)
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