import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [userEmail, setUserEmail] = useState(""); 
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState(""); 
  const [timer, setTimer] = useState(30); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setUserEmail(emailFromState);
    }
  }, [location.state]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData("text");
    const otpArray = pastedData.split("").slice(0, 6); // Limit to 6 characters

    if (otpArray.length === 6) {
      setOtp(otpArray);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    try {
      const response = await fetch('https://med-scribe-backend.onrender.com/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp: otpString })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('isOtpVerified', otp);
        localStorage.setItem('forgotEmail', userEmail);

        navigate('/create-new-password'); 
      } else {
        alert('Your OTP is invalid or expired');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendMessage(""); 

    try {
      const response = await fetch('https://med-scribe-backend.onrender.com/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const result = await response.json();
      if (result.success) {
        setResendMessage("OTP has been resent successfully!"); 
      } else {
        setResendMessage("Failed to resend OTP. Please try again later.");
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setResendMessage("An error occurred while resending OTP.");
    }
  };

  return (
    <div>
      <img src='./Images/Vector 3.png' alt="vector" style={{ width: '100%' }} className='vector-img' />
      <div className="otp-container">
        <h2>OTP Verification</h2>
        <p>Enter the verification code we just sent to your email address.</p>
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                onPaste={handlePaste} // Handle paste event
              />
            ))}
          </div>
          <button className="btn verify-btn" type="submit">
            Verify
          </button>
          <p className="resend-text">
            Didn't receive the code?{" "}
            <span
              className="resend-link"
              onClick={!isResending ? handleResendOTP : null}
              style={{ cursor: isResending ? "not-allowed" : "pointer", color: isResending ? "gray" : "blue" }}
            >
              {isResending ? `Resend in ${timer} seconds` : "Resend"}
            </span>
          </p>
          {resendMessage && <p className="resend-message">{resendMessage}</p>}
        </form>
      </div>
    </div>  
  );
};

export default OTPVerification;
