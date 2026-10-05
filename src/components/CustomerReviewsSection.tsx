import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, PenLine, Filter, Heart, MessageSquare, X } from 'lucide-react';
import { CustomerReview } from '../types';
import { PRODUCTS } from '../data/flowerData';

interface CustomerReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  onAddReview,
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterOccasion, setFilterOccasion] = useState<string>('All');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Form state
  const [author, setAuthor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [selectedBouquet, setSelectedBouquet] = useState<string>(PRODUCTS[0].name);
  const [occasion, setOccasion] = useState<string>('Anniversary');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return +(sum / totalReviews).toFixed(2);
  }, [reviews, totalReviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterRating !== 'all' && r.rating !== filterRating) {
        return false;
      }
      if (filterOccasion !== 'All' && r.occasion !== filterOccasion) {
        return false;
      }
      return true;
    });
  }, [reviews, filterRating, filterOccasion]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !content.trim()) {
      setFormError('Please fill in your name, title, and review message.');
      return;
    }

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || 'New York, NY',
      rating,
      date: 'Just now',
      occasion,
      productName: selectedBouquet,
      title: title.trim(),
      content: content.trim(),
      verified: true,
    };

    onAddReview(newRev);
    setIsWriteModalOpen(false);

    // Reset
    setAuthor('');
    setLocation('');
    setTitle('');
    setContent('');
    setFormError('');
  };

  const occasions = ['All', 'Anniversary', 'Birthday', 'Romance', 'Sympathy', 'Celebration'];

  return (
    <section id="reviews" className="py-16 bg-[#FAF9F6] border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7770] mb-2">
              Verified Patron Testimonials
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1F1E1D] font-normal tracking-tight">
              Customer Reviews & Stories
            </h2>
            <p className="text-sm text-[#666059] mt-2 max-w-xl">
              Authentic feedback from recipients and senders across New York and beyond. We read every reflection to continually refine our floral artistry.
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-5 py-3 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#1A2C21] transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            <PenLine className="w-4 h-4" />
            <span>Write a Customer Review</span>
          </button>
        </div>

        {/* Rating Breakdown & Summary Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E0D8] shadow-xs mb-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Aggregate Score */}
          <div className="md:col-span-4 text-center md:text-left md:border-r border-[#EFECE6] md:pr-8">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-display text-5xl sm:text-6xl font-medium text-[#1F1E1D] tabular-nums">
                {averageRating}
              </span>
              <div>
                <div className="flex items-center gap-1 text-[#E6A15C]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#7A746E] mt-1 font-medium">
                  Based on {totalReviews} verified orders
                </p>
              </div>
            </div>
            <p className="text-xs text-[#5E5953] mt-3 leading-relaxed">
              99.2% of recipients report flowers lasting 7 or more days with complimentary hydration food.
            </p>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
              const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-[#68625B] font-medium flex items-center gap-1 shrink-0">
                    {star} <Star className="w-3 h-3 fill-[#E6A15C] text-[#E6A15C]" />
                  </span>
                  <div className="flex-1 bg-[#F0ECE4] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#23382B] h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[#7A746E] tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#7E7770] uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setFilterOccasion(occ)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    filterOccasion === occ
                      ? 'bg-[#23382B] text-white'
                      : 'bg-white border border-[#E2DDD5] text-[#555] hover:bg-[#F2EFE9]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7A746E]">Rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-white border border-[#DDD8D0] rounded-lg px-2.5 py-1 text-xs text-[#333]"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D0C8BC] transition-colors"
            >
              <div>
                {/* Top Row: Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#E6A15C]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8A847C]">{rev.date}</span>
                </div>

                {/* Title */}
                <h4 className="font-display text-base font-semibold text-[#1F1E1D] mt-2.5 leading-snug">
                  "{rev.title}"
                </h4>

                {/* Body Text */}
                <p className="text-xs text-[#5D5750] mt-2 leading-relaxed">
                  {rev.content}
                </p>
              </div>

              {/* Author & Product Footer (Zero-Pill Compliant) */}
              <div className="pt-3 border-t border-[#F2EFE9]">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1 font-semibold text-[#1F1E1D]">
                      <span>{rev.author}</span>
                      {rev.verified && (
                        <span title="Verified Recipient/Buyer">
                          <CheckCircle className="w-3 h-3 text-[#23382B]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A746E]">{rev.location}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#C47053] font-medium block">{rev.occasion}</span>
                    <span className="text-[10px] text-[#8A847C] truncate max-w-[120px] block">
                      {rev.productName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5E0D8] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4 mb-6">
              <div>
                <h3 className="font-display text-2xl text-[#1F1E1D] font-medium">Share Your Experience</h3>
                <p className="text-xs text-[#7A746E]">Your reflection helps fellow flower lovers and our florists.</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 rounded-lg text-[#666] hover:text-[#222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#1F1E1D] mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#E6A15C] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? 'fill-[#E6A15C]' : 'stroke-[#D0C8BC]'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#222] ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Bouquet selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#444] mb-1">
                    Bouquet Received
                  </label>
                  <select
                    value={selectedBouquet}
                    onChange={(e) => setSelectedBouquet(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444] mb-1">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg"
                  >
                    <option value="Anniversary">Anniversary</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Romance">Romance</option>
                    <option value="Sympathy">Sympathy</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Everyday">Everyday Grace</option>
                  </select>
                </div>
              </div>

              {/* Title & Content */}
              <div>
                <label className="block text-xs font-medium text-[#444] mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gorgeous blooms and punctual courier!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444] mb-1">
                  Your Review / Story *
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about the scent, flower longevity, and delivery presentation..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                />
              </div>

              {/* Author name & city */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#444] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Charlotte B."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444] mb-1">
                    Neighborhood / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Greenwich Village, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-600">{formError}</p>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#666] hover:text-[#222]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2C21] transition-all cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
