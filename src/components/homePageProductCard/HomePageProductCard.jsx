import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../context/NotificationContext";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import useCartSync from "../../hooks/cart/useCartSync";
import LoginPopup from "../LoginPopup/LoginPopup";
import { createProductUrl } from "../../utils/slugUtils";
import { 
  SerifPageWrapper, 
  SerifProductCard, 
  SerifButton,
  SerifLoadingSkeleton,
  SerifEmptyState,
  SerifFilterChip
} from "../../design-system/components";
import { serifTheme } from "../../design-system/themes";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import logger from '../../utils/logger';
// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================


// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useResponsiveDesign = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { isMobile, isTablet };
};

const useHapticFeedback = () => {
  const triggerHapticFeedback = useCallback(() => {
    // Check if device supports vibration and is mobile
    if ('vibrate' in navigator && window.innerWidth < 768) {
      // Short vibration for button clicks
      navigator.vibrate(50);
    }
  }, []);

  return { triggerHapticFeedback };
};


// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'netflix': '🎬',
    'spotify': '🎵',
    'streaming': '📺',
    'ott': '📱',
    'vpn': '🔒',
    'software': '💻',
    'games': '🎮',
    'education': '📚',
    'music': '🎵',
    'antivirus': '🛡️',
    'bundle': '📦',
    'ai tools': '🤖',
    'default': '📦'
  };
  return icons[category?.toLowerCase()] || icons.default;
};

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

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
// SortDropdown removed - no sorting needed

// ProductCard wrapper - uses SerifProductCard
const ProductCard = React.memo(({ 
  product, 
  isInCart, 
  onAddToCart, 
  onRemoveFromCart, 
  onNavigate,
  isMobile,
  index = 0
}) => {
  const handleNavigate = useCallback((productId, productTitle) => {
    // Pass id and title directly to the parent's handleNavigate
    onNavigate(productId, productTitle);
  }, [onNavigate]);

  return (
    <SerifProductCard
      product={product}
      isInCart={isInCart}
      onAddToCart={onAddToCart}
      onRemoveFromCart={onRemoveFromCart}
      onNavigate={handleNavigate}
      index={index}
    />
  );
});

ProductCard.displayName = 'ProductCard';

// LoadingSkeleton removed - using SerifLoadingSkeleton instead

const EmptyState = () => {
  return (
    <SerifEmptyState
      icon={FaSearch}
      title="No products available"
      description="Check back soon for new arrivals and exciting deals"
      actions={[]}
      className="max-w-2xl mx-auto"
    />
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HomePageProductCard = () => {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { getAllProduct, loading: contextLoading } = context;

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { 
    addToCartWithSync, 
    removeFromCartWithSync, 
    showLoginPopup, 
    closeLoginPopup, 
    pendingProduct 
  } = useCartSync();

  const { isMobile, isTablet } = useResponsiveDesign();
  const { triggerHapticFeedback } = useHapticFeedback();
  const notification = useNotification();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('users'));
    } catch {
      return null;
    }
  }, []);
  
  const {
    activeCategory,
    setActiveCategory,
    categories,
    filteredAndSortedProducts
  } = useProductFilters(getAllProduct);

  // Cart actions
  const addCart = useCallback((item) => {
    triggerHapticFeedback();
    const added = addToCartWithSync(item);
    
    // Only show success notification if item was actually added
    if (added) {
      notification.success("Added to cart", {
        icon: <FaShoppingCart />,
        duration: 3000
      });
    }
    // If not added, the login popup will be shown by useCartSync
  }, [addToCartWithSync, triggerHapticFeedback, notification]);

  const deleteCart = useCallback((item) => {
    triggerHapticFeedback();
    removeFromCartWithSync(item);
    notification.success("Removed from cart", {
      icon: <FaTrash />,
      duration: 3000
    });
  }, [removeFromCartWithSync, triggerHapticFeedback, notification]);

  // Removed sort functionality

  // Removed category-related handlers

  const handleNavigate = useCallback((productId, productTitle) => {
    const path = createProductUrl({ id: productId, title: productTitle });
    navigate(path);
  }, [navigate]);

  // All products in a flat array (no categories)
  const productsToShow = filteredAndSortedProducts;

  return (
    <SerifPageWrapper className="py-8 lg:py-16">
        {/* Categories and Sort */}
        <div className="mb-8 lg:mb-12">
          <div className={`
            ${serifTheme.gradients.overlay}
            backdrop-blur-xl 
            ${serifTheme.radius.card}
            p-6 
            border ${serifTheme.colors.border.primary}
            ${serifTheme.colors.shadow.card}
          `}>
            {/* Category Filter Chips */}
            <div>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {categories.map(category => (
                  <SerifFilterChip
                    key={category}
                    label={category === 'all' ? '🌟 All Products' : `${getCategoryIcon(category)} ${category}`}
                    isActive={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  />
                ))}
      </div>
            </div>
          </div>
        </div>

        {/* Products Display - Single Grid without Categories */}
        <div>
            {contextLoading ? (
            // Loading State using SerifLoadingSkeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <SerifLoadingSkeleton count={8} variant="productCard" />
                    </div>
          ) : productsToShow.length === 0 ? (
              // Empty State
            <EmptyState />
          ) : (
            // All Products in Single Grid
            <div
                      className={`grid gap-6 ${
                        isMobile 
                          ? "grid-cols-2" 
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }`}
                    >
              {productsToShow.map((item, index) => {
                          const isInCart = cartItems.some((p) => p.id === item.id);

                          return (
                            <ProductCard
                    key={`product-${item.id}`}
                              product={item}
                              isInCart={isInCart}
                              onAddToCart={addCart}
                              onRemoveFromCart={deleteCart}
                              onNavigate={handleNavigate}
                              isMobile={isMobile}
                    index={index}
                            />
                          );
                        })}
            </div>
          )}
      </div>
      
      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={closeLoginPopup}
        productTitle={pendingProduct?.title || "this item"}
      />
    </SerifPageWrapper>
  );
};

export default HomePageProductCard;