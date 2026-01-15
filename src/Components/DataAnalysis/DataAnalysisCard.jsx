import React, { useEffect, useState } from 'react';
import { MoonFilled } from '@ant-design/icons';
import DOMPurify from 'dompurify';
import { FaLungsVirus } from 'react-icons/fa';
import LargeTextViewerModal from '@/Components/LargeTextViewerModal/LargeTextViewerModal';

export default function DataAnalysisCard({ dataAnalysisData = data, isSeeMore = true }) {
  return (
    <div id='DataAnalysisReport' className='flex flex-col gap-1 bg-white rounded-2xl p-4 w-full'>
      <div id='titleWithIcon' className='flex items-center gap-2'>
        {dataAnalysisData.icon}
        <div id='title' className='text-[20px] font-bold'>
          {dataAnalysisData.title}
        </div>
      </div>
      <div className='flex flex-col gap-0 w-full'>
        <span id='subTitle' className='text-[16px] font-bold'>
          {dataAnalysisData.subTitle}
        </span>
        <p
          id='description'
          className='text-[14px] text-text-primary w-full font-normal'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(dataAnalysisData?.description || ''),
          }}
        >
          {/* {!isSeeMore ? (
            dataAnalysisData.description
          ) : (
            <LargeTextViewerModal
              title="Analysis Report"
              data={dataAnalysisData.description}
              splitLatter={100}
              seeMoreClassName={`w-full ${
                dataAnalysisData.title === "Sleep"
                  ? "hover:text-[#9B7EBD]"
                  : "hover:text-[#88C273]"
              }`}
              isSeeMore={true}
            /> */}
          {/* )} */}
        </p>
      </div>
    </div>
  );
}
