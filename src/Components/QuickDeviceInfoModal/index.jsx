import { Divider, Modal, Steps, Tag } from 'antd';
import React, { useContext } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { MdOutlineLocalPhone } from 'react-icons/md';
import { SidebarContext } from '@/Context/CustomContext';
import { useNavigate } from 'react-router-dom';

export default function QuickDeviceInfoModal({ isvisible, setVisible, row_data }) {
  const { rolesFormatter } = useContext(SidebarContext);
  const navigate = useNavigate();
  const onClose = () => {
    setVisible(false);
  };
  function getItems(data = {}) {
    function handleUserClick() {
      navigate(`/super-admin/user/${data?._id}`, {
        state: { role: data?.role },
      });
    }
    return {
      title: (
        <div className='flex items-center gap-2'>
          <h1
            className='font-semibold font-base cursor-pointer select-none hover:text-primary/70'
            onClick={handleUserClick}
          >
            {data?.name} {data?.last_name}
          </h1>
          <Tag>{rolesFormatter[data?.role]}</Tag>
        </div>
      ),
      description: (
        <ul>
          <li className='flex items-center gap-1'>
            <MdOutlineMail />
            <p>{data?.email}</p>
          </li>
          <li className='flex items-center gap-1'>
            <MdOutlineLocalPhone />
            <p>
              {data?.contact_code} {data?.contact_number}
            </p>
          </li>
        </ul>
      ),
    };
  }
  const rooms = [
    {
      roomName: 'Bedroom',
      roomType: 'Bedroom',
      deviceUid: 'A1234B',
      online: true,
    },
    {
      roomName: 'Living Room',
      roomType: 'Living Room',
      deviceUid: 'B5678C',
      online: false,
    },
    {
      roomName: 'Ground',
      roomType: 'Living Room',
      deviceUid: 'C9012D',
      online: true,
    },
  ];

  return (
    <div>
      <Modal
        open={isvisible}
        onCancel={onClose}
        footer={null}
        centered
        // width="40vw"
        className='device-configuration-modal my-6 md:w-[80vw] !sm:w-[80vw] w-[80vw]'
      >
        <div className='p-6 space-y-4'>
          {/* <Steps
            progressDot
            current={10}
            direction="vertical"
            items={Array.isArray(row_data) ? row_data?.map(getItems) : []}
          /> */}
          {rooms.map((room, index) => (
            <div key={index} className='flex items-start gap-3'>
              <span
                className={`mt-2.5 h-2.5 w-2.5 rounded-full ${
                  room.online ? 'bg-success' : 'bg-red-500'
                }`}
              ></span>
              <div>
                <div className='flex text-lg items-center gap-2 font-medium text-gray-800'>
                  {room.roomName}
                  <span className='text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded'>
                    {room.roomType}
                  </span>
                </div>
                <div className='text-base text-gray-500'>UID: {room.deviceUid}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
