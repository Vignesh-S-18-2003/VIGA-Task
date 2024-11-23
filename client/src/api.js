import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const register = (userData) => API.post("/register", userData);
export const login = (userData) => API.post("/login", userData);
export const fetchBooks = () => API.get("/books");
export const addBook = (bookData, token) =>
  API.post("/books", bookData, { headers: { Authorization: token } });
export const editBook = (id, bookData, token) =>
  API.put(`/books/${id}`, bookData, { headers: { Authorization: token } });
export const deleteBook = (id, token) =>
  API.delete(`/books/${id}`, { headers: { Authorization: token } });
export const fetchReviews = (bookId) => API.get(`/books/${bookId}/reviews`);
export const addReview = (bookId, reviewData) =>
  API.post(`/books/${bookId}/review`, reviewData);
export const editReview = (bookId, reviewId, comment) =>
  API.put(`/books/${bookId}/review/${reviewId}`, { comment });
export const deleteReview = (bookId, reviewId) =>
  API.delete(`/books/${bookId}/review/${reviewId}`);



