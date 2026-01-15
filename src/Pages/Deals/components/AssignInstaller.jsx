import React, { useState, useEffect, useContext } from 'react';
import { RiToolsLine } from 'react-icons/ri';
import CustomModal from '../../../Shared/modal/CustomModal';
import { ConfigProvider, Select, Table } from 'antd';
import CustomButton from '@/Shared/button/CustomButton';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { getUser, getUserDetails } from '@/api/Users';
import { assignInstaller } from '@/api/ordersManage';
export default function AssignInstaller({ data }) {
  const [open, setOpen] = useState(false);
  const sharedMethod = useContext(SidebarContext);

  const [dataSource, setDataSource] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  function getlist() {
    setLoading(true);
    getUser({
      role: 'installer',
    }).then((res) => {
      if (res) {
        setDataSource(res?.data);
        setLoading(false);
      }
    });
  }
  function handleSelectChange(value) {
    setSelectedItems(value);
  }
  function handleClick() {
    console.log('cliekd');
    setLoading(true);
    assignInstaller(data?._id, {
      installer_id: selectedItems,
    })
      .then((res) => {
        if (res) {
          console.log(res);
          setOpen(false);
          setLoading(false);
          sharedMethod.getlist();
        }
      })
      .finally(() => {
        setOpen(false);
      });
  }
  function handleAssignBtnClick() {
    getlist();
    // getInstallerData();
  }

  return (
    <div>
      <span
        onClick={() => {
          setOpen(true);
          handleAssignBtnClick();
        }}
        className='flex items-center gap-2 text-blue-500 font-baloo font-semibold'
      >
        <RiToolsLine size={18} /> Assign Installer
      </span>
      <CustomModal
        modalOPen={open}
        setModalOpen={setOpen}
        onCancel={() => setOpen(false)}
        title='Assign Installer'
        isBottomButtomShow={false}
      >
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
          <div id='addSalesAgent' className='flex gap-4 mb-5  justify-between items-center'>
            <Select
              mode='single'
              maxTagCount='responsive'
              optionFontSize={18}
              dropdownMatchSelectWidth={false}
              optionHeight={50}
              placeholder='Search Installer'
              value={selectedItems}
              onChange={handleSelectChange}
              onSearch={(value) => setQuery(value)} // Handles the search input
              style={{ width: '100%', borderRadius: '13px' }}
              filterOption={false} // Disable default filtering to use custom filtering
              className='agentSelection h-[40px]'
            >
              {dataSource?.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name} {item.last_name}
                </Option>
              ))}
            </Select>

            <CustomButton onClick={() => handleClick()}>Assign Installer</CustomButton>
          </div>

          {/* Table */}
          {/* {installerData && (
            <Table
              loading={loading}
              dataSource={[installerData] || []}
              columns={[
                {
                  title: "Installer Name",
                  dataIndex: "name",
                },
                {
                  title: "Installer Email",
                  dataIndex: "email",
                },
                {
                  title: "Installer Phone",
                  dataIndex: "contact_number",
                },
              ]}
              pagination={false}
            />
          )} */}

          {/* <SidebarContext1.SidebarContext.Provider value={{ getlist: getlist }}>
            <CustomTable
              loading={loading}
              tableData={dataSource || []}
              columns={[
                {
                  title: "Installer Name",
                  dataIndex: "name",
                },
                {
                  title: "Installer Email",
                  dataIndex: "email",
                },
                {
                  title: "Installer Phone",
                  dataIndex: "phone",
                },
              ]}
              scroll={{ x: 500, y: 500 }}
            />
          </SidebarContext1.SidebarContext.Provider> */}
        </ConfigProvider>
      </CustomModal>
    </div>
  );
}
