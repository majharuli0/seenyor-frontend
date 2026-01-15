import React, { useEffect, useState } from 'react';
import { MoonFilled } from '@ant-design/icons';
import { FaLungsVirus } from 'react-icons/fa';
import LargeTextViewerModal from '@/Components/LargeTextViewerModal/LargeTextViewerModal';
import { Empty } from 'antd';

export default function DataAnalysis({ dataAnalysisData = data, date, isSeeMore = true }) {
  const [dateQuery, setDateQuery] = useState({
    from: '',
    to: '',
  });
  useEffect(() => {
    setDateQuery({
      from: date?.from,
      to: date?.to,
    });
  }, [date?.from, date?.to]);
  useEffect(() => {}, [dateQuery]);
  return (
    <div id='dataAnalysis' className='flex gap-4 w-full'>
      {dataAnalysisData.length > 0 ? (
        dataAnalysisData.map((item, index) => (
          <div
            key={index}
            id='DataAnalysisReport'
            className='flex flex-col gap-4 bg-white rounded-2xl p-4 w-full'
          >
            <div id='titleWithIcon' className='flex items-center gap-2'>
              {item.icon}
              <div id='title' className='text-[20px] font-bold'>
                {item.title}
              </div>
            </div>
            <div className='flex flex-col gap-0 w-full'>
              <span id='subTitle' className='text-[16px] font-bold'>
                {item.subTitle}
              </span>
              <p id='description' className='text-[14px] text-text-primary w-full'>
                {!isSeeMore ? (
                  item.description
                ) : (
                  <LargeTextViewerModal
                    title='Analysis Report'
                    data={item.description}
                    splitLatter={100}
                    seeMoreClassName={`w-full ${
                      item.title === 'Sleep' ? 'hover:text-[#9B7EBD]' : 'hover:text-[#88C273]'
                    }`}
                    isSeeMore={true}
                  />
                )}
              </p>
            </div>
          </div>
        ))
      ) : (
        <Empty className='w-full' image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
export const data = [
  {
    title: 'Sleep',
    icon: <MoonFilled className='text-[#9B7EBD] text-[20px]' />,
    subTitle: 'You sleep for 4 hr 58 min, With deep sleep for 38%, Poor sleep Quality.',
    description:
      'Your current sleep pattern indicates that you are averaging just under 5 hours of sleep per night, which is below the recommended 7-9 hours for adults. This insufficient duration can lead to chronic sleep deprivation, negatively impacting cognitive function, mood, and overall health. While you have a decent percentage of deep sleep—38%—the short total sleep time means you may not be getting enough restorative rest.',
  },
  {
    title: 'Breathing',
    icon: <FaLungsVirus className='text-[#88C273] text-[20px]' />,
    subTitle: 'Your AHI Index is 0.8, It is a normal phenomenom',
    description:
      'Your Apnea-Hypopnea Index (AHI) of 0.8 indicates a normal level of sleep apnea events. The AHI measures the number of apneas (complete cessation of breathing) and hypopneas (partial cessation of breathing) you experience per hour of sleep. Generally, an AHI score of 0-5 is considered normal, meaning that your breathing patterns during sleep are healthy and not indicative of sleep apnea.',
  },
];
