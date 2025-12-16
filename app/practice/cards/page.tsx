"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface Word {
  word: string;
  finnish: string;
  english: string;
  russian: string;
  type: string;
  group: string;
}

export default function PracticeCardsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [practiceWords, setPracticeWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0); // Index to actually display
  const [cardFlipStates, setCardFlipStates] = useState<Record<number, boolean>>({});
  const [slideDirection, setSlideDirection] = useState<"left" | "out-left" | null>(null);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const isFlipped = cardFlipStates[displayIndex] || false;

  const handleCardClick = () => {
    setCardFlipStates(prev => ({
      ...prev,
      [displayIndex]: !isFlipped
    }));
  };

  // Sync displayIndex with currentIndex when not animating
  useEffect(() => {
    if (!isAnimating) {
      setDisplayIndex(currentIndex);
    }
  }, [currentIndex, isAnimating]);

  const handlePrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      const targetIndex = currentIndex - 1;
      setIsAnimating(true);
      
      // Step 1: Reset BOTH current (displayIndex) and target cards to Finnish
      setCardFlipStates(prev => {
        const newState = { ...prev };
        delete newState[displayIndex];
        delete newState[targetIndex];
        return newState;
      });
      
      // Step 2: After a brief pause, animate to previous card
      setTimeout(() => {
        setPreviousIndex(targetIndex);
        setSlideDirection("out-left");
        
        setTimeout(() => {
          setCurrentIndex(targetIndex);
          setDisplayIndex(targetIndex);
          setSlideDirection(null);
          setPreviousIndex(null);
          setIsAnimating(false);
        }, 400);
      }, 200); // Small delay to show the flip back to Finnish
    }
  };

  const handleNext = () => {
    if (currentIndex < practiceWords.length - 1 && !isAnimating) {
      const targetIndex = currentIndex + 1;
      setIsAnimating(true);
      
      // Step 1: Reset BOTH current (displayIndex) and target cards to Finnish
      setCardFlipStates(prev => {
        const newState = { ...prev };
        delete newState[displayIndex];
        delete newState[targetIndex];
        return newState;
      });
      
      // Step 2: After a brief pause, animate to next card
      setTimeout(() => {
        setPreviousIndex(displayIndex);
        setSlideDirection("left");
        setDisplayIndex(targetIndex);
        setCurrentIndex(targetIndex);
        
        setTimeout(() => {
          setSlideDirection(null);
          setPreviousIndex(null);
          setIsAnimating(false);
        }, 400);
      }, 200); // Small delay to show the flip back to Finnish
    }
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

    // Load selected topics from localStorage
    const storedTopics = localStorage.getItem("practiceTopics");
    if (storedTopics) {
      setSelectedTopics(JSON.parse(storedTopics));
    }
    
    setIsLoading(false);
  }, []);

  // Fetch words and select random 20
  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/words")
        .then((res) => res.json())
        .then((allWords: Word[]) => {
          // Filter by selected topics, or use all words if no topics selected
          const filteredWords = selectedTopics.length > 0
            ? allWords.filter((word) => selectedTopics.includes(word.group))
            : allWords;
          
          // Get 20 random words
          const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
          const randomWords = shuffled.slice(0, Math.min(20, shuffled.length));
          
          setPracticeWords(randomWords);
        })
        .catch((error) => console.error("Failed to load words:", error));
    }
  }, [isLoggedIn, selectedTopics]);

  const handleLogout = () => {
    // Clear from both localStorage and cookies
    localStorage.removeItem("isLoggedIn");
    document.cookie = "isLoggedIn=; max-age=0; path=/";
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  if (isLoading) {
    return null;
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
                <h1 className="text-4xl font-bold">Practice Cards</h1>
                <p className="text-muted-foreground mt-2">
                  Topics: {selectedTopics.length > 0 ? selectedTopics.join(", ") : "All Topics"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/practice" passHref>
                  <Button variant="outline">
                    Back to Practice
                  </Button>
                </Link>
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
          </div>
          
          <div className="flex items-center justify-center flex-1">
            {practiceWords.length === 0 ? (
              <div className="text-center">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Loading words...
                </p>
              </div>
            ) : (
              <div className="w-full max-w-2xl">
                {/* Card Container */}
                <div className="relative h-[400px] mb-6" style={{ perspective: "1000px" }}>
                  {/* Underneath Card - shows current card's state during animation */}
                  {previousIndex !== null && practiceWords[previousIndex] && (
                    <div 
                      className="absolute top-0 left-0 w-full h-full bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-16 text-center flex items-center justify-center shadow-lg"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {cardFlipStates[previousIndex] ? (
                        // Current card is flipped - show translations
                        <div className="space-y-6 w-full">
                          <div>
                            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                              English
                            </p>
                            <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                              {practiceWords[previousIndex]?.english}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                              Russian
                            </p>
                            <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                              {practiceWords[previousIndex]?.russian}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Current card is in Finnish
                        <h2 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                          {practiceWords[previousIndex]?.finnish}
                        </h2>
                      )}
                    </div>
                  )}
                  
                  {/* Current Card - slides or stays on top */}
                  <div 
                    onClick={handleCardClick}
                    className={`absolute top-0 left-0 w-full h-full bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-16 text-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 flex items-center justify-center shadow-xl ${
                      slideDirection === "left" 
                        ? "animate-slide-left" 
                        : slideDirection === "out-left" 
                        ? "animate-slide-out-left" 
                        : ""
                    }`}
                    style={{ transformStyle: "preserve-3d", zIndex: 10 }}
                  >
                    {!isFlipped ? (
                      // Front - Finnish word
                      <h2 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                        {practiceWords[displayIndex]?.finnish}
                      </h2>
                    ) : (
                      // Back - Translations
                      <div className="space-y-6 w-full">
                        <div>
                          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                            English
                          </p>
                          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                            {practiceWords[displayIndex]?.english}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                            Russian
                          </p>
                          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                            {practiceWords[displayIndex]?.russian}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Navigation and counter */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="outline"
                    size="lg"
                  >
                    ← Previous
                  </Button>
                  
                  <p className="text-muted-foreground">
                    Card {currentIndex + 1} of {practiceWords.length}
                  </p>
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentIndex === practiceWords.length - 1}
                    variant="outline"
                    size="lg"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

