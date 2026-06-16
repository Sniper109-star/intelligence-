"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SearchInput({ onSearch, placeholder = "Search address...", className }: {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <input
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 pl-10 text-sm text-foreground placeholder:text-foreground-muted/60 focus:border-primary focus:outline-none transition-colors"
      />
      <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <button
        type="submit"
        disabled={!isValid}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Analyze
      </button>
    </form>
  );
}
