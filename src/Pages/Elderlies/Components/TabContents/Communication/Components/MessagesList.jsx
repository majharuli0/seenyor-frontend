import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Popover, Button, Modal } from 'antd';
import AudioPlayer from './AudioVisualizer';
import ls from 'store2';
import { CustomContext } from '@/Context/UseCustomContext';

const MessageList = ({ messages, messageEndRef, onRemoveMessage, onEditMessage }) => {
  const [showModal, setShowModal] = useState(false);
  const [messageToDeleteIndex, setMessageToDeleteIndex] = useState(null);
  const { elderlyDetails } = useContext(CustomContext);
  const user = ls.get('user');
  // Function to handle delete confirmation
  console.log(messages);

  const handleDeleteConfirmation = (index) => {
    if (index !== null) {
      onRemoveMessage(index);
      setShowModal(false);
      setMessageToDeleteIndex(null);
    }
  };

  // Define the content of the popover
  const popoverContent = (index) => (
    <div>
      <Button
        type='link'
        danger
        onClick={() => {
          handleDeleteConfirmation(index);
        }}
      >
        Remove
      </Button>
    </div>
  );

  return (
    <div
      style={{
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%',
        overflowX: 'hidden',
      }}
      className='bg-slate-50 border-b border-gray-200 min-h-[calc(100svh-380px)] max-h-[calc(100svh-380px)]'
    >
      {messages?.map((message, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            x: message.sender_id === user?._id ? 50 : -50,
          }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            alignSelf: message.sender_id === user?._id ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
            padding: '10px 15px',
            backgroundColor: message.sender_id === user?._id ? '#6AC198' : '#fff',
            color: message.sender_id === user?._id ? '#fff' : '#000',
            wordWrap: 'break-word',
            minWidth: '200px',
            borderRadius: message.sender_id === user?._id ? '15px 0 15px 15px' : '0 15px 15px 15px',
            position: 'relative',
          }}
        >
          {message.text ? message.text : <AudioPlayer audioSrc={message.file} />}
          {/* {message.sender_id === user?._id && (
            <Popover
              content={popoverContent(index)}
              trigger="click"
              placement="left"
            >
              <div
                style={{
                  position: "absolute",
                  left: "-28px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  // right: "10px",
                  cursor: "pointer",
                  padding: "5px",
                }}
                className="bg-transparent rounded-full hover:bg-gray-200"
              >
                <BsThreeDotsVertical color="#4A5568" />
              </div>
            </Popover>
          )} */}
        </motion.div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
