'use client';

import { useState, useEffect } from 'react';
import AdBanner from "@/components/ad-banner";
import { ToolCard } from "@/components/tool-card";
import { Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { ToolCategory, Tool } from '@/lib/tools-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllToolContents } from '@/lib/localStorageManager';

interface ContentAwareTool extends Tool {
  customContent?: string;
  isLoadingContent?: boolean;
}

export function PdfToolsClient({ category }: { category: ToolCategory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<ContentAwareTool[]>(
      category.tools.map(t => ({...t, isLoadingContent: true}))
  );

  const loadToolContents = () => {
    const allContents = getAllToolContents();
    
    const toolsWithContent = category.tools.map(tool => {
        const slug = tool.href.split('/').pop() || '';
        const contentData = allContents[slug];
        return {
            ...tool,
            customContent: contentData?.content,
            isLoadingContent: false
        };
    });

    setTools(toolsWithContent);
  }

  useEffect(() => {
    // We can only access localStorage on the client
    loadToolContents();

    // Listen for the custom event to update content in real-time
    window.addEventListener('storageUpdated', loadToolContents);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storageUpdated', loadToolContents);
    };
  }, [category.tools]);


  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tool.customContent || tool.description).toLowerCase().includes(searchQuery.toLowerCase())
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
          tool.isLoadingContent ? (
             <Card key={tool.href}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                 <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-24" />
                </CardContent>
             </Card>
          ) : (
             <ToolCard
                key={tool.title}
                title={tool.title}
                description={tool.customContent ? <div dangerouslySetInnerHTML={{ __html: tool.customContent }} /> : tool.description}
                icon={tool.icon}
                href={tool.href}
            />
          )
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
