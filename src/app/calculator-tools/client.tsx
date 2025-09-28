'use client';

import { useState } from 'react';
import AdBanner from "@/components/ad-banner";
import { ToolCard } from "@/components/tool-card";
import { Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { ToolCategory } from '@/lib/tools-data';

export function CalculatorToolsClient({ category }: { category: ToolCategory }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = category.tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="mb-8 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold font-headline text-primary">{category.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">{category.description}</p>
      </header>

      <div className="mb-12">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search calculator tools..."
            className="pl-10 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <AdBanner type="top-banner" className="mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
          />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No tools found for your search.</p>
        </div>
      )}
    </>
  );
}