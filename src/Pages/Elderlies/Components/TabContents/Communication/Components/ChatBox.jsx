import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RiSendPlane2Fill } from 'react-icons/ri';
import MessageList from './MessagesList';
import { io } from 'socket.io-client';
import { CustomContext } from '@/Context/UseCustomContext';
import ls from 'store2';
import { getChatList } from '@/api/elderlySupport';
const SOCKET_URL = 'https://www.backend.elderlycareplatform.com';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const { elderlyDetails } = useContext(CustomContext);
  const user = ls.get('user');
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      secure: true,
    });

    setSocket(socketInstance);

    // Subscribe with user details
    socketInstance.on('connect', () => {
      socketInstance.emit('setup', {
        _id: elderlyDetails?._id,
        name: 'elderly',
      });
    });

    // Listen for new messages
    socketInstance.on('message received', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle disconnection
    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Clean up on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [elderlyDetails]);

  const handleSendMessage = () => {
    if (inputValue.trim() && socket) {
      const newMessage = {
        sender_id: user?._id,
        reciver_id: elderlyDetails?._id,
        text: inputValue,
      };
      setMessages([...messages, newMessage]);
      socket.emit('new message', {
        sender_id: user?._id,
        reciver_id: elderlyDetails?._id,
        text: inputValue,
      });
      setInputValue('');
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const getChatListData = useCallback(() => {
    getChatList({
      user1Id: elderlyDetails?._id,
      user2Id: user?._id,
    })
      .then((res) => {
        setMessages(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [elderlyDetails]);
  useEffect(() => {
    getChatListData();
  }, [getChatListData]);
  useEffect(() => {
    // scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className='flex flex-col w-full '>
      <MessageList messages={messages} messageEndRef={messageEndRef} />
      <div className='flex items-center h-20 bg-white justify-center py-3 relative mx-6'>
        <div
          className='flex items-center w-full'
          title='This feature is currently unavailable. We’ll let you know as soon as it becomes available.'
        >
          <input
            type='text'
            value={inputValue}
            onKeyPress={handleKeyPress}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Type a message...'
            className='border-none outline-none w-full pl-4 text-base bg-transparent cursor-not-allowed pointer-events-none'
            disabled
          />
          <button
            disabled
            onClick={handleSendMessage}
            className='bg-[#80CAA7]/0 hover:bg-[#80CAA7]/10 text-white px-3 py-3 rounded-xl flex items-center justify-center cursor-not-allowed pointer-events-none'
            style={{ border: 'none' }}
          >
            <RiSendPlane2Fill size={22} color='#80CAA7' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
