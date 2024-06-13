'use client'
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatProps {
  id: string;
}

export function Chat({ id }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');
        
        const res = await fetch(`https://nf-chat-back.onrender.com/api/chats/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch chat data');
        }

        const data = await res.json();
        setMessages(data.messages || []);
        setParticipants(data.chat.participants || []);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [id]);

  useEffect(() => {
    let socket: Socket | null = null;

    const connectSocket = () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return;

      socket = io('https://nf-chat-back.onrender.com', {
        extraHeaders: {
          'Authorization': `Bearer ${token}`,
        },
      });

      socket.on('connect', () => {
        console.log('connected');
        socket!.emit('JOIN_CHAT', { chatId: id });
      });

      socket.on('MESSAGE', (message: any) => {
        setMessages((currentMessages) => {
           
          if (currentMessages.find((msg) => msg._id === message._id)) {
            return currentMessages;
          }
          return [...currentMessages, message];
        });
      });

      socket.on('PARTNER_TYPING', () => {
        setPartnerTyping(true);
      });

      socket.on('disconnect', () => {
        console.log('disconnected');
      });

      useEffect(() => {
        const timeout = setTimeout(() => {
          setPartnerTyping(false);
        }, 3000);
  
        return () =>{
          clearTimeout(timeout);
        };
  
      },[partnerTyping]);

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    };

    connectSocket();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const userId = sessionStorage.getItem('userId');
      if (!token) {
        throw new Error('No token available');
      }

      if (messageText.trim()) {
        const response = await fetch(`https://nf-chat-back.onrender.com/api/chats/${id}/sendText`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: messageText })
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        
        setMessageText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
       
    }
  };

  const userId = sessionStorage.getItem('userId');

  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-[#f3e4df] dark:border-gray-800">
      <div className="flex items-center justify-between bg-[#a66956] text-white rounded-lg px-4 py-3 border border-gray-200 border-[#a66956] dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#d2b1a2] text-white flex items-center justify-center w-8 h-8"></div>
          <div>
            <h3 className="font-semibold mr-4">{participants[0]}</h3>
            <p className="text-sm">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#d2b1a2] flex items-center justify-center w-8 h-8"></div>
          <div>
            <h3 className="font-semibold">{participants[1]}</h3>
            <p className="text-sm">Online</p>
          </div>
        </div>
      </div>
      <div>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex items-start gap-3 ${
              message.sender === userId ? 'justify-end' : ''
            }`}
          >
            <div className={`rounded-full bg-[#a66956] text-white flex items-center justify-center w-8 h-8`}></div>
            <div className={`bg-white text-black rounded-lg p-3 max-w-[70%] border border-gray-200 border-[#a66956] dark:border-gray-800 mb-3`}>
              <p className="text-black">{message.text}</p>
              <p className="text-gray-500 text-xs">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a66956] dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:border-gray-800"
          placeholder="Type your message..."
          type="text"
        />
        <Button
          onClick={handleSendMessage}
          className="ml-2 rounded-lg bg-[#a66956] px-4 py-2 text-white hover:bg-[#8a5447] focus:outline-none focus:ring-2 focus:ring-[#a66956]"
          type="submit"
        >
          Send
        </Button>
      </div>
    </div>
  );
}