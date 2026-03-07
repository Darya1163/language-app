import { useState, useEffect, useCallback } from 'react';
import type { Language, Sentence, AppData } from '@/types';

const STORAGE_KEY = 'lingolearn-data';

const defaultLanguages: Language[] = [
  {
    id: 'spanish',
    name: 'Испанский',
    flag: '🇪🇸',
    color: '#FF6B6B',
    sentences: [
      { id: '1', russian: 'Привет, как дела?', translation: 'Hola, ¿cómo estás?', createdAt: Date.now() },
      { id: '2', russian: 'Спасибо большое', translation: 'Muchas gracias', createdAt: Date.now() },
      { id: '3', russian: 'До свидания', translation: 'Adiós', createdAt: Date.now() },
    ]
  },
  {
    id: 'german',
    name: 'Немецкий',
    flag: '🇩🇪',
    color: '#4ECDC4',
    sentences: [
      { id: '1', russian: 'Привет, как дела?', translation: 'Hallo, wie geht es dir?', createdAt: Date.now() },
      { id: '2', russian: 'Спасибо большое', translation: 'Vielen Dank', createdAt: Date.now() },
      { id: '3', russian: 'До свидания', translation: 'Auf Wiedersehen', createdAt: Date.now() },
    ]
  },
  {
    id: 'french',
    name: 'Французский',
    flag: '🇫🇷',
    color: '#9B59B6',
    sentences: [
      { id: '1', russian: 'Привет, как дела?', translation: 'Bonjour, comment allez-vous?', createdAt: Date.now() },
      { id: '2', russian: 'Спасибо большое', translation: 'Merci beaucoup', createdAt: Date.now() },
      { id: '3', russian: 'До свидания', translation: 'Au revoir', createdAt: Date.now() },
    ]
  },
  {
    id: 'italian',
    name: 'Итальянский',
    flag: '🇮🇹',
    color: '#F39C12',
    sentences: [
      { id: '1', russian: 'Привет, как дела?', translation: 'Ciao, come stai?', createdAt: Date.now() },
      { id: '2', russian: 'Спасибо большое', translation: 'Grazie mille', createdAt: Date.now() },
      { id: '3', russian: 'До свидания', translation: 'Arrivederci', createdAt: Date.now() },
    ]
  }
];

export function useLanguageData() {
  const [data, setData] = useState<AppData>({ languages: defaultLanguages });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse stored data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addLanguage = useCallback((name: string, flag: string, color: string) => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name,
      flag,
      color,
      sentences: []
    };
    setData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
  }, []);

  const deleteLanguage = useCallback((languageId: string) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== languageId)
    }));
  }, []);

  const addSentences = useCallback((languageId: string, russian: string, translation: string) => {
    const newSentence: Sentence = {
      id: Date.now().toString(),
      russian: russian.trim(),
      translation: translation.trim(),
      createdAt: Date.now()
    };
    
    setData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === languageId
          ? { ...lang, sentences: [...lang.sentences, newSentence] }
          : lang
      )
    }));
  }, []);

  const addMultipleSentences = useCallback((languageId: string, sentences: { russian: string; translation: string }[]) => {
    const newSentences: Sentence[] = sentences.map((s, index) => ({
      id: `${Date.now()}-${index}`,
      russian: s.russian.trim(),
      translation: s.translation.trim(),
      createdAt: Date.now() + index
    }));
    
    setData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === languageId
          ? { ...lang, sentences: [...lang.sentences, ...newSentences] }
          : lang
      )
    }));
  }, []);

  const deleteSentence = useCallback((languageId: string, sentenceId: string) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === languageId
          ? { ...lang, sentences: lang.sentences.filter(s => s.id !== sentenceId) }
          : lang
      )
    }));
  }, []);

  const getLanguage = useCallback((languageId: string) => {
    return data.languages.find(l => l.id === languageId);
  }, [data.languages]);

  return {
    languages: data.languages,
    isLoaded,
    addLanguage,
    deleteLanguage,
    addSentences,
    addMultipleSentences,
    deleteSentence,
    getLanguage
  };
}
