export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  flagColor?: string; // Rengi tutacak, undefined ise işaretsiz
}
