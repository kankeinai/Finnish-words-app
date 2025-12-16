"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PracticePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      const localStorageLogin = localStorage.getItem("isLoggedIn") === "true";
      const cookieLogin = document.cookie.split("; ").find(row => row.startsWith("isLoggedIn="))?.split("=")[1] === "true";
      return localStorageLogin || cookieLogin;
    };
    
    const loggedIn = checkLoginStatus();
    setIsLoggedIn(loggedIn);
    
    // Sync cache if one is set but not the other
    if (loggedIn) {
      localStorage.setItem("isLoggedIn", "true");
      document.cookie = "isLoggedIn=true; max-age=" + (60 * 60 * 24 * 7) + "; path=/";
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isLoggedIn) {
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
          <div className="text-center">
            <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              403
            </h1>
            <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
              Access Denied
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              You don't have access to this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Practice Mode
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Practice page - coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

