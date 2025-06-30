"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4] px-4">
      <div className="bg-white flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden max-w-[900px] w-full">
        {/* Left - Illustration */}
        <div className="bg-[#f9f9f9] p-6 md:p-10 w-full md:w-1/2 flex items-center justify-center">
          <Image
            src="/loginImage.png"
            alt="Login Illustration"
            width={250}
            height={250}
            className="w-[200px] md:w-[250px] lg:w-[300px] h-auto"
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              Welcome Back
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-black text-sm">Email</label>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-black text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4 sm:gap-0">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login →"}
              </button>
              <a href="#" className="text-black hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
