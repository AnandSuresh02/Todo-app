import React from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('../Dashboard');
  };

  const handleEmailLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleLoginSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      handleLoginSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-panel">
      <h2>Login</h2>
      <h4>Login with Email</h4>
      <form onSubmit={(e) => { e.preventDefault(); handleEmailLogin(e.target.email.value, e.target.password.value); }}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
      <div>
      <button type="submit">Login</button>
      </div>
      </form>
      <h5>or</h5>
      <button onClick={() => handleOAuthLogin(new GoogleAuthProvider())}>Login with Google</button>
      <h5>If you don't have an account yet, sign up now</h5>
      <button onClick={() => navigate('/signup')}>Sign up now</button>
    </div>
  );
};

export default Login;
