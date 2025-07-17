import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Heart, User, Menu, X } from "lucide-react";

interface HeaderProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  favoriteCount: number;
}

export const Header = ({ cartItemsCount, onOpenCart, favoriteCount }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 glass border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Luxe Store
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </a>
              <a href="#products" className="text-sm font-medium hover:text-primary transition-colors">
                Products
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Categories
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-accent">
                  {favoriteCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={onOpenCart}>
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center animate-bounce-in">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-up">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Home
              </a>
              <a href="#products" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Products
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Categories
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
                About
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Contact
              </a>
              
              {/* Mobile Search */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};