import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';

export default function SubDetails(data) {
  const [isvisible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Button onClick={() => setVisible(true)}>Details</Button>
      <Modal
        open={isvisible}
        onCancel={onClose}
        footer={null}
        centered
        width='80vw'
        className='device-configuration-modal my-6 lg:max-w-[50vw] overflow-hidden'
      >
        <div className='max-h-[70vh] overflow-auto text-left p-4'>
          <ReactJson
            src={data}
            name={false}
            collapsed={2} // start collapsed
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={false}
            theme='rjv-default' // colorful theme
          />
        </div>
      </Modal>
    </div>
  );
}
