export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Öğrenciler</h2>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Okullar</h2>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">İşletmeler</h2>
          <p className="text-3xl font-bold mt-2">34</p>
        </div>
      </div>
    </div>
  );
}