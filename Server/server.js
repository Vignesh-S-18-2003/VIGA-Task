const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/book-platform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Schemas
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  ISBN: String,
  genre: String,
  reviews: [{ id: String, reviewer: String, comment: String }],
});

const User = mongoose.model("User", UserSchema);
const Book = mongoose.model("Book", BookSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send("Token required.");
  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
};

// Routes
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.send("Registered successfully!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(403).send("Invalid credentials");
  const token = jwt.sign({ username }, "SECRET_KEY");
  res.json({ token });
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/books", authenticate, async (req, res) => {
  if (req.user.username !== "admin") return res.status(403).send("Access denied");
  const book = new Book(req.body);
  await book.save();
  res.send("Book added.");
});

app.put("/books/:id", authenticate, async (req, res) => {
  if (req.user.username !== "admin") return res.status(403).send("Access denied");
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.send("Book updated.");
});

app.delete("/books/:id", authenticate, async (req, res) => {
  if (req.user.username !== "admin") return res.status(403).send("Access denied");
  await Book.findByIdAndDelete(req.params.id);
  res.send("Book deleted.");
});

app.post("/books/:id/review", async (req, res) => {
  const { id } = req.params;
  const { reviewer, comment } = req.body;
  const book = await Book.findById(id);
  book.reviews.push({ id: uuidv4(), reviewer, comment });
  await book.save();
  res.send("Review added.");
});

app.put("/books/:bookId/review/:reviewId", async (req, res) => {
    console.log("Received edit request for bookId:", req.params.bookId, "and reviewId:", req.params.reviewId);  // Add this log
    const { bookId, reviewId } = req.params;
    const { comment } = req.body;
  
    const book = await Book.findById(bookId);
    const review = book.reviews.find((r) => r.id === reviewId);
    if (!review) return res.status(404).send("Review not found");
  
    review.comment = comment;
    await book.save();
    res.send("Review updated.");
  });
  

app.delete("/books/:bookId/review/:reviewId", async (req, res) => {
  const { bookId, reviewId } = req.params;
  const book = await Book.findById(bookId);
  book.reviews = book.reviews.filter((r) => r.id !== reviewId);
  await book.save();
  res.send("Review deleted.");
});

// Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
