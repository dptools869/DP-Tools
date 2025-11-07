'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toolsData } from '@/lib/tools-data';
import { Editor } from '@tinymce/tinymce-react';

export default function EditPdfToolPage() {
  const [initialContent, setInitialContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toolTitle, setToolTitle] = useState('');
  
  const params = useParams();
  const router = useRouter();
  const { toolSlug } = params;

  const firestore = useFirestore();
  const { toast } = useToast();
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof toolSlug !== 'string') return;
    
    const pdfToolCategory = toolsData['pdf-tools'];
    const tool = pdfToolCategory?.tools.find(t => t.href.endsWith(toolSlug));
    if (tool) {
      setToolTitle(tool.title);
    }

    const fetchContent = async () => {
      // Wait until firestore is available.
      if (!firestore) {
        return;
      }
      
      setIsLoading(true);
      try {
        const docRef = doc(firestore, 'pdfToolsContent', toolSlug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const contentData = docSnap.data().content;
          setInitialContent(contentData);
        } else {
          setInitialContent('');
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch content.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toolSlug, firestore, toast]);

  const handleSave = async () => {
    if (!firestore || typeof toolSlug !== 'string' || !editorRef.current) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
      return;
    }
    
    // @ts-ignore
    const newContent = editorRef.current.getContent();
    if (!newContent.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'Content cannot be empty.' });
        return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(firestore, 'pdfToolsContent', toolSlug);
      await setDoc(docRef, { 
        content: newContent,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({
        title: 'Content Saved',
        description: `Successfully updated content for ${toolTitle}.`,
      });
      // Optionally, redirect after saving
      // setTimeout(() => router.push('/admin/dashboard/pdf-tools'), 1500);
    } catch (error) {
      console.error("Error saving content: ", error);
      toast({ 
          variant: 'destructive', 
          title: 'Save Failed', 
          description: 'Could not save content to the database.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => router.push('/admin/dashboard/pdf-tools')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to PDF Tools
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editing: {toolTitle || 'Tool'}</CardTitle>
          <CardDescription>Use the rich text editor below to update the content for this tool page.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
             <Editor
                apiKey='f08kw0ml5k8dqbktq0eeba9walbjg5fs9vwobqtcgwzcant5'
                // @ts-ignore
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={initialContent}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    content_style: 'body { font-family:Inter,sans-serif; font-size:14px }'
                }}
            />
          )}
        </CardContent>
        <CardFooter className="sticky bottom-0 bg-background border-t py-4">
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
