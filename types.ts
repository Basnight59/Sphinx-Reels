export interface Scene {
  id: string;
  text: string;
  image?: string;
  videoUrl?: string;
  duration: number; // in seconds
  voiceover?: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  lastModified: string;
  status: 'draft' | 'rendering' | 'completed';
  scenes: Scene[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export enum AIScriptType {
  MOTIVATIONAL = 'motivational',
  EDUCATIONAL = 'educational',
  STORYTIME = 'storytime',
  FACTS = 'facts'
}