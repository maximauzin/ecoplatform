import { useState } from 'react';
import './Feedback.css';

// Вспомогательный компонент для отображения звезд
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

export default function Feedback() {
  // Имитация данных
  const [averageRating] = useState(4.8);
  
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Акакий Кузнецов",
      rating: 5,
      text: "Всё понравилось, отличный пункт!",
    },
    {
      id: 2,
      name: "Алёна",
      rating: 4,
      text: "Неудачное место расположения",
    }
  ]);

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5); // По умолчанию 5 звезд

  const handlePublish = () => {
    if (!newReviewText.trim()) return;

    const newReview = {
      id: Date.now(),
      name: "Вы (Текущий пользователь)", // Здесь можно взять имя из профиля
      rating: newReviewRating,
      text: newReviewText,
    };

    // Добавляем новый отзыв в начало списка
    setReviews([newReview, ...reviews]);
    setNewReviewText(''); // Очищаем поле
  };

  return (
    <div className="reviews-section">
      
      {/* 1. Общий рейтинг */}
      <div className="reviews-summary">
        <div className="summary-left">
          <StarRating rating={averageRating} />
          <span className="score">{averageRating}</span>
        </div>
      </div>

      {/* 2. Заголовок */}
      <h3 className="reviews-title">Отзывы:</h3>

      {/* 3. Форма добавления отзыва */}
      <div className="review-form-wrapper">
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
          disabled={!newReviewText.trim()}
        >
          Опубликовать
        </button>
      </div>

      {/* 4. Список отзывов */}
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <h4 className="review-author">{review.name}</h4>
            <StarRating rating={review.rating} />
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}