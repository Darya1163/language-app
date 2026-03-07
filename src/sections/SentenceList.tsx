import { useState } from 'react';
import type { Language, Sentence } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react';

interface SentenceListProps {
  language: Language;
  onBack: () => void;
  onAddSentences: (sentences: { russian: string; translation: string }[]) => void;
  onDeleteSentence: (sentenceId: string) => void;
}

export function SentenceList({ language, onBack, onAddSentences, onDeleteSentence }: SentenceListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleAddSentences = () => {
    if (!inputText.trim()) return;

    // Parse input text - support multiple formats
    const lines = inputText.split('\n').filter(line => line.trim());
    const sentences: { russian: string; translation: string }[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Try to split by common separators
      let parts: string[] = [];
      
      if (trimmed.includes(' - ')) {
        parts = trimmed.split(' - ');
      } else if (trimmed.includes(' — ')) {
        parts = trimmed.split(' — ');
      } else if (trimmed.includes(' | ')) {
        parts = trimmed.split(' | ');
      } else if (trimmed.includes('=>')) {
        parts = trimmed.split('=>');
      } else if (trimmed.includes('=')) {
        parts = trimmed.split('=');
      } else if (trimmed.includes('>')) {
        parts = trimmed.split('>');
      } else if (trimmed.includes(':')) {
        parts = trimmed.split(':');
      } else if (trimmed.includes('  ')) {
        // Two spaces as separator
        parts = trimmed.split('  ').filter(p => p.trim());
      }

      if (parts.length >= 2) {
        sentences.push({
          russian: parts[0].trim(),
          translation: parts.slice(1).join(' - ').trim()
        });
      } else if (trimmed) {
        // If no separator found, treat whole line as Russian
        sentences.push({
          russian: trimmed,
          translation: ''
        });
      }
    }

    if (sentences.length > 0) {
      onAddSentences(sentences);
      setInputText('');
      setIsAddDialogOpen(false);
    }
  };

  const cleanInput = () => {
    // Remove extra formatting, multiple spaces, etc.
    const cleaned = inputText
      .replace(/\t/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/  +/g, ' ')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
    setInputText(cleaned);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{language.flag}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{language.name}</h1>
                <p className="text-xs text-gray-400">{language.sentences.length} предложений</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentences List */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {language.sentences.length === 0 ? (
          <div className="text-center py-16">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${language.color}20` }}
            >
              <Sparkles className="w-10 h-10" style={{ color: language.color }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Пока нет предложений</h3>
            <p className="text-gray-400 text-sm">Добавьте первые предложения для изучения</p>
          </div>
        ) : (
          <div className="space-y-3">
            {language.sentences.map((sentence, index) => (
              <SentenceCard
                key={sentence.id}
                index={index + 1}
                sentence={sentence}
                accentColor={language.color}
                onDelete={() => onDeleteSentence(sentence.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="rounded-full px-6 py-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить предложения
        </Button>
      </div>

      {/* Add Sentences Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-500" />
              Добавить предложения
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <p className="font-medium mb-1">Формат ввода:</p>
              <p>Русский текст - Перевод</p>
              <p className="text-blue-500 text-xs mt-1">Поддерживаются разделители: -, —, |, {'=>'}, =, {'>'}, :</p>
              <p className="text-blue-500 text-xs">Каждая пара с новой строки</p>
            </div>
            
            <Textarea
              placeholder={`Привет, как дела? - Hola, ¿cómo estás?
Спасибо - Gracias
До свидания - Adiós`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] rounded-xl resize-none font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={cleanInput}
                className="flex-1 rounded-xl"
              >
                Очистить форматирование
              </Button>
            </div>
            
            <Button 
              onClick={handleAddSentences}
              disabled={!inputText.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white py-5 disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SentenceCardProps {
  index: number;
  sentence: Sentence;
  accentColor: string;
  onDelete: () => void;
}

function SentenceCard({ index, sentence, accentColor, onDelete }: SentenceCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Number indicator */}
          <div 
            className="w-12 flex items-center justify-center font-bold text-white text-lg"
            style={{ backgroundColor: accentColor }}
          >
            {index}
          </div>
          
          <div className="flex-1 p-4">
            {/* Russian text - RED color */}
            <p className="text-rose-500 font-medium text-base mb-2 leading-relaxed">
              {sentence.russian}
            </p>
            
            {/* Translation - accent color */}
            <p 
              className="font-semibold text-lg leading-relaxed"
              style={{ color: accentColor }}
            >
              {sentence.translation}
            </p>
          </div>
          
          {/* Delete button */}
          <button
            onClick={onDelete}
            className="px-3 text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
