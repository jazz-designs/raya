import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Menu, Search, ShoppingBag, ArrowLeft, X, Plus, Minus, Trash2, 
  Check, Tag, Sparkles, ShieldCheck, ChevronLeft, ChevronRight, 
  ArrowRight, Gem, Truck, Shield, AlertCircle, RotateCcw
} from 'lucide-react';
import { Product, Category, getCollectionsWithMeta, CollectionItem } from './data';
import { fetchProducts, fetchCategories, fetchProductById } from './services/productService';
import AddProductView from './components/AddProductView';
import ProductAccordions from './components/ProductAccordions';
import SocialVideoShowcase from './components/SocialVideoShowcase';
import logoImg from '../assets/logo.jpg';
import bouquet1 from '../assets/images/bouquet1.jpeg';
import bouquet2 from '../assets/images/bouquet2.jpeg';
import bouquet3 from '../assets/images/bouquet3.jpeg';
import bouquet4 from '../assets/images/bouquet4.jpeg';

interface CartItem {
  product: Product;
  quantity: number;
}

function ProductDetailView({
  products,
  isLoading,
  addToCart,
  handleSingleProductWhatsApp,
  setSelectedCategory,
}: {
  products: Product[];
  isLoading: boolean;
  addToCart: (product: Product, quantityToAdd?: number) => void;
  handleSingleProductWhatsApp: (product: Product) => void;
  setSelectedCategory: (cat: Category) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);

  // Reset active thumbnail and scroll to top on product change
  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // If product not in in-memory list (e.g., navigated directly to URL), fetch directly from Supabase
  useEffect(() => {
    if (id && !products.find(p => p.id === id)) {
      setIsFetchingDirect(true);
      fetchProductById(id).then(res => {
        setDirectProduct(res.data);
        setIsFetchingDirect(false);
      });
    }
  }, [id, products]);

  const selectedProduct = products.find(p => p.id === id) || directProduct;

  if (isLoading || isFetchingDirect) {
    return (
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-24 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-serif text-primary">Loading jewelry piece...</p>
      </main>
    );
  }

  if (!selectedProduct) {
    return (
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-16 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold mb-4">Product Not Found</h2>
        <p className="text-sm text-on-surface-variant mb-6">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Return to Catalog
        </button>
      </main>
    );
  }

  const imageList = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : [selectedProduct.image];

  // Up to 4 curated related products prioritizing the same category
  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id)
    .sort((a, b) => {
      const aSame = a.category.toLowerCase() === selectedProduct.category.toLowerCase();
      const bSame = b.category.toLowerCase() === selectedProduct.category.toLowerCase();
      if (aSame && !bSame) return -1;
      if (!aSame && bSame) return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-8 md:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-outline mb-6 sm:mb-8 flex-wrap">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-outline-variant">/</span>
        <button 
          onClick={() => {
            setSelectedCategory('All');
            navigate('/');
          }}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          Collections
        </button>
        <span className="text-outline-variant">/</span>
        <button 
          onClick={() => {
            setSelectedCategory(selectedProduct.category as Category);
            navigate('/');
          }}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          {selectedProduct.category}
        </button>
        <span className="text-outline-variant">/</span>
        <span className="text-primary font-bold">{selectedProduct.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Image View & Interactive Carousel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="w-full aspect-[3.8/5] bg-surface-container relative overflow-hidden rounded-2xl shadow-md border border-outline-variant/30 group">
            <img 
              src={imageList[activeImageIndex]} 
              alt={`${selectedProduct.name} - View ${activeImageIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Carousel Arrow Controls (When multiple images exist) */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? imageList.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 z-20"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === imageList.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 z-20"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Image Counter Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 z-10">
                  {activeImageIndex + 1} / {imageList.length}
                </div>
              </>
            )}

            {/* ANTI TARNISH Label */}
            <div className="absolute top-4 left-4 bg-emerald-950/90 text-emerald-200 font-semibold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1.5 shadow-lg rounded-full backdrop-blur-md flex items-center gap-1.5 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ANTI TARNISH</span>
            </div>

            {/* 50% OFF Badge */}
            <div className="absolute top-4 right-4 bg-[#4A403D]/95 text-[#F9F8F6] font-semibold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1.5 shadow-lg rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/10">
              <Tag className="w-3.5 h-3.5 text-secondary" />
              <span>50% OFF SPECIAL</span>
            </div>
          </div>

          {/* Thumbnail Gallery (When 2+ images exist) */}
          {imageList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    idx === activeImageIndex 
                      ? 'border-primary shadow-md scale-102' 
                      : 'border-outline-variant/50 hover:border-primary/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details & Buy Actions */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                {selectedProduct.category}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
                {selectedProduct.material}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold tracking-tight mb-4">
              {selectedProduct.name}
            </h1>
            
            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-4 bg-surface-container rounded-2xl border border-outline-variant/30 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                ₹ {selectedProduct.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-outline line-through font-medium">
                ₹ {selectedProduct.lastPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                50% OFF
              </span>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-outline-variant/30 text-xs">
            <div className="flex items-center gap-2 text-primary font-medium">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <span>Waterproof & Sweatproof</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Sparkles className="w-4 h-4 text-secondary shrink-0" />
              <span>Anti-Tarnish Seal</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Truck className="w-4 h-4 text-secondary shrink-0" />
              <span>Shipped with Care in Raya Box</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Gem className="w-4 h-4 text-secondary shrink-0" />
              <span>Hypoallergenic & Skin-Safe</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => addToCart(selectedProduct)}
              className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>

            <button
              onClick={() => handleSingleProductWhatsApp(selectedProduct)}
              className="w-full py-3.5 px-6 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Order on WhatsApp Directly</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Information & Guarantees - Desktop Only, Below Main Section */}
      <div className="hidden lg:block mt-12 pt-8 border-t border-outline-variant/30">
        <ProductAccordions product={selectedProduct} />
      </div>

      {/* Social Media Videos Showcase (Styled in Motion @raya_.jewels) */}
      <SocialVideoShowcase productId={selectedProduct.id} />

      {/* Curated Recommendations / Complete the Look */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-20 pt-12 border-t border-outline-variant/30">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-outline text-xs font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Curated Recommendations</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
                Complete the Look
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mt-1">
                Handcrafted pieces that pair effortlessly with your selection.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(relProduct => (
              <div 
                key={relProduct.id}
                onClick={() => {
                  navigate(`/product/${relProduct.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer flex flex-col bg-surface-container/30 rounded-2xl p-3 border border-outline-variant/30 hover:border-outline-variant/80 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
                  <img 
                    src={relProduct.image} 
                    alt={relProduct.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-emerald-950/90 text-emerald-200 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Anti Tarnish
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#4A403D]/95 text-[#F9F8F6] text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    50% OFF
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {relProduct.category}
                </span>
                <h4 className="font-serif text-sm font-bold text-primary truncate mt-0.5 group-hover:text-secondary transition-colors">
                  {relProduct.name}
                </h4>

                <div className="flex items-baseline gap-2 mt-1.5 mb-3">
                  <span className="text-sm font-bold text-primary">
                    ₹ {relProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-outline line-through">
                    ₹ {relProduct.lastPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(relProduct);
                  }}
                  className="mt-auto w-full py-2 px-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function HomeCatalogView({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  filteredProducts,
  allProducts,
  categories,
  isLoading,
  addToCart,
}: {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  allProducts: Product[];
  categories: string[];
  isLoading: boolean;
  addToCart: (product: Product, quantityToAdd?: number) => void;
}) {
  const navigate = useNavigate();
  const collections = getCollectionsWithMeta(allProducts);

  const isSearchActive = searchQuery.trim().length > 0;
  const isViewingSpecificCollection = selectedCategory !== 'All' && !isSearchActive;

  // 4 bouquet images for banner
  const bannerSlides = [
    { src: bouquet1, title: 'Pastel Blue Jewelry Gift Box', tag: 'Travel Case' },
    { src: bouquet2, title: 'Anniversary Bouquet', tag: 'Hand Bouquet' },
    { src: bouquet3, title: 'Red Velvet Jewelry Gift Box', tag: 'Velvet Case' },
    { src: bouquet4, title: 'Champagne Wrap Bouquet', tag: 'Floral Wrap' },
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const allCategoryPills = ['All', ...categories];

  return (
    <main className="flex-grow flex flex-col">
      {/* 1. SEARCH RESULTS VIEW */}
      {isSearchActive ? (
        <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1 block">Search Results</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
                Results for &ldquo;{searchQuery}&rdquo;
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Found {filteredProducts.length} matching piece{filteredProducts.length === 1 ? '' : 's'}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary py-2 px-4 rounded-full border border-outline-variant/50 hover:border-primary transition-all cursor-pointer bg-surface-container"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Collections</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-12">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse bg-surface-container rounded-2xl aspect-[4/5] border border-outline-variant/30" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface-container/50 border border-outline-variant/30 rounded-2xl max-w-md mx-auto">
              <Search className="w-10 h-10 text-outline-variant mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-primary mb-2">No matching pieces found</p>
              <p className="text-xs text-on-surface-variant mb-6 px-4">
                We couldn&rsquo;t find anything matching &ldquo;{searchQuery}&rdquo;. Try another term or explore our collections.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-3 px-7 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors"
              >
                View All Collections
              </button>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts} 
              addToCart={addToCart} 
              navigate={navigate} 
            />
          )}
        </section>
      ) : isViewingSpecificCollection ? (
        /* 2. SPECIFIC COLLECTION VIEW */
        <section className="py-6 sm:py-10 px-3 sm:px-8 md:px-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Collections</span>
              </button>

              <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A403D] bg-[#4A403D]/10 px-3 py-1 rounded-full border border-[#4A403D]/20">
                50% OFF Applied
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-1 block">
                  Fine Jewelry
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl text-primary font-bold tracking-tight">
                  {selectedCategory} Collection
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                  {collections.find(c => c.category.toLowerCase() === selectedCategory.toLowerCase())?.description || 
                   'Handcrafted anti-tarnish, waterproof and hypoallergenic luxury designs.'}
                </p>
              </div>

              <div className="text-xs text-outline font-semibold uppercase tracking-wider whitespace-nowrap">
                {filteredProducts.length} Piece{filteredProducts.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Quick Switch Pills between collections */}
            <div className="flex flex-wrap gap-2 pt-4">
              {allCategoryPills.map(cat => {
                const count = cat === 'All' 
                  ? allProducts.length 
                  : allProducts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-full flex items-center gap-1.5 border cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-dim hover:text-primary'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Collections' : cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid for this Collection */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-12">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse bg-surface-container rounded-2xl aspect-[4/5] border border-outline-variant/30" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface-container/50 border border-outline-variant/30 rounded-2xl max-w-md mx-auto">
              <p className="font-serif text-xl font-bold text-primary mb-2">No pieces in this collection yet</p>
              <p className="text-xs text-on-surface-variant mb-6 px-4">
                Pieces added for this category in Supabase will automatically appear here.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-3 px-7 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors"
              >
                View All Collections
              </button>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts} 
              addToCart={addToCart} 
              navigate={navigate} 
            />
          )}
        </section>
      ) : (
        /* 3. HOMEPAGE BANNER & COLLECTIONS SHOWCASE */
        <>
          {/* Bouquet Hero Banner */}
          <section className="relative w-full overflow-hidden bg-surface border-b border-outline-variant/30">
            <div className="relative w-full h-[440px] sm:h-[600px] lg:h-[700px]">
              {/* Slides */}
              {bannerSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center md:object-[65%_center]"
                  />
                </div>
              ))}

              {/* Soft Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 z-1 bg-gradient-to-t from-surface via-surface/75 to-transparent pointer-events-none" />
              <div className="hidden sm:block absolute inset-y-0 left-0 w-[45%] z-1 bg-gradient-to-r from-surface/85 via-surface/40 to-transparent pointer-events-none" />

              {/* Banner Content */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end sm:justify-center pb-14 sm:pb-12 pt-4">
                <div className="max-w-2xl text-left">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] mb-2 sm:mb-3 shadow-md rounded-full">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary animate-pulse" />
                    <span>Bouquet Special • Flat 50% OFF</span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-primary font-bold tracking-tight mb-3 sm:mb-5 leading-[1.18]">
                    Add 3 or More Items to Make a Bouquet
                  </h1>

                  <div>
                    <button
                      onClick={() => {
                        const el = document.getElementById('collections-showcase');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 sm:gap-2.5 bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.15em] py-2.5 sm:py-3.5 px-5 sm:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-98"
                    >
                      <span>Shop Collections</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-surface/85 backdrop-blur-xs py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full border border-outline-variant/30 shadow-xs">
                {bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 sm:h-2 transition-all duration-300 rounded-full cursor-pointer ${
                      idx === activeSlide ? 'w-5 sm:w-6 bg-primary' : 'w-1.5 sm:w-2 bg-outline-variant/60 hover:bg-primary/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Curated Collections Showcase Section */}
          <section id="collections-showcase" className="pt-8 sm:pt-12 pb-12 sm:pb-16 px-3 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4 sm:mb-10 pb-2 border-b border-outline-variant/30">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                  Collections
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Select a category to view pieces
                </p>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                Flat 50% OFF
              </span>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
              {collections.map((col) => {
                return (
                  <div
                    key={col.category}
                    onClick={() => {
                      setSelectedCategory(col.category);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedCategory(col.category);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-outline-variant/30 hover:border-primary/50 flex flex-col justify-end min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] bg-surface-container"
                  >
                    <img
                      src={col.image}
                      alt={`${col.title} Collection`}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A2016]/95 via-[#4A3828]/60 to-transparent transition-opacity duration-300" />

                    <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10">
                      <span className="bg-[#4A403D]/95 backdrop-blur-xs text-[#F9F8F6] border border-white/20 text-[9px] sm:text-xs font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary" />
                        <span>50% OFF</span>
                      </span>
                    </div>

                    <div className="relative z-10 p-3 sm:p-5 lg:p-6 flex flex-col justify-end text-left">
                      <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl text-[#F9F8F6] font-bold tracking-tight mb-0.5 group-hover:text-[#F3E5AB] transition-colors">
                        {col.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs lg:text-sm text-[#E6D7C3] font-medium mb-1.5 sm:mb-2 line-clamp-1 hidden sm:block">
                        {col.tagline}
                      </p>
                      
                      <div className="pt-1.5 sm:pt-2 border-t border-[#D4AF37]/30 flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#F9F8F6]/90">
                          From <span className="text-[#F3E5AB] font-bold text-xs sm:text-sm lg:text-base">₹ {col.startingPrice.toLocaleString('en-IN')}</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F3E5AB] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Brand Pillars */}
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-outline-variant/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-primary mb-0.5">High-Luster Polish</h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant leading-relaxed">
                    Engineered for lasting mirror shine and anti-fade durability.
                  </p>
                </div>

                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-primary mb-0.5">Anti-Tarnish & Waterproof</h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant leading-relaxed">
                    Sweatproof and showerproof daily durability.
                  </p>
                </div>

                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Gem className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-primary mb-0.5">Skin Safe Comfort</h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant leading-relaxed">
                    Hypoallergenic threaded backs and smooth clasps.
                  </p>
                </div>

                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-primary mb-0.5">Bouquet Presentation</h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant leading-relaxed">
                    Order 3+ pieces to receive in an artisan floral bouquet wrap.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function ProductGrid({
  products,
  addToCart,
  navigate,
}: {
  products: Product[];
  addToCart: (product: Product, quantityToAdd?: number) => void;
  navigate: (path: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-12">
      {products.map((product) => {
        const coverImg = (product.images && product.images[0]) || product.image;
        return (
          <div 
            key={product.id} 
            className="group flex flex-col bg-surface border border-outline-variant/30 hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden"
          >
            {/* Image Container */}
            <div 
              className="w-full aspect-[4/5] bg-surface-container relative overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img 
                src={coverImg} 
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
                    navigate(`/product/${product.id}`);
                  }}
                  className="flex-1 py-2 px-3 bg-white/90 hover:bg-white text-primary text-[11px] font-bold uppercase tracking-wider transition-colors text-center rounded-xl cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col p-3 sm:p-5 text-left flex-grow justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-outline tracking-wider uppercase mb-0.5 block truncate">
                  {product.category}
                </span>
                <h3 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="font-serif text-sm sm:text-lg text-primary font-bold mb-1 leading-snug cursor-pointer hover:text-secondary transition-colors line-clamp-1"
                >
                  {product.name}
                </h3>
              </div>

              {/* Price Section */}
              <div className="pt-2 border-t border-outline-variant/20 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-primary tracking-tight">
                  ₹ {product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-outline line-through">
                  ₹ {product.lastPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded">
                  50% OFF
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic products and categories from Supabase
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([
    'Necklaces', 'Bracelets', 'Bangles', 'Earrings', 'Watches'
  ]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [whatsappNumber] = useState('919383442770');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orderAsBouquet, setOrderAsBouquet] = useState(true);

  // Automatically scroll to top whenever location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Load products and categories from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingProducts(true);
      const [prodsRes, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      if (isMounted) {
        if (prodsRes.data) {
          setProductsList(prodsRes.data);
        }
        if (cats && cats.length > 0) {
          setCategoriesList(cats);
        }
        setIsLoadingProducts(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProductCreated = (newProduct: Product) => {
    setProductsList(prev => [newProduct, ...prev]);
    showToast(`Published ${newProduct.name} to catalog`);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProductsList(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast(`Updated ${updatedProduct.name}`);
  };

  const handleProductDeleted = (deletedId: string) => {
    setProductsList(prev => prev.filter(p => p.id !== deletedId));
    showToast(`Removed product from catalog`);
  };

  const handleCategoryCreated = (newCat: string) => {
    setCategoriesList(prev => Array.from(new Set([...prev, newCat])));
  };

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
  const totalCartSubtotal = cartItems.reduce((sum, item) => sum + item.product.lastPrice * item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCartSavings = totalCartSubtotal - totalCartPrice;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter products by category & search
  const filteredProducts = productsList.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    let itemsListStr = cartItems.map((item, idx) => {
      return `${idx + 1}. ${item.product.name} (Qty: ${item.quantity})`;
    }).join('\n');

    const packagingStr = (totalCartCount >= 3 && orderAsBouquet)
      ? '💐 Packaging: Handcrafted Luxury Bouquet (3+ Items Bouquet Option)'
      : '📦 Packaging: Signature Luxury Velvet Box';

    const text = `Hi Raya Jewels! I would like to order the following item(s):\n\n${itemsListStr}\n\n${packagingStr}\n\nPlease assist me with confirming my order and shipping details. Thank you!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSingleProductWhatsApp = (product: Product) => {
    const text = `Hi Raya Jewels! I would like to order:\n\n*${product.name}*\nCategory: ${product.category}\n\nPlease assist me with confirming my order and pricing. Thank you!`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const navCategories = ['All', ...categoriesList];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-[100] bg-primary text-white px-5 py-3 shadow-2xl rounded-lg flex items-center gap-3 border border-secondary/30 animate-bounce">
          <Check className="w-4 h-4 text-secondary" />
          <span className="text-xs font-semibold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I am interested in your products.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[80] bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group border-2 border-white/40 active:scale-95"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg 
          className="w-7 h-7 fill-current" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2 tracking-wide">
          Chat on WhatsApp
        </span>
      </a>

      {/* Announcement Bar */}
      <div className="bg-primary text-white text-[11px] font-semibold tracking-[0.15em] uppercase py-2.5 px-4 text-center flex items-center justify-center gap-2 border-b border-secondary/20">
        <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
        <span>LIMITED TIME SALE: FLAT 50% OFF STOREWIDE</span>
        <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
      </div>

      {/* Header - NOTICE: Strictly NO links or buttons to /add here */}
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 transition-all">
        <div className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-3 max-w-7xl mx-auto gap-4">
          {/* Left: Mobile menu trigger + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button 
              className="md:hidden text-primary p-1 hover:opacity-70 transition-opacity cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button 
              onClick={() => {
                setSelectedCategory('All');
                navigate('/');
              }} 
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img 
                src={logoImg} 
                alt="Raya Jewels Logo" 
                className="h-8 w-auto md:h-10 rounded-full object-cover border border-secondary/40 shadow-xs" 
              />
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight text-primary font-bold whitespace-nowrap">
                Raya Jewels
              </span>
            </button>
          </div>
          
          {/* Center: Desktop Nav Categories */}
          <nav className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-xs tracking-[0.12em] font-semibold uppercase text-on-surface-variant flex-1">
            {navCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                }}
                className={`transition-all hover:text-primary cursor-pointer relative py-1 whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.toLowerCase() && location.pathname === '/'
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant/80'
                }`}
              >
                {cat === 'All' ? 'Collections' : cat}
              </button>
            ))}
          </nav>

          {/* Right: Search & Cart Actions */}
          <div className="flex gap-3.5 md:gap-5 items-center text-primary shrink-0">
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
                placeholder="Search earrings, necklaces, bangles, watches..."
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
          <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/30 py-6 px-6 flex flex-col gap-3 text-sm tracking-[0.1em] font-semibold uppercase text-primary shadow-xl">
            <span className="text-[10px] text-outline tracking-[0.2em]">Collections</span>
            {navCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-left py-2.5 border-b border-outline-variant/20 flex justify-between items-center cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase() && location.pathname === '/' 
                    ? 'text-primary font-bold pl-2 border-l-4 border-l-primary' 
                    : 'text-on-surface-variant'
                }`}
              >
                <span>{cat === 'All' ? 'All Collections' : cat}</span>
                <ChevronRight className="w-4 h-4 text-outline" />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Primary Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <HomeCatalogView 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProducts={filteredProducts}
              allProducts={productsList}
              categories={categoriesList}
              isLoading={isLoadingProducts}
              addToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProductDetailView 
              products={productsList}
              isLoading={isLoadingProducts}
              addToCart={addToCart}
              handleSingleProductWhatsApp={handleSingleProductWhatsApp}
              setSelectedCategory={setSelectedCategory}
            />
          } 
        />
        {/* Secret /add Route - Protected by Admin Password */}
        <Route 
          path="/add" 
          element={
            <AddProductView 
              categories={categoriesList}
              allProducts={productsList}
              onProductCreated={handleProductCreated}
              onProductUpdated={handleProductUpdated}
              onProductDeleted={handleProductDeleted}
              onCategoryCreated={handleCategoryCreated}
            />
          } 
        />
        <Route 
          path="*" 
          element={
            <HomeCatalogView 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProducts={filteredProducts}
              allProducts={productsList}
              categories={categoriesList}
              isLoading={isLoadingProducts}
              addToCart={addToCart}
            />
          } 
        />
      </Routes>

      {/* Slide-Over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div 
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          />

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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-outline" />
                  </div>
                  <p className="font-serif text-xl font-bold text-primary mb-1">Your bag is empty</p>
                  <p className="text-xs text-on-surface-variant max-w-xs mb-6">
                    Add jewelry pieces from our collections to assemble your order or bouquet.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/');
                    }}
                    className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div 
                    key={product.id}
                    className="flex gap-4 p-3 bg-surface-container rounded-xl border border-outline-variant/30 relative group"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-24 object-cover rounded-lg border border-outline-variant/30"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm font-bold text-primary line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-outline hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[10px] text-outline font-semibold uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-bold text-primary">
                            ₹ {product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-outline line-through font-medium">
                            ₹ {product.lastPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-outline-variant/60 rounded-lg bg-surface">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 text-primary hover:bg-surface-dim transition-colors rounded-l cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-primary">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 text-primary hover:bg-surface-dim transition-colors rounded-r cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-primary ml-auto">
                          ₹ {(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-outline-variant/30 bg-surface-container space-y-4">
                {/* Bouquet Packaging Option */}
                <div 
                  className={`p-3 rounded-xl border transition-all ${
                    totalCartCount >= 3 
                      ? 'bg-amber-500/10 border-amber-400/50 shadow-xs cursor-pointer' 
                      : 'bg-surface-container-high/60 border-outline-variant/30 opacity-40 cursor-not-allowed select-none'
                  }`}
                  onClick={() => {
                    if (totalCartCount >= 3) {
                      setOrderAsBouquet(!orderAsBouquet);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="bouquet-packaging-checkbox"
                      checked={totalCartCount >= 3 && orderAsBouquet}
                      onChange={(e) => {
                        if (totalCartCount >= 3) {
                          setOrderAsBouquet(e.target.checked);
                        }
                      }}
                      disabled={totalCartCount < 3}
                      className={`mt-0.5 w-4 h-4 rounded accent-primary ${
                        totalCartCount < 3 ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label 
                          htmlFor="bouquet-packaging-checkbox" 
                          className={`text-xs font-bold ${
                            totalCartCount >= 3 ? 'text-primary cursor-pointer' : 'text-on-surface-variant cursor-not-allowed'
                          }`}
                        >
                          Order as a Bouquet
                        </label>
                        {totalCartCount >= 3 ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-surface border border-outline-variant/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-secondary" />
                            <span>3+ Items Option</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-outline bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/40">
                            Add {3 - totalCartCount} more to unlock
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        {totalCartCount >= 3 
                          ? '💐 Your entire 3+ items order will be hand-styled into a luxury bouquet arrangement.' 
                          : 'Select 3 or more jewelry pieces to order as a luxury bouquet.'}
                      </p>
                    </div>
                  </div>
                </div>

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

      {/* Footer - NOTICE: Strictly NO links or buttons to /add here */}
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
              Sophisticated minimalism handcrafted with anti-tarnish durability and fine gemstones for the discerning modern individual.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">Shop Categories</h4>
            {navCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                }}
                className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-center md:text-left"
              >
                {cat === 'All' ? 'All Collections' : cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">Client Care</h4>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-center md:text-left">Care Guide</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-center md:text-left">Shipping & Delivery</a>
            <button 
              onClick={() => {
                const text = "Hi, I am interested in your products.";
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
              }} 
              className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-center md:text-left"
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
