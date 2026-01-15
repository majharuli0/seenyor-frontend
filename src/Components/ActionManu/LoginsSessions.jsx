import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import OwnershipStructureModal from '../OwnershipStructureModal';
import { MdDevices } from 'react-icons/md';
import LoginsSessionsModal from '../LoginsSessionsModal';
export default function LoginsSessions({ data }) {
  const [isvisible, setVisible] = useState(false);

  return (
    <div>
      <Button shape='circle' icon={<MdDevices />} onClick={() => setVisible(true)} />
      {isvisible && (
        <LoginsSessionsModal isvisible={isvisible} setVisible={setVisible} row_data={data} />
      )}
    </div>
  );
}
