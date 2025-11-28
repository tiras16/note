import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const NOTES_KEY = '@notes';

export const storage = {
  saveNote: async (note: Note) => {
    const notes = await storage.loadNotes();
    const updatedNotes = [note, ...notes.filter((n) => n.id !== note.id)];
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    return updatedNotes;
  },
  loadNotes: async (): Promise<Note[]> => {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },
  deleteNote: async (noteId: string) => {
    const notes = await storage.loadNotes();
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    return updatedNotes;
  },
};
