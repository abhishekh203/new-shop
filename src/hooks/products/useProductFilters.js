import { useState, useMemo } from 'react';

/**
 * Custom hook for product filtering and categorization
 * @param {Array} products - Array of products to filter
 * @returns {Object} - Object containing filter state and filtered products
 */
const useProductFilters = (products) => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      (products || [])
        .map(product => product?.category)
        .filter(Boolean)
    );
    return ["all", ...Array.from(uniqueCategories)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products?.length) return [];

    // Filter by category
    let filtered = products;
    if (activeCategory !== "all") {
      filtered = products.filter(product => 
        product?.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Return flat array of filtered products (no sorting)
    return filtered;
  }, [products, activeCategory]);

  return {
    activeCategory,
    setActiveCategory,
    categories,
    filteredAndSortedProducts
  };
};

export default useProductFilters;
