import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import QuickDeviceInfoModal from '../QuickDeviceInfoModal';
import { TbHomeDot } from 'react-icons/tb';
export default function QuickDeviceInfo({ data }) {
  const [isvisible, setVisible] = useState(false);

  return (
    <div>
      <Button shape='circle' icon={<TbHomeDot />} onClick={() => setVisible(true)} />
      <QuickDeviceInfoModal
        isvisible={isvisible}
        setVisible={setVisible}
        row_data={data?.parents}
      />
    </div>
  );
}
