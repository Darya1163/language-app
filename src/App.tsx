import { useState } from 'react';
import type { Language } from '@/types';
import { useLanguageData } from '@/hooks/useLanguageData';
import { LanguageList } from '@/sections/LanguageList';
import { SentenceList } from '@/sections/SentenceList';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { 
    languages, 
    isLoaded, 
    addLanguage, 
    deleteLanguage, 
    addMultipleSentences, 
    deleteSentence,
    getLanguage 
  } = useLanguageData();

  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleBack = () => {
    setSelectedLanguage(null);
  };

  const handleAddLanguage = (name: string, flag: string, color: string) => {
    addLanguage(name, flag, color);
    toast.success(`Язык "${name}" добавлен!`);
  };

  const handleDeleteLanguage = (id: string) => {
    const lang = getLanguage(id);
    if (lang) {
      deleteLanguage(id);
      toast.success(`Язык "${lang.name}" удален`);
    }
  };

  const handleAddSentences = (sentences: { russian: string; translation: string }[]) => {
    if (selectedLanguage) {
      addMultipleSentences(selectedLanguage.id, sentences);
      const addedCount = sentences.length;
      toast.success(`Добавлено ${addedCount} ${getSentenceWord(addedCount)}!`);
      
      // Refresh selected language data
      const updatedLang = getLanguage(selectedLanguage.id);
      if (updatedLang) {
        setSelectedLanguage(updatedLang);
      }
    }
  };

  const handleDeleteSentence = (sentenceId: string) => {
    if (selectedLanguage) {
      deleteSentence(selectedLanguage.id, sentenceId);
      toast.success('Предложение удалено');
      
      // Refresh selected language data
      const updatedLang = getLanguage(selectedLanguage.id);
      if (updatedLang) {
        setSelectedLanguage(updatedLang);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedLanguage ? (
        <SentenceList
          language={selectedLanguage}
          onBack={handleBack}
          onAddSentences={handleAddSentences}
          onDeleteSentence={handleDeleteSentence}
        />
      ) : (
        <LanguageList
          languages={languages}
          onSelectLanguage={handleSelectLanguage}
          onAddLanguage={handleAddLanguage}
          onDeleteLanguage={handleDeleteLanguage}
        />
      )}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#fff',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          },
        }}
      />
    </>
  );
}

function getSentenceWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'предложений';
  }
  
  if (lastDigit === 1) {
    return 'предложение';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'предложения';
  }
  
  return 'предложений';
}

export default App;
