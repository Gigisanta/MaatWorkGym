'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Loader2,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Star,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface ProductVariant {
  id?: string;
  flavor?: string;
  size?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  categoryId?: string;
  category?: { id: string; name: string };
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  benefits?: string;
  ingredients?: string;
  directions?: string;
  warnings?: string;
  servingsPerContainer?: number;
  servingSize?: string;
  variants?: ProductVariant[];
  minPrice?: number;
  totalStock?: number;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  tags: string;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  benefits: string;
  ingredients: string;
  directions: string;
  warnings: string;
  servingsPerContainer: string;
  servingSize: string;
}

const defaultFormData: ProductFormData = {
  name: '',
  slug: '',
  brand: '',
  categoryId: '',
  shortDescription: '',
  description: '',
  imageUrl: '',
  tags: '',
  featured: false,
  bestSeller: false,
  isNew: false,
  benefits: '',
  ingredients: '',
  directions: '',
  warnings: '',
  servingsPerContainer: '',
  servingSize: '',
};

// Confirm Modal Component
function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-destructive/10">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>
          <div className="px-6 py-4 border-t border-border bg-secondary/50 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-border hover:bg-card transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 bg-destructive hover:bg-destructive text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Variant Row Component
function VariantRow({
  variant,
  onUpdate,
  onRemove,
  index,
}: {
  variant: ProductVariant;
  onUpdate: (field: keyof ProductVariant, value: string | number) => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/30 rounded-lg">
      <div className="col-span-2">
        <input
          type="text"
          value={variant.flavor || ''}
          onChange={(e) => onUpdate('flavor', e.target.value)}
          placeholder="Sabor"
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background"
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          value={variant.size || ''}
          onChange={(e) => onUpdate('size', e.target.value)}
          placeholder="Tamaño"
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={variant.price || ''}
          onChange={(e) => onUpdate('price', parseFloat(e.target.value) || 0)}
          placeholder="Precio"
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={variant.originalPrice || ''}
          onChange={(e) => onUpdate('originalPrice', parseFloat(e.target.value) || 0)}
          placeholder="Precio orig."
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={variant.stock || ''}
          onChange={(e) => onUpdate('stock', parseInt(e.target.value) || 0)}
          placeholder="Stock"
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background"
        />
      </div>
      <div className="col-span-1">
        <input
          type="text"
          value={variant.sku || ''}
          onChange={(e) => onUpdate('sku', e.target.value)}
          placeholder="SKU"
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          onClick={onRemove}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
          aria-label="Eliminar variante"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({
  product,
  categories,
  onClose,
  onSave,
  isLoading,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: ProductFormData, variants: ProductVariant[]) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (product) {
      return {
        name: product.name || '',
        slug: product.slug || '',
        brand: product.brand || '',
        categoryId: product.categoryId || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        tags: product.tags?.join(', ') || '',
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        isNew: product.isNew || false,
        benefits: product.benefits || '',
        ingredients: product.ingredients || '',
        directions: product.directions || '',
        warnings: product.warnings || '',
        servingsPerContainer: product.servingsPerContainer?.toString() || '',
        servingSize: product.servingSize || '',
      };
    }
    return defaultFormData;
  });

  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
  const [showVariants, setShowVariants] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, variants);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { flavor: '', size: '', price: 0, originalPrice: 0, stock: 0, sku: '' },
    ]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden sm:rounded-2xl bg-card border border-border shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {product ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {product ? 'Actualiza los datos del producto' : 'Completa los datos del nuevo producto'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <form onSubmit={handleSubmit} className="space-y-6" id="product-form">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  Información Básica
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nombre del Producto *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="Ej: Proteína Whey 100%"
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="slug" className="text-sm font-medium text-foreground">
                        Slug (URL)
                      </label>
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Generar desde nombre
                      </button>
                    </div>
                    <input
                      id="slug"
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="proteina-whey-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="brand" className="text-sm font-medium text-foreground">
                      Marca
                    </label>
                    <input
                      id="brand"
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="Ej: Optimum Nutrition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="categoryId" className="text-sm font-medium text-foreground">
                      Categoría
                    </label>
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="shortDescription" className="text-sm font-medium text-foreground">
                      Descripción Corta
                    </label>
                    <input
                      id="shortDescription"
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="Breve descripción del producto"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="description" className="text-sm font-medium text-foreground">
                      Descripción Completa
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all resize-none"
                      placeholder="Descripción detallada del producto..."
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="imageUrl" className="text-sm font-medium text-foreground">
                      URL de Imagen
                    </label>
                    <div className="relative">
                      <input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="tags" className="text-sm font-medium text-foreground">
                      Tags (separados por coma)
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="proteína, whey, ganar músculo"
                    />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  Características
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('featured', !formData.featured)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      formData.featured
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    <Sparkles size={14} />
                    Destacado
                    {formData.featured && <Check size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('bestSeller', !formData.bestSeller)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      formData.bestSeller
                        ? 'bg-warning/10 border-warning text-warning'
                        : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    <Flame size={14} />
                    Más Vendido
                    {formData.bestSeller && <Check size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isNew', !formData.isNew)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      formData.isNew
                        ? 'bg-success/10 border-success text-success'
                        : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    <Sparkles size={14} />
                    Nuevo
                    {formData.isNew && <Check size={14} />}
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertCircle size={16} className="text-primary" />
                  Detalles del Producto
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="benefits" className="text-sm font-medium text-foreground">
                      Beneficios
                    </label>
                    <textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all resize-none"
                      placeholder="Beneficios del producto..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ingredients" className="text-sm font-medium text-foreground">
                      Ingredientes
                    </label>
                    <textarea
                      id="ingredients"
                      value={formData.ingredients}
                      onChange={(e) => handleInputChange('ingredients', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all resize-none"
                      placeholder="Lista de ingredientes..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="directions" className="text-sm font-medium text-foreground">
                      Modo de Uso
                    </label>
                    <textarea
                      id="directions"
                      value={formData.directions}
                      onChange={(e) => handleInputChange('directions', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all resize-none"
                      placeholder="Instrucciones de uso..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="warnings" className="text-sm font-medium text-foreground">
                      Advertencias
                    </label>
                    <textarea
                      id="warnings"
                      value={formData.warnings}
                      onChange={(e) => handleInputChange('warnings', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all resize-none"
                      placeholder="Advertencias de uso..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="servingsPerContainer" className="text-sm font-medium text-foreground">
                      Porciones por Envase
                    </label>
                    <input
                      id="servingsPerContainer"
                      type="number"
                      value={formData.servingsPerContainer}
                      onChange={(e) => handleInputChange('servingsPerContainer', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="servingSize" className="text-sm font-medium text-foreground">
                      Tamaño de Porción
                    </label>
                    <input
                      id="servingSize"
                      type="text"
                      value={formData.servingSize}
                      onChange={(e) => handleInputChange('servingSize', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
                      placeholder="30g (1 scoop)"
                    />
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Package size={16} className="text-primary" />
                    Variantes
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowVariants(!showVariants)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showVariants ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showVariants ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                {showVariants && (
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-3">
                      <div className="col-span-2">Sabor</div>
                      <div className="col-span-2">Tamaño</div>
                      <div className="col-span-2">Precio</div>
                      <div className="col-span-2">Precio Orig.</div>
                      <div className="col-span-2">Stock</div>
                      <div className="col-span-1">SKU</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Variant Rows */}
                    {variants.map((variant, index) => (
                      <VariantRow
                        key={index}
                        variant={variant}
                        index={index}
                        onUpdate={(field, value) => updateVariant(index, field, value)}
                        onRemove={() => removeVariant(index)}
                      />
                    ))}

                    {/* Add Variant Button */}
                    <button
                      type="button"
                      onClick={addVariant}
                      className="w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Plus size={16} />
                      Agregar Variante
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-secondary/50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border hover:bg-card transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {product ? 'Actualizar' : 'Crear Producto'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Main Page Component
export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/ecommerce/products?page=1&limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/ecommerce/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category?.name?.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  // Handle create/update product
  const handleSaveProduct = async (formData: ProductFormData, variants: ProductVariant[]) => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        servingsPerContainer: formData.servingsPerContainer
          ? parseInt(formData.servingsPerContainer)
          : undefined,
        featured: formData.featured || undefined,
        bestSeller: formData.bestSeller || undefined,
        isNew: formData.isNew || undefined,
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/ecommerce/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/ecommerce/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const result = await res.json();
        const productId = editingProduct?.id || result.id;

        // Handle variants
        for (const variant of variants) {
          if (variant.id) {
            // Update existing variant
            await fetch(`/api/ecommerce/variants/${variant.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(variant),
            });
          } else {
            // Create new variant
            await fetch(`/api/ecommerce/products/${productId}/variants`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(variant),
            });
          }
        }

        // Refresh products
        await fetchProducts();
        setShowProductModal(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!showDeleteConfirm) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/ecommerce/products/${showDeleteConfirm.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Optimistic update
        setProducts((prev) => prev.filter((p) => p.id !== showDeleteConfirm.id));
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open modal for add/edit
  const openProductModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  // Get stock status
  const getStockStatus = (product: Product) => {
    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
    if (totalStock === 0) return { label: 'Sin Stock', variant: 'destructive' as const };
    if (totalStock < 10) return { label: 'Stock Bajo', variant: 'warning' as const };
    return { label: 'En Stock', variant: 'success' as const };
  };

  // Get min price from variants
  const getMinPrice = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return null;
    const min = Math.min(...product.variants.map((v) => v.price));
    return min;
  };

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20 shrink-0 border-b border-border/60 bg-background">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Productos</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {filteredProducts.length} productos
            </p>
          </div>
        </div>

        <button
          onClick={() => openProductModal(null)}
          className="flex items-center justify-center gap-2 min-h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          <span>Agregar Producto</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, marca, categoría o tags..."
                className="w-full min-h-11 pl-11 pr-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Package className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? 'No se encontraron productos' : 'No hay productos registrados'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => openProductModal(null)}
                  className="flex items-center gap-2 min-h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
                >
                  <Plus size={16} />
                  Agregar Producto
                </button>
              )}
            </div>
          ) : (
            /* Products Table */
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Producto
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                        Marca
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                        Categoría
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 hidden sm:table-cell">
                        Precio
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 hidden xl:table-cell">
                        Stock
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Badges
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product);
                      const minPrice = getMinPrice(product);
                      return (
                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package size={18} className="text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                                  {product.name}
                                </p>
                                {product.shortDescription && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[180px] hidden sm:block">
                                    {product.shortDescription}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-sm text-foreground">
                              {product.brand || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-sm text-foreground">
                              {product.category?.name || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {minPrice !== null ? (
                              <span className="text-sm font-medium text-foreground">
                                ${minPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              {product.featured && (
                                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                  <Sparkles size={10} className="mr-0.5" />
                                  Destacado
                                </Badge>
                              )}
                              {product.bestSeller && (
                                <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                                  <Flame size={10} className="mr-0.5" />
                                  Top
                                </Badge>
                              )}
                              {product.isNew && (
                                <Badge variant="success" className="text-[10px] px-1.5 py-0">
                                  <Star size={10} className="mr-0.5" />
                                  Nuevo
                                </Badge>
                              )}
                              {!product.featured && !product.bestSeller && !product.isNew && (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openProductModal(product)}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Editar producto"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  setShowDeleteConfirm({ id: product.id, name: product.name })
                                }
                                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Eliminar producto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          isLoading={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Eliminar Producto"
          message={`¿Estás seguro de que deseas eliminar "${showDeleteConfirm.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteProduct}
          onCancel={() => setShowDeleteConfirm(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
