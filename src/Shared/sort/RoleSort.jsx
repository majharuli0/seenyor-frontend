import React, { useState } from 'react';
import { Popover } from 'antd';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const Sort = ({ selectedRole, setSelectedRole, data, width = '90px', bg, query, setQuery }) => {
  const [popupShow, setPopupShow] = useState(false);
  const [isDescending, setIsDescending] = useState(true);

  const handleOpenChange = (newOpen) => {
    setPopupShow(newOpen);
  };

  const content = (
    <div className={`w-fit p-2 max-h-[400px] overflow-y-scroll flex  flex-col gap-2`}>
      {data?.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setPopupShow(false);
            setSelectedRole(item);
          }}
          className={`text-nowrap text-sm w-full items-start rounded-lg font-medium text-gray-700 hover:bg-text-primary/15 hover:text-text-primary flex py-2 px-5 ${
            item === selectedRole ? 'bg-text-primary/10 text-text-primary' : ''
          }`}
          disabled={item === 'Sort'}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={` w-fit relative flex items-center border-2 bg-white hover:bg-text-primary/5 border-text-primary/10 text-text-primary h-[44px] px-3  rounded-[10px] !overflow-hidden`}
    >
      {/* Sort Button with Popover */}
      <Popover
        open={popupShow}
        onOpenChange={handleOpenChange}
        content={content}
        placement='bottomRight'
        trigger='click'
      >
        <button
          className={`text-nowrap w-fit  h-[40px] font-medium rounded-lg flex gap-4 items-center justify-between  py-2 cursor-pointer`}
        >
          <span>
            {selectedRole
              ? selectedRole.length > 25
                ? selectedRole.substring(0, 25) + '...'
                : selectedRole
              : data[0]}
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`w-4 h-4 transform transition-transform ${popupShow ? 'rotate-180' : ''}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      </Popover>
    </div>
  );
};

export default Sort;
