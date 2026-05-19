"use client";

import { useState } from "react";

type Permission = {
  group: string;
  pages: string[];
  crud: string[];
  fileUpload: boolean;
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      group: "Öğrenci",
      pages: ["Öğrenci Listesi", "Dosya Yükleme"],
      crud: ["Create", "Read"],
      fileUpload: true,
    },
    {
      group: "Okul",
      pages: ["Öğrenci Listesi", "Okul Listesi"],
      crud: ["Read", "Update"],
      fileUpload: true,
    },
    {
      group: "İşletme",
      pages: ["İşletme Listesi"],
      crud: ["Read"],
      fileUpload: false,
    },
  ]);

  const allPages = ["Öğrenci Listesi", "Okul Listesi", "İşletme Listesi", "Dosya Yükleme"];
  const allCrud = ["Create", "Read", "Update", "Delete"];

  function togglePage(group: string, page: string) {
    setPermissions((prev) =>
      prev.map((item) =>
        item.group === group
          ? {
              ...item,
              pages: item.pages.includes(page)
                ? item.pages.filter((p) => p !== page)
                : [...item.pages, page],
            }
          : item
      )
    );
  }

  function toggleCrud(group: string, crud: string) {
    setPermissions((prev) =>
      prev.map((item) =>
        item.group === group
          ? {
              ...item,
              crud: item.crud.includes(crud)
                ? item.crud.filter((c) => c !== crud)
                : [...item.crud, crud],
            }
          : item
      )
    );
  }

  function toggleFileUpload(group: string) {
    setPermissions((prev) =>
      prev.map((item) =>
        item.group === group
          ? { ...item, fileUpload: !item.fileUpload }
          : item
      )
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Supervisor Yetki Paneli
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {permissions.map((item) => (
          <div key={item.group} className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">{item.group}</h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Ekran Yetkileri</h3>

              <div className="grid grid-cols-2 gap-3">
                {allPages.map((page) => (
                  <label key={page} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.pages.includes(page)}
                      onChange={() => togglePage(item.group, page)}
                    />
                    {page}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">CRUD Yetkileri</h3>

              <div className="grid grid-cols-4 gap-3">
                {allCrud.map((crud) => (
                  <label key={crud} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.crud.includes(crud)}
                      onChange={() => toggleCrud(item.group, crud)}
                    />
                    {crud}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Dosya Yükleme</h3>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.fileUpload}
                  onChange={() => toggleFileUpload(item.group)}
                />
                Dosya yükleme izni
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}