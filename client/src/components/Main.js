import React, { useEffect, useState } from "react";
import { fetchBooks, addReview, deleteReview, editReview } from "../api";
import { useNavigate } from "react-router";

function Main() {
  const [books, setBooks] = useState([]);
  const [review, setReview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      const { data } = await fetchBooks();
      setBooks(data);
    };
    getBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleAddReview = async (bookId) => {
    await addReview(bookId, {
      reviewer: localStorage.getItem("username"),
      comment: review,
    });
    alert("Review added!");
    setReview("");
    window.location.reload();
  };

  const handleEditReview = async (bookId, reviewId) => {
    console.log("Editing review with bookId:", bookId, "and reviewId:", reviewId);  // Add this log
    const updatedComment = prompt("Enter your updated review:");
    if (!updatedComment) return;
  
    await editReview(bookId, reviewId, updatedComment);
    alert("Review updated!");
    window.location.reload();
  };
  

  const handleDeleteReview = async (bookId, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(bookId, reviewId);
      alert("Review deleted!");
      window.location.reload();
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Logout
      </button>

      <h2>Book List</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {books
        .filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((book) => (
          <div key={book._id} className="mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{book.title}</h3>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <h4 className="mt-3">Reviews:</h4>
                {book.reviews.map((review) => (
                  <div key={review.id} className="mb-3">
                    <p>
                      <strong>{review.reviewer}:</strong> {review.comment}
                    </p>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => handleEditReview(book._id, review.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteReview(book._id, review.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add a review"
                    required
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleAddReview(book._id)}
                  >
                    Add Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Main;
