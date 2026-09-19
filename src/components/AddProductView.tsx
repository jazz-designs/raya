import { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, X, Plus, Sparkles, CheckCircle2, AlertCircle, ArrowRight, 
  Image as ImageIcon, Layers, FileText, Lock, Eye, EyeOff, Search,
  Edit2, Trash2, ShieldCheck, ArrowLeft, RefreshCw, ExternalLink, Check
} from 'lucide-react';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createCategory, 
  verifyAdminPassword 
} from '../services/productService';
import { isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../data';
import logoImg from '../../assets/logo.jpg';

interface AddProductViewProps {
  categories: string[];
  allProducts?: Product[];
  onProductCreated: (newProduct: Product) => void;
  onProductUpdated?: (updatedProduct: Product) => void;
  onProductDeleted?: (deletedProductId: string) => void;
  onCategoryCreated: (newCategory: string) => void;
}

interface SelectedImage {
  file: File;
  previewUrl: string;
}

export default function AddProductView({
  categories,
  allProducts = [],
  onProductCreated,
  onProductUpdated,
  onProductDeleted,
  onCategoryCreated,
}: AddProductViewProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('raya_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Portal Active Tab: 'add' or 'manage'
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');

  // Local products cache for inventory management
  const [catalogItems, setCatalogItems] = useState<Product[]>(allProducts);

  // Sync catalogItems when allProducts updates
  if (allProducts.length !== catalogItems.length && catalogItems.length === 0) {
    setCatalogItems(allProducts);
  }

  // Search & filter for catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');

  // --- Add Product Form States ---
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [title, setTitle] = useState('');
  const [lastPrice, setLastPrice] = useState<string>('');
  const [afterDiscountPrice, setAfterDiscountPrice] = useState<string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(categories[0] || 'Necklaces');

  // New category creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  // --- Edit Product States ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLastPrice, setEditLastPrice] = useState('');
  const [editAfterDiscountPrice, setEditAfterDiscountPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editKeptImages, setEditKeptImages] = useState<string[]>([]);
  const [editRemovedImages, setEditRemovedImages] = useState<string[]>([]);
  const [editNewImages, setEditNewImages] = useState<SelectedImage[]>([]);
  const [isEditingSaving, setIsEditingSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // --- Delete Confirmation State ---
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Global toast / notification
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const isConfigured = isSupabaseConfigured();

  // Price calculations for creation
  const afterDiscountNum = parseFloat(afterDiscountPrice) || 0;
  const lastPriceNum = parseFloat(lastPrice) || 0;
  const discountPercent = lastPriceNum > 0 && afterDiscountNum > 0 && lastPriceNum > afterDiscountNum
    ? Math.round(((lastPriceNum - afterDiscountNum) / lastPriceNum) * 100)
    : 0;

  // Price calculations for editing
  const editAfterDiscountNum = parseFloat(editAfterDiscountPrice) || 0;
  const editLastPriceNum = parseFloat(editLastPrice) || 0;
  const editDiscountPercent = editLastPriceNum > 0 && editAfterDiscountNum > 0 && editLastPriceNum > editAfterDiscountNum
    ? Math.round(((editLastPriceNum - editAfterDiscountNum) / editLastPriceNum) * 100)
    : 0;

  // --- Handle Admin Password Unlock ---
  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!passwordInput.trim()) {
      setAuthError('Please enter the password.');
      return;
    }

    setIsVerifying(true);
    const res = await verifyAdminPassword(passwordInput);
    setIsVerifying(false);

    if (res.success) {
      sessionStorage.setItem('raya_admin_auth', 'true');
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setAuthError(res.error || 'Incorrect admin password.');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('raya_admin_auth');
    setIsAuthenticated(false);
    showFeedback('Admin portal locked.');
  };

  // --- Handle Creation Image Files ---
  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = 3 - selectedImages.length;
    if (availableSlots <= 0) {
      alert('You can upload a maximum of 3 images per product.');
      return;
    }

    const filesToAdd = Array.from(files).slice(0, availableSlots);
    const newItems: SelectedImage[] = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages(prev => [...prev, ...newItems]);
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => {
      const itemToRemove = prev[indexToRemove];
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // --- Handle Category Creation ---
  const handleSaveCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Category name cannot be empty');
      return;
    }

    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryError('This category already exists');
      return;
    }

    setCategoryError(null);
    const res = await createCategory(trimmed);
    if (!res.success && res.error) {
      setCategoryError(res.error);
      return;
    }

    onCategoryCreated(trimmed);
    setCategory(trimmed);
    setNewCategoryName('');
    setIsCreatingCategory(false);
    showFeedback(`Created category "${trimmed}"`);
  };

  // --- Handle Creation Submit ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isConfigured) {
      setErrorMessage(
        'Supabase is not configured yet. Please open your .env file and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
      return;
    }

    if (selectedImages.length === 0) {
      setErrorMessage('Please add at least 1 image for the product (up to 3 allowed).');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }

    if (!lastPriceNum || lastPriceNum <= 0) {
      setErrorMessage('Please enter a valid Last Price.');
      return;
    }

    if (!afterDiscountNum || afterDiscountNum <= 0) {
      setErrorMessage('Please enter a valid After Discount Price.');
      return;
    }

    if (afterDiscountNum > lastPriceNum) {
      setErrorMessage('After Discount Price should be less than or equal to Last Price.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a product description.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(`Uploading ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} to Supabase Storage...`);

    try {
      const res = await createProduct({
        name: title.trim(),
        description: description.trim(),
        price: afterDiscountNum,
        lastPrice: lastPriceNum,
        category: category,
        images: selectedImages.map(img => img.file),
      });

      if (!res.success || !res.product) {
        setErrorMessage(res.error || 'Failed to create product in database.');
        setIsSubmitting(false);
        setSubmissionProgress('');
        return;
      }

      setCreatedProduct(res.product);
      onProductCreated(res.product);
      setCatalogItems(prev => [res.product!, ...prev]);
      setIsSubmitting(false);
      setSubmissionProgress('');
      showFeedback(`Published "${res.product.name}" to catalog!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error creating product';
      setErrorMessage(message);
      setIsSubmitting(false);
      setSubmissionProgress('');
    }
  };

  const handleResetForm = () => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setSelectedImages([]);
    setTitle('');
    setLastPrice('');
    setAfterDiscountPrice('');
    setDescription('');
    setCategory(categories[0] || 'Necklaces');
    setErrorMessage(null);
    setCreatedProduct(null);
  };

  // --- Handle Edit Setup ---
  const startEditing = (prod: Product) => {
    setEditingProduct(prod);
    setEditTitle(prod.name);
    setEditCategory(prod.category);
    setEditLastPrice(String(prod.lastPrice));
    setEditAfterDiscountPrice(String(prod.price));
    setEditDescription(prod.description);
    setEditKeptImages(prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image]);
    setEditRemovedImages([]);
    setEditNewImages([]);
    setEditError(null);
  };

  const handleEditNewImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentTotal = editKeptImages.length + editNewImages.length;
    const availableSlots = 3 - currentTotal;
    if (availableSlots <= 0) {
      alert('You can have a maximum of 3 images per product.');
      return;
    }

    const filesToAdd = Array.from(files).slice(0, availableSlots);
    const newItems: SelectedImage[] = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setEditNewImages(prev => [...prev, ...newItems]);
  };

  const removeEditKeptImage = (urlToRemove: string) => {
    setEditKeptImages(prev => prev.filter(u => u !== urlToRemove));
    setEditRemovedImages(prev => [...prev, urlToRemove]);
  };

  const removeEditNewImage = (indexToRemove: number) => {
    setEditNewImages(prev => {
      const item = prev[indexToRemove];
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditError(null);

    const totalImagesCount = editKeptImages.length + editNewImages.length;
    if (totalImagesCount === 0) {
      setEditError('Product must have at least 1 image.');
      return;
    }

    if (!editTitle.trim()) {
      setEditError('Product title is required.');
      return;
    }

    if (!editLastPriceNum || editLastPriceNum <= 0) {
      setEditError('Please enter a valid Last Price.');
      return;
    }

    if (!editAfterDiscountNum || editAfterDiscountNum <= 0) {
      setEditError('Please enter a valid After Discount Price.');
      return;
    }

    if (editAfterDiscountNum > editLastPriceNum) {
      setEditError('After Discount Price cannot exceed Last Price.');
      return;
    }

    setIsEditingSaving(true);

    try {
      const res = await updateProduct(editingProduct.id, {
        name: editTitle.trim(),
        description: editDescription.trim(),
        price: editAfterDiscountNum,
        lastPrice: editLastPriceNum,
        category: editCategory,
        keptImageUrls: editKeptImages,
        newImageFiles: editNewImages.map(img => img.file),
        removedImageUrls: editRemovedImages,
      });

      setIsEditingSaving(false);

      if (!res.success || !res.product) {
        setEditError(res.error || 'Failed to update product.');
        return;
      }

      const updated = res.product;
      setCatalogItems(prev => prev.map(p => p.id === updated.id ? updated : p));
      if (onProductUpdated) onProductUpdated(updated);

      // Clean up previews
      editNewImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
      setEditingProduct(null);
      showFeedback(`Successfully updated "${updated.name}" and cleaned up replaced images!`);
    } catch (err: unknown) {
      setIsEditingSaving(false);
      const msg = err instanceof Error ? err.message : 'Error updating product';
      setEditError(msg);
    }
  };

  // --- Handle Delete Product ---
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    const imageUrls = deletingProduct.images && deletingProduct.images.length > 0
      ? deletingProduct.images
      : [deletingProduct.image];

    const res = await deleteProduct(deletingProduct.id, imageUrls);
    setIsDeleting(false);

    if (!res.success) {
      alert(`Failed to delete product: ${res.error}`);
      return;
    }

    setCatalogItems(prev => prev.filter(p => p.id !== deletingProduct.id));
    if (onProductDeleted) onProductDeleted(deletingProduct.id);

    showFeedback(`Deleted "${deletingProduct.name}" and removed all images from storage.`);
    setDeletingProduct(null);
  };

  // Filter catalog items
  const filteredCatalog = catalogItems.filter(item => {
    const matchesCat = catalogCategory === 'All' || item.category.toLowerCase() === catalogCategory.toLowerCase();
    const matchesSearch = !catalogSearch.trim() || 
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // ============================================================================
  // RENDER: PASSWORD PROTECTION GATE (IF NOT AUTHENTICATED)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-[85vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-surface-container/60 border border-outline-variant/50 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <img 
                src={logoImg} 
                alt="Raya Jewels Logo" 
                className="w-16 h-16 rounded-full object-cover border-2 border-secondary/40 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-secondary p-1.5 rounded-full border border-surface shadow-xs">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl text-primary font-bold tracking-tight">
              Admin Portal Access
            </h1>
            <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed">
              Enter your master administrator password to manage catalog inventory and add pieces.
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleUnlock} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  autoFocus
                  required
                  className="w-full py-3.5 pl-4 pr-11 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-sm text-primary transition-colors shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-outline hover:text-primary font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Store Catalog</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================================
  // RENDER: AUTHENTICATED ADMIN PORTAL
  // ============================================================================
  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-8 md:py-12">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-8 right-6 z-[120] bg-primary text-white px-5 py-3 shadow-2xl rounded-xl flex items-center gap-2.5 border border-secondary/40 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-secondary" />
          <span className="text-xs font-semibold">{feedbackToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary bg-surface-container px-2.5 py-1 rounded-full border border-outline-variant/30">
              Admin Portal
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-outline font-medium">
              {catalogItems.length} Products in Catalog
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold mt-1">
            Store Administration
          </h1>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-xl border border-outline-variant/40 hover:border-primary/50 text-xs font-bold uppercase tracking-wider text-primary transition-colors flex items-center gap-2 bg-surface cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-outline" />
            <span>View Live Store</span>
          </button>

          <button
            onClick={handleLock}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-dim text-xs font-bold uppercase tracking-wider text-outline hover:text-primary transition-colors flex items-center gap-2 border border-outline-variant/30 cursor-pointer"
            title="Lock admin portal session"
          >
            <Lock className="w-3.5 h-3.5 text-secondary" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 mt-6 mb-8 border-b border-outline-variant/20 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'add'
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface-container/60 hover:bg-surface-container text-on-surface-variant'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Piece</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'manage'
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface-container/60 hover:bg-surface-container text-on-surface-variant'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Catalog</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'manage' ? 'bg-white/20 text-white' : 'bg-surface text-outline'
          }`}>
            {catalogItems.length}
          </span>
        </button>
      </div>

      {/* ====================================================================== */}
      {/* TAB 1: ADD NEW PRODUCT FORM */}
      {/* ====================================================================== */}
      {activeTab === 'add' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Upload & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant/30">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold uppercase tracking-[0.15em] text-primary flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-secondary" />
                  <span>Product Photos ({selectedImages.length}/3)</span>
                </label>
                <span className="text-[11px] text-outline">Up to 3 images</span>
              </div>

              {/* Upload Dropzone */}
              {selectedImages.length < 3 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant hover:border-primary/60 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-surface hover:bg-surface-container flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">Click to upload photos</p>
                    <p className="text-[11px] text-outline mt-0.5">JPEG, PNG, WEBP (Max 3 files)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageFiles(e.target.files)}
                  />
                </div>
              )}

              {/* Selected Images Grid */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {selectedImages.map((item, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/40 group shadow-xs">
                      <img
                        src={item.previewUrl}
                        alt={`Upload preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] font-bold text-center py-0.5 rounded backdrop-blur-xs uppercase">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Pricing Preview */}
            <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant/30 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Pricing Preview
              </h4>
              <div className="flex items-baseline gap-3 p-4 bg-surface rounded-xl border border-outline-variant/30">
                <span className="text-2xl font-bold text-primary">
                  ₹ {afterDiscountNum > 0 ? afterDiscountNum.toLocaleString('en-IN') : '0'}
                </span>
                {lastPriceNum > 0 && (
                  <span className="text-sm text-outline line-through">
                    ₹ {lastPriceNum.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-outline">
                Shoppers will see the discounted price as primary, with the crossed-out last price.
              </p>
            </div>
          </div>

          {/* Right Column: Product Details Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container/50 p-6 sm:p-8 rounded-2xl border border-outline-variant/30">
              {/* Feedback Banners */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Submission Error</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {createdProduct && (
                <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Product Published Successfully!</span>
                  </div>
                  <p className="text-xs text-emerald-900">
                    <strong>{createdProduct.name}</strong> is now live in the <strong>{createdProduct.category}</strong> collection.
                  </p>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${createdProduct.id}`)}
                      className="text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white py-2 px-4 rounded-lg hover:bg-emerald-900 transition-colors"
                    >
                      View Live Product
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-xs font-bold uppercase tracking-wider bg-white text-emerald-800 border border-emerald-300 py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      Add Another Piece
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Celestial Sky Butterfly Pendant"
                    required
                    className="w-full py-3.5 px-4 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-sm text-primary transition-colors"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                      className="text-xs text-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isCreatingCategory ? 'Cancel New Category' : 'Create New Category'}</span>
                    </button>
                  </div>

                  {isCreatingCategory ? (
                    <div className="p-4 bg-surface rounded-xl border border-secondary/40 space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter new category name (e.g. Anklets)"
                          className="flex-1 py-2 px-3 bg-surface-container rounded-lg border border-outline-variant text-xs focus:outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={handleSaveCategory}
                          className="py-2 px-4 bg-secondary text-primary font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Save
                        </button>
                      </div>
                      {categoryError && (
                        <p className="text-[11px] text-rose-600">{categoryError}</p>
                      )}
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full py-3.5 px-4 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-sm text-primary transition-colors cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">
                      MRP (Original ₹) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={lastPrice}
                      onChange={(e) => setLastPrice(e.target.value)}
                      placeholder="e.g. 560"
                      required
                      className="w-full py-3.5 px-4 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-sm text-primary transition-colors"
                    />
                    <span className="text-[10px] text-outline mt-1 block">Crossed-out original price</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">
                      After Discount Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={afterDiscountPrice}
                      onChange={(e) => setAfterDiscountPrice(e.target.value)}
                      placeholder="e.g. 280"
                      required
                      className="w-full py-3.5 px-4 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-sm text-primary transition-colors"
                    />
                    <span className="text-[10px] text-outline mt-1 block">Final selling price</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">
                    Product Description *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed description of the jewelry piece..."
                    required
                    className="w-full py-3.5 px-4 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-sm text-primary transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>{submissionProgress || 'Publishing Piece...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <span>Publish Piece to Catalog</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 2: MANAGE CATALOG (INVENTORY VIEW) */}
      {/* ====================================================================== */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Category Chips */}
          <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search piece by name or category..."
                  className="w-full py-2.5 pl-10 pr-4 bg-surface rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none text-xs text-primary transition-colors"
                />
                {catalogSearch && (
                  <button
                    onClick={() => setCatalogSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <span className="text-xs text-outline font-medium">
                Showing {filteredCatalog.length} of {catalogItems.length} pieces
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    catalogCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface hover:bg-surface-dim text-on-surface-variant border border-outline-variant/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          {filteredCatalog.length === 0 ? (
            <div className="p-12 text-center bg-surface-container/30 rounded-2xl border border-outline-variant/30">
              <p className="font-serif text-lg text-primary font-bold">No products found</p>
              <p className="text-xs text-on-surface-variant mt-1">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCatalog.map((item) => {
                const imgList = item.images && item.images.length > 0 ? item.images : [item.image];
                const pct = item.lastPrice > item.price
                  ? Math.round(((item.lastPrice - item.price) / item.lastPrice) * 100)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-surface-container/40 rounded-2xl p-3.5 border border-outline-variant/30 flex flex-col justify-between hover:border-outline-variant transition-all hover:shadow-md group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3 border border-outline-variant/20">
                        <img
                          src={imgList[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {imgList.length} {imgList.length === 1 ? 'image' : 'images'}
                        </div>
                        {pct > 0 && (
                          <div className="absolute top-2 right-2 bg-rose-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {pct}% OFF
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">
                        {item.category}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-primary truncate mt-0.5" title={item.name}>
                        {item.name}
                      </h3>

                      <div className="flex items-baseline gap-2 mt-1.5 mb-2">
                        <span className="text-sm font-bold text-primary">
                          ₹ {item.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-outline line-through">
                          ₹ {item.lastPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 mt-3 border-t border-outline-variant/20">
                      <button
                        onClick={() => startEditing(item)}
                        className="flex-1 py-2 px-3 bg-surface hover:bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-secondary" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingProduct(item)}
                        className="py-2 px-3 bg-surface hover:bg-rose-50 border border-outline-variant/40 hover:border-rose-300 rounded-lg text-xs font-bold text-rose-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* EDIT PRODUCT MODAL */}
      {/* ====================================================================== */}
      {editingProduct && (
        <div 
          className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="relative bg-surface rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                  Edit Item
                </span>
                <h2 className="font-serif text-2xl text-primary font-bold">
                  {editingProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {editError && (
              <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full py-3 px-4 bg-surface-container rounded-xl border border-outline-variant/60 text-sm text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                  Category *
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full py-3 px-4 bg-surface-container rounded-xl border border-outline-variant/60 text-sm text-primary focus:outline-none focus:border-primary cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                    Last Price (Original ₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={editLastPrice}
                    onChange={(e) => setEditLastPrice(e.target.value)}
                    required
                    className="w-full py-3 px-4 bg-surface-container rounded-xl border border-outline-variant/60 text-sm text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                    After Discount Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={editAfterDiscountPrice}
                    onChange={(e) => setEditAfterDiscountPrice(e.target.value)}
                    required
                    className="w-full py-3 px-4 bg-surface-container rounded-xl border border-outline-variant/60 text-sm text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="w-full py-3 px-4 bg-surface-container rounded-xl border border-outline-variant/60 text-sm text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Images Management */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    Images ({editKeptImages.length + editNewImages.length}/3)
                  </label>
                  <span className="text-[11px] text-outline">
                    Removed images will be permanently deleted from storage
                  </span>
                </div>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {/* Kept existing images */}
                  {editKeptImages.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/40 group">
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeEditKeptImage(url)}
                        className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded-full transition-colors cursor-pointer"
                        title="Remove image (will be deleted from storage on save)"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5">
                        Current
                      </div>
                    </div>
                  ))}

                  {/* Newly selected images */}
                  {editNewImages.map((item, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-secondary group">
                      <img src={item.previewUrl} alt={`New upload ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeEditNewImage(i)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                        title="Cancel new image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-secondary text-primary text-[8px] font-bold text-center py-0.5">
                        New
                      </div>
                    </div>
                  ))}

                  {/* Add Image Button */}
                  {editKeptImages.length + editNewImages.length < 3 && (
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-outline-variant hover:border-primary flex flex-col items-center justify-center gap-1 cursor-pointer bg-surface-container/50 hover:bg-surface-container transition-colors"
                    >
                      <Plus className="w-5 h-5 text-outline" />
                      <span className="text-[10px] font-bold text-outline uppercase">Add</span>
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleEditNewImageFiles(e.target.files)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-outline-variant/60 text-xs font-bold uppercase tracking-wider text-outline hover:text-primary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditingSaving}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isEditingSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save & Update Item</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ====================================================================== */}
      {deletingProduct && (
        <div 
          className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingProduct(null)}
        >
          <div 
            className="relative bg-surface rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-primary">
              Delete "{deletingProduct.name}"?
            </h3>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              This action cannot be undone. This product will be permanently removed from the catalog and all its images will be deleted from Supabase storage.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-outline-variant/60 text-xs font-bold uppercase tracking-wider text-outline hover:text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Item</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
