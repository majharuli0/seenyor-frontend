import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import { PiGitMergeBold } from 'react-icons/pi';
import OwnershipStructureModal from '../OwnershipStructureModal';
export default function OwnershipStructure({ data }) {
  const [isvisible, setVisible] = useState(false);

  return (
    <div>
      <Button shape='circle' icon={<PiGitMergeBold />} onClick={() => setVisible(true)} />
      <OwnershipStructureModal
        isvisible={isvisible}
        setVisible={setVisible}
        row_data={data?.parents}
      />
    </div>
  );
}
