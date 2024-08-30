import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://med-scribe-backend.onrender.com/api/forgot-password", {
        email
      });

      setMessage(response.data.message);
      if (response.data.success) {
        // Redirect to OTP verification page
        navigate('/verify-otp', { state: { email } });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  }

  return (
    <div>
     <img src='./Images/Vector 3.png' style={{width:'100%'}} alt="Vector" />
     <div className='loginSignup'>
      <div className='reset'>
        <h2>Forgot Password</h2>
        <h4>Enter your email and we'll send you a code to reset your password</h4>
        <form onSubmit={handleSubmit}>
          <div className='email_container input-icons'>
            <img src='/Images/email.png' className="icon" style={{ width: '20px' }} alt="Email icon" />
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
            />
          </div>
          <div className='login-btn'>
            <button type="submit">Send Code</button>
          </div>
          <div className='link_login'>
            <div >
              <Link to='/login' className="back-to-login-link">
                <img className="back-to-login-img" src='../Images/back.png' alt="Back Arrow" />
                Back to Login
              </Link>
            </div>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
   </div>
  );
};

export default ForgotPassword;