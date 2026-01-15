import { useState, useContext } from 'react';
import DataAnalysisCard from '@/Components/DataAnalysis/DataAnalysisCard';
import { Collapse, Input, ConfigProvider } from 'antd';
import { CustomContext } from '@/Context/UseCustomContext';
import { MoonFilled } from '@ant-design/icons';
import { FaLungsVirus } from 'react-icons/fa';
import { FaLungs } from 'react-icons/fa';
import { FaHeartbeat } from 'react-icons/fa';
import { IoBody } from 'react-icons/io5';
import { IoBed } from 'react-icons/io5';
import translateTo from '@/utils/translateTo';
const { Panel } = Collapse;
const { Search } = Input;

export default function DataAnalyzeTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const { sleepData } = useContext(CustomContext);
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
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
    // return text; // Return translated text or original text if not found
    return translationMap[text] || 'No Analysis Available';
  };

  const data = [
    {
      groupName: 'Sleep condition',
      items: [
        sleepData?.evaluation?.sleep_deep_ratio_evaluation && {
          title: 'Sleep Deep Ratio',
          description: translateToEnglish(sleepData.evaluation.sleep_deep_ratio_evaluation),
        },
        sleepData?.evaluation?.sleep_ahi_evaluation && {
          title: 'Sleep AHI',
          description: translateToEnglish(sleepData.evaluation.sleep_ahi_evaluation),
        },
        sleepData?.evaluation?.sleep_duration_evaluation && {
          title: 'Sleep Duration',
          description: translateToEnglish(sleepData.evaluation.sleep_duration_evaluation),
        },
        sleepData?.evaluation?.unqualified_evaluation && {
          title: 'Unqualified Evaluation',
          description: translateToEnglish(sleepData.evaluation.unqualified_evaluation),
        },
        sleepData?.evaluation?.sleep_start_time_evaluation && {
          title: 'Sleep Start Time Evaluation',
          description: translateToEnglish(sleepData.evaluation.sleep_start_time_evaluation),
        },
        sleepData?.evaluation?.sleep_analysis_evaluation && {
          title: 'Sleep Analysis Evaluation',
          description: translateToEnglish(sleepData.evaluation.sleep_analysis_evaluation),
        },
      ].filter(Boolean),
    },
    {
      groupName: 'Breathing condition',
      items: [],
    },
    {
      groupName: 'Heart rate condition',
      items: [],
    },
    {
      groupName: 'Body movement condition',
      items: [],
    },
    {
      groupName: 'Bed exit condition',
      items: [
        sleepData?.evaluation?.sleep_leave_bed_evaluation && {
          title: 'Leave Bed Evaluation',
          description: translateToEnglish(sleepData.evaluation.sleep_leave_bed_evaluation),
        },
      ].filter(Boolean),
    },
    {
      groupName: 'Daily Routine',
      items: [],
    },
  ];

  // Filter data based on groupName and title
  const filteredData = data
    ?.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.title.toLowerCase().includes(searchTerm)),
    }))
    .filter(
      (group) => group.groupName.toLowerCase().includes(searchTerm) || group.items.length > 0
    );
  // Determine the key of the first panel to open by default
  const defaultOpenKey = filteredData.length > 0 ? filteredData[0].groupName : null;

  return (
    <>
      <div id='dataAnalyze' className='flex flex-col mt-6 rounded-xl gap-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-[24px] font-bold'>Data Analysis</h1>
          <ConfigProvider theme={{ token: { colorPrimary: '#8086AC' } }}>
            <Search
              size='large'
              placeholder='Search Analysis'
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
          </ConfigProvider>
        </div>
        <Collapse defaultActiveKey={defaultOpenKey}>
          {filteredData.map((group) => (
            <Panel
              header={group.groupName}
              key={group.groupName}
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#252F67 !important',
              }}
            >
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                {group.items.map((item, index) => (
                  <DataAnalysisCard key={index} dataAnalysisData={item} isSeeMore={false} />
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </>
  );
}
