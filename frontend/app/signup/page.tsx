"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password , name }),
    });

    if (!res.ok) {
      setError("Signup failed. Try again.");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4]">
      <div className="bg-white flex rounded-xl shadow-lg overflow-hidden w-[900px]">
        {/* Left - Illustration */}
        <div className="bg-[#f9f9f9] p-10 w-1/2 flex items-center justify-center">
          <Image
            src="/loginImage.png"
            alt="Signup Illustration"
            width={300}
            height={300}
          />
        </div>

        {/* Right - Signup Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-gray-600 text-sm">Full Name</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Create Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Confirm Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition w-full cursor-pointer"
            >
              SignUp →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
