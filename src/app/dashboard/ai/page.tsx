"use client";

import { useEffect, useState } from "react";

type TxtFile = {
  id: number;
  createdAt: string;
  value: {
    originalName: string;
    savedName: string;
    type: string;
    size: number;
  };
};

export default function AiPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [txtFiles, setTxtFiles] = useState<TxtFile[]>([]);

  async function fetchTxtFiles() {
    const response = await fetch("/api/ai");
    const data = await response.json();
    setTxtFiles(data);
  }

  useEffect(() => {
    fetchTxtFiles();
  }, []);

  async function analyzePrompt() {
    if (!prompt) {
      alert("Lütfen prompt yaz");
      return;
    }

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setResult(data.result);
  }

  async function analyzeTxtFile(fileId: number) {
    const response = await fetch("/api/ai", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setResult(data.result);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Yapay Zeka Analiz Paneli
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Manuel Prompt Analizi
        </h2>

        <textarea
          className="border p-3 rounded-lg w-full h-40 mb-4"
          placeholder="Örneğin: Bana öğrenci takip sistemi için HTML sayfası oluştur..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={analyzePrompt}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          Analiz Et
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Yüklenen TXT Dosyalarını Analiz Et
        </h2>

        {txtFiles.length === 0 ? (
          <p className="text-gray-500">
            Henüz TXT dosyası yüklenmemiş.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Dosya Adı</th>
                <th className="p-3">Boyut</th>
                <th className="p-3">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {txtFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{file.id}</td>
                  <td className="p-3">{file.value.originalName}</td>
                  <td className="p-3">
                    {Math.round(file.value.size / 1024)} KB
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => analyzeTxtFile(file.id)}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                    >
                      TXT Analiz Et
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Sonuç
          </h2>

          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}