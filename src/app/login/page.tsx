"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../components/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  function handleLogin() {
    if (email === "admin@test.com" && password === "123456") {
      router.push("/dashboard");
    } else {
      alert("Email veya şifre hatalı!");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6">
          Staj Yönetim Sistemi
        </h1>

        <div className="mb-4">
          <Input
            placeholder="Email Giriniz"
            value={email}
            onChange={setEmail}
          />
        </div>

        <div className="mb-6">
          <Input
            placeholder="Şifre Giriniz"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}