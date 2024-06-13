'use client'
import { useState } from 'react';

const CreateChatPage = () => {
  const [participantId, setParticipantId] = useState('');
  const [createdChat, setCreatedChat] = useState<any>(null); 

  const handleCreateChat = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const userId = sessionStorage.getItem('userId');

      const response = await fetch('https://nf-chat-back.onrender.com/api/chats/createchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ participants: [userId, participantId] }),  
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedChat(data);
        alert('Chat created successfully');
        window.location.href = `/chats/${data._id}`;
      } else {
        alert('Failed to create chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to create chat');
    }
  };

  return (
    <div className="bg-[#d2b1a2] rounded-2xl shadow-lg w-[400px] p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Create Chat</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="participantId" className="block mb-2 text-white font-medium">
            Participant ID
          </label>
          <input
            type="text"
            id="participantId"
            placeholder="Enter participant ID"
            className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#a66956]"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
          />
        </div>
        <button
          type="button"  
          onClick={handleCreateChat}
          className="w-full bg-[#a66956] text-white font-medium py-2 px-4 rounded-md hover:bg-[#8c5744] focus:outline-none focus:ring-2 focus:ring-[#d2b1a2]"
        >
          Create Chat
        </button>
      </form>
      {createdChat && (
        <div className="mt-4">
          <h3 className="text-white font-semibold">Chat Created:</h3>
          <p className="text-white">Chat ID: {createdChat._id}</p>
          <p className="text-white">Participants: {createdChat.participants.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default CreateChatPage;