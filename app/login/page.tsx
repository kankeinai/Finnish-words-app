"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if credentials are admin/admin
    if (login === "admin" && password === "admin") {
      // Store in both localStorage and cookie for persistence
      localStorage.setItem("isLoggedIn", "true");
      // Set cookie with 7 days expiration
      document.cookie = "isLoggedIn=true; max-age=" + (60 * 60 * 24 * 7) + "; path=/";
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="p-4 md:p-8">
        <div className="mb-4 flex items-start justify-end">
          <Link href="/" passHref>
            <Button variant="outline">
              Back to Words
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
            Login
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Login
              </label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Enter your login"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

