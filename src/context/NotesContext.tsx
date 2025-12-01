import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note } from '../types/note';
import { storage } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateFlag: (id: string, color?: string) => Promise<void>;
  updateTags: (id: string, tags: string[]) => Promise<void>;
  toggleLock: (id: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
  isPremium: boolean;
  setIsPremium: (status: boolean) => void;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const FLAG_COLORS = [
  '#E53935', // Kırmızı (Yüksek)
  '#FB8C00', // Turuncu (Orta)
  '#1E88E5', // Mavi (Düşük)
  '#43A047', // Yeşil (Tamamlandı)
  '#7E57C2', // Mor (Özel)
];

const PREMIUM_KEY = '@is_premium';

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  const refreshNotes = async () => {
    const loadedNotes = await storage.loadNotes();
    setNotes(loadedNotes);
  };

  useEffect(() => {
    const loadData = async () => {
      await refreshNotes();
      try {
        const premiumStatus = await AsyncStorage.getItem(PREMIUM_KEY);
        if (premiumStatus === 'true') {
          setIsPremium(true);
        }
      } catch (e) {
        console.error("Error loading premium status", e);
      }
    };
    loadData();
  }, []);

  const setPremiumStatus = async (status: boolean) => {
    setIsPremium(status);
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, status ? 'true' : 'false');
    } catch (e) {
      console.error("Error saving premium status", e);
    }
  };

  const addNote = async (title: string, content: string) => {
    if (!isPremium && notes.length >= 10) {
      throw new Error("LIMIT_REACHED");
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: Date.now(),
      flagColor: undefined,
      tags: [],
      isLocked: false,
    };
    const updated = await storage.saveNote(newNote);
    setNotes(updated);
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const existing = notes.find((n) => n.id === id);
    if (!existing) return;
    const updatedNote = { ...existing, title, content };
    const updated = await storage.saveNote(updatedNote);
    setNotes(updated);
  };

  const updateFlag = async (id: string, color?: string) => {
    const existing = notes.find((n) => n.id === id);
    if (!existing) return;

    const updatedNote = { ...existing, flagColor: color };
    if ('isFlagged' in updatedNote) {
      delete (updatedNote as any).isFlagged;
    }

    const updated = await storage.saveNote(updatedNote);
    setNotes(updated);
  };

  const updateTags = async (id: string, tags: string[]) => {
    const existing = notes.find((n) => n.id === id);
    if (!existing) return;

    const updatedNote = { ...existing, tags };
    const updated = await storage.saveNote(updatedNote);
    setNotes(updated);
  };

  const toggleLock = async (id: string) => {
    const existing = notes.find((n) => n.id === id);
    if (!existing) return;

    const updatedNote = { ...existing, isLocked: !existing.isLocked };
    const updated = await storage.saveNote(updatedNote);
    setNotes(updated);
  };

  const deleteNote = async (id: string) => {
    const updated = await storage.deleteNote(id);
    setNotes(updated);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, updateFlag, updateTags, toggleLock, refreshNotes, isPremium, setIsPremium: setPremiumStatus }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within a NotesProvider');
  return context;
};
