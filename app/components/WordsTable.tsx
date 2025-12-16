"use client";

import { useState, useEffect } from "react";
import { topics } from "../config/topics";
import type { Word } from "../page";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WordsTableProps {
  words: Word[];
}

// Function to get row background color based on word type
function getRowColor(type: string): string {
  const types = extractTypes(type);
  
  // Use first type for row color
  if (types.length === 0) {
    return "bg-gray-50/50 hover:bg-gray-100/50 dark:bg-gray-950/20 dark:hover:bg-gray-950/30";
  }
  
  const primaryType = types[0];
  
  // Color based on primary type
  if (primaryType === "adv") {
    return "bg-orange-50/50 hover:bg-orange-100/50 dark:bg-orange-950/20 dark:hover:bg-orange-950/30";
  } else if (primaryType === "adj") {
    return "bg-purple-50/50 hover:bg-purple-100/50 dark:bg-purple-950/20 dark:hover:bg-purple-950/30";
  } else if (primaryType === "pron") {
    return "bg-pink-50/50 hover:bg-pink-100/50 dark:bg-pink-950/20 dark:hover:bg-pink-950/30";
  } else if (primaryType === "noun") {
    return "bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-950/20 dark:hover:bg-blue-950/30";
  } else if (primaryType === "verb") {
    return "bg-green-50/50 hover:bg-green-100/50 dark:bg-green-950/20 dark:hover:bg-green-950/30";
  } else if (primaryType === "phrase") {
    return "bg-yellow-50/50 hover:bg-yellow-100/50 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/30";
  } else if (primaryType === "question") {
    return "bg-cyan-50/50 hover:bg-cyan-100/50 dark:bg-cyan-950/20 dark:hover:bg-cyan-950/30";
  } else {
    return "bg-gray-50/50 hover:bg-gray-100/50 dark:bg-gray-950/20 dark:hover:bg-gray-950/30";
  }
}

// Function to get badge color based on simplified type
function getBadgeColor(simpleType: string): string {
  if (simpleType === "adv") {
    return "bg-orange-200 text-orange-900 dark:bg-orange-900/50 dark:text-orange-200";
  } else if (simpleType === "adj") {
    return "bg-purple-200 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200";
  } else if (simpleType === "pron") {
    return "bg-pink-200 text-pink-900 dark:bg-pink-900/50 dark:text-pink-200";
  } else if (simpleType === "noun") {
    return "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200";
  } else if (simpleType === "verb") {
    return "bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-200";
  } else if (simpleType === "phrase") {
    return "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-200";
  } else if (simpleType === "question") {
    return "bg-cyan-200 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-200";
  } else {
    return "bg-gray-200 text-gray-900 dark:bg-gray-900/50 dark:text-gray-200";
  }
}

// Extract all word types from a compound type string
function extractTypes(type: string): string[] {
  const lowerType = type.toLowerCase();
  
  // Remove parenthetical content first
  const cleanType = lowerType.replace(/\([^)]*\)/g, '').trim();
  
  // Split by / or space to get individual types
  const parts = cleanType.split(/[/\s]+/).filter(part => part.length > 0);
  
  const types: string[] = [];
  
  for (const part of parts) {
    if (part === "adverb" || part === "adv") types.push("adv");
    else if (part === "adjective" || part === "adj") types.push("adj");
    else if (part === "pronoun" || part === "pron") types.push("pron");
    else if (part === "noun") types.push("noun");
    else if (part === "verb") types.push("verb");
    else if (part === "phrase") types.push("phrase");
    else if (part === "question") types.push("question");
    else if (part === "conjunction" || part === "conj") types.push("conj");
    else if (part === "postposition" || part === "postp") types.push("postp");
    else if (part === "participle") types.push("part");
    else if (part === "quantifier") types.push("quant");
    else if (part === "interjection") types.push("interj");
    else if (part === "greeting") types.push("greeting");
    else if (part === "modal") types.push("modal");
    else if (part === "determiner") types.push("det");
    else if (part === "predicative") types.push("pred");
  }
  
  // Remove duplicates while preserving order
  return [...new Set(types)];
}

export default function WordsTable({ words }: WordsTableProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount from cache (localStorage and cookies)
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
  }, []);

  const handleLogout = () => {
    // Clear from both localStorage and cookies
    localStorage.removeItem("isLoggedIn");
    document.cookie = "isLoggedIn=; max-age=0; path=/";
    setIsLoggedIn(false);
  };

  // First filter by topic
  let topicFilteredWords = words;
  if (selectedTopic) {
    topicFilteredWords = words.filter((word) => word.group === selectedTopic);
  }

  // Helper function to check if word matches filter type
  const matchesType = (wordType: string, filterType: string): boolean => {
    const types = extractTypes(wordType);
    
    // Map filter types to their simplified versions
    const filterMapping: Record<string, string> = {
      "noun": "noun",
      "verb": "verb",
      "adjective": "adj",
      "adverb": "adv",
      "pronoun": "pron",
      "phrase": "phrase",
      "question": "question"
    };
    
    const targetType = filterMapping[filterType];
    return types.includes(targetType);
  };

  // Get available types in the current topic filter
  const availableTypes = [
    { value: "noun", label: "noun", count: topicFilteredWords.filter((w) => matchesType(w.type, "noun")).length },
    { value: "verb", label: "verb", count: topicFilteredWords.filter((w) => matchesType(w.type, "verb")).length },
    { value: "adjective", label: "adj", count: topicFilteredWords.filter((w) => matchesType(w.type, "adjective")).length },
    { value: "adverb", label: "adv", count: topicFilteredWords.filter((w) => matchesType(w.type, "adverb")).length },
    { value: "pronoun", label: "pron", count: topicFilteredWords.filter((w) => matchesType(w.type, "pronoun")).length },
    { value: "phrase", label: "phrase", count: topicFilteredWords.filter((w) => matchesType(w.type, "phrase")).length },
    { value: "question", label: "question", count: topicFilteredWords.filter((w) => matchesType(w.type, "question")).length },
  ].filter(type => type.count > 0);

  // Reset selected type if it's no longer available in the current topic
  useEffect(() => {
    if (selectedType && !availableTypes.some(t => t.value === selectedType)) {
      setSelectedType(null);
    }
  }, [selectedTopic, selectedType, availableTypes]);

  // Then filter by type
  let filteredWords = topicFilteredWords;
  if (selectedType) {
    filteredWords = filteredWords.filter((word) => matchesType(word.type, selectedType));
  }

  // Then filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredWords = filteredWords.filter((word) => 
      word.word.toLowerCase().includes(query) ||
      word.finnish.toLowerCase().includes(query) ||
      word.english.toLowerCase().includes(query) ||
      word.russian.toLowerCase().includes(query)
    );
  }

  // Count words per topic
  const topicCounts = topics.reduce((acc, topic) => {
    acc[topic] = words.filter((word) => word.group === topic).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Topics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        setSelectedTopic(null);
                        setSelectedType(null);
                      }}
                      isActive={selectedTopic === null}
                    >
                      <span>All Topics</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {words.length}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {topics.map((topic) => (
                    <SidebarMenuItem key={topic}>
                      <SidebarMenuButton
                        onClick={() => {
                          setSelectedTopic(topic);
                          setSelectedType(null);
                        }}
                        isActive={selectedTopic === topic}
                      >
                        <span>{topic}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {topicCounts[topic] || 0}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
            {/* Header */}
            <div className="flex-shrink-0 mb-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold">Finnish Words</h1>
                <p className="text-muted-foreground mt-2">
                  {selectedTopic && selectedType ? (
                    <>
                      <span className="font-medium">{selectedTopic}</span> • 
                      <span className="font-medium">{availableTypes.find(t => t.value === selectedType)?.label || selectedType}</span> • 
                      {" "}{filteredWords.length} words
                    </>
                  ) : selectedTopic ? (
                    <>
                      <span className="font-medium">{selectedTopic}</span> •{" "}
                      {filteredWords.length} words
                    </>
                  ) : selectedType ? (
                    <>
                      <span className="font-medium">{availableTypes.find(t => t.value === selectedType)?.label || selectedType}</span> •{" "}
                      {filteredWords.length} words
                    </>
                  ) : (
                    <>All Topics • {filteredWords.length} words</>
                  )}
                </p>
                </div>
                <div className="flex gap-2">
                  {isLoggedIn && (
                    <Link href="/practice" passHref>
                      <Button>Practice</Button>
                    </Link>
                  )}
                  {isLoggedIn ? (
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  ) : (
                    <Link href="/login" passHref>
                      <Button variant="outline">Login</Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  onClick={() => setSelectedType(null)}
                  className={`cursor-pointer transition-colors ${
                    selectedType === null
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All Types
                </Badge>
                {availableTypes.map((type) => {
                  const isActive = selectedType === type.value;
                  
                  // Map filter type to badge type
                  const badgeTypeMap: Record<string, string> = {
                    "noun": "noun",
                    "verb": "verb",
                    "adjective": "adj",
                    "adverb": "adv",
                    "pronoun": "pron",
                    "phrase": "phrase",
                    "question": "question"
                  };
                  
                  const badgeType = badgeTypeMap[type.value];
                  const baseColor = getBadgeColor(badgeType);
                  
                  return (
                    <Badge
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`cursor-pointer transition-all ${baseColor} ${
                        isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {type.label}
                    </Badge>
                  );
                })}
              </div>

              {/* Search Bar */}
              <Input
                type="text"
                placeholder="Search by Finnish, English, or Russian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden flex-1 flex flex-col min-h-0">
              {/* Table Header - Fixed */}
              <div className="bg-muted border-b-2 overflow-y-scroll">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Finnish
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        English
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Russian
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Group
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              
              {/* Table Body - Scrollable */}
              <div className="overflow-y-scroll flex-1 min-h-0">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                  </colgroup>
                  <tbody className="divide-y">
                    {filteredWords.map((word, index) => (
                      <tr key={index} className={`transition-colors ${getRowColor(word.type)}`}>
                        <td className="px-4 py-3 text-sm font-medium">
                          {word.finnish}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {word.english}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {word.russian}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {extractTypes(word.type).map((type, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className={`${getBadgeColor(type)} text-xs font-medium`}
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {word.group}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

