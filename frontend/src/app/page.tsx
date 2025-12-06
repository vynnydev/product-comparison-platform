'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Zap, Shield } from 'lucide-react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryTags from '@/components/CategoryTags';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types/product';

// Mock data para desenvolvimento
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB - Titânio Natural',
    description: 'O iPhone mais avançado com chip A17 Pro e câmera de 48MP',
    price: 9499.00,
    category: 'Smartphones',
    rating: 4.9,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    aiSummary: 'Excelente performance com chip A17 Pro. Câmera profissional e bateria durável.',
    aiKeywords: 'premium, câmera, performance, titanium',
    aiSentiment: 'positive',
    aiScore: 9.2,
    analysisCompleted: true,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Galaxy AI integrado com S Pen e câmera de 200MP',
    price: 8999.00,
    category: 'Smartphones',
    rating: 4.8,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    aiSummary: 'Melhor tela do mercado com Galaxy AI. S Pen inclusa para produtividade.',
    aiKeywords: 'AI, produtividade, câmera, S Pen',
    aiSentiment: 'positive',
    aiScore: 9.0,
    analysisCompleted: true,
  },
  {
    id: 3,
    name: 'MacBook Pro 14" M3 Pro 512GB',
    description: 'Notebook profissional com chip M3 Pro e tela Liquid Retina XDR',
    price: 18999.00,
    category: 'Notebooks',
    rating: 4.9,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    aiSummary: 'Performance excepcional para profissionais. Bateria de até 18 horas.',
    aiKeywords: 'profissional, M3, bateria, Retina',
    aiSentiment: 'positive',
    aiScore: 9.5,
    analysisCompleted: true,
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5 - Fone Bluetooth',
    description: 'Melhor cancelamento de ruído do mercado com 30h de bateria',
    price: 2299.00,
    category: 'Áudio',
    rating: 4.7,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    aiSummary: 'Referência em ANC. Som Hi-Res e conforto premium para longas sessões.',
    aiKeywords: 'ANC, Hi-Res, conforto, wireless',
    aiSentiment: 'positive',
    aiScore: 8.8,
    analysisCompleted: true,
  },
  {
    id: 5,
    name: 'PlayStation 5 Slim Digital Edition',
    description: 'Console de última geração com SSD ultra-rápido',
    price: 3499.00,
    category: 'Games',
    rating: 4.8,
    inStock: false,
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    aiSummary: 'Experiência next-gen com load times mínimos. Excelente biblioteca de jogos.',
    aiKeywords: 'gaming, next-gen, SSD, exclusivos',
    aiSentiment: 'positive',
    aiScore: 8.5,
    analysisCompleted: true,
  },
  {
    id: 6,
    name: 'LG OLED C3 55" 4K Smart TV',
    description: 'TV OLED com Dolby Vision, Atmos e processador α9 Gen6',
    price: 5999.00,
    category: 'TVs',
    rating: 4.9,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    aiSummary: 'Preto perfeito e cores vibrantes. Ideal para cinema e gaming.',
    aiKeywords: 'OLED, 4K, Dolby, gaming',
    aiSentiment: 'positive',
    aiScore: 9.3,
    analysisCompleted: true,
  },
];

const categories = [
  'Smartphones',
  'Notebooks',
  'TVs',
  'Áudio',
  'Games',
  'Tablets',
  'Wearables',
  'Casa Inteligente',
  'Câmeras',
  'Acessórios',
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    
    // Simular busca (substituir por API real)
    setTimeout(() => {
      if (query) {
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
      setLoading(false);
    }, 500);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(products.filter(p => p.category === category));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Full Width */}
      <main className="w-full">
        {/* Hero Content */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* AI Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </span>
          </div>

          {/* Title */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Compare. Descubra.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                Economize.
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use inteligência artificial para encontrar os melhores produtos.
              Análises detalhadas e comparações instantâneas.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Busque por produtos, categorias ou características..."
            />
          </div>

          {/* Category Tags */}
          <div className="max-w-4xl mx-auto flex justify-center">
            <CategoryTags 
              categories={categories}
              onSelect={handleCategorySelect}
            />
          </div>
        </section>

        {/* Features */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-white/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Análise com IA</h3>
                <p className="text-sm text-gray-500">Insights inteligentes sobre cada produto</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Comparação Rápida</h3>
                <p className="text-sm text-gray-500">Compare especificações lado a lado</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Preços em Tempo Real</h3>
                <p className="text-sm text-gray-500">Atualizados de múltiplas lojas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid - Full Width */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory || 'Produtos em Destaque'}
              </h2>
              <p className="text-gray-500">
                {filteredProducts.length} produtos encontrados
              </p>
            </div>
            <select className="btn-secondary text-sm py-2">
              <option>Mais relevantes</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Melhor avaliação</option>
              <option>Maior score IA</option>
            </select>
          </div>

          <ProductGrid products={filteredProducts} loading={loading} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-white border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">ProductAI</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Product Comparison Platform. Desenvolvido para Mercado Livre Technical Assessment.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Dados seguros e atualizados</span>
          </div>
        </div>
      </footer>
    </div>
  );
}