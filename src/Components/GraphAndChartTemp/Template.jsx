import { useState } from 'react';
import { FileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { BsMoonStarsFill } from 'react-icons/bs';
import SummaryModal from '../SummaryModal/SummaryModal';

export default function Template({
  children,
  title,
  color,
  icon,
  description,
  dataAnalysis,
  isDataAnalysis = true,
  isSummaryBtn = true,
  summaryProps,
  headerClassName,
}) {
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  return (
    <>
      <div className='flex flex-col gap-6 p-6 bg-white rounded-2xl !w-full h-full '>
        <div id='header' className='flex justify-between items-center w-full'>
          <div className='flex items-center gap-2'>
            <div
              style={{
                color: color,
                fontSize: '24px',
              }}
            >
              {icon}
            </div>
            <h1 className={`text-[21px] font-bold text-primary ${headerClassName}`}>{title}</h1>
            {description && (
              <Tooltip title={description}>
                <InfoCircleOutlined
                  style={{ fontSize: '16px', color: '#000', cursor: 'pointer' }}
                />
              </Tooltip>
            )}
          </div>
          {isSummaryBtn && (
            <Button
              onClick={() => setIsSummaryModalOpen(true)}
              icon={<FileOutlined />}
              size='large'
            >
              Summary
            </Button>
          )}
        </div>
        <div className='h-full'>{children}</div>

        {isDataAnalysis && dataAnalysis !== '' && (
          <div id='footer' className='flex gap-3 items-center p-2 px-3'>
            {/* <div
            id="bar"
            style={{ backgroundColor: color }}
            className="w-[3px] h-full rounded-full"
          ></div> */}
            <div
              id='icon'
              style={{
                color: 'white',
                fontSize: '20px',
                backgroundColor: color,
              }}
              className='p-2 rounded-full'
            >
              {icon}
            </div>
            <span className='text-[15px] capitalize'>{dataAnalysis}</span>
          </div>
        )}
      </div>
      <SummaryModal
        visible={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summaryProps={{ ...summaryProps, color, icon }}
      />
    </>
  );
}
