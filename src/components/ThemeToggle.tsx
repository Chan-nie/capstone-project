"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const currentlyDark = html.classList.contains("dark");
    
    setIsDark(currentlyDark);
    localStorage.setItem("theme", currentlyDark ? "dark" : "light");
  };

  if (!mounted) {
    return <div className="w-[100px] h-[34px]" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="font-mono text-[12px] tracking-[0.05em] border border-rose px-[14px] py-[8px] rounded-[20px] bg-transparent text-foreground transition-colors hover:bg-rose/15 cursor-pointer"
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}