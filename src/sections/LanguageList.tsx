import { useState } from 'react';
import type { Language } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookOpen, ChevronRight } from 'lucide-react';

interface LanguageListProps {
  languages: Language[];
  onSelectLanguage: (language: Language) => void;
  onAddLanguage: (name: string, flag: string, color: string) => void;
  onDeleteLanguage: (id: string) => void;
}

const pastelColors = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#9B59B6', // Purple
  '#F39C12', // Orange
  '#3498DB', // Blue
  '#E74C3C', // Red
  '#2ECC71', // Green
  '#1ABC9C', // Teal
  '#F1C40F', // Yellow
  '#E91E63', // Pink
];

export function LanguageList({ languages, onSelectLanguage, onAddLanguage, onDeleteLanguage }: LanguageListProps) {
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageFlag, setNewLanguageFlag] = useState('🌐');
  const [selectedColor, setSelectedColor] = useState(pastelColors[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddLanguage = () => {
    if (newLanguageName.trim()) {
      onAddLanguage(newLanguageName.trim(), newLanguageFlag, selectedColor);
      setNewLanguageName('');
      setNewLanguageFlag('🌐');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-4">
            <BookOpen className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">LingoLearn</h1>
          <p className="text-gray-500">Изучай языки легко</p>
        </div>

        {/* Language Cards */}
        <div className="space-y-3 mb-6">
          {languages.map((language) => (
            <Card
              key={language.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden group"
              onClick={() => onSelectLanguage(language)}
            >
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div 
                    className="w-2 self-stretch"
                    style={{ backgroundColor: language.color }}
                  />
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{language.flag}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{language.name}</h3>
                        <p className="text-sm text-gray-400">{language.sentences.length} предложений</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLanguage(language.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Language Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full py-6 rounded-2xl bg-white text-gray-700 border-2 border-dashed border-gray-300 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить язык
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Новый язык</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="langName" className="text-gray-600">Название языка</Label>
                <Input
                  id="langName"
                  placeholder="Например: Японский"
                  value={newLanguageName}
                  onChange={(e) => setNewLanguageName(e.target.value)}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="langFlag" className="text-gray-600">Флаг (эмодзи)</Label>
                <Input
                  id="langFlag"
                  placeholder="🌐"
                  value={newLanguageFlag}
                  onChange={(e) => setNewLanguageFlag(e.target.value)}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Цвет</Label>
                <div className="flex flex-wrap gap-2">
                  {pastelColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all duration-200 ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleAddLanguage}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white py-5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
