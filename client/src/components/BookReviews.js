import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookDetails, addReview, editReview, deleteReview } from '../api/api';
import { useAuth } from '../context/AuthContext'; // Assuming you have a context for managing auth state

const BookReviews = () => {
  const { bookId } = useParams();
  const { user, token } = useAuth(); // Get the logged-in user and token from context
  const [book, setBook] = useState(null);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  
  // Fetch book details and reviews
  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const response = await fetchBookDetails(bookId);
        setBook(response.data);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };
    getBookDetails();
  }, [bookId]);

  // Handle new review submission
  const handleAddReview = async () => {
    if (newReview.rating && newReview.comment) {
      try {
        const reviewData = {
          username: user.username,
          rating: newReview.rating,
          comment: newReview.comment,
        };
        await addReview(bookId, reviewData);
        setNewReview({ rating: '', comment: '' });
        setReviews((prevReviews) => [...prevReviews, reviewData]);
      } catch (error) {
        console.error('Error adding review:', error);
      }
    } else {
      alert('Please provide a rating and comment.');
    }
  };

  // Handle review edit
  const handleEditReview = async () => {
    if (editingReview && editingReview.rating && editingReview.comment) {
      try {
        await editReview(bookId, editingReview.id, editingReview);
        setReviews((prevReviews) =>
          prevReviews.map((rev) =>
            rev.id === editingReview.id ? editingReview : rev
          )
        );
        setEditingReview(null);
      } catch (error) {
        console.error('Error editing review:', error);
      }
    } else {
      alert('Please provide a rating and comment for editing.');
    }
  };

  // Handle review delete
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(bookId, reviewId);
      setReviews((prevReviews) => prevReviews.filter((rev) => rev.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Handle edit button click (pre-fill the review)
  const handleReviewEdit = (review) => {
    setEditingReview({ ...review });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="book-reviews">
      <h3>Reviews for {book ? book.title : 'this book'}</h3>
      {book && (
        <>
          <div>
            <h4>Average Rating: {averageRating.toFixed(1)} / 5</h4>
          </div>
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <div className="review-header">
                    <strong>{review.username}</strong>
                    <span>Rating: {review.rating} / 5</span>
                    {review.username === user?.username && (
                      <div>
                        <button onClick={() => handleReviewEdit(review)}>Edit</button>
                        <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Add/Edit Review Form */}
          <div className="review-form">
            <h4>{editingReview ? 'Edit Your Review' : 'Add Your Review'}</h4>
            <div>
              <label>Rating (1-5):</label>
              <input
                type="number"
                value={editingReview ? editingReview.rating : newReview.rating}
                onChange={(e) =>
                  editingReview
                    ? setEditingReview({ ...editingReview, rating: e.target.value })
                    : setNewReview({ ...newReview, rating: e.target.value })
                }
                min="1"
                max="5"
              />
            </div>
            <div>
              <label>Comment:</label>
              <textarea
                value={editingReview ? editingReview.comment : newReview.comment}
                onChange={(e) =>
                  editingReview
                    ? setEditingReview({ ...editingReview, comment: e.target.value })
                    : setNewReview({ ...newReview, comment: e.target.value })
                }
              />
            </div>
            <div>
              <button onClick={editingReview ? handleEditReview : handleAddReview}>
                {editingReview ? 'Update Review' : 'Add Review'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookReviews;
