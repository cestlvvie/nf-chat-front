'use client'
import React from "react";
 
 
import { Chat } from "@/components/chat";

const ChatPage = ({ params }: { params: { id: string } }) => {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Chat id={params.id} />
      
    </main>
  );
};

export default ChatPage;
