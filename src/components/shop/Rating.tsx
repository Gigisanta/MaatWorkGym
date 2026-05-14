'use client';

import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function Rating({ rating, reviewCount, size = 'md', showCount = true }: RatingProps) {
  const sizes = {
    sm: { star: 12, gap: 0.5 },
    md: { star: 14, gap: 1 },
    lg: { star: 18, gap: 1.5 },
  };

  const { star: starSize, gap } = sizes[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            size={starSize}
            className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
          />
        ))}
      </div>
      {showCount && typeof reviewCount === 'number' && (
        <span className="text-gray-400 text-xs ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
