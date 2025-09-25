// Notes management utilities
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export const saveNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const existingNotes = getNotes();
  const updatedNotes = [...existingNotes, newNote];
  localStorage.setItem('ai_chat_notes', JSON.stringify(updatedNotes));
  
  return newNote;
};

export const getNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  
  const notesJson = localStorage.getItem('ai_chat_notes');
  if (!notesJson) return [];
  
  try {
    const notes = JSON.parse(notesJson);
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch (error) {
    console.error('Error parsing notes:', error);
    return [];
  }
};

export const updateNote = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  notes[noteIndex] = updatedNote;
  localStorage.setItem('ai_chat_notes', JSON.stringify(notes));
  
  return updatedNote;
};

export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) return false;
  
  localStorage.setItem('ai_chat_notes', JSON.stringify(filteredNotes));
  return true;
};

export const toggleFavorite = (id: string): boolean => {
  const note = getNotes().find(n => n.id === id);
  if (!note) return false;
  
  updateNote(id, { isFavorite: !note.isFavorite });
  return !note.isFavorite;
};

export const searchNotes = (query: string): Note[] => {
  const notes = getNotes();
  const lowercaseQuery = query.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getNotesByCategory = (category: string): Note[] => {
  return getNotes().filter(note => note.category === category);
};

export const getFavoriteNotes = (): Note[] => {
  return getNotes().filter(note => note.isFavorite);
};
