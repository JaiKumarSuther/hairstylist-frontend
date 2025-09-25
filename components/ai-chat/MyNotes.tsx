'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Heart, 
  Filter,
  Tag,
  Calendar,
  X
} from 'lucide-react';
import { Note } from '@/lib/types';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, useToggleNoteFavorite, useNoteCategories } from '@/lib/api/hooks/notes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface MyNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyNotes: React.FC<MyNotesProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const { user } = useAuth();

  // API hooks
  const { data: notesData, isLoading } = useNotes({ 
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    search: searchQuery || undefined 
  });
  const { data: categoriesData } = useNoteCategories();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const toggleFavoriteMutation = useToggleNoteFavorite();

  const notes = notesData?.notes || [];
  const categories = ['All', ...(categoriesData?.map(cat => cat.name) || ['General', 'Tips', 'Techniques', 'Products', 'Inspiration'])];

  // No need for local filtering since API handles it

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    createNoteMutation.mutate({
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags,
    });

    setNewNote({ title: '', content: '', category: 'General', tags: [] });
    setShowAddNote(false);
  };

  const handleEditNote = () => {
    if (!editingNote) return;

    updateNoteMutation.mutate({
      id: editingNote.id,
      data: {
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        tags: newNote.tags,
      }
    });

    setEditingNote(null);
    setNewNote({ title: '', content: '', category: 'General', tags: [] });
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteMutation.mutate(id);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newNote.tags.includes(tagInput.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
    });
    setShowAddNote(true);
  };

  const cancelEditing = () => {
    setShowAddNote(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', category: 'General', tags: [] });
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>My Notes</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please login to save your AI chat notes</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Notes
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Header with search and add button */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowAddNote(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                <Filter className="h-3 w-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No notes found matching your search' : 'No notes yet. Start by adding your first note!'}
                </p>
              </div>
            ) : (
              notes.map(note => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{note.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {note.updatedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(note.id)}
                          className={note.isFavorite ? 'text-red-500' : ''}
                        >
                          <Heart className={`h-4 w-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Add/Edit Note Modal */}
        <Dialog open={showAddNote} onOpenChange={cancelEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title..."
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter note content..."
                  rows={6}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newNote.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={editingNote ? handleEditNote : handleAddNote}>
                  {editingNote ? 'Update' : 'Save'} Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
