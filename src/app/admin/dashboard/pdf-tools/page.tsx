'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toolsData } from '@/lib/tools-data';
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import EditContentModal from '@/components/admin/edit-content-modal';

interface Tool {
  title: string;
  slug: string;
}

export default function PdfToolsManagementPage() {
  const [pdfTools, setPdfTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [initialContent, setInitialContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const firestore = useFirestore();

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

  const handleEdit = async (tool: Tool) => {
    if (!firestore) return;

    setSelectedTool(tool);
    const docRef = doc(firestore, 'pdfToolsContent', tool.slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setInitialContent(docSnap.data().content || '');
    } else {
      setInitialContent('');
    }
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
    setInitialContent('');
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

      {selectedTool && (
        <EditContentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          tool={selectedTool}
          initialContent={initialContent}
          collectionName="pdfToolsContent"
        />
      )}
    </>
  );
}
