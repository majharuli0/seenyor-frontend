import React from 'react';
import { ConfigProvider, Select, Table, DatePicker } from 'antd';
import DealColumns from './utiles';
import { useState, useEffect, useCallback } from 'react';
import ls from 'store2';
import { getUser } from '@/api/Users';
import { getDealDetails } from '@/api/Dashboard';
import WeeklyMonthlyPicker from '@/Components/WeeklyMonthlyPicker/WeeklyMonthlyPicker';
import { SidebarContext } from '@/Context/CustomUsertable';
import CustomTable from '@/Shared/Table/CustomTable';
import './style.css';
import CustomButton from '@/Shared/button/CustomButton';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const { RangePicker } = DatePicker;
const Deals = () => {
  const [DDOrderStatus, setDDOrderStatus] = useState(null);
  const [DDAgentId, setDDAgentId] = useState('all');
  const [user, SetUser] = useState(ls.get('user'));
  const [office, setOffice] = useState([]);
  const [salesAgent, setSalesAgent] = useState([]);
  const [officeId, setOfficeId] = useState(null);
  const [dealDetails, setDealDetails] = useState([]);
  const [dealDetailsForReports, setDealDetailsForReports] = useState([]);
  const [officeQuery, setOfficeQuery] = useState({});
  const [dealLoading, setDealLoading] = useState(false);
  const [page, SetPage] = useState(1);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const dealDetailCol = DealColumns('dealDetailCol');
  const [weeklyMonthly, setWeeklyMonthly] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const statusMapping = {
    not_started: 'Not Started',
    pending: 'Pending',
    completed: 'Completed',
  };
  //Report Download
  const downloadReport = async () => {
    try {
      const reportData = await DealsForReports(
        DDAgentId === 'all' ? null : DDAgentId,
        DDOrderStatus === 'all' ? null : DDOrderStatus
      );

      if (!reportData || reportData.length === 0) {
        throw new Error('No data available to download');
      }

      const formattedData = reportData.map((item, index) => {
        const saleDate = new Date(item.created_at);
        return {
          'No.': index + 1,
          'Office Name': item.office_name,
          'Agent ID': item.agent_unique_id,
          'Agent Name': item.agent_name,
          // "Order Number": item.order_no,
          'Sale Date': saleDate.toLocaleDateString('en-CA'),
          'Sale Time': saleDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          'Installation Status': item.installer_id
            ? statusMapping[item.installation_status] || 'Unknown'
            : 'N/A',
          'Preferred Installation Date': item.installation_date
            ? new Date(item.installation_date).toLocaleDateString('en-CA')
            : '--',
          Products: item.products.map((product, idx) => `${idx + 1}. ${product.name}`).join(''),
          'Extra Product': item.products
            .map((item, indx) => {
              if (
                item.type !== 'Seenyor Kit' &&
                item.type !== 'Installation' &&
                item.type !== 'AI Monitoring'
              ) {
                return item.type;
              }
            })
            .join(''),
          'Current Sale Status': item.saleStatus,
          'City Location': item.address?.city || 'N/A',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading the sales report:', error);
      // Here you might want to show an error message to the user
      // For example: message.error("Failed to download report. Please try again.");
    }
  };

  const DealsForReports = (agentId, orderStatus) => {
    return getDealDetails({
      ...officeQuery,
      agent_id: agentId,
      payment_status: orderStatus,
      from_date: fromDate,
      to_date: toDate,
      limit: 100000,
    })
      .then((res) => {
        setDealDetailsForReports(res);
        return res.data; // Return the data for further processing
      })
      .catch((err) => {
        console.log(err);
        throw err; // Propagate the error
      });
  };
  const DealDetails = useCallback(
    (agentId, orderStatus) => {
      setDealLoading(true);
      getDealDetails({
        ...page,
        ...officeQuery,
        agent_id: agentId,
        payment_status: orderStatus,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          console.log(res);

          setDealDetails(res);
          setDealLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [DDOrderStatus, DDAgentId, officeQuery.office_id, toDate, page]
  );
  function getAllOffice() {
    getUser({ role: 'office' })
      .then((res) => {
        setOffice(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getAllAgent() {
    getUser({ ...officeQuery, role: 'sales_agent' })
      .then((res) => {
        setSalesAgent(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getAllOffice();
    getAllAgent();
  }, []);
  useEffect(() => {
    getAllAgent();
  }, [officeQuery]);
  useEffect(() => {
    DealDetails(
      DDAgentId === 'all' ? null : DDAgentId,
      DDOrderStatus === 'all' ? null : DDOrderStatus
    );
  }, [DealDetails]);
  function handleWeeklyMonthly(e) {
    setWeeklyMonthly(e);
    setFromDate(e?.start);
    setToDate(e?.end);
  }

  function handleDatePicker(e) {
    setFromDate(e[0]);
    setToDate(e[1]);
  }
  useEffect(() => {
    if (!officeId) return;
    if (officeId === 'all') {
      if (officeQuery.office_id) {
        const newQuery = { ...officeQuery };
        delete newQuery.office_id;
        setOfficeQuery(newQuery);
      }
    } else {
      setOfficeQuery((prevQuery) => ({
        ...prevQuery,
        office_id: officeId,
      }));
      // Reset other states if needed
      setDDAgentId('all');
    }
  }, [officeId]);
  return (
    <>
      <div
        id='Distributor_Dash_Top'
        className='flex justify-between w-full mb-5 flex-wrap gap-5 pt-[30px]'
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
          {user.role == 'office' ? (
            <div className='p-2 px-4 rounded-lg text-[36px] font-bold  text-primary'>
              {user.office}
            </div>
          ) : user.role == 'sales_agent' ? null : (
            <Select
              showSearch
              optionFilterProp='label'
              onChange={(e) => setOfficeId(e.value)}
              defaultValue={'all'}
              dropdownMatchSelectWidth={false}
              size='large'
              className='custom-select'
              labelInValue={true}
              options={[
                {
                  value: 'all',
                  label: (
                    <>
                      All Offices <span className='highlighted-number'>{office.length}</span>
                    </>
                  ), // Number of options included here
                },
                ...office.map((office) => ({
                  value: office._id,
                  label: office.name,
                })),
              ]}
            />
          )}
          <div id='DatePickers' className='flex gap-4 items-center'>
            <WeeklyMonthlyPicker
              placeholder={'Weekly/Monthly'}
              style={{ width: '140px', borderRadius: '10px' }}
              value={weeklyMonthly}
              handleChnage={(e) => {
                handleWeeklyMonthly(e);
                setDateRange(null);
              }}
            />
            <RangePicker
              showTime={false}
              style={{ width: '200px', borderRadius: '10px' }}
              size='large'
              value={dateRange}
              placeholder={['Pick Date Range (Start)', 'End']}
              format='YYYY-MM-DD'
              onChange={(value, dateString) => {
                handleDatePicker(dateString);
                setWeeklyMonthly(null);
                setDateRange(value);
              }}
            />
            <CustomButton
              disabled={dealDetails?.data?.length <= 0}
              onClick={downloadReport}
              type='text'
            >
              Download
            </CustomButton>
          </div>
        </ConfigProvider>
      </div>
      <div id='dealsDetails' className=' p-[25px] rounded-2xl  bg-white w-full mb-[20px]'>
        <div id='DealsHeader' className='w-full flex justify-between mb-8'>
          <h1 className='text-[24px] font-bold'>All Deal</h1>
          {user.role == 'sales_agent' ? null : (
            <div id='chartController' className='flex gap-4'>
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
                <Select
                  optionFilterProp='label'
                  onChange={(e) => setDDOrderStatus(e.value)}
                  defaultValue={'all'}
                  size='large'
                  labelInValue={true}
                  dropdownMatchSelectWidth={false}
                  className='w-[200px]'
                  options={[
                    {
                      value: 'all',
                      label: 'All Sales',
                    },
                    {
                      value: 'completed',
                      label: 'Completed',
                    },
                    {
                      value: 'pending',
                      label: 'Pending',
                    },
                    {
                      value: 'cancelled',
                      label: 'Cancelled',
                    },
                  ]}
                />
                <Select
                  showSearch
                  optionFilterProp='label'
                  onChange={(e) => setDDAgentId(e.value)}
                  defaultValue={'all'}
                  size='large'
                  value={DDAgentId}
                  labelInValue={true}
                  className='w-[200px]'
                  dropdownMatchSelectWidth={false}
                  options={[
                    {
                      value: 'all',
                      label: 'All Agents',
                    },
                    ...salesAgent.map((agent) => ({
                      value: agent._id,
                      label: agent.name + ' ' + agent.last_name,
                    })),
                  ]}
                />
              </ConfigProvider>
            </div>
          )}
        </div>

        <SidebarContext.Provider
          value={{
            getlist: DealDetails,
            total: dealDetails.total || [],
            page,
            SetPage,
          }}
        >
          <CustomTable loading={dealLoading} tableData={dealDetails.data} columns={dealDetailCol} />
        </SidebarContext.Provider>
        {/* <Table
            loading={dealLoading}
            pagination={{
              total: dealDetails.total,
              onChange: (page, pageSize) => {
                setPage(page);
              },
            }}
            scroll={{ x: 750 }}
            className="custom-table-filter"
            columns={dealDetailCol}
            dataSource={dealDetails.data}
          /> */}
      </div>
    </>
  );
};

export default Deals;
