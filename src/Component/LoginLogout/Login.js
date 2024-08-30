import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log('Token Response:', tokenResponse);

      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenResponse.access_token}`
        }
      })
      .then(response => response.json())
      .then(userInfo => {
        console.log('User Info:', userInfo);  
        localStorage.setItem('user', JSON.stringify(userInfo));
        navigate('/dashboard');
      })
      .catch(error => console.error('Error fetching user info:', error));
    },
    onError: errorResponse => console.error('Login Failed:', errorResponse),
  });

  return (
    <div>
      <button onClick={() => login()}>Sign in with Google</button>
    </div>
  );
};

export default LoginButton;
