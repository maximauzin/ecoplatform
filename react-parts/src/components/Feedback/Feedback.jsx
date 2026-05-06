import { useState, useEffect } from 'react';
import { getReviews, addReview, deleteReview } from '../../api/reviews';
import { useAuth } from '../../context/AuthContext';
import './Feedback.css';

function StarRating({ rating, maxStars = 5 }) {
  return (
    <div className="star-rating">
      {[...Array(maxStars)].map((_, index) => (
        <span key={index} className={`star ${index < Math.round(rating) ? 'filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function InteractiveStarRating({ rating, setRating, maxStars = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating interactive" style={{ marginBottom: '12px', display: 'flex', gap: '4px' }}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${(hover || rating) >= starValue ? 'filled' : ''}`}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            style={{ 
              cursor: 'pointer', 
              fontSize: '32px',
              color: (hover || rating) >= starValue ? '#F4E2B6' : '#E0E0E0'
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function useReviews(pointId) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const load = () => {
    if (!pointId) return;
    getReviews(pointId)
      .then(data => {
        setReviews(data);
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverageRating(Math.round(avg * 10) / 10);
        } else {
          setAverageRating(0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [pointId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { reviews, averageRating, reload: load };
}

export default function Feedback({ pointId }) {
  const { user } = useAuth();
  const { reviews, averageRating, reload } = useReviews(pointId);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingReview = user ? reviews.find(r => r.user?.id === user.id) : null;

  useEffect(() => {
    if (existingReview) {
      setNewReviewText(existingReview.text);
      setNewReviewRating(existingReview.rating);
    }
  }, [existingReview]);

  const handlePublish = async () => {
    if (!newReviewText.trim()) return;
    setIsSubmitting(true);
    try {
      if (existingReview) {
        await deleteReview(pointId, existingReview.id);
      }
      await addReview(pointId, newReviewRating, newReviewText);
      reload();
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reviews-section">
      <div className="reviews-summary">
        <div className="summary-left">
          <StarRating rating={averageRating} />
          <span className="score">{averageRating || ''}</span>
        </div>
      </div>

      <h3 className="reviews-title">Отзывы:</h3>

      {user && (
        <div className="review-form-wrapper">
          <div style={{ marginBottom: '8px', fontSize: '20px', fontWeight: '500' }}>
            {existingReview ? 'Вы уже оставили отзыв. Вы можете его изменить:' : 'Оставьте ваш отзыв:'}
          </div>
          <InteractiveStarRating rating={newReviewRating} setRating={setNewReviewRating} />
          <div className="form-area">
            <textarea
              placeholder="Поделитесь мнением о пункте приёма"
              value={newReviewText}
              rows={2}
              onChange={(e) => setNewReviewText(e.target.value)}
            />
          </div>
          <button
            className="btn-publish"
            onClick={handlePublish}
            disabled={!newReviewText.trim() || isSubmitting}
          >
            {isSubmitting ? 'Публикация...' : (existingReview ? 'Обновить отзыв' : 'Опубликовать')}
          </button>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <h4 className="review-author">{review.user?.username || 'Пользователь'}</h4>
            <StarRating rating={review.rating} />
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
