import React, { useState } from 'react';
import CustomModal from '@/Shared/modal/CustomModal';
export default function LargeTextViewerModal({
  data,
  title,
  splitLatter = 30,
  className,
  seeMoreClassName,
  isSeeMore = false,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span
        onClick={() => (isSeeMore ? null : setOpen(true))}
        className={`${isSeeMore ? 'text-nowrap' : 'cursor-pointer text-nowrap'} hover:text-primary ${
          data?.length > splitLatter ? 'w-full' : ''
        } ${className}`}
      >
        {data?.length > splitLatter
          ? `${data?.substring(0, splitLatter)}...`
          : data || 'No Comment'}
        {data?.length > splitLatter && (
          <span
            onClick={() => setOpen(true)}
            className={`text-nowrap text-primary font-bold cursor-pointer ${seeMoreClassName}`}
          >
            See More
          </span>
        )}
      </span>
      <CustomModal modalOPen={open} setModalOpen={setOpen} title={title} isBottomButtomShow={false}>
        <div className='p-4 text-base text-text-primary'>{data || 'No Comment'}</div>
      </CustomModal>
    </>
  );
}
