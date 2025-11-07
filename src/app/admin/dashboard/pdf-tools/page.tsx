'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toolsData } from '@/lib/tools-data';

interface Tool {
  title: string;
  slug: string;
}

export default function PdfToolsManagementPage() {
  const [pdfTools, setPdfTools] = useState<Tool[]>([]);
  const router = useRouter();

  useEffect(() => {
    const pdfToolCategory = toolsData['pdf-tools'];
    if (pdfToolCategory) {
      const tools = pdfToolCategory.tools.map(tool => ({
        title: tool.title,
        slug: tool.href.split('/').pop() || '',
      }));
      setPdfTools(tools);
    }
  }, []);

  const handleEdit = (tool: Tool) => {
    router.push(`/admin/dashboard/pdf-tools/${tool.slug}/edit`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>PDF Tools Content</CardTitle>
          <CardDescription>Manage the descriptive content for each PDF tool page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pdfTools.map((tool) => (
                <TableRow key={tool.slug}>
                  <TableCell className="font-medium">{tool.title}</TableCell>
                  <TableCell className="text-muted-foreground">/tools/pdf/{tool.slug}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tool)}>
                      Edit Content
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
