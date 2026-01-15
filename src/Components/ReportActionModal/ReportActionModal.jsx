import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'antd';
import { MdReport } from 'react-icons/md';
import CustomModal from '@/Shared/modal/CustomModal';
import { TbMessageReportFilled } from 'react-icons/tb';
import { updateInstallationReport } from '@/api/ordersManage';
import ls from 'store2';
export default function ReportActionModal({ report }) {
  const [open, setOpen] = useState(false);
  const mainRole = ls.get('mainRole');
  const [messages, setMessages] = useState(report?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const chatViewRef = useRef(null);
  const handleSendMessage = async () => {
    const newMessageObj = {
      text: newMessage,
      isInstaller: mainRole === 'installer',
      time: new Date().toISOString(),
    };
    if (newMessage.trim()) {
      const res = await updateInstallationReport(report?._id, {
        text: newMessage,
        isInstaller: mainRole === 'installer',
        time: new Date().toISOString(),
      });
      if (res) {
        setMessages([...messages, newMessageObj]);
        setNewMessage('');
      }
    }
  };

  const scrollToBottom = () => {
    if (chatViewRef.current) {
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <TbMessageReportFilled
        size={26}
        onClick={() => setOpen(true)}
        className='text-text-secondary cursor-pointer'
      />
      <CustomModal
        modalOPen={open}
        setModalOpen={setOpen}
        onCancel={() => setOpen(false)}
        title='Installation Reports'
        isBottomButtomShow={false}
      >
        <div id='ReportChatContainer' className='flex flex-col h-[500px] font-baloo'>
          <div id='chatViewArea' className='flex-1 overflow-y-auto p-4 space-y-4' ref={chatViewRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.isInstaller
                    ? 'ml-auto bg-[#6dc29a] text-white'
                    : 'mr-auto bg-[#80CAA7]/10 text-text-primary'
                }`}
              >
                <p className='text-xs font-bold mb-1'>
                  {mainRole == 'installer'
                    ? message.isInstaller
                      ? 'You'
                      : 'Manager'
                    : message.isInstaller
                      ? 'Installer'
                      : 'You'}
                </p>
                <p className='text-base mb-2'>{message.text}</p>
                <p
                  className={`text-sm  text-right ${
                    message.isInstaller ? 'text-white' : 'text-primary'
                  }`}
                >
                  {new Date(message.time).toDateString() === new Date().toDateString()
                    ? new Date(message.time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : new Date(message.time).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                </p>
              </div>
            ))}
          </div>
          <div id='chatInputArea' className='flex p-4 pb-0 border-t'>
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type your message...'
              className='py-[18px] px-4 text-text-primary placeholder:text-[#A3AED0] h-[50px]  rounded-[16px] w-full text-base outline-none   border-[1px] focus:border-primary rounded-r-none border-r-0'
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className='bg-primary text-white px-8 py-2 rounded-r-[16px] hover:bg-primary focus:outline-none focus:ring-2 '
            >
              Send
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
