import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Create() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const navigate=useNavigate();
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User created:', { name, email, age });
    axios.post("http://localhost:3000/createUser", { name, email, age })
      .then(res => {
        console.log(res);
        navigate("/");
        alert('User created successfully!');
      })
      .catch(err => {
        console.log(err);
        alert('Failed to create user.');
      });
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Add User</h2>
          <div className='mb-2'>
            <label>Name</label>
            <input
              type='text'
              className='form-control'
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className='mb-2'>
            <label>Email</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className='mb-2'>
            <label>Age</label>
            <input
              type='number'
              className='form-control'
              value={age}
              onChange={handleAgeChange}
              required
            />
          </div>
          <button className='btn btn-success' type='submit'>Create</button>
        </form>
      </div>
    </div>
  );
}

export default Create;
