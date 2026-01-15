import React from 'react';

export default function RoomMapList({ activeKey, onTabClick, tabs = [] }) {
  return (
    <>
      <div className='flex flex-col items-center justify-start gap-4 w-full !border-none  overflow-y-auto '>
        {tabs?.map((tab) => (
          <div
            key={tab._id}
            className={`tab-button flex items-center rounded-xl w-full gap-2 p-4 cursor-pointer border-2 border-transparent !h-[60px] relative ${
              activeKey === tab._id.toString()
                ? 'activeTab border-2 !border-[#43B981]'
                : 'bg-black/5'
            }`}
            onClick={() => onTabClick(tab._id.toString())}
          >
            <div
              id='roomNmaeAndStatus'
              className='flex items-center gap-2 w-fit  pr-4 py-1.5  p-2 rounded-full '
            >
              <div
                id='dot'
                className='size-3 rounded-full'
                style={{
                  backgroundColor: tab.is_device_bind === true ? 'green' : 'red',
                }}
              ></div>
              <p className='text-[16px]'>{tab.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
