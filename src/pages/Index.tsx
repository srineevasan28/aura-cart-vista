import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { CartSidebar, CartItem } from "@/components/CartSidebar";
import { Recommendations } from "@/components/Recommendations";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

// Import product images
import headphonesImg from "@/assets/headphones.jpg";
import smartwatchImg from "@/assets/smartwatch.jpg";
import backpackImg from "@/assets/backpack.jpg";
import laptopImg from "@/assets/laptop.jpg";
import keyboardImg from "@/assets/keyboard.jpg";
import smartphoneImg from "@/assets/smartphone.jpg";
import deskLampImg from "@/assets/desk-lamp.jpg";
import mouseImg from "@/assets/mouse.jpg";

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299,
    originalPrice: 399,
    image: headphonesImg,
    category: "Audio",
    rating: 4.8,
    reviews: 245,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 399,
    originalPrice: 499,
    image: smartwatchImg,
    category: "Wearables",
    rating: 4.6,
    reviews: 189,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Luxury Leather Backpack",
    price: 199,
    image: backpackImg,
    category: "Accessories",
    rating: 4.9,
    reviews: 156,
    isNew: true,
  },
  {
    id: "4",
    name: "Ultra-thin Laptop",
    price: 1299,
    originalPrice: 1499,
    image: laptopImg,
    category: "Computers",
    rating: 4.7,
    reviews: 89,
    isFeatured: true,
  },
  {
    id: "5",
    name: "RGB Gaming Keyboard",
    price: 149,
    image: keyboardImg,
    category: "Gaming",
    rating: 4.5,
    reviews: 203,
  },
  {
    id: "6",
    name: "Latest Smartphone",
    price: 899,
    originalPrice: 999,
    image: smartphoneImg,
    category: "Mobile",
    rating: 4.8,
    reviews: 334,
    isFeatured: true,
  },
  {
    id: "7",
    name: "Modern Desk Lamp",
    price: 89,
    image: deskLampImg,
    category: "Home",
    rating: 4.4,
    reviews: 67,
    isNew: true,
  },
  {
    id: "8",
    name: "Wireless Gaming Mouse",
    price: 79,
    originalPrice: 99,
    image: mouseImg,
    category: "Gaming",
    rating: 4.6,
    reviews: 128,
  },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  // Add to cart functionality
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: "Updated cart",
          description: `Increased ${product.name} quantity`,
        });
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    // Track viewed products for recommendations
    if (!viewedProducts.includes(product.id)) {
      setViewedProducts(prev => [...prev, product.id]);
    }
  };

  // Update cart quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    setCartItems(prev => prev.filter(item => item.id !== productId));
    
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed from your cart`,
      });
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const product = sampleProducts.find(p => p.id === productId);
      if (prev.includes(productId)) {
        toast({
          title: "Removed from favorites",
          description: `${product?.name} removed from favorites`,
        });
        return prev.filter(id => id !== productId);
      } else {
        toast({
          title: "Added to favorites",
          description: `${product?.name} added to favorites`,
        });
        return [...prev, productId];
      }
    });
  };

  // Calculate cart items count
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-close cart when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        favoriteCount={favorites.length}
      />
      
      <main>
        <Hero />
        
        <div id="products">
          <ProductGrid
            products={sampleProducts}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        <Recommendations
          products={sampleProducts}
          cartItems={cartItems}
          viewedProducts={viewedProducts}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;
