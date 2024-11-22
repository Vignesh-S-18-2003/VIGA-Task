import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Update() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when the component mounts
    axios.get(`http://localhost:3000/user/${id}`)
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setAge(res.data.age);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data
    axios.put(`http://localhost:3000/editUser/${id}`, { name, email, age })
      .then(res => {
        navigate('/');
        alert('User updated successfully!');
      })
      .catch(err => {
        console.log(err);
        alert('Failed to update user.');
      });
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Edit User</h2>
          <div className='mb-2'>
            <label>Name</label>
            <input
              type='text'
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='mb-2'>
            <label>Email</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-2'>
            <label>Age</label>
            <input
              type='number'
              className='form-control'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <button className='btn btn-success' type='submit'>Update</button>
        </form>
      </div>
    </div>
  );
}

export default Update;
