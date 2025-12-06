import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Comparison Platform - Compare Products with AI',
  description: 'Compare products intelligently with AI-powered analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased min-h-screen bg-slate-100">
        {children}
      </body>
    </html>
  );
}