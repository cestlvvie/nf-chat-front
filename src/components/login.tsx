'use client'
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://nf-chat-back.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('userId', data.user._id); // Save userId if needed
        alert('Login successful');
        window.location.href = 'https://nf-chat-frontend.vercel.app/createchat';  
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="bg-[#d2b1a2] rounded-2xl shadow-lg w-[400px] p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-white font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#a66956]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-white font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#a66956]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="button" // Use type="button" to prevent form submission on click
          onClick={handleLogin}
          className="w-full bg-[#a66956] text-white font-medium py-2 px-4 rounded-md hover:bg-[#8c5744] focus:outline-none focus:ring-2 focus:ring-[#d2b1a2]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
