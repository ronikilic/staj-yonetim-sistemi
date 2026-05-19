"use client";

import { useEffect, useState } from "react";

type WordFile = {
  id: number;
  createdAt: string;
  value: {
    originalName: string;
    savedName: string;
    type: string;
    size: number;
  };
};

export default function WordHtmlPage() {
  const [wordFiles, setWordFiles] = useState<WordFile[]>([]);
  const [html, setHtml] = useState("");

  async function fetchWordFiles() {
    const response = await fetch("/api/convert-word");
    const data = await response.json();
    setWordFiles(data);
  }

  useEffect(() => {
    fetchWordFiles();
  }, []);

  async function convertWord(fileId: number) {
    const response = await fetch("/api/convert-word", {
      method: "POST",
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

    setHtml(data.result.value.html);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Word → HTML Dönüştürme
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Yüklenen Word Dosyaları
        </h2>

        {wordFiles.length === 0 ? (
          <p className="text-gray-500">
            Henüz Word dosyası yüklenmemiş. Önce Dosya Yükleme panelinden .docx yükle.
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
              {wordFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{file.id}</td>
                  <td className="p-3">{file.value.originalName}</td>
                  <td className="p-3">
                    {Math.round(file.value.size / 1024)} KB
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => convertWord(file.id)}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                    >
                      HTML’e Dönüştür
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {html && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            HTML Önizleme
          </h2>

          <div
            className="border p-4 rounded-lg mb-6 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <h2 className="text-xl font-bold mb-4">
            HTML Kodu
          </h2>

          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg overflow-auto">
            {html}
          </pre>
        </div>
      )}
    </div>
  );
}