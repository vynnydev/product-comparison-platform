import { Product, SearchFilters, SearchResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const SEARCH_API_URL = process.env.NEXT_PUBLIC_SEARCH_API_URL || 'http://localhost:8082';

// Product Service API
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Search Service API
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`${SEARCH_API_URL}/api/search?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to search products');
    return res.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function searchWithFilters(filters: SearchFilters): Promise<Product[]> {
  try {
    const res = await fetch(`${SEARCH_API_URL}/api/search/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    if (!res.ok) throw new Error('Failed to search products');
    return res.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function getTopRated(): Promise<Product[]> {
  try {
    const res = await fetch(`${SEARCH_API_URL}/api/search/top-rated`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch top rated');
    return res.json();
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${SEARCH_API_URL}/api/search/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}