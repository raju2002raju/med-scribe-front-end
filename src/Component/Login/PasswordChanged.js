import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordChanged = () => {


    return (
    <div>
      <img src='./Images/Vector 3.png' style={{ width: '100%' }} alt="Vector" className='vector-img' />
      <div className='loginSignup'>
        <div className='password-changed'>
          <img  src='../Images/Successmark.png' />
          <h1>Password Changed!</h1>
          <h4>Your password has been changed successfully.</h4>
            <div className="back-to-login-container">
              <Link to='/login' className="back-to-login-link">
                Back to Login
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};




export default PasswordChanged
