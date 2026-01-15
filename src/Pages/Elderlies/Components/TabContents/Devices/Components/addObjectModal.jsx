import React, { useState } from 'react';
import { Modal, Input, Button, ConfigProvider } from 'antd';
import {
  FaBed,
  FaCouch,
  FaDoorOpen,
  FaBath,
  FaTable,
  FaArrowsAltH,
  FaArrowsAltV,
} from 'react-icons/fa';
import { MdTableBar } from 'react-icons/md';
import { PiToiletFill } from 'react-icons/pi';
import bedroomOther from '@/assets/icon/object/black/bo.svg';
import bathroomOther from '@/assets/icon/object/black/bao.svg';
import livingroomOther from '@/assets/icon/object/black/lo.svg';
import singleBed from '@/assets/icon/object/black/sb.svg';
import doubleBed from '@/assets/icon/object/black/db.svg';
import door from '@/assets/icon/object/black/do.svg';
import sofa from '@/assets/icon/object/black/sofa.svg';
import table from '@/assets/icon/object/black/t.svg';
import tub from '@/assets/icon/object/black/tu.svg';
import toilet from '@/assets/icon/object/black/to.svg';
const objectTemplates = {
  bedroom: [
    {
      type: 2,
      label: 'Bed',
      width: 18,
      length: 8,
      icon: singleBed,
      object_type: 6,
    },
    {
      type: 4,
      label: 'Door',
      width: 10,
      length: 3,
      icon: door,
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      width: 10,
      length: 10,
      icon: bedroomOther,
      object_type: 12,
    },
  ],
  livingroom: [
    {
      type: 5,
      label: 'Sofa',
      width: 10,
      length: 10,
      icon: sofa,
      object_type: 8,
    },
    {
      type: 6,
      label: 'Table',
      width: 10,
      length: 10,
      icon: table,
      object_type: 9,
    },
    {
      type: 4,
      label: 'Door',
      width: 10,
      length: 3,
      icon: door,
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      width: 10,
      length: 10,
      icon: livingroomOther,
      object_type: 13,
    },
  ],
  bathroom: [
    {
      type: 7,
      label: 'Tub',
      width: 15,
      length: 7.5,
      icon: tub,
      object_type: 10,
    },
    {
      type: 8,
      label: 'Toilet',
      width: 6,
      length: 6,
      icon: toilet,
      object_type: 11,
    },
    {
      type: 4,
      label: 'Door',
      width: 10,
      length: 3,
      icon: door,
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      width: 10,
      length: 10,
      icon: bathroomOther,
      object_type: 14,
    },
  ],
};

const ObjectCard = ({ template, isSelected, onSelect, children }) => {
  return (
    <div
      onClick={onSelect}
      style={{
        border: isSelected ? '2px solid #1B2559' : '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '10px',
        width: '120px',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#f2f3f5' : '#fff',
        boxShadow: isSelected ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
        // transition: "all 0.2s ease",
        textAlign: 'center',
      }}
    >
      {template.icon && (
        <span style={{ fontSize: '30px', marginBottom: '8px' }}>
          {template.label == 'Horizontal' || template.label == 'Vertical' ? (
            <>{template.icon}</>
          ) : (
            <img src={template.icon} alt='' />
          )}
        </span>
      )}
      <div style={{ fontWeight: '500', fontSize: '14px' }}>{template.label}</div>
      {template.label !== 'Others' && template.label !== 'Bed' && (
        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
          {template.width * 10}cm x {template.length * 10}cm
        </div>
      )}
      {children}
    </div>
  );
};

const DimensionCard = ({ label, icon, value, onChange, max }) => {
  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '15px',
        width: '180px',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '40px', marginBottom: '10px' }}>{icon}</span>
      <div style={{ fontWeight: '500', fontSize: '16px', marginBottom: '10px' }}>{label}</div>
      <Input
        type='number'
        value={value}
        onChange={onChange}
        placeholder={`${label} (CM)`}
        min={1}
        max={max}
        style={{ width: '100%', textAlign: 'center', fontSize: '14px' }}
      />
    </div>
  );
};

const AddObjectModal = ({ visible, onOk, onCancel, roomType, mountType }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [orientation, setOrientation] = useState('horizontal');
  const [customWidth, setCustomWidth] = useState('');
  const [customLength, setCustomLength] = useState('');

  const handleNext = () => {
    if (step === 1 && selectedTemplate) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOrientation('horizontal');
    setCustomWidth('');
    setCustomLength('');
  };

  const handleOk = () => {
    if (step === 2) {
      let width = selectedTemplate.width;
      let length = selectedTemplate.length;
      if (
        selectedTemplate.label === 'Others' ||
        selectedTemplate.label === 'Sofa' ||
        selectedTemplate.label === 'Table' ||
        selectedTemplate.label === 'Bed'
      ) {
        width = parseInt(customWidth) / 10 || 10;
        length = parseInt(customLength) / 10 || 10;
      } else if (orientation === 'vertical') {
        [width, length] = [length, width];
      }
      onOk({ ...selectedTemplate, width, length, orientation });
      setStep(1);
      setSelectedTemplate(null);
      setOrientation('horizontal');
      setCustomWidth('');
      setCustomLength('');
    }
  };

  const maxWidth = mountType === 'ceiling' ? 600 : 60;
  const maxLength = mountType === 'ceiling' ? 400 : 40;

  const orientationTemplates = [
    {
      label: 'Horizontal',
      width: selectedTemplate?.width,
      length: selectedTemplate?.length,
      icon: <FaArrowsAltH />,
    },
    {
      label: 'Vertical',
      width: selectedTemplate?.length,
      length: selectedTemplate?.width,
      icon: <FaArrowsAltV />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1B2559',
        },
      }}
    >
      <Modal
        // title={`Add Object to ${
        //   roomType.charAt(0).toUpperCase() + roomType.slice(1)
        // }`}
        visible={visible}
        onOk={step === 1 ? handleNext : handleOk}
        onCancel={onCancel}
        okText={step === 1 ? 'Next' : 'Add'}
        footer={null}
        centered
        width={500}
        bodyStyle={{ height: '400px', padding: '20px', paddingTop: '0' }} // Fixed height with padding
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Vertical centering
            alignItems: 'center', // Horizontal centering
            position: 'relative',
          }}
        >
          <h2 className='text-xl font-bold pt-4 text-primary'>
            Add Object to {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
          </h2>
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingBottom: '30px',
            }}
          >
            {step === 1 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '10px',
                  padding: '10px 0',
                  maxWidth: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                }}
              >
                {objectTemplates[roomType].map((template, index) => (
                  <ObjectCard
                    key={index}
                    template={template}
                    isSelected={selectedTemplate === template}
                    onSelect={() => setSelectedTemplate(template)}
                  />
                ))}
              </div>
            ) : selectedTemplate.label === 'Others' ||
              selectedTemplate.label === 'Sofa' ||
              selectedTemplate.label === 'Table' ||
              selectedTemplate.label === 'Bed' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 180px)',
                  gap: '20px',
                }}
              >
                <DimensionCard
                  label='Width'
                  icon={<FaArrowsAltH />}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  max={maxWidth}
                />
                <DimensionCard
                  label='Height'
                  icon={<FaArrowsAltV />}
                  value={customLength}
                  onChange={(e) => setCustomLength(e.target.value)}
                  max={maxLength}
                />
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 120px)',
                  gap: '20px',
                }}
              >
                {orientationTemplates.map((template, index) => (
                  <ObjectCard
                    key={index}
                    template={template}
                    isSelected={orientation === template.label.toLowerCase()}
                    onSelect={() => setOrientation(template.label.toLowerCase())}
                  />
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
            }}
          >
            {step === 2 && (
              <Button
                onClick={handleBack}
                style={{
                  width: '100px',
                  borderColor: '#d9d9d9',
                }}
              >
                Back
              </Button>
            )}
            <Button
              onClick={step === 1 ? handleNext : handleOk}
              disabled={
                step === 1
                  ? !selectedTemplate
                  : selectedTemplate.label === 'Others' && (!customWidth || !customLength)
              }
              style={{
                width: '100px',
                backgroundColor: '#1B2559',
                color: '#fff',
                border: 'none',
              }}
            >
              {step === 1 ? 'Next' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddObjectModal;
