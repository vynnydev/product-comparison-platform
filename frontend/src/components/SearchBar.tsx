'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "O que você está procurando?" }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'compare'>('search');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'search'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Buscar Produtos
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'compare'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Comparar
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-lg transition-all shadow-sm"
          />
        </div>
        
        <button
          type="button"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          type="submit"
          className="btn-primary py-4 px-8 text-lg rounded-xl"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}