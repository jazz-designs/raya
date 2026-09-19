import { supabase, isSupabaseConfigured, STORAGE_BUCKET, PRODUCTS_TABLE, CATEGORIES_TABLE } from '../lib/supabase';
import { Product } from '../data';

export const DEFAULT_CATEGORIES = ["Necklaces", "Bracelets", "Bangles", "Earrings", "Watches"];

export interface CreateProductInput {
  name: string;
  description: string;
  price: number; // After discount price
  lastPrice: number; // Last price before discount
  category: string;
  images: (File | string)[]; // can be uploaded files or existing URL strings
}

export interface DbProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  last_price: number;
  category: string;
  image: string;
  images?: string[];
  created_at?: string;
}

/**
 * Maps Supabase DB row to frontend Product model
 */
export function mapDbRowToProduct(row: DbProductRow): Product {
  const imagesArray = Array.isArray(row.images) && row.images.length > 0 
    ? row.images 
    : [row.image];

  return {
    id: String(row.id),
    name: row.name || 'Untitled Piece',
    description: row.description || '',
    price: Number(row.price) || 0,
    lastPrice: Number(row.last_price) || Number(row.price),
    image: row.image || imagesArray[0] || '',
    images: imagesArray,
    category: row.category || 'Fine Jewelry',
  };
}

/**
 * Fetches all products from the Supabase products table
 */
export async function fetchProducts(): Promise<{ data: Product[]; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { 
      data: [], 
      error: 'Supabase is not configured yet. Please enter your Supabase URL & Anon Key in the .env file.' 
    };
  }

  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return { data: [], error: error.message };
    }

    const mapped = (data || []).map(mapDbRowToProduct);
    return { data: mapped, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error fetching products';
    console.error('fetchProducts exception:', err);
    return { data: [], error: message };
  }
}

/**
 * Fetches a single product by ID
 */
export async function fetchProductById(id: string): Promise<{ data: Product | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data ? mapDbRowToProduct(data) : null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error retrieving product';
    return { data: null, error: message };
  }
}

/**
 * Fetches categories list from Supabase categories table, merged with defaults
 */
export async function fetchCategories(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('name')
      .order('name', { ascending: true });

    if (error || !data) {
      console.warn('Could not fetch categories table, using defaults:', error?.message);
      return DEFAULT_CATEGORIES;
    }

    const fetchedNames = data.map(item => item.name).filter(Boolean);
    const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...fetchedNames]));
    return combined;
  } catch (err) {
    console.warn('Exception fetching categories:', err);
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Creates a new category in Supabase categories table
 */
export async function createCategory(name: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, error: 'Category name cannot be empty.' };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from(CATEGORIES_TABLE)
      .insert([{ name: trimmed }]);

    if (error && !error.message.includes('unique') && !error.message.includes('duplicate')) {
      console.error('Error inserting category:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creating category';
    return { success: false, error: message };
  }
}

/**
 * Uploads a single image to the Supabase storage bucket and returns its public URL
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { 
      url: null, 
      error: 'Supabase credentials missing in .env.' 
    };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Supabase image upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to upload image';
    return { url: null, error: message };
  }
}

/**
 * Creates a new product in Supabase:
 * 1. Uploads all provided image files to Supabase Storage
 * 2. Inserts the product record into the products table
 */
export async function createProduct(
  input: CreateProductInput
): Promise<{ success: boolean; product?: Product; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { 
      success: false, 
      error: 'Supabase is not configured yet. Add your credentials in .env.' 
    };
  }

  try {
    const uploadedUrls: string[] = [];

    for (const img of input.images.slice(0, 3)) {
      if (img instanceof File) {
        const { url, error: uploadErr } = await uploadProductImage(img);
        if (uploadErr || !url) {
          return { success: false, error: `Image upload failed: ${uploadErr}` };
        }
        uploadedUrls.push(url);
      } else if (typeof img === 'string' && img.trim().length > 0) {
        uploadedUrls.push(img.trim());
      }
    }

    if (uploadedUrls.length === 0) {
      return { success: false, error: 'At least one product image is required.' };
    }

    const primaryImage = uploadedUrls[0];
    const discountPrice = Number(input.price);
    const lastPrice = Number(input.lastPrice);

    const rowToInsert = {
      name: input.name.trim(),
      description: input.description.trim(),
      price: discountPrice,
      last_price: lastPrice,
      category: input.category,
      image: primaryImage,
      images: uploadedUrls,
    };

    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert([rowToInsert])
      .select('*')
      .single();

    if (error) {
      console.error('Error inserting product:', error);
      return { success: false, error: error.message };
    }

    const created = mapDbRowToProduct(data);
    return { success: true, product: created };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creating product';
    return { success: false, error: message };
  }
}

/**
 * Extracts storage relative file path from a Supabase public URL
 */
export function extractStoragePathFromUrl(url: string, bucket = STORAGE_BUCKET): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(url.substring(idx + marker.length));
  }
  if (!url.startsWith('http') && !url.includes('/')) {
    return url;
  }
  return null;
}

/**
 * Deletes image files from Supabase Storage bucket
 */
export async function deleteStorageFiles(urls: string[]): Promise<void> {
  if (!isSupabaseConfigured() || !urls || urls.length === 0) return;

  const paths = urls
    .map(u => extractStoragePathFromUrl(u, STORAGE_BUCKET))
    .filter((p): p is string => Boolean(p));

  if (paths.length === 0) return;

  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    if (error) {
      console.error('Error removing files from Supabase storage:', error);
    }
  } catch (err) {
    console.error('Exception removing files from Supabase storage:', err);
  }
}

export interface UpdateProductInput {
  name: string;
  description: string;
  price: number;
  lastPrice: number;
  category: string;
  keptImageUrls: string[];
  newImageFiles: File[];
  removedImageUrls: string[];
}

/**
 * Updates an existing product:
 * 1. Uploads newly added image files
 * 2. Deletes removed images from Supabase storage
 * 3. Updates the database row
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<{ success: boolean; product?: Product; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    // 1. Upload new image files
    const newUploadedUrls: string[] = [];
    for (const file of input.newImageFiles) {
      const { url, error: uploadErr } = await uploadProductImage(file);
      if (uploadErr || !url) {
        return { success: false, error: `Image upload failed: ${uploadErr}` };
      }
      newUploadedUrls.push(url);
    }

    // 2. Clean up removed images from storage
    if (input.removedImageUrls && input.removedImageUrls.length > 0) {
      await deleteStorageFiles(input.removedImageUrls);
    }

    // 3. Assemble final images array
    const finalImages = [...input.keptImageUrls, ...newUploadedUrls];
    if (finalImages.length === 0) {
      return { success: false, error: 'Product must have at least one image.' };
    }

    const rowToUpdate = {
      name: input.name.trim(),
      description: input.description.trim(),
      price: Number(input.price),
      last_price: Number(input.lastPrice),
      category: input.category,
      image: finalImages[0],
      images: finalImages,
    };

    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(rowToUpdate)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating product in Supabase:', error);
      return { success: false, error: error.message };
    }

    const updated = mapDbRowToProduct(data);
    return { success: true, product: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating product';
    return { success: false, error: message };
  }
}

/**
 * Deletes a product from database and removes all its images from storage
 */
export async function deleteProduct(
  id: string,
  imageUrls: string[] = []
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    // 1. Delete associated images from storage
    if (imageUrls.length > 0) {
      await deleteStorageFiles(imageUrls);
    }

    // 2. Delete row from database
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting product';
    return { success: false, error: message };
  }
}

/**
 * Verifies admin password via Supabase RPC or admin_settings table, with fallback
 */
export async function verifyAdminPassword(password: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = password.trim();
  if (!trimmed) {
    return { success: false, error: 'Please enter the admin password.' };
  }

  // 1. Try Supabase RPC verify_admin_password
  try {
    const { data, error } = await supabase.rpc('verify_admin_password', {
      input_password: trimmed,
    });

    if (!error && typeof data === 'boolean') {
      if (data) return { success: true };
      return { success: false, error: 'Incorrect admin password. Please try again.' };
    }
  } catch {
    // RPC might not be created yet; fall through
  }

  // 2. Try direct select from admin_settings table
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_password')
      .maybeSingle();

    if (!error && data && typeof data.value === 'string') {
      const isMatch = data.value === trimmed;
      if (isMatch) return { success: true };
      return { success: false, error: 'Incorrect admin password. Please try again.' };
    }
  } catch {
    // Table might not be created yet; fall through
  }

  // 3. Fallback verification for Raya2244** so user is never locked out before running SQL
  const fallbackPassword = 'Raya2244**';
  if (trimmed === fallbackPassword) {
    return { success: true };
  }

  return { success: false, error: 'Incorrect admin password. Please try again.' };
}
