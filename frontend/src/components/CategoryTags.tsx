'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryTagsProps {
  categories: string[];
  onSelect: (category: string | null) => void;
}

const defaultCategories = [
  'Eletrônicos',
  'Smartphones',
  'Notebooks',
  'TVs',
  'Áudio',
  'Games',
  'Casa',
  'Esportes',
];

export default function CategoryTags({ categories = defaultCategories, onSelect }: CategoryTagsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleSelect = (category: string) => {
    const newSelected = selected === category ? null : category;
    setSelected(newSelected);
    onSelect(newSelected);
  };

  const visibleCategories = showMore ? categories : categories.slice(0, 8);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleCategories.map((category) => (
        <button
          key={category}
          onClick={() => handleSelect(category)}
          className={`tag ${selected === category ? 'tag-active' : ''}`}
        >
          {category}
        </button>
      ))}
      
      {categories.length > 8 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="tag flex items-center gap-1"
        >
          {showMore ? 'Menos' : 'Mais'}
          <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}