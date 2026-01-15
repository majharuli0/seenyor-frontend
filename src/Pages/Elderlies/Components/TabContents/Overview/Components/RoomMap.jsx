import React, { useContext } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import RoomMapBox from './RoomMapBox';
import RoomMapList from './RoomMapList';
import { CustomContext } from '@/Context/UseCustomContext';

export default function RoomMap() {
  // const elderlyDetais = ls.get("elderly_details");
  const { elderlyDetails } = useContext(CustomContext) || [];

  return (
    <div className='rounded-2xl bg-white flex flex-col gap-4 items-center justify-center w-full p-4 '>
      <div className='flex items-center justify-between w-full '>
        <h1 className='text-2xl font-bold'>Live Room Map</h1>
      </div>
      <Tabs
        tabPosition='left'
        defaultActiveKey='1' // Set defaultActiveKey to match the first tab's id
        renderTabBar={(props, DefaultTabBar) => (
          <div className=' w-[24%] h-[500px] overflow-y-auto !border-none'>
            <RoomMapList {...props} tabs={elderlyDetails?.rooms?.filter((tab) => tab?.device_no)} />
          </div>
        )}
        className='w-full'
      >
        {elderlyDetails?.rooms
          ?.filter((tab) => tab?.device_no)
          .map((tab) => (
            <TabPane tab={tab._id} key={tab._id} className=''>
              <div key={tab.id} className='w-full h-[500px]'>
                <RoomMapBox data={tab} elderly_id={elderlyDetails?._id} />
              </div>
            </TabPane>
          ))}
      </Tabs>
    </div>
  );
}
