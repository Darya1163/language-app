export interface Sentence {
  id: string;
  russian: string;
  translation: string;
  createdAt: number;
}

export interface Language {
  id: string;
  name: string;
  flag: string;
  color: string;
  sentences: Sentence[];
}

export interface AppData {
  languages: Language[];
}
