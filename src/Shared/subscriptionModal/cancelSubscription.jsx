import { Modal, Input } from 'antd';
import React, { useState, useEffect } from 'react';

const { TextArea } = Input;

export default function CancelSubscriptionModal({
  modalOpen,
  setModalOpen,
  onCancelSubscription,
  body = 'Please provide a reason for cancelling this subscription.',
}) {
  const [reason, setReason] = useState('');

  // reset textarea when modal opens/closes
  useEffect(() => {
    if (modalOpen === false) {
      setReason('');
    }
  }, [modalOpen]);

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    onCancelSubscription(reason);
    setModalOpen(false);
  };

  return (
    <Modal
      centered
      footer={null}
      open={modalOpen}
      onCancel={handleCancel}
      width={520}
      className='rounded-[30px]  pt-3'
    >
      <div className='text-center pt-6'>
        <h2 className='text-[25px] text-center font-[600] text-text-primary'>
          Cancel Subscription
        </h2>
        <p className='text-[16px] font-normal text-[#707EAE] mt-2 px-4'>{body}</p>
      </div>

      <div className='mt-6 px-4'>
        <label className='block mb-2 text-[#707EAE]'>Reason for cancellation</label>
        <TextArea
          rows={4}
          placeholder='Type your reason here...'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className='flex items-center justify-center gap-5 pt-8 pb-4'>
        <button
          onClick={handleConfirm}
          disabled={reason.trim() === ''}
          className='font-bold h-[40px] px-6 disabled:bg-red-100 rounded-[10px] bg-red-500 hover:bg-red-700 duration-300 text-white'
        >
          Cancel Subscription
        </button>
        <button
          onClick={handleCancel}
          className='font-bold h-[40px] px-6 hover:text-red-500 hover:border-red-500 duration-300 rounded-[10px] bg-transparent text-secondary border border-secondary'
        >
          Keep Subscription
        </button>
      </div>
    </Modal>
  );
}
