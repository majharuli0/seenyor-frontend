import React from 'react';
import DataAnalysis from '@/Components/DataAnalysis/DataAnalysis';
import { FaLungsVirus } from 'react-icons/fa6';
export default function BioVitalDataAnalysis() {
  return (
    <div className='w-full h-full flex flex-col gap-4'>
      <h1 className='text-[24px] font-bold'>Bio Vital Data Analysis</h1>
      <DataAnalysis dataAnalysisData={data} isSeeMore={false} />
    </div>
  );
}
export const data = [
  {
    title: 'Respiratory Rate',
    icon: <FaLungsVirus className='text-[#88C273] text-[20px]' />,
    subTitle: 'You sleep for 4 hr 58 min, With deep sleep for 38%, Poor sleep Quality.',
    description:
      'Your current sleep pattern indicates that you are averaging just under 5 hours of sleep per night, which is below the recommended 7-9 hours for adults. This insufficient duration can lead to chronic sleep deprivation, negatively impacting cognitive function, mood, and overall health. While you have a decent percentage of deep sleep—38%—the short total sleep time means you may not be getting enough restorative rest.',
  },
];
