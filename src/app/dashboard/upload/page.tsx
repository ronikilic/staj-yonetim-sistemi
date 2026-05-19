"use client";

import { useEffect, useState } from "react";

type UploadedFile = {
  id: number;
  createdAt: string;
  value: {
    originalName: string;
    savedName: string;
    type: string;
    size: number;
  };
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  async function fetchFiles() {
    const response = await fetch("/api/upload");
    const data = await response.json();
    setFiles(data);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function uploadFile() {
    if (!file) {
      alert("Lütfen dosya seç");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Dosya yüklendi");

    setFile(null);

    fetchFiles();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dosya Yükleme Paneli
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Yeni Dosya Yükle
        </h2>

        <input
          type="file"
          className="border p-3 rounded-lg w-full mb-4"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        <button
          onClick={uploadFile}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          Dosya Yükle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Yüklenen Dosyalar
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Dosya Adı</th>
              <th className="p-3">Tür</th>
              <th className="p-3">Boyut</th>
            </tr>
          </thead>

          <tbody>
            {files.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{item.id}</td>

                <td className="p-3">
                  {item.value.originalName}
                </td>

                <td className="p-3">
                  {item.value.type}
                </td>

                <td className="p-3">
                  {Math.round(item.value.size / 1024)} KB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}