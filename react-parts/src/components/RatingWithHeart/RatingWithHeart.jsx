import { useState } from 'react';
import './RatingWithHeart.css';

export default function RatingWithHeart({ 
  rating = 5.0, 
  isFavorite = false, 
  onToggleFavorite,
  maxStars = 5 
}) {
  return (
    <div className="rating-with-heart">
      <div className="stars-container">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = rating >= starValue;
          
          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              className={`star ${isFilled ? 'star-filled' : 'star-empty'}`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          );
        })}
      </div>

      {/* Число рейтинга */}
      <span className="rating-score">{rating.toFixed(1)}</span>

      {/* Сердечко */}
      <button 
        className={`heart-button ${isFavorite ? 'heart-active' : ''}`}
        onClick={onToggleFavorite}
        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <svg viewBox="0 0 24 24" className="heart-icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </div>
  );
}