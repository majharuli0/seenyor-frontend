import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'; // Icons for sorting
import { TbArrowsSort } from 'react-icons/tb';

const Sort2 = ({ selected, setSelected, data, width = '90px', bg, query, setQuery }) => {
  const [popupShow, setPopupShow] = useState(false);
  const [isDescending, setIsDescending] = useState(true);
  const handleOpenChange = (newOpen) => {
    setPopupShow(newOpen);
  };
  useEffect(() => {
    setIsDescending(true);
  }, [selected]);
  const handleChangeType = () => {
    const newQuery = { ...query };

    if (selected === 'By Name') {
      delete newQuery.sort_by_created_at;
      newQuery.sort_by_name = isDescending ? 1 : -1;
    } else {
      delete newQuery.sort_by_name;
      newQuery.sort_by_room_created_at = isDescending ? 1 : -1;
    }

    setQuery(newQuery); // Update the query state with new sort direction
    setIsDescending(!isDescending); // Toggle the sort direction state
  };

  const content = (
    <div className={`w-fit p-2 max-h-36 overflow-y-scroll flex gap-4`}>
      {data?.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setPopupShow(false);
            setSelected(item);
          }}
          className={`text-sm w-full !text-nowrap items-start rounded-lg font-medium text-gray-700 hover:bg-text-primary/15 hover:text-text-primary flex py-2 px-5 ${
            item === selected ? 'bg-text-primary/10 text-text-primary' : ''
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
      className={`w-full max-w-fit relative flex items-center border-2  hover:bg-text-primary/10 bg-text-primary/10 text-text-primary h-[44px] px-3  rounded-[10px] !overflow-hidden`}
    >
      {/* Sort Direction Icon */}
      <button onClick={handleChangeType} className='cursor-pointer text-text-primary'>
        <TbArrowsSort
          size={16}
          className={`transition-transform duration-300 ${
            isDescending ? 'rotate-0 skew-y-0' : 'rotate-180 skew-y-12'
          }`}
        />
      </button>

      {/* Sort Button with Popover */}
      <Popover
        open={popupShow}
        onOpenChange={handleOpenChange}
        content={content}
        placement='bottomRight'
        trigger='click'
      >
        <button
          className={`pl-1 w-fit h-[40px]  font-medium rounded-lg flex items-center justify-between px-4 pr-0 py-2 cursor-pointer`}
        >
          <span className='mr-3 !text-nowrap'>
            {selected
              ? selected.length > 25
                ? selected.substring(0, 25) + '...'
                : selected
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

export default Sort2;
