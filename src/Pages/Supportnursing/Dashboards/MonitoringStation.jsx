import React, { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';

import BarChartByGender from '../components/barChartByGender';
import PieChart from '../components/pieChart';
import { ConfigProvider } from 'antd';
import { Select } from 'antd';
import TotalAlertChart from '../components/totalAlertChart';
import BarChart from '../components/barChart';
import { getChartByGender, getChartByAge, getDiseasesCountByGender } from '@/api/Dashboard';
import BubbleChart from '../components/bubbleChart';
import { useRefContext } from '@/Context/RefContext';

export default function MonitoringStation({
  count,
  chartByAge = [],
  chartByGender = [],
  diseasesCountByGender = [],
  alertsCountByName = [],
  alertsCountByElderly = [],
}) {
  const { registerRef } = useRefContext();

  // const [chartByGender, setChartByGender] = useState([]);
  // const [chartByAge, setChartByAge] = useState([]);
  // const [diseasesCountByGender, setDiseasesCountByGender] = useState([]);
  // //Chart by gender (male and female)
  // const ChartByGender = useCallback(() => {
  //   getChartByGender()
  //     .then((res) => {
  //       console.log(res);
  //       setChartByGender(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // //chart by age with range
  // const ChartByAge = useCallback(() => {
  //   getChartByAge()
  //     .then((res) => {
  //       console.log(res);
  //       setChartByAge(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // //Diseses count by gender
  // const DiseasesCountByGender = useCallback(() => {
  //   getDiseasesCountByGender()
  //     .then((res) => {
  //       console.log(res);
  //       setDiseasesCountByGender(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // useEffect(() => {
  //   ChartByGender();
  //   ChartByAge();
  //   DiseasesCountByGender();
  // }, []);
  const stepsRef = {
    usersCountM: useRef(null),
    mostAlertM: useRef(null),
    activityCountM: useRef(null),
    agesM: useRef(null),
    genderM: useRef(null),
    diseasesM: useRef(null),
    activityM: useRef(null),
  };

  useEffect(() => {
    Object.keys(stepsRef).forEach((key) => {
      if (stepsRef[key].current) {
        registerRef('tour_step_' + key, stepsRef[key]);
      }
    });
  }, [registerRef]);
  return (
    <div className='w-full flex flex-col gap-6 pt-6'>
      <div className='flex gap-6 lg:flex-row flex-col h-fit'>
        <div className='rounded-2xl lg:w-[75%] w-full flex flex-col gap-6 h-full'>
          <div id='Reports' className='w-full rounded-2xl flex flex-col gap-6'>
            <div
              id='Cards'
              className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
              ref={stepsRef.usersCountM}
            >
              {count?.map((item, key) => {
                let IconName = item.icon;
                return (
                  <div
                    key={key}
                    id='Card'
                    style={{ backgroundColor: item?.color }}
                    className='cursor-pointer group flex w-full items-center p-4 py-6 text-white gap-3 rounded-[12px] relative overflow-hidden'
                  >
                    <div
                      id='circle'
                      className='w-[100px] h-[100px] bg-white/20 absolute -right-11 -top-14 rounded-full group-hover:-right-5 group-hover:-top-[75px] transition-all duration-200 ease-in-out'
                    ></div>
                    <div
                      id='circle'
                      className='w-[100px] h-[100px] bg-white/10 absolute -right-3 -top-[70px] rounded-full group-hover:-right-[50px] group-hover:-top-[45px] transition-all duration-200 ease-in-out'
                    ></div>
                    <div className='bg-opacity-10 h-fit rounded-[8px] p-2 bg-black/20'>
                      {IconName && <IconName color='#fff' size={20} />}
                    </div>
                    <div className='flex flex-col items-start'>
                      <h1 className='text-[26px] font-semibold leading-none'>{item.count || 0}</h1>
                      <span className='text-[14px] font-medium text-white/70 leading-none'>
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* {[1, 2, 3].map((item, key) => (
              <div
                key={key}
                id="Card"
                className="cursor-pointer group flex w-full items-center p-4 py-6 bg-[#0F60FF] text-white gap-3 rounded-[12px] relative overflow-hidden"
              >
                <div
                  id="circle"
                  className="w-[100px] h-[100px] bg-white/20 absolute -right-11 -top-14 rounded-full group-hover:-right-5 group-hover:-top-[75px] transition-all duration-200 ease-in-out"
                ></div>
                <div
                  id="circle"
                  className="w-[100px] h-[100px] bg-white/10 absolute -right-3 -top-[70px] rounded-full group-hover:-right-[50px] group-hover:-top-[45px] transition-all duration-200 ease-in-out"
                ></div>
                <div className="bg-opacity-10 h-fit rounded-[8px] p-2 bg-black/20">
                  <FiUser color="#fff" size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <h1 className="text-[26px] font-semibold leading-none">
                    1.6k
                  </h1>
                  <span className="text-[14px] font-medium text-white/70 leading-none">
                    Customers
                  </span>
                </div>
              </div>
            ))} */}
            </div>
          </div>
          <div
            className='p-[25px] rounded-2xl bg-white w-full h-[445px] flex-grow'
            ref={stepsRef.agesM}
          >
            <div id='ChartHeader' className='w-full flex justify-between'>
              <h1 className='text-[24px] font-bold'>Ages</h1>
            </div>
            <BarChartByGender
              // data={
              //   chartByAge.length > 0
              //     ? chartByAge
              //     : [
              //         {
              //           _id: "20-29",
              //           male_count: 4,
              //           female_count: 0,
              //         },
              //         {
              //           _id: "70-79",
              //           male_count: 0,
              //           female_count: 2,
              //         },
              //         {
              //           _id: "90-99",
              //           male_count: 1,
              //           female_count: 1,
              //         },
              //       ]
              // }
              data={chartByGender}
              chartFor='age'
            />
          </div>
          <div
            className='p-[25px] rounded-2xl bg-white w-full h-[445px] flex-grow'
            ref={stepsRef.diseasesM}
          >
            <div id='ChartHeader' className='w-full flex justify-between'>
              <h1 className='text-[24px] font-bold'>Diseases</h1>
            </div>
            <BarChartByGender
              // data={
              //   diseasesCountByGender.length > 0
              //     ? diseasesCountByGender
              //     : [
              //         {
              //           _id: "Diabetes5",
              //           male_count: 0,
              //           female_count: 1,
              //         },
              //         {
              //           _id: "Hypertension5",
              //           male_count: 0,
              //           female_count: 1,
              //         },
              //       ]
              // }
              data={diseasesCountByGender}
              chartFor='diseases'
            />
          </div>
        </div>

        <div className='rounded-2xl lg:w-[35%] w-full flex flex-col gap-6 h-full'>
          <div
            className='p-[25px] rounded-2xl bg-white w-full flex flex-col h-[496px] justify-between'
            ref={stepsRef.genderM}
          >
            <div>
              <div id='ChartHeader' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Gender</h1>
              </div>
              <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
                <PieChart
                  // data={
                  //   chartByGender.length > 0
                  //     ? chartByGender
                  //     : [
                  //         {
                  //           _id: "fe-male",
                  //           male_count: 0,
                  //           female_count: 3,
                  //         },
                  //         {
                  //           _id: "male",
                  //           male_count: 5,
                  //           female_count: 0,
                  //         },
                  //       ]
                  // }
                  data={chartByAge}
                  chartFor='gender'
                />
              </div>
            </div>

            <div id='ChartInfo' className='w-full flex flex-col gap-2'>
              <div id='InfoItem' className='w-full flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <div className='w-[12px] h-[12px] bg-text-primary rounded-full'></div>
                  <span className='text-lg font-medium'>Total</span>
                </div>
                <span className='text-lg font-semibold'>
                  {chartByAge.reduce((acc, item) => acc + item.male_count + item.female_count, 0)}
                </span>
              </div>
              <div id='InfoItem' className='w-full flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <div className='w-[12px] h-[12px] bg-[#4379EE] rounded-full'></div>
                  <span className='text-lg font-medium'>Male</span>
                </div>
                <span className='text-lg font-semibold'>
                  {chartByAge.map((item) => (item._id === 'male' ? item.male_count || 0 : 0))}
                  {chartByAge.length === 0 && <>0</>}
                </span>
              </div>
              <div id='InfoItem' className='w-full flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <div className='w-[12px] h-[12px] bg-[#5CC8BE] rounded-full'></div>
                  <span className='text-lg font-medium'>Female</span>
                </div>
                <span className='text-lg font-semibold'>
                  {' '}
                  {chartByAge.map((item) => (item._id === 'female' ? item.male_count || 0 : 0))}
                  {chartByAge.length === 0 && <>0</>}
                </span>
              </div>
            </div>
          </div>
          <div
            className='p-[25px] rounded-2xl bg-white w-full flex flex-col h-[496px] justify-between'
            ref={stepsRef.activityM}
          >
            <div>
              <div id='ChartHeader' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Activity</h1>
                <div id='chartController' className='flex gap-4'></div>
              </div>
              <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
                <TotalAlertChart data={alertsCountByName} />
              </div>
            </div>

            <div id='ChartInfo' className='w-full flex flex-col gap-2'>
              <div id='InfoItem' className='w-full flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <div className='w-[12px] h-[12px] bg-[#4379EE] rounded-full'></div>
                  <span className='text-lg font-medium'>Info</span>
                </div>
                <span className='text-lg font-semibold'>
                  {alertsCountByName
                    .filter((item) => item.type === 1)
                    .reduce((acc, curr) => acc + curr.count, 0)}
                </span>
              </div>
              <div id='InfoItem' className='w-full flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <div className='w-[12px] h-[12px] bg-[#F1963A] rounded-full'></div>
                  <span className='text-lg font-medium'>Warning</span>
                </div>
                <span className='text-lg font-semibold'>
                  {alertsCountByName
                    .filter((item) => item.type === 2)
                    .reduce((acc, curr) => acc + curr.count, 0)}
                </span>
              </div>
              <div id='InfoItem' className='w-full flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <div className='w-[12px] h-[12px] bg-[#D90000] rounded-full'></div>
                  <span className='text-lg font-medium'>Critical</span>
                </div>
                <span className='text-lg font-semibold'>
                  {alertsCountByName
                    .filter((item) => item.type === 3)
                    .reduce((acc, curr) => acc + curr.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full flex gap-6 xl:flex-row flex-col h-[500px] justify-between'>
        <div className='p-[25px] rounded-2xl bg-white w-full h-[445px]' ref={stepsRef.mostAlertM}>
          <div id='ChartHeader' className='w-full flex justify-between'>
            <h1 className='text-[24px] font-bold'>Most Alerts</h1>
          </div>
          <BarChart data={alertsCountByElderly} />
        </div>
        <div
          className='p-[25px] rounded-2xl bg-white w-full h-[445px]'
          ref={stepsRef.activityCountM}
        >
          <div id='ChartHeader' className='w-full flex justify-between'>
            <h1 className='text-[24px] font-bold'>Activity Count</h1>
          </div>
          <BubbleChart data={alertsCountByName} />
        </div>
      </div>
    </div>
  );
}
