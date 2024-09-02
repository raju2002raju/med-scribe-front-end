import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';

const Login = () => {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for checkbox

  async function submit(e) {
    e.preventDefault();
    console.log('Submit function called'); // Debugging log

    // Check if the checkbox is checked
    console.log('Remember Me:', rememberMe); // Debugging log
    if (!rememberMe) {
      alert("Please tick the 'Remember Me' checkbox to proceed.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {  
          email,
          password
      });

      console.log('Response from server:', response);

      if (response.status === 200) { 
        if (response.data.status === "exist") {
          console.log('Navigating to dashboard');
          navigate("/dashboard", { state: { user: response.data.user } });
        } else if (response.data.status === "notexist") {
          alert("User not found or incorrect password");
        }
      } else {
        alert("Password incorrect. Please try again.");
      }
    } catch (error) {
      alert("Failed to login. Please try again.");
      console.error('Error during login:', error);
    }
  }

  return (
    <div>
      <img src='./Images/Vector 3.png' style={{width:'100%'}} className='vector-img'/>
      <div className='loginSignup'>
        <div className='login'>
          <h1>Welcome back! Glad to see you, Again!</h1>
          
          <form onSubmit={submit}>
            <div className='email_container input-icons'>
              <img src='/Images/email.png' className="icon" style={{ width: '20px' }} alt="Email Icon" />
              <input 
                className='input-field'
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder='Enter Your Email'
              />
            </div>
            <div className='password_container input-icons'>
              <img src='./Images/password.png' className="icon" style={{ width: '20px' }} alt="Password Icon" />
              <div className="password-field">
                <input 
                  className='input-field'
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder='Enter Your Password'
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="show-password-btn"
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>
            <div className='Forget_Remember'>
              <div className='check'>
                <input 
                  type='checkbox' 
                  checked={rememberMe} 
                  onChange={(e) => {
                    console.log('Checkbox clicked:', e.target.checked); // Debugging log
                    setRememberMe(e.target.checked); 
                  }} 
                />
                <p style={{fontSize:'15px'}}>Remember Me</p>
              </div>
              <div>
                <Link className='resetPassword' to='/reset_password'>Forgot Password?</Link>
              </div>
            </div>
            <div className='login-btn'>
              <button type="submit" disabled={!rememberMe}>Login</button>
            </div>
            <div>
              <p>Don't have an account? <Link style={{textDecoration:'none'}} to='/signup'><span>Register Now</span></Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
