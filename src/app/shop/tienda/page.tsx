'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, Grid2X2 } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import type { ShopProduct, Category } from '@/lib/shop/types';
import { getProducts, getCategories } from '@/lib/shop/api';
import { formatCurrency } from '@/lib/shop/formatters';

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') ?? ''
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // UI
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts({
            category: selectedCategory || undefined,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 200000 ? priceRange[1] : undefined,
            sort: sortBy,
            pageSize: 50,
          }),
        ]);
        setCategories(cats);
        setProducts(prods.products);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedCategory, sortBy, priceRange]);

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('category') ?? '';
    if (cat !== selectedCategory) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    const minPrice = Math.min(...p.variants.map(v => v.price));
    if (onlyOnSale && !p.variants.some(v => v.originalPrice && v.originalPrice > v.price)) return false;
    if (onlyInStock && !p.variants.some(v => v.stock > 0)) return false;
    if (minPrice < priceRange[0] || minPrice > priceRange[1]) return false;
    return true;
  });

  const activeFiltersCount = [
    selectedCategory,
    onlyOnSale,
    onlyInStock,
    priceRange[0] > 0 || priceRange[1] < 200000,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory('');
    setOnlyOnSale(false);
    setOnlyInStock(false);
    setPriceRange([0, 200000]);
    setSortBy('name_asc');
    router.replace('/shop/tienda');
  };

  return (
    <div className="min-h-screen bg-[#030712]">

      {/* Page Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-white text-3xl lg:text-4xl font-black mb-2">
            {selectedCategory
              ? categories.find(c => c.slug === selectedCategory)?.name ?? 'Tienda'
              : 'Tienda'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isLoading ? 'Cargando...' : `${filteredProducts.length} productos`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">

          {/* Left: Filter toggle (mobile) + Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm hover:border-orange-500/50 transition-all lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Category pills */}
            <button
              onClick={() => { setSelectedCategory(''); router.replace('/shop/tienda'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !selectedCategory
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  router.replace(`/shop/tienda?category=${cat.slug}`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right: Sort + Grid toggle */}
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="name_asc">Nombre A-Z</option>
              <option value="name_desc">Nombre Z-A</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="newest">Más Nuevos</option>
            </select>

            {/* Grid cols */}
            <div className="hidden lg:flex items-center gap-1 bg-gray-800 rounded-xl p-1">
              {([2, 3, 4] as const).map(cols => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  className={`p-1.5 rounded-lg transition-all ${
                    gridCols === cols ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {cols === 2 ? <Grid2X2 size={16} /> : <Grid3X3 size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Sale filter */}
              <div>
                <h3 className="text-white text-sm font-bold mb-3">Oferta</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={onlyOnSale}
                    onChange={e => setOnlyOnSale(e.target.checked)}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    Solo en oferta
                  </span>
                </label>
              </div>

              {/* Stock filter */}
              <div>
                <h3 className="text-white text-sm font-bold mb-3">Disponibilidad</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={e => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    Solo en stock
                  </span>
                </label>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-white text-sm font-bold mb-3">Precio</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <span className="text-gray-600">—</span>
                  <input
                    type="number"
                    min={0}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500 text-[10px]">{formatCurrency(priceRange[0])}</span>
                  <span className="text-gray-500 text-[10px]">{formatCurrency(priceRange[1])}</span>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-center text-orange-400 text-xs font-semibold hover:text-orange-300 transition-colors"
                >
                  Limpiar filtros ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid gap-4 grid-cols-${gridCols}`}
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-2xl aspect-square animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                  <X size={32} className="text-gray-600" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">No hay productos</p>
                  <p className="text-gray-400 text-sm mt-1">Probá cambiar los filtros</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-400 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopTiendaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
