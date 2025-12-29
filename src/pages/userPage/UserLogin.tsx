// pages/UserLogin.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEventContext } from '../../context/EventContext';

const UserLogin: React.FC = () => {
  const { login } = useEventContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!email) return setMessage('Email required');
    if (!password) return setMessage('Password required');

    try {
      setLoading(true);
      const data = await login({ email: email.toLowerCase().trim(), password });

      if (data.user) {
        const role = data.user.role;
        if (role === 'organizer') navigate('/organizer');
        else if (role === 'admin') navigate('/admin');
        else navigate('/');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Server error. Try later!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // window.location.href = `${BASE_URL}/api/auth/google`; // Adjust if needed
  };

  return (
    <div className="pt-10 pb-10 w-full flex items-center justify-center">
      <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center">
        <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
        <p className="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>

        <button type="button" onClick={handleGoogleLogin} className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full">
          <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="Google" />
        </button>

        <div className="flex items-center gap-4 w-full my-5">
          <div className="w-full h-px bg-gray-300/90"></div>
          <p className="text-sm text-gray-500/90">or sign in with email</p>
          <div className="w-full h-px bg-gray-300/90"></div>
        </div>

        {message && <div className="w-full bg-red-100 text-red-700 p-2 rounded text-sm mb-3 text-center">{message}</div>}

        <div className="w-full mb-6">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-12 pl-12 border rounded-full" required />
        </div>

        <div className="w-full">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-12 pl-12 border rounded-full" required />
        </div>

        <button disabled={loading} type="submit" className={`mt-8 w-full h-11 rounded-full text-white bg-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-gray-500/90 mt-4">
          Don’t have an account? <Link to="/register" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;