"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          email: form.email,
          password: form.password,
        },
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        router.push("/");
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
    { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
    { name: "username", label: "Username", type: "text", placeholder: "johndoe" },
    { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center text-3xl font-black tracking-tight mb-2">
            <svg width="36" height="36" viewBox="0 0 128 128" role="img" aria-label="NeGo Logo Symbol" className="shrink-0"><g fill="#F4A100"><path d="M18 22 L64 10 L64 84 Q64 87 62 89 L34 114 Q32.5 115.5 31 115.5 Q28.5 115.5 28.5 112.5 L28.5 46 L18 35 Z"></path><path d="M74 22 L102 12 L112 22 L112 84 Q112 86.5 110.5 88.5 L82 116 L74 123 Z"></path><rect x="66" y="40" width="8" height="22" rx="2" transform="skewX(-15)"></rect></g></svg>
            <span className="text-gray-900 dark:text-white">Ne</span>
            <span className="text-blue-600 dark:text-blue-500">Go</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Create Account</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Join NeGo and connect with the world
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.slice(0, 2).map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            ))}
          </div>

          {fields.slice(2).map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
