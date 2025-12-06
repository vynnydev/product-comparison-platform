export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    inStock: boolean;
    imageUrl?: string;
    specifications?: string;
    
    // AI Analysis fields
    aiSummary?: string;
    aiKeywords?: string;
    aiSentiment?: 'positive' | 'negative' | 'neutral';
    aiScore?: number;
    aiRecommendations?: string;
    
    // Search fields
    searchScore?: number;
    analysisCompleted?: boolean;
}
  
export interface SearchFilters {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
}
  
export interface SearchResponse {
    products: Product[];
    total: number;
    page: number;
    size: number;
}