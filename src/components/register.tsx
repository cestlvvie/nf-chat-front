'use client';
import { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('https://nf-chat-back.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registration successful');
        window.location.href = 'https://nf-chat-frontend.vercel.app/login';  
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="bg-[#d2b1a2] rounded-2xl shadow-lg w-[400px] p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Register</h2>
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
          type="button"  
          onClick={handleRegister}
          className="w-full bg-[#a66956] text-white font-medium py-2 px-4 rounded-md hover:bg-[#8c5744] focus:outline-none focus:ring-2 focus:ring-[#d2b1a2]"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
