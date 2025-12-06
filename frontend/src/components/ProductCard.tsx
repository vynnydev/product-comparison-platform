import { Product } from '@/types/product';
import { Star, TrendingUp, Sparkles, Package } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const sentimentColor = {
    positive: 'bg-green-100 text-green-700',
    negative: 'bg-red-100 text-red-700',
    neutral: 'bg-gray-100 text-gray-700',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="card group cursor-pointer">
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.analysisCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-lg shadow-lg">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          )}
          {product.aiScore && product.aiScore >= 8 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Top
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
            product.inStock 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {product.inStock ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        {/* AI Summary */}
        {product.aiSummary && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.aiSummary}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="tag text-xs py-1 px-2">
            {product.category}
          </span>
          {product.aiSentiment && (
            <span className={`tag text-xs py-1 px-2 ${sentimentColor[product.aiSentiment]}`}>
              {product.aiSentiment === 'positive' ? '👍 Positivo' : 
               product.aiSentiment === 'negative' ? '👎 Negativo' : '😐 Neutro'}
            </span>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-gray-700">{product.rating.toFixed(1)}</span>
            {product.aiScore && (
              <>
                <span className="text-gray-300 mx-1">•</span>
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-600">{product.aiScore.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}