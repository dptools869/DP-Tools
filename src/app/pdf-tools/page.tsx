'use client';

import { useState } from 'react';
import AdBanner from "@/components/ad-banner";
import { RecommendedVideo } from "@/components/recommended-video";
import { ToolCard } from "@/components/tool-card";
import { toolsData } from "@/lib/tools-data.tsx";
import { AlertCircle, Search } from "lucide-react";
import { Input } from '@/components/ui/input';

export default function PdfToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const category = toolsData['pdf-tools'];

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">The requested tool category does not exist.</p>
      </div>
    );
  }

  const filteredTools = category.tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <main className="lg:col-span-3">
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold font-headline text-primary">{category.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">{category.description}</p>
          </header>

          <div className="mb-12">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search PDF tools..."
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

          <section className="mt-16">
            <h2 className="text-3xl font-bold font-headline mb-6 text-center lg:text-left">Recommended Tutorial</h2>
            <RecommendedVideo toolName={category.title} />
          </section>

          <AdBanner type="bottom-banner" className="mt-12" />
        </main>
        
        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
