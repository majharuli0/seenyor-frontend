import React, { useState, useCallback, useEffect } from 'react';
import TabMenus from '@/Components/TabMenus';
import { ConfigProvider } from 'antd';
import { SidebarContext } from '@/Context/CustomUsertable';
import CustomTable from '@/Shared/Table/CustomTable';
import { installation } from './utiles';
import { getInstallationList } from '@/api/ordersManage';
export default function Installation() {
  const [loading, setLoading] = useState(false);
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    installation_status: 'completed',
    ne: true,
  });
  const [installationList, setInstallationList] = useState([]);
  const [activeTab, setActiveTab] = useState('Not Installed');
  const menus = [{ text: 'Not Installed' }, { text: 'Installed' }];
  const getList = useCallback(() => {
    // setLoading(true);
    setLoading(true);
    getInstallationList({ ...query, page })
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
  }, [query, page]);
  useEffect(() => {
    getList();
  }, [getList]);
  useEffect(() => {
    if (activeTab === 'Installed') {
      setQuery({ installation_status: 'completed' });
    } else {
      setQuery({ installation_status: 'completed', ne: true });
    }
  }, [activeTab]);
  return (
    <div>
      <div className='py-[20px] flex'>
        <TabMenus menus={menus} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div id='NewInstallation' className='p-[25px] rounded-2xl  bg-white w-full  h-full'>
        <div id='ChartHeader' className='w-full flex justify-between mb-8'>
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
              getList,
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
    </div>
  );
}
