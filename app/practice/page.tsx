"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { topics } from "../config/topics";

export default function PracticePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handlePracticeCards = () => {
    // Store selected topics in localStorage (empty array means all topics)
    localStorage.setItem("practiceTopics", JSON.stringify(selectedTopics));
    router.push("/practice/cards");
  };

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

  const handleLogout = () => {
    // Clear from both localStorage and cookies
    localStorage.removeItem("isLoggedIn");
    document.cookie = "isLoggedIn=; max-age=0; path=/";
    setIsLoggedIn(false);
    window.location.href = "/";
  };

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
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900">
        <Sidebar>
          <SidebarContent>
            {/* Empty sidebar for now */}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
          <div className="flex-shrink-0 mb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold">Practice Mode</h1>
              </div>
              <div className="flex gap-2">
                <Link href="/" passHref>
                  <Button variant="outline">
                    Back to Words
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            {/* Topic Selection */}
            <div className="mb-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                Select topics to practice (leave empty to practice all words)
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`cursor-pointer transition-colors px-3 py-2 ${
                      selectedTopics.includes(topic)
                        ? "bg-blue-200 text-blue-900 hover:bg-blue-300 dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-900"
                        : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center flex-1">
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Generate text */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/50 p-12 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-200 text-center mb-3">
                    Generate text
                  </h2>
                  <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                    Practice by generating sentences and paragraphs using selected words
                  </p>
                </div>
                
                {/* Practice cards */}
                <div 
                  onClick={handlePracticeCards}
                  className="bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900/50 p-12 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors cursor-pointer flex flex-col items-center justify-center"
                >
                  <h2 className="text-2xl font-semibold text-green-900 dark:text-green-200 text-center mb-3">
                    Practice cards
                  </h2>
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">
                    Review flashcards with Finnish words and their translations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

