"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: spbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (spbError) {
      setError(spbError.message);
    } else {
      router.refresh();
      router.push("/"); // Redirect to home page
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg">
        <h2 className="text-center text-2xl font-bold">Login</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative mt-1">
              <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5" />
              <input
                className="w-full rounded-md border border-gray-300 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                value={email}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-md border border-gray-300 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
          </div>
          <button
            className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
            disabled={loading}
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            className="font-medium text-indigo-600 hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
