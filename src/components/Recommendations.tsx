import { useMemo } from "react";
import { ProductCard, Product } from "./ProductCard";
import { Sparkles, TrendingUp } from "lucide-react";

interface RecommendationsProps {
  products: Product[];
  cartItems: any[];
  viewedProducts: string[];
  onAddToCart: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export const Recommendations = ({ 
  products, 
  cartItems, 
  viewedProducts, 
  onAddToCart, 
  favorites, 
  onToggleFavorite 
}: RecommendationsProps) => {
  
  const recommendedProducts = useMemo(() => {
    // Smart recommendation algorithm
    const cartCategories = cartItems.map(item => item.category);
    const viewedCategories = viewedProducts
      .map(id => products.find(p => p.id === id)?.category)
      .filter(Boolean);
    
    const allCategories = [...cartCategories, ...viewedCategories];
    const categoryFrequency = allCategories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostViewedCategory = Object.keys(categoryFrequency).sort(
      (a, b) => categoryFrequency[b] - categoryFrequency[a]
    )[0];

    // Get products from most viewed category + highly rated products
    let recommendations = products.filter(product => {
      const isInCart = cartItems.some(item => item.id === product.id);
      const isViewed = viewedProducts.includes(product.id);
      const isSameCategory = product.category === mostViewedCategory;
      const isHighlyRated = product.rating >= 4.5;
      
      return !isInCart && (!isViewed || isSameCategory || isHighlyRated);
    });

    // Sort by relevance and rating
    recommendations = recommendations.sort((a, b) => {
      const aScore = (a.category === mostViewedCategory ? 2 : 0) + 
                    (a.isFeatured ? 1 : 0) + 
                    (a.rating * 0.5);
      const bScore = (b.category === mostViewedCategory ? 2 : 0) + 
                    (b.isFeatured ? 1 : 0) + 
                    (b.rating * 0.5);
      return bScore - aScore;
    });

    return recommendations.slice(0, 4);
  }, [products, cartItems, viewedProducts]);

  const trendingProducts = useMemo(() => {
    return products
      .filter(product => product.rating >= 4.0)
      .sort((a, b) => (b.reviews * b.rating) - (a.reviews * a.rating))
      .slice(0, 4);
  }, [products]);

  if (recommendedProducts.length === 0 && trendingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto space-y-16">
        
        {/* Personalized Recommendations */}
        {recommendedProducts.length > 0 && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Recommended 
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> For You</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Based on your browsing history and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products */}
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Trending 
                <span className="bg-gradient-accent bg-clip-text text-transparent"> Now</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most popular products loved by our community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};