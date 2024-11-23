import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";
import BookCRUD from "./components/BookCRUD";
import BookReviews from "./components/Main";


function App() {
  const [user, setUser] = useState(localStorage.getItem("username"));

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/login"
            element={<Login setUser={setUser} />} // Pass setUser to Login
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={user === "admin" ? <BookCRUD /> : <Main
               />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
