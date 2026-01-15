import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'; // Icons for sorting

const Sort = ({ selected, setSelected, data, width = '90px', bg, query, setQuery }) => {
  const [popupShow, setPopupShow] = useState(false);
  const [isDescending, setIsDescending] = useState(true); // Local state to track the sort direction

  const handleOpenChange = (newOpen) => {
    setPopupShow(newOpen);
  };
  useEffect(() => {
    setIsDescending(true);
  }, [selected]);
  const handleChangeType = () => {
    const newQuery = { ...query };

    if (selected === 'Name') {
      delete newQuery.sort_by_created_at;
      newQuery.sort_by_name = isDescending ? 1 : -1; // Toggle between ascending/descending
    } else {
      delete newQuery.sort_by_name;
      newQuery.sort_by_created_at = isDescending ? 1 : -1; // Toggle between ascending/descending
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
          className={`text-sm w-full items-start rounded-lg font-medium text-gray-700 hover:bg-text-primary/15 hover:text-text-primary flex py-2 px-5 ${
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
      className={`w-full max-w-fit relative flex items-center border-2 border-text-primary/10 bg-white hover:bg-text-primary/5 border-text-primary/10 text-text-primary h-[44px] px-3  rounded-[10px] !overflow-hidden`}
    >
      {/* Sort Direction Icon */}
      <button onClick={handleChangeType} className='cursor-pointer text-text-primary'>
        {isDescending ? (
          <FaSortAmountDown size={16} /> // Icon for descending sort
        ) : (
          <FaSortAmountUp size={16} /> // Icon for ascending sort
        )}
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
          className={`pl-4 w-fit h-[40px]  font-medium rounded-lg flex items-center justify-between px-4 pr-0 py-2 cursor-pointer`}
        >
          <span>
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

export default Sort;
