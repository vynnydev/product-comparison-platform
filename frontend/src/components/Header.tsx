'use client';

import { useState } from 'react';
import { Search, Menu, X, Sparkles, BarChart3, Gift, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Produtos', href: '/products', icon: null },
    { name: 'Categorias', href: '/categories', icon: null },
    { name: 'Comparar', href: '/compare', icon: BarChart3 },
    { name: 'Top Avaliados', href: '/top-rated', icon: Gift },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Lado Esquerdo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              ProductAI
            </span>
          </Link>

          {/* Desktop Navigation - CENTRALIZADO */}
          <nav className="hidden md:flex items-center justify-center flex-1 ml-12">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Search & Actions - Lado Direito */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mini Search */}
            {/* <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-48">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="bg-transparent border-none outline-none ml-2 text-sm w-full"
              />
            </div> */}

            {/* Auth Buttons */}
            <button className="btn-secondary text-sm py-2 px-4 hidden sm:block">
              Login
            </button>
            <button className="btn-primary text-sm py-2 px-4">
              Cadastrar
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}