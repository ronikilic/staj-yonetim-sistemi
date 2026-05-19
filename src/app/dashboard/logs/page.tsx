"use client";

import { useEffect, useState } from "react";

type Log = {
  id: number;
  createdAt: string;
  value: {
    action: string;
    entity: string;
    status: string;
    message: string;
  };
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  async function fetchLogs() {
    const response = await fetch("/api/logs");
    const data = await response.json();
    setLogs(data);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sistem Logları</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">İşlem</th>
              <th className="p-3">Varlık</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Mesaj</th>
              <th className="p-3">Tarih</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.value.action}</td>
                <td className="p-3">{log.value.entity}</td>
                <td className="p-3">{log.value.status}</td>
                <td className="p-3">{log.value.message}</td>
                <td className="p-3">
                  {new Date(log.createdAt).toLocaleString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
