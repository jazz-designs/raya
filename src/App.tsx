import { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, ArrowLeft, X, Plus, Minus, Trash2, Check, Tag, Sparkles, ShieldCheck } from 'lucide-react';
import { products, Product, CATEGORIES, Category } from './data';
import logoImg from '../assets/logo.jpg';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [whatsappNumber] = useState('916282819051');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Automatically scroll to the top of the page whenever a product is opened or view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedProduct]);

  // Cart operations
  const addToCart = (product: Product, quantityToAdd = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });
    showToast(`Added ${product.name} to your cart`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartSubtotal = cartItems.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCartSavings = totalCartSubtotal - totalCartPrice;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter products by category & search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    let itemsListStr = cartItems.map((item, idx) => {
      return `${idx + 1}. ${item.product.name} x${item.quantity} - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')} (Original: ~₹${(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}~)`;
    }).join('\n');

    const text = `Hi Raya Jewels! I would like to order the following items (50% Off Applied):\n\n${itemsListStr}\n\n` +
      `Total Original Price: ~₹${totalCartSubtotal.toLocaleString('en-IN')}~\n` +
      `Total Discount (50% OFF): -₹${totalCartSavings.toLocaleString('en-IN')}\n` +
      `Final Amount Payable: ₹${totalCartPrice.toLocaleString('en-IN')}\n\n` +
      `Please assist me with confirming shipping details. Thank you!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSingleProductWhatsApp = (product: Product) => {
    const text = `Hi Raya Jewels! I want to order:\n\n*${product.name}*\n` +
      `Material: ${product.material}\n` +
      `Original Price: ~₹${product.originalPrice.toLocaleString('en-IN')}~\n` +
      `Special Price (50% OFF): ₹${product.price.toLocaleString('en-IN')}\n\n` +
      `Please assist me with completing this order.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSelectProduct = (product: Product | null) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-primary text-white px-5 py-3 shadow-2xl rounded-lg flex items-center gap-3 border border-secondary/30 animate-bounce">
          <Check className="w-4 h-4 text-secondary" />
          <span className="text-xs font-semibold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Announcement Bar */}
      <div className="bg-primary text-white text-[11px] font-semibold tracking-[0.15em] uppercase py-2.5 px-4 text-center flex items-center justify-center gap-2 border-b border-secondary/20">
        <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
        <span>LIMITED TIME SALE: FLAT 50% OFF STOREWIDE — COMPLIMENTARY INSURED SHIPPING</span>
        <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
      </div>

      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 transition-all">
        <div className="flex justify-between items-center px-4 md:px-12 py-3 max-w-7xl mx-auto">
          {/* Mobile menu trigger */}
          <button 
            className="md:hidden text-primary p-1 hover:opacity-70 transition-opacity cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Desktop Nav Categories */}
          <nav className="hidden md:flex gap-8 items-center text-xs tracking-[0.12em] font-semibold uppercase text-on-surface-variant">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleSelectProduct(null);
                }}
                className={`transition-all hover:text-primary cursor-pointer relative py-1 ${
                  selectedCategory === cat && !selectedProduct
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant/80'
                }`}
              >
                {cat === 'All' ? 'Collections' : cat}
              </button>
            ))}
          </nav>

          {/* Brand Logo & Name */}
          <button 
            onClick={() => {
              handleSelectProduct(null);
              setSelectedCategory('All');
            }} 
            className="flex items-center gap-2 cursor-pointer absolute left-1/2 -translate-x-1/2 hover:opacity-90 transition-opacity"
          >
            <img 
              src={logoImg} 
              alt="Raya Jewels Logo" 
              className="h-8 w-auto md:h-10 rounded-full object-cover border border-secondary/40 shadow-xs" 
            />
            <span className="font-serif text-xl md:text-3xl tracking-tight text-primary font-bold whitespace-nowrap">
              Raya Jewels
            </span>
          </button>

          {/* Search & Cart Actions */}
          <div className="flex gap-4 md:gap-5 items-center text-primary">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-1 hover:opacity-70 transition-opacity relative text-primary cursor-pointer"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1 hover:opacity-70 transition-opacity relative text-primary cursor-pointer"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#4A403D] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-surface">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="bg-surface-container border-t border-outline-variant/30 py-3 px-4 md:px-12">
            <div className="max-w-xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search earrings, necklaces, rings, gold..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-primary placeholder:text-outline"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-outline hover:text-primary cursor-pointer">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/30 py-6 px-6 flex flex-col gap-4 text-sm tracking-[0.1em] font-semibold uppercase text-primary shadow-xl">
            <span className="text-[10px] text-outline tracking-[0.2em]">Categories</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleSelectProduct(null);
                  setIsMenuOpen(false);
                }}
                className={`text-left py-2.5 border-b border-outline-variant/20 flex justify-between items-center cursor-pointer ${
                  selectedCategory === cat && !selectedProduct ? 'text-primary font-bold pl-2 border-l-4 border-l-primary' : 'text-on-surface-variant'
                }`}
              >
                <span>{cat === 'All' ? 'All Collections' : cat}</span>
                <span className="text-xs text-outline font-normal">
                  ({cat === 'All' ? products.length : products.filter(p => p.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      {!selectedProduct ? (
        <main className="flex-grow flex flex-col">
          {/* Hero Section */}
          <section className="relative w-full h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden bg-surface-dim">
            <div className="absolute inset-0 z-0">
              <img 
                src={products[0].image} 
                alt="Raya Jewels Fine Collection" 
                className="w-full h-full object-cover object-center opacity-75 scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface-variant/40 to-primary/30"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto mt-4">
              {/* Luxury Grey Badge */}
              <div className="inline-flex items-center gap-2 bg-[#4A403D]/90 backdrop-blur-md text-[#F9F8F6] px-3.5 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] mb-4 shadow-md rounded-full border border-white/10">
                <Tag className="w-3.5 h-3.5 text-secondary" />
                <span>FLAT 50% OFF EXCLUSIVE COLLECTION</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-primary mb-4 leading-tight font-bold drop-shadow-sm">
                Quiet Elegance,<br/>Defined.
              </h1>
              
              <p className="text-sm md:text-lg text-on-surface-variant font-medium mb-6 max-w-xl leading-relaxed">
                Discover our handcrafted jewelry collection. Minimalist gold and anti-tarnish pieces designed for daily elegance.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => {
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-primary text-white text-xs font-bold uppercase tracking-[0.15em] py-3.5 px-8 shadow-lg hover:bg-primary/90 active:scale-98 transition-all rounded-xl cursor-pointer border border-primary"
                >
                  Shop Collection
                </button>
              </div>
            </div>
          </section>

          {/* Category Filter Pills & Product Catalog */}
          <section id="catalog-section" className="py-10 sm:py-16 px-3 sm:px-8 md:px-12 max-w-7xl mx-auto w-full">
            {/* Category Navigation Bar */}
            <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1.5">Curated Luxury</span>
              <h2 className="font-serif text-2xl sm:text-4xl text-primary mb-5 font-bold">
                {selectedCategory === 'All' ? 'Complete Collection' : `${selectedCategory} Collection`}
              </h2>
              
              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-3">
                {CATEGORIES.map(cat => {
                  const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full flex items-center gap-1.5 border cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-dim hover:text-primary'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Pieces' : cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {searchQuery && (
                <p className="text-xs text-on-surface-variant mt-2">
                  Showing results for &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo; ({filteredProducts.length} items found)
                </p>
              )}
            </div>

            {/* Empty Search / Filter State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-surface-container/50 border border-outline-variant/30 rounded-2xl max-w-md mx-auto">
                <p className="text-sm font-semibold text-primary mb-4">No products found matching your filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-3 px-7 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              /* Product Grid - 2 COLUMNS ON MOBILE, 3 ON DESKTOP */
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-12">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="group flex flex-col bg-surface border border-outline-variant/30 hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden"
                  >
                    {/* Image Container */}
                    <div 
                      className="w-full aspect-[4/5] bg-surface-container relative overflow-hidden cursor-pointer"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {/* Luxury Grey Badge on Top Right */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 bg-[#4A403D]/95 text-[#F9F8F6] font-semibold text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 border border-white/10 z-10">
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary" />
                        <span>50% OFF</span>
                      </div>

                      {/* Category Tag on Top Left */}
                      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 bg-surface/90 backdrop-blur-md text-primary font-semibold text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-outline-variant/30 z-10">
                        {product.category}
                      </div>

                      {/* Circular Full-Black Cart Button at Bottom Right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 w-9 h-9 sm:w-11 sm:h-11 bg-black hover:bg-neutral-800 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer border border-white/20"
                        title="Add to Cart"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </button>

                      {/* Quick Details Hover Overlay for larger screens */}
                      <div className="hidden sm:flex absolute bottom-0 left-0 w-full p-3.5 bg-gradient-to-t from-primary/90 via-primary/75 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 gap-2 pr-16">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(product);
                          }}
                          className="flex-1 py-2 px-3 bg-white/90 hover:bg-white text-primary text-[11px] font-bold uppercase tracking-wider transition-colors text-center rounded-xl cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Product Details - LEFT ALIGNED & COMPACT FOR 2 COLUMNS */}
                    <div className="flex flex-col p-3 sm:p-5 text-left flex-grow justify-between">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-outline tracking-wider uppercase mb-0.5 block truncate">
                          {product.material}
                        </span>
                        <h3 
                          onClick={() => handleSelectProduct(product)}
                          className="font-serif text-sm sm:text-lg text-primary font-bold mb-1 leading-snug cursor-pointer hover:text-secondary transition-colors line-clamp-1"
                        >
                          {product.name}
                        </h3>
                      </div>

                      {/* Price Section with Light Red Tag Beside Price */}
                      <div className="pt-2 border-t border-outline-variant/20 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-primary tracking-tight">
                          ₹ {product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] sm:text-xs font-medium text-outline line-through">
                          ₹ {product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded">
                          50% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        /* Product Detail View */
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-8 md:py-16">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-outline mb-6 sm:mb-8 flex-wrap">
            <button 
              onClick={() => handleSelectProduct(null)}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-outline-variant">/</span>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                handleSelectProduct(null);
              }}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Collections
            </button>
            <span className="text-outline-variant">/</span>
            <button 
              onClick={() => {
                setSelectedCategory(selectedProduct.category as Category);
                handleSelectProduct(null);
              }}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              {selectedProduct.category}
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">{selectedProduct.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Image View with ANTI TARNISH (Top Left) & 50% OFF (Top Right) Badges */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="w-full aspect-[4/5] bg-surface-container relative overflow-hidden rounded-2xl shadow-md border border-outline-variant/30">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />

                {/* ANTI TARNISH Label (TOP LEFT) */}
                <div className="absolute top-4 left-4 bg-emerald-950/90 text-emerald-200 font-semibold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1.5 shadow-lg rounded-full backdrop-blur-md flex items-center gap-1.5 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ANTI TARNISH</span>
                </div>

                {/* 50% OFF Badge (TOP RIGHT) */}
                <div className="absolute top-4 right-4 bg-[#4A403D]/95 text-[#F9F8F6] font-semibold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1.5 shadow-lg rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                  <Tag className="w-3.5 h-3.5 text-secondary" />
                  <span>50% OFF SPECIAL</span>
                </div>
              </div>
            </div>
            
            {/* Right Product Details & Actions */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-secondary mb-2">
                {selectedProduct.material} • {selectedProduct.category}
              </span>
              
              <h1 className="font-serif text-3xl md:text-5xl text-primary font-bold mb-4 leading-tight">
                {selectedProduct.name}
              </h1>

              {/* Price Block */}
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 mb-6 flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  ₹ {selectedProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base font-semibold text-outline line-through">
                  ₹ {selectedProduct.originalPrice.toLocaleString('en-IN')}
                </span>
                {/* Light red tag preserved next to price */}
                <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 border border-red-200/60 rounded-md ml-auto">
                  Save ₹ {(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')} (50%)
                </span>
              </div>

              <div className="prose text-on-surface-variant text-sm md:text-base leading-relaxed mb-8">
                <p>{selectedProduct.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3.5 mb-10">
                {/* Add to Cart Button */}
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  className="w-full py-4 px-8 bg-primary text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-primary/90 transition-all duration-200 shadow-lg flex items-center justify-center gap-3 rounded-xl border border-primary active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                  <span>Add to Cart</span>
                </button>

                {/* Instant Order via WhatsApp */}
                <button 
                  onClick={() => handleSingleProductWhatsApp(selectedProduct)}
                  className="w-full py-4 px-8 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 shadow-md flex items-center justify-center gap-3 rounded-xl active:scale-98 cursor-pointer"
                >
                  <span>Buy Now via WhatsApp</span>
                </button>
                
                <p className="text-[11px] text-center text-outline mt-1">
                  🔒 Fast checkout & personalized care via WhatsApp assistant.
                </p>
              </div>

              {/* Product Specifications Accordion */}
              <div className="border-t border-outline-variant/30 divide-y divide-outline-variant/30">
                <div className="py-5">
                  <h3 className="font-serif text-lg text-primary font-bold mb-3">Product Highlights</h3>
                  <ul className="text-xs text-on-surface-variant space-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-primary">100% Anti-Tarnish & Waterproof Protection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                      <span>Crafted with genuine {selectedProduct.material}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                      <span>Certified 50% Promotional Discount Applied</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                      <span>Handcrafted by master jewelers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="py-5">
                  <h3 className="font-serif text-lg text-primary font-bold mb-2">Shipping & Guarantee</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Complimentary insured door-to-door delivery. Every order comes packaged in a luxury signature velvet box with an authenticity certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Slide-Over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col z-10 border-l border-outline-variant/30 animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl text-primary font-bold">Your Cart</h2>
                <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-primary hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-12">
                  <ShoppingBag className="w-16 h-16 text-outline-variant mb-4" />
                  <p className="font-serif text-xl text-primary font-bold mb-2">Your cart is empty</p>
                  <p className="text-xs text-on-surface-variant mb-6 max-w-xs">
                    Explore our 50% OFF collection to add handcrafted gold and diamond pieces.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      handleSelectProduct(null);
                    }}
                    className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 hover:bg-primary/90 transition-colors rounded-xl cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div 
                    key={product.id} 
                    className="flex gap-4 pb-6 border-b border-outline-variant/20 items-center"
                  >
                    {/* Item Thumbnail */}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-24 object-cover bg-surface-container rounded-xl border border-outline-variant/30"
                    />

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-base text-primary font-bold leading-tight">
                          {product.name}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(product.id)}
                          className="text-outline hover:text-red-700 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-[11px] text-outline mb-2">{product.material}</span>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-sm font-bold text-primary">
                          ₹ {(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-outline line-through">
                          ₹ {(product.originalPrice * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-outline-variant/50 rounded-lg bg-surface-container overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1.5 text-primary hover:bg-surface-dim transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-primary">{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1.5 text-primary hover:bg-surface-dim transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-red-700 bg-red-50 border border-red-200/60 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          50% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-outline-variant/30 bg-surface-container flex flex-col gap-4">
                {/* Savings Summary Banner */}
                <div className="bg-rose-50 border border-rose-200/60 p-3 rounded-xl flex items-center justify-between text-xs text-rose-800 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-rose-700" />
                    <span>50% OFF Savings Applied</span>
                  </div>
                  <span>- ₹ {totalCartSavings.toLocaleString('en-IN')}</span>
                </div>

                {/* Subtotals */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Original Price Subtotal</span>
                    <span className="line-through">₹ {totalCartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Insured Shipping</span>
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-outline-variant/30">
                    <span>Total Amount</span>
                    <span className="text-lg">₹ {totalCartPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-4 px-6 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 shadow-xl flex items-center justify-center gap-2 rounded-xl cursor-pointer border border-[#128C7E]"
                >
                  <span>Checkout via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto w-full bg-surface-container border-t border-outline-variant/30 py-16 px-6 md:px-12 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img 
                src={logoImg} 
                alt="Raya Jewels Logo" 
                className="h-10 w-auto rounded-full object-cover border border-secondary/40 shadow-xs" 
              />
              <h2 className="font-serif text-2xl text-primary font-bold">Raya Jewels</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-xs mx-auto md:mx-0 leading-relaxed">
              Sophisticated minimalism handcrafted in solid gold and genuine gemstones for the discerning modern individual.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">Shop Categories</h4>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleSelectProduct(null);
                }}
                className="text-sm text-on-surface-variant hover:text-primary text-left transition-colors cursor-pointer"
              >
                {cat === 'All' ? 'All Collections' : cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">Client Care</h4>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Care Guide</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Shipping & Returns</a>
            <button 
              onClick={() => {
                const text = "Hi Raya Jewels! I have an inquiry regarding your 50% OFF fine jewelry collection.";
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
              }} 
              className="text-sm text-on-surface-variant hover:text-primary text-left transition-colors cursor-pointer"
            >
              Contact Us on WhatsApp
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/30 text-xs text-on-surface-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Raya Jewels. All Rights Reserved. Special 50% Storewide Promotion.</p>
        </div>
      </footer>
    </div>
  );
}
