import React, { useEffect, useState, useCallback, useContext } from 'react';
import { getAlertList } from '@/api/elderlySupport';
import dayjs, { Dayjs } from 'dayjs';
import { SidebarContext } from '@/Context/CustomUsertable';
import { Segmented, ConfigProvider, Select, Checkbox, Button, Table } from 'antd';
// import { alertHistoryColumns } from "./utiles";
import { useAlertTableColumns } from './utiles';
import { getAlertInfoViaEventDetails, getAlertsGroup } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import AlertCloseModal from '@/Components/ActiveAlerts/AlertCloseModal';

export default function AlertsHistoryTab() {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openAlertCloseModal, setOpenAlertCloseModal] = useState(false);
  const [currentSegment, setCurrentSegment] = useState('All Activity');
  const tableColumns = useAlertTableColumns(
    currentSegment === 'All Activity' ? 'allActivity' : 'recentlyClosedAlert'
  );
  const { elderlyDetails } = useContext(CustomContext);

  const [alertHistory, setAlertHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Add pageSize state
  const [total, setTotal] = useState(0);
  const [alertHistiryQuery, setAlertHistiryQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isResolved, setIsResolved] = useState(null);

  const getAlartsHistory = useCallback(() => {
    setLoading(true);
    getAlertList({
      to_date: '2024-11-30',
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: isResolved,
      lookup: false,
      elderly_id: elderlyDetails?._id,
      page: page, // Fix: pass page correctly
      limit: pageSize, // Fix: add limit parameter
      ...alertHistiryQuery,
    })
      .then((res) => {
        setTotal(res.total);
        setLoading(false);
        setAlertHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [page, pageSize, alertHistiryQuery, isResolved, elderlyDetails?._id]); // Add pageSize to dependencies

  useEffect(() => {
    getAlartsHistory();
  }, [getAlartsHistory]);

  function onAlertHistorySegmantChnage(value) {
    setCurrentSegment(value);
    setAlertHistiryQuery(getAlertsGroup(value));
    setPage(1); // Reset to first page when filter changes
    if (value === 'All Activity') {
      setIsResolved(null);
    }
  }

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Determine if an alert is Critical or Warning based on event type
  const getAlertSeverity = (item) => {
    return getAlertInfoViaEventDetails(item).label;
  };

  // Check if item should be selectable (checkbox enabled)
  const isItemSelectable = (item) => {
    const severity = getAlertSeverity(item);
    // Enable checkbox only for Critical and Warning items that are not resolved
    return (severity === 'Critical' || severity === 'Warning') && item.is_resolved === false;
  };

  // Handle checkbox selection
  const handleCheckboxChange = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Handle select all checkboxes
  const handleSelectAll = (checked) => {
    if (checked) {
      const selectableItems = alertHistory
        .filter((item) => isItemSelectable(item))
        .map((item) => item._id || item.id);
      setSelectedItems(selectableItems);
    } else {
      setSelectedItems([]);
    }
  };

  // Get selectable items count
  const selectableItemsCount = alertHistory.filter(isItemSelectable).length;

  // Handle bulk action
  const handleBulkAction = () => {
    // Add your bulk action logic here
    setOpenAlertCloseModal(true);
    // You can add API calls or other actions here
  };

  // Row selection configuration for Ant Design Table
  const rowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedKeys) => setSelectedItems(selectedKeys),
    getCheckboxProps: (record) => ({
      // Disable checkbox for items that are NOT Critical/Warning OR are resolved
      disabled: !isItemSelectable(record),
    }),
  };

  // Handle filter changes that should reset pagination
  const handleFilterChange = (filterValue) => {
    setIsResolved(filterValue);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div
      id='Elderlies'
      className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6 mt-6'
    >
      <div id='Elderlies_Header' className='w-full flex justify-between'>
        <h1 className='text-[24px] font-bold'>Activities History</h1>
        <div className='flex gap-4 h-fit items-center'>
          {selectedItems.length > 0 && (
            <Button
              type='primary'
              onClick={handleBulkAction}
              style={{
                backgroundColor: '#252F67',
                borderColor: '#252F67',
              }}
            >
              Resolve ({selectedItems.length})
            </Button>
          )}

          <ConfigProvider
            theme={
              {
                // components: {
                //   Segmented: {
                //     itemSelectedBg: "#252F67",
                //     itemSelectedColor: "#fff",
                //     fontFamily: "Baloo2",
                //   },
                // },
              }
            }
          >
            <Segmented
              size='large'
              options={alertHistorySegmentOptions}
              onChange={(value) => onAlertHistorySegmantChnage(value)}
            />
          </ConfigProvider>

          {(currentSegment === 'Critical' || currentSegment === 'Warning') && (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#8086AC',
                },
              }}
            >
              <Select
                size='large'
                style={{
                  width: '120px',
                  height: '40px',
                  borderRadius: '10px !important',
                }}
                onChange={(selectedValue, option) => {
                  handleFilterChange(selectedValue);
                }}
                dropdownMatchSelectWidth={false}
                placeholder='Filter by Alert Status'
                value={isResolved}
                options={[
                  {
                    label: 'All Activity',
                    value: null,
                  },
                  {
                    label: 'Resolved',
                    value: true,
                  },
                  {
                    label: 'Non-Resolved',
                    value: false,
                  },
                ]}
              />
            </ConfigProvider>
          )}
        </div>
      </div>

      <SidebarContext.Provider
        value={{
          getLatestAlarmList: {
            getAlartsHistory,
          },
        }}
      >
        <ConfigProvider
          theme={{
            Table: {
              rowSelectedHoverBg: '#fff',
              rowSelectedBg: '#ba80f0',
            },
          }}
        >
          <Table
            rowSelection={rowSelection}
            columns={Array.isArray(tableColumns) ? tableColumns : []}
            dataSource={alertHistory}
            rowKey='_id'
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange} // Add onChange handler
            locale={{ emptyText: 'No recent alerts' }}
            className='rounded-lg w-full'
            scroll={{ x: 700 }}
          />
        </ConfigProvider>
      </SidebarContext.Provider>
      <AlertCloseModal
        openAlertCloseModal={openAlertCloseModal}
        setOpenAlertCloseModal={setOpenAlertCloseModal}
        selectedAlert={selectedItems}
        getAlertListDatas={() => {
          getAlartsHistory();
          setSelectedItems([]);
        }}
      />
    </div>
  );
}

export const alertHistorySegmentOptions = [
  {
    label: 'All Activity',
    value: 'All Activity',
  },
  {
    label: 'Critical',
    value: 'Critical',
  },
  {
    label: 'Warning',
    value: 'Warning',
  },
];
