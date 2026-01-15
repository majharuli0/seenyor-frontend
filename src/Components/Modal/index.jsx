import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { TbManualGearbox } from 'react-icons/tb';
import { MdEditRoad } from 'react-icons/md';
import { TbInfoHexagon } from 'react-icons/tb';
import { Tabs } from 'antd';
import EditRoom from '@/Pages/Elderlies/Components/TabContents/Devices/Components/EditRoom';
import DeviceConfiguration from '@/Pages/Elderlies/Components/TabContents/Devices/Components/DeviceConfiguration';
import DeviceInfo from '@/Pages/Elderlies/Components/TabContents/Devices/Components/DeviceInfo';

export default function DeviceConfigurationModal({
  isvisible,
  setVisible,
  device_id,
  elderly_id,
  room_id,
}) {
  const onClose = () => {
    setVisible(false);
  };
  const [activeKey, setActiveKey] = useState('1');

  const tabs = [
    {
      key: '1',
      tab: 'Device Configuration',
      content: (
        <DeviceConfiguration
          device_id={device_id}
          elderly_id={elderly_id}
          isActive={activeKey === '1'}
        />
      ),
      icon: <TbManualGearbox />,
    },
    {
      key: '2',
      tab: 'Edit Room',
      content: (
        <EditRoom device_id={device_id} elderly_id={elderly_id} isActive={activeKey === '2'} />
      ),
      icon: <MdEditRoad />,
    },
    // {
    //   key: "3",
    //   tab: "Device Info",
    //   content: <DeviceInfo elderly_id={elderly_id} room_id={room_id} />,
    //   icon: <TbInfoHexagon />,
    // },
  ];

  return (
    <Modal
      open={isvisible}
      onCancel={onClose}
      footer={null}
      centered
      width='80vw'
      className='device-configuration-modal my-6'
    >
      <div className='min-h-[90vh] h-full p-4'>
        <Tabs
          //   defaultActiveKey="2"
          //   items={tabs.map((tab, i) => {
          //     const id = String(i + 1);
          //     return {
          //       key: id,
          //       label: tab.tab,
          //       children: tab.content,
          //       icon: <tab.icon />,
          //     };
          //   })}
          //   tabBarStyle={{ borderBottom: "none" }}
          //   animated={{ inkBar: false, tabPane: false }}
          renderTabBar={(props, DefaultTabBar) => (
            <div className='h-full'>
              <DefaultTabBar {...props} />
            </div>
          )}
          onChange={(key) => setActiveKey(key)}
        >
          {tabs.map((item) => (
            <Tabs.TabPane
              tab={
                <span className='flex items-center gap-2 !border-none'>
                  {item.icon}
                  {item.tab}
                </span>
              }
              key={item.key}
            >
              {item.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Modal>
  );
}
