import { cancelSubscription } from '@/api/subscriptions';
import DeleteModal from '@/Shared/delete/DeleteModal';
import CancelSubscriptionModal from '@/Shared/subscriptionModal/cancelSubscription';
import { Button, Dropdown } from 'antd';
import React, { useState } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

export default function SubscriptionUserAction({ data = {} }) {
  const [modalOPen, setModalOpen] = useState(false);
  const handleMenuClick = (e) => {
    if (e.key === '1') {
      setModalOpen(true);
    }
  };
  const items = [
    {
      label: 'Cancel Subscription',
      key: '1',
      danger: true,
    },
  ];
  function handleCancelSubscription(reason) {
    cancelSubscription({
      subscriptionId: data?.sub_id,
      cancellationReason: reason,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div>
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick, // attach the click handler here
        }}
        trigger={['click']}
        placement='bottomRight'
      >
        <Button
          onClick={(e) => e.preventDefault()}
          shape='circle'
          icon={<HiOutlineDotsVertical />}
        />
      </Dropdown>

      <CancelSubscriptionModal
        modalOpen={modalOPen}
        setModalOpen={setModalOpen}
        onCancelSubscription={handleCancelSubscription}
      />
    </div>
  );
}
