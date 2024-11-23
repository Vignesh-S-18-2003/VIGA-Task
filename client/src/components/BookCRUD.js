import React, { useEffect, useState } from "react";
import { fetchBooks, addBook, deleteBook } from "../api";
import EditBookForm from "./EditBookForm";
import { useNavigate } from "react-router-dom";

function BookCRUD() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // For filtered results
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    ISBN: "",
    genre: ""
  });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [editingBook, setEditingBook] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      const { data } = await fetchBooks();
      setBooks(data);
      setFilteredBooks(data); // Initialize filteredBooks with all books
    };
    getBooks();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const lowerCaseTerm = term.toLowerCase();
    const results = books.filter((book) =>
      book.title.toLowerCase().includes(lowerCaseTerm) ||
      book.author.toLowerCase().includes(lowerCaseTerm) ||
      book.genre.toLowerCase().includes(lowerCaseTerm) ||
      book.ISBN.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredBooks(results);
  };

  const handleAddBook = async () => {
    try {
      await addBook(bookDetails, token);
      alert("Book added successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error adding book");
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
  };

  const handleSave = () => {
    setEditingBook(null);
    window.location.reload();
  };

  const handleCancel = () => {
    setEditingBook(null);
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id, token);
      alert("Book deleted successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error deleting book");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2>Admin: Book CRUD</h2>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      
      {editingBook ? (
        <EditBookForm
          book={editingBook}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div>
          <div className="mb-3">
            <h4>Add a New Book</h4>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              onChange={(e) =>
                setBookDetails({ ...bookDetails, title: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Author"
              onChange={(e) =>
                setBookDetails({ ...bookDetails, author: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="ISBN"
              onChange={(e) =>
                setBookDetails({ ...bookDetails, ISBN: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Genre"
              onChange={(e) =>
                setBookDetails({ ...bookDetails, genre: e.target.value })
              }
              required
            />
            <input
              type="file"
              className="form-control mb-3"
              placeholder="Upload Book Image"
            />
            <button className="btn btn-primary" onClick={handleAddBook}>
              Add Book
            </button>
          </div>

          <h3>Search Books:</h3>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by title, author, genre, or ISBN"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <h3>Book List:</h3>
          <div className="row">
            {filteredBooks.map((book) => (
              <div key={book._id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">Author: {book.author}</p>
                    <p className="card-text">ISBN: {book.ISBN}</p>
                    <p className="card-text">Genre: {book.genre}</p>
                    <button
                      className="btn btn-warning mr-2" style={{marginRight:'15px'}}
                      onClick={() => handleEditClick(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteBook(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookCRUD;
