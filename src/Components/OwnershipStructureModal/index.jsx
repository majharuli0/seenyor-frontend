import { Divider, Modal, Steps, Tag } from 'antd';
import React, { useContext } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { MdOutlineLocalPhone } from 'react-icons/md';
import { SidebarContext } from '@/Context/CustomContext';
import { useNavigate } from 'react-router-dom';

export default function OwnershipStructureModal({ isvisible, setVisible, row_data }) {
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

  return (
    <div>
      <Modal
        open={isvisible}
        onCancel={onClose}
        footer={null}
        centered
        width='80vw'
        className='device-configuration-modal my-6 lg:max-w-[50vw]'
      >
        <div className='p-3'>
          <Steps
            progressDot
            current={10}
            direction='vertical'
            items={Array.isArray(row_data) ? row_data?.map(getItems) : []}
          />
        </div>
      </Modal>
    </div>
  );
}
