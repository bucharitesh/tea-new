"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const res: any = await fetch("/api/seller-signup", {
        method: "POST",
        headers: {
          "Content-Type": "appplication/json",
        },
        body: JSON.stringify({
          user_id: userId,
          password: password,
        }),
      });

      const data = await res.json();
      
      console.log("res", data);
      if (!res?.error) {
        toast.success("success!");
        // router.push("/"); // Redirect to dashboard or another page
      } else {
        setError("Invalid email or password!");
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      setError("Failed to log in. Please try again.");
      console.log("error", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-gray-600"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-600"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
