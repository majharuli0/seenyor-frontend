import React, { useState, useEffect, useCallback, useRef } from 'react';
import PieChart from '../components/pieChart';
import MapLocat from '../components/map';
import { ConfigProvider, Table } from 'antd';
import { installation } from '../utiles.jsx';
import { getInstallationList } from '../../../api/ordersManage';
import { getDeviceSalesCount } from '@/api/Dashboard';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { useRefContext } from '@/Context/RefContext';

export default function InstallerDashboard() {
  const [loading, setLoading] = useState(false);
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [installationList, setInstallationList] = useState([]);
  const [completedInstallationList, setCompletedInstallationList] = useState([]);
  const [deviceSalesCount, setDeviceSalesCount] = useState([]);
  function getList(query) {
    // setLoading(true);
    setLoading(true);
    getInstallationList(query)
      .then((res) => {
        setInstallationList(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const getDeviceSalesCounts = useCallback(() => {
    getDeviceSalesCount()
      .then((res) => {
        setDeviceSalesCount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);
  const getCompletedandToBeInstalled = useCallback(() => {
    getList({ installation_status: 'completed', ne: true, page: page });
  }, [page]);
  useEffect(() => {
    getCompletedandToBeInstalled();
  }, [getCompletedandToBeInstalled]);
  useEffect(() => {
    getDeviceSalesCounts();
  }, [getDeviceSalesCounts]);
  const { registerRef } = useRefContext();

  const stepsRef = {
    step1: useRef(null),
  };

  useEffect(() => {
    Object.keys(stepsRef).forEach((key) => {
      if (stepsRef[key].current) {
        registerRef('tour_step_' + key, stepsRef[key]);
      }
    });
  }, [registerRef]);
  return (
    <div className='flex flex-col gap-6 pt-6'>
      <div className='w-full flex  gap-6 lg:flex-row flex-col'>
        {/* <div className=" p-[25px] rounded-2xl  bg-white lg:w-[65%] w-full  h-[500px]">
          <MapLocat />
        </div> */}
        <div
          id='NewInstallation'
          className='p-[25px] rounded-2xl  bg-white lg:w-[65%] w-full  h-full'
        >
          <div id='ChartHeader' className='w-full flex justify-between mb-8' ref={stepsRef.step1}>
            <h1 className='text-[24px] font-bold'>To Be Installed</h1>
            <div id='chartController' className='flex gap-4'></div>
          </div>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'Baloo2',
                colorPrimary: '#8086AC',
                colorLinkActive: '#8086AC',
                colorLinkHover: '#8086AC',
                colorLink: '#8086AC',
              },
            }}
          >
            <SidebarContext.Provider
              value={{
                getInstallationList: {
                  getCompletedandToBeInstalled,
                  getDeviceSalesCounts,
                },
                total: total,
                page,
                SetPage,
              }}
            >
              <CustomTable
                loading={loading}
                scroll={{ x: 750 }}
                columns={installation}
                tableData={installationList}
              />
            </SidebarContext.Provider>
          </ConfigProvider>
        </div>
        <div className=' p-[25px] rounded-2xl  bg-white lg:w-[35%] w-full'>
          <div>
            <div id='ChartHeader' className='w-full flex justify-between'>
              <h1 className='text-[24px] font-bold'>Device Installed</h1>
            </div>
            <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
              <PieChart data={deviceSalesCount} chartFor='device' />
            </div>
          </div>

          <div id='ChartInfo' className='w-full flex flex-col gap-2'>
            {['completed', 'pending', 'not_started'].map((status, index) => {
              const item = deviceSalesCount.find((item) => item._id === status) || {
                _id: status,
                count: 0,
              };
              return (
                <div key={index} id='InfoItem' className='w-full flex justify-between'>
                  <div className='flex gap-2 items-center'>
                    <div
                      className={`w-[12px] h-[12px] ${
                        item._id === 'completed'
                          ? 'bg-[#08A1F7]'
                          : item._id === 'pending'
                            ? 'bg-[#922BF2]'
                            : 'bg-[#FF3B11]'
                      } rounded-full`}
                    ></div>
                    <span className='text-lg font-medium capitalize'>
                      {item._id === 'completed'
                        ? 'Completed'
                        : item._id === 'pending'
                          ? 'Pending'
                          : 'Not Started'}
                    </span>
                  </div>
                  <span className='text-lg font-semibold'>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div
        id="TotalInstallation"
        className=" p-[25px] rounded-2xl  bg-white w-full h-full "
      >
        <div id="ChartHeader" className="w-full flex justify-between mb-8">
          <h1 className="text-[24px] font-bold">Total Installation</h1>
          <div id="chartController" className="flex gap-4"></div>
        </div>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "Baloo2",
              colorPrimary: "#8086AC",
              colorLinkActive: "#8086AC",
              colorLinkHover: "#8086AC",
              colorLink: "#8086AC",
            },
          }}
        >
          <SidebarContext.Provider
            value={{
              getInstallationList: {
                getCompletedandToBeInstalled,
                getDeviceSalesCounts,
              },
              total: total,
              page,
              SetPage,
            }}
          >
            <CustomTable
              loading={loading}
              scroll={{ x: 750 }}
              columns={installation}
              tableData={completedInstallationList}
            />
          </SidebarContext.Provider>
        </ConfigProvider>
      </div> */}
    </div>
  );
}
