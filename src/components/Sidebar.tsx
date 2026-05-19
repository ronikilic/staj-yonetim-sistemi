import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="space-y-3">
        <Link href="/dashboard" className="block hover:bg-gray-700 p-3 rounded-lg">
          Dashboard
        </Link>

        <Link href="/dashboard/students" className="block hover:bg-gray-700 p-3 rounded-lg">
          Öğrenciler
        </Link>

        <Link href="/dashboard/schools" className="block hover:bg-gray-700 p-3 rounded-lg">
          Okullar
        </Link>

        <Link href="/dashboard/companies" className="block hover:bg-gray-700 p-3 rounded-lg">
          İşletmeler
        </Link>

        <Link href="/dashboard/permissions" className="block hover:bg-gray-700 p-3 rounded-lg">
          Yetkiler
        </Link>
      </nav>
    </aside>
  );
}