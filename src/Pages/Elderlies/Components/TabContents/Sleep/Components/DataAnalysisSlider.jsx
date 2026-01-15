import React, { useEffect, useRef, useContext } from 'react';
import DOMPurify from 'dompurify';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AlertBG from '@/assets/AlertBGABS.svg';
import { LuFileSearch } from 'react-icons/lu';
import { CustomContext } from '@/Context/UseCustomContext';

export default function DataAnalysisSlider() {
  const { sleepData } = useContext(CustomContext);

  // Settings for react-slick
  const settings = {
    dots: Object.keys(sleepData?.evaluation || {}).length >= 2,
    infinite: Object.keys(sleepData?.evaluation || {}).length > 2,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
    centerMode: true, // This will center the active slide
    centerPadding: '20px', // Add space around the active slide
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: 'transparent',
          borderRadius: '10px',
          padding: '2px',
        }}
      >
        <ul id='dots' style={{ margin: '0px' }}>
          {dots}
        </ul>
      </div>
    ),
  };

  const keyToEnglishTitleMap = {
    sleep_deep_ratio_evaluation: 'Sleep Deep Ratio',
    sleep_leave_bed_evaluation: 'Sleep Leave Bed',
    sleep_start_time_evaluation: 'Sleep Start Time',
    sleep_duration_evaluation: 'Sleep Duration',
    unqualified_evaluation: 'Unqualified Evaluation',
    ahi_unqualified_evaluation: 'AHI Unqualified',
    sleep_ahi_evaluation: 'Sleep AHI',
    sleep_analysis_evaluation: 'Sleep Analysis',
  };
  const translationMap = {
    合格: 'Qualified',
    不合格: 'Unqualified',
    '您的AHI指数是0.77 （正常）<br/>AHI指数小于5是正常和良好的呼吸':
      'Your AHI index is 0.77 (Normal). AHI below 5 is considered normal and healthy breathing.',
    '您的睡眠时长5小时44分钟，深睡时长占比26%<br/>你的睡眠时间偏少<br/>建议早睡早起，增加睡眠时间，养成良好作息，好的睡眠让您一整天活力满满！':
      'Your sleep duration is 5 hours and 44 minutes, with 26% in deep sleep.<br/>You are sleeping less than recommended.<br/>We suggest going to bed early, waking up early, and increasing sleep time for a healthier routine. Good sleep will keep you energized throughout the day.',
  };
  const translateToEnglish = (text) => {
    return translationMap[text] || 'No Analysis Available For It.'; // Return translated text or original text if not found
  };

  return (
    <>
      {sleepData?.evaluation && Object.keys(sleepData?.evaluation).length > 0 && (
        <div id='dataAnalysisSlider' className='w-full mb-2 transition-all duration-300'>
          <Slider {...settings} className='w-full transition-all duration-300'>
            {Object.keys(sleepData?.evaluation)
              .filter((key) => keyToEnglishTitleMap[key]) // Only include keys that have a title in the map
              .map((key) => {
                const itemName = keyToEnglishTitleMap[key]; // Use key as the title
                const description = sleepData?.evaluation[key] || 'No Analysis Available';
                // const description = translateToEnglish(
                //   sleepData?.evaluation[key]
                // );

                return (
                  <div
                    key={key}
                    id='dataAnalysisItem'
                    className='rounded-2xl overflow-hidden bg-[#7F87FC] p-4  !flex justify-between items-center min-h-[200px] mx-auto  !w-[99%]'
                  >
                    <div id='leftSide' className='z-50'>
                      <div id='dataAnalysisItemHeader'>
                        <div
                          id='dataAnalysisItemTitleAndDescription'
                          className='flex flex-col gap-1.5'
                        >
                          <span className='text-white/80 text-2xl font-bold leading-none'>
                            {itemName}
                          </span>
                          <div className='flex flex-col gap-1'>
                            <h1
                              className=' text-[18px] font-semibold text-white m-0'
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(description || ''),
                              }}
                            ></h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id='rightSide'
                      className='z-50 flex-col gap-2 items-end hidden md:flex lg:flex'
                    >
                      {/* <img src={AlertBG} alt="" /> */}
                      <p className='text-white text-[22px] font-semibold leading-none opacity-40'>
                        Data Analysis
                      </p>
                      <LuFileSearch className='text-white text-[75px] opacity-60' />
                    </div>
                    <div
                      id='circleShapeWithLinearWhiteGurdianColor'
                      className='absolute -bottom-36 -left-10 size-60 opacity-10 rounded-full bg-gradient-to-b from-white to-transparent'
                    ></div>
                    <div
                      id='circleShapeWithLinearWhiteGurdianColor'
                      className='absolute -top-36 -right-10 size-60 opacity-35 rounded-full bg-gradient-to-b from-white to-transparent'
                    ></div>
                  </div>
                );
              })}
          </Slider>
        </div>
      )}

      {!sleepData?.evaluation && (
        <div className='flex justify-center items-center w-full !min-h-[280px] bg-primary/10 rounded-2xl'>
          <p className='text-primary text-[22px] font-semibold leading-none opacity-40'>
            No Data Analysis Available
          </p>
        </div>
      )}
    </>
  );
}
