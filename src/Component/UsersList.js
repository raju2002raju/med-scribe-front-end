// UsersList.js
import React, { useEffect, useState } from 'react';

const UsersList = () => {
  const [users, setUsers] = useState([]);  // State to hold the fetched users
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [error, setError] = useState(null); // State to hold any error message

  useEffect(() => {
    // Function to fetch data from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users-get-data'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);  // Set the fetched data to the state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading indicator while fetching data
  }

  if (error) {
    return <p>Error: {error}</p>;  // Show an error message if an error occurs
  }

  return (
    <div>
      <h2>Users List</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              Name: {user.name}, Email: {user.email} {/* Display user details */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UsersList;
