import React, { useState } from 'react';
import { Steps } from 'antd';
import CustomModal from '@/Shared/modal/CustomModal';
import { FaTimeline } from 'react-icons/fa6';
export default function LifespanTimeline({ data = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <span
        className='flex items-center gap-2 hover:cursor-pointer hover:text-primary'
        onClick={() => setOpen(true)}
      >
        <FaTimeline size={20} />
        <span className='text-sm text-nowrap'>View Lifespan</span>
      </span>
      <CustomModal title='Alert Lifespan' modalOPen={open} setModalOpen={setOpen}>
        <Steps
          progressDot
          current={data?.length}
          direction='vertical'
          items={data?.map((item) => ({
            title: item.dateTime,
            description: item.description,
          }))}
        />
      </CustomModal>
    </div>
  );
}
