import React, { useState, useContext } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMdCheckmark } from 'react-icons/io';
import { FaRegRectangleXmark } from 'react-icons/fa6';
import { Popover } from 'antd';
import DeleteModal from '@/Shared/delete/DeleteModal';
import SuccessModal from '@/Shared/Success/SuccessModal';
import { CustomContext } from '@/Context/UseCustomContext';
import { addEvent, getEventList, updateEvent } from '@/api/elderlySupport';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import { SidebarContext } from '@/Context/CustomUsertable';

export default function ActionManu({ row }) {
  const [popupShow, setPopupShow] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const sharedMethod = useContext(SidebarContext);

  const handleOpenChange = (open) => {
    setPopupShow(open);
  };
  const onMark = (inf) => {
    updateEvent({
      id: inf.id,
      data: {
        event_status: inf.event_status,
      },
    })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={'Event Status Updated Successfully!'} />);
        sharedMethod?.getList();
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  };
  const content = (
    <>
      <div className='flex items-center gap-1 flex-col m-2'>
        <span
          onClick={() => setSuccessModal(true)}
          className='flex items-center gap-2 justify-start p-2 px-4 w-full mt-2 rounded-md hover:bg-[#008000]/10 cursor-pointer'
        >
          <IoMdCheckmark color='green' /> Mark As Done
        </span>
        <span
          onClick={() => setCloseModal(true)}
          className='flex items-center gap-2 justify-start p-2 px-4 mb-2 w-full rounded-md hover:bg-red-500/10 cursor-pointer'
        >
          <FaRegRectangleXmark color='red' />
          Close Event
        </span>
      </div>
    </>
  );

  return (
    <div className='flex items-center justify-center'>
      <div
        onClick={() => setPopupShow(true)}
        className='cursor-pointer p-2 hover:bg-[#E8E9EE] rounded-full'
      >
        <HiDotsVertical className='cursor-pointer' />
      </div>
      <Popover
        open={popupShow}
        onOpenChange={handleOpenChange}
        content={content}
        placement='leftTop'
        trigger='click'
      ></Popover>
      <DeleteModal
        onDelete={() => onMark({ id: row?._id, event_status: 'closed' })}
        modalOPen={closeModal}
        setModalOpen={setCloseModal}
        title={'Are you sure you want to mark this event as close?'}
        title2={'This process cannot be undone.'}
        okText={'Close Event'}
      />
      <SuccessModal
        modalOPen={successModal}
        setModalOpen={setSuccessModal}
        onOk={() => onMark({ id: row?._id, event_status: 'open' })}
        title={'Are you sure you want to mark this event as completed?'}
        title2={'This process cannot be undone.'}
      />
    </div>
  );
}
// export const content = (
//   <>
//     <div className="flex items-center gap-1 flex-col m-2">
//       <span
//         onClick={() => setCloseModal(true)}
//         className="flex items-center gap-2 justify-start p-2 px-4 w-full mt-2 rounded-md hover:bg-[#008000]/10 cursor-pointer"
//       >
//         <IoMdCheckmark color="green" /> Mark As Done
//       </span>
//       <span className="flex items-center gap-2 justify-start p-2 px-4 mb-2 w-full rounded-md hover:bg-red-500/10 cursor-pointer">
//         <FaRegRectangleXmark color="red" />
//         Close Event
//       </span>
//     </div>
//   </>
// );
