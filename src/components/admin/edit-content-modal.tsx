'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: { title: string; slug: string };
  initialContent: string;
  collectionName: string;
}

export default function EditContentModal({ isOpen, onClose, tool, initialContent, collectionName }: EditContentModalProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not available.' });
      return;
    }
    setIsSaving(true);
    try {
      const docRef = doc(firestore, collectionName, tool.slug);
      await setDoc(docRef, { content });
      toast({
        title: 'Content Saved',
        description: `Successfully updated content for ${tool.title}.`,
      });
      onClose();
    } catch (error) {
      console.error("Error saving content: ", error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: `Could not save content for ${tool.title}.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Content for: {tool.title}</DialogTitle>
          <DialogDescription>
            This content will be displayed on the tool's main category page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="content-textarea">Tool Page Content</Label>
            <Textarea
              id="content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter a short, descriptive paragraph about this tool..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
