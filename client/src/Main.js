import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Main() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000')
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/deleteUser/${id}`)
      .then(res => {
        setUsers(users.filter(user => user._id !== id));
        alert('User deleted successfully!');
      })
      .catch(err => {
        console.log(err);
        alert('Failed to delete user.');
      });
  };
 

  
  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <Link to="/create" className='btn btn-primary mb-3'>Add New</Link>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>
                  <Link to={`/update/${user._id}`} className='btn btn-sm btn-warning mr-2'>Edit</Link>
                  <button onClick={() => handleDelete(user._id)} className='btn btn-sm btn-danger'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Main;
