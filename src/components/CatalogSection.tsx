import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Plus, Eye, X } from 'lucide-react';
import { FlowerProduct, CartItem } from '../types';
import { PRODUCTS, VASE_OPTIONS } from '../data/flowerData';

interface CatalogSectionProps {
  onSelectProduct: (product: FlowerProduct) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onSelectProduct,
  onAddToCart,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const occasions = ['All', 'Anniversary', 'Birthday', 'Romance', 'Sympathy', 'Celebration', 'Everyday'];
  const categories = ['All', 'Peonies', 'Roses', 'Wildflowers', 'Orchids', 'Seasonal'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Occasion filter
      if (selectedOccasion !== 'All') {
        if (!product.occasions.includes(selectedOccasion as any)) {
          return false;
        }
      }
      // Category filter
      if (selectedCategory !== 'All') {
        if (product.category !== selectedCategory) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBotanic = product.botanicName.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesOccasion = product.occasions.some(o => o.toLowerCase().includes(query));
        if (!matchesName && !matchesBotanic && !matchesDesc && !matchesOccasion) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedOccasion, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: FlowerProduct) => {
    e.stopPropagation();
    onAddToCart({
      product,
      size: 'Standard',
      sizeMultiplier: 1.0,
      vase: VASE_OPTIONS[0], // stem wrap default
      quantity: 1,
      calculatedPrice: product.basePrice,
    });
  };

  return (
    <section id="catalog" className="py-16 bg-[#FAF9F6] border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7870] mb-2">
              Fresh Daily Harvest & Studio Bouquets
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1F1E1D] font-normal tracking-tight">
              Curated Botanical Catalog
            </h2>
            <p className="text-sm text-[#666059] mt-2 max-w-xl">
              Each arrangement is conditioned with flower food, hand-tied in wet hydration wrap, and tailored with custom stem counts and vase pairings.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search peonies, roses, occasions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#DDD8D0] rounded-lg text-[#222] placeholder-[#9C958C] focus:outline-none focus:ring-1 focus:ring-[#23382B] focus:border-[#23382B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-[#222]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#DDD8D0] rounded-lg px-3 py-2 pr-8 text-sm text-[#3E3A35] font-medium focus:outline-none focus:ring-1 focus:ring-[#23382B]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C857B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Bar 1: Occasions (Segmented Buttons) */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7870] mb-2">
            Filter by Occasion
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedOccasion === occ
                    ? 'bg-[#23382B] text-white shadow-xs'
                    : 'bg-white border border-[#E2DDD5] text-[#55504A] hover:bg-[#F2EFE9] hover:text-[#222]'
                }`}
              >
                {occ === 'All' ? 'All Occasions' : occ}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar 2: Flower Type (Segmented Buttons) */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7870] mb-2">
            Flower Variety
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#516E5A] text-white shadow-xs'
                    : 'bg-[#F2EFEA] text-[#5A544D] hover:bg-[#EAE5DD]'
                }`}
              >
                {cat === 'All' ? 'All Stems' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-12 text-center max-w-lg mx-auto">
            <p className="font-display text-xl text-[#222] mb-2">No arrangements found</p>
            <p className="text-sm text-[#777] mb-6">
              We couldn't find any floral designs matching "{searchQuery}" under the selected filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedOccasion('All');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-[#23382B] text-white text-xs font-medium rounded-lg hover:bg-[#1B2B21] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group bg-white rounded-xl border border-[#EAE6DF] hover:border-[#D4CCC0] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[4/3] bg-[#F4F1EB] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Subtle Text Kicker (Zero-Pill compliant) */}
                  <div className="absolute top-3 left-3 bg-[#FAF9F6]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold tracking-wider text-[#35322E] uppercase">
                    {product.category}
                  </div>

                  {product.originalPrice && (
                    <div className="absolute top-3 right-3 bg-[#C47053] text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                      Save ${(product.originalPrice - product.basePrice).toFixed(0)}
                    </div>
                  )}

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="px-4 py-2 bg-white text-[#222] text-xs font-semibold rounded-lg shadow-md hover:bg-[#FAF9F6] transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Customizer</span>
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="px-4 py-2 bg-[#23382B] text-white text-xs font-semibold rounded-lg shadow-md hover:bg-[#1A2C21] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>

                {/* Product Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed Metadata Line with typographic separators */}
                    <div className="flex items-center gap-1.5 text-xs text-[#7A746D] mb-1">
                      <span className="italic font-serif">{product.botanicName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.bloomDuration}</span>
                    </div>

                    <h3 className="font-display text-xl text-[#1F1E1D] font-medium leading-snug group-hover:text-[#23382B] transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#635D56] line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Stem Count Breakdown Teaser */}
                    <div className="mt-3 pt-3 border-t border-[#F2EFE9] flex items-center gap-2 text-xs text-[#68625B]">
                      <span className="font-medium text-[#23382B]">Includes:</span>
                      <span className="truncate">
                        {product.stemBreakdown.map((s) => `${s.count}x ${s.name.split(' ')[0]}`).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Pricing, Reviews & CTA Footer */}
                  <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl font-semibold text-[#1F1E1D] tabular-nums">
                          ${product.basePrice}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#8A847C] line-through tabular-nums">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#716B64] mt-0.5">
                        <Star className="w-3 h-3 fill-[#E6A15C] text-[#E6A15C]" />
                        <span className="font-semibold text-[#222]">{product.rating}</span>
                        <span>({product.reviewsCount})</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-[#23382B] bg-[#EBF1ED] hover:bg-[#DEE7E0] rounded-lg transition-colors"
                    >
                      Select Size & Vase
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
