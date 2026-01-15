import { getDeviceReports } from '@/api/elderly';
import { Card, Col, DatePicker, Descriptions, Input, List, Row, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import React, { useEffect, useMemo, useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DeviceReports() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [deviceData, setDeviceData] = useState([]);
  const [filters, setFilters] = useState({
    isBind: 'all',
    sleepReport: 'all',
    activity: 'all',
    score: 'all',
    timezone: 'all',
  });
  const [searchTerm, setSearchTerm] = useState(''); // State for UID search
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  // Update tick every second to refresh time display
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data when selectedDate changes
  useEffect(() => {
    setLoading(true);
    getDeviceReports({ date: selectedDate })
      .then((res) => {
        setDeviceData(res?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [selectedDate]);

  // Compute unique timezones from device data
  const timezones = useMemo(() => {
    const zones = new Set();
    deviceData.forEach((device) => {
      if (device.timezone2Ip) {
        zones.add(device.timezone2Ip);
      }
    });
    return Array.from(zones);
  }, [deviceData]);

  // Apply filters to device data including UID search
  const filteredDeviceData = useMemo(() => {
    return deviceData.filter((device) => {
      // Filter by UID search term (case-insensitive)
      const matchesSearchTerm = device.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearchTerm) return false;

      // Existing filters
      if (filters.isBind !== 'all') {
        const isOnline = device.isBind;
        if (filters.isBind === 'online' && !isOnline) return false;
        if (filters.isBind === 'offline' && isOnline) return false;
      }
      if (filters.sleepReport !== 'all') {
        const hasSleepReport = device.sleepReport;
        if (filters.sleepReport === 'yes' && !hasSleepReport) return false;
        if (filters.sleepReport === 'no' && hasSleepReport) return false;
      }
      if (filters.activity !== 'all') {
        const hasActivity = device.activity;
        if (filters.activity === 'yes' && !hasActivity) return false;
        if (filters.activity === 'no' && hasActivity) return false;
      }
      if (filters.score !== 'all') {
        const hasScore = device.score;
        if (filters.score === 'yes' && !hasScore) return false;
        if (filters.score === 'no' && hasScore) return false;
      }
      if (filters.timezone !== 'all') {
        if (device.timezone2Ip !== filters.timezone) return false;
      }
      return true;
    });
  }, [deviceData, filters, searchTerm]);

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      {/* Filters Section */}
      <Row gutter={0} className='mb-6 gap-2'>
        <Col span={4}>
          <Select
            value={filters.timezone}
            onChange={(value) => setFilters({ ...filters, timezone: value })}
            options={[
              { value: 'all', label: 'All Timezones' },
              ...timezones.map((tz) => ({ value: tz, label: tz })),
            ]}
            dropdownMatchSelectWidth={false}
            className='w-full'
          />
        </Col>

        <Col span={4}>
          <Select
            value={filters.isBind}
            onChange={(value) => setFilters({ ...filters, isBind: value })}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'online', label: 'Online' },
              { value: 'offline', label: 'Offline' },
            ]}
            dropdownMatchSelectWidth={false}
            className='w-full'
          />
        </Col>
        <Col span={4}>
          <Select
            value={filters.sleepReport}
            onChange={(value) => setFilters({ ...filters, sleepReport: value })}
            options={[
              { value: 'all', label: 'All Sleep Reports' },
              { value: 'yes', label: 'Generated' },
              { value: 'no', label: 'Not Generated' },
            ]}
            dropdownMatchSelectWidth={false}
            className='w-full'
          />
        </Col>
        <Col span={4}>
          <Select
            value={filters.activity}
            onChange={(value) => setFilters({ ...filters, activity: value })}
            options={[
              { value: 'all', label: 'All Activity' },
              { value: 'yes', label: 'Has Activity' },
              { value: 'no', label: 'No Activity' },
            ]}
            dropdownMatchSelectWidth={false}
            className='w-full'
          />
        </Col>
        <Col span={4}>
          <Select
            value={filters.score}
            onChange={(value) => setFilters({ ...filters, score: value })}
            options={[
              { value: 'all', label: 'All Data' },
              { value: 'yes', label: 'Has Data' },
              { value: 'no', label: 'No Data' },
            ]}
            dropdownMatchSelectWidth={false}
            className='w-full'
          />
        </Col>
        <Col span={4}>
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={(date) =>
              setSelectedDate(date ? date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))
            }
            className='w-full'
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder='Search by UID'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full'
          />
        </Col>
      </Row>

      {/* Device Cards Section */}
      <Spin spinning={loading} tip='Loading device reports...'>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={filteredDeviceData}
          locale={{ emptyText: 'No devices found for the selected criteria.' }}
          renderItem={(device) => (
            <List.Item>
              <Card
                title={`Device: ${device.id}`}
                className='shadow-lg hover:shadow-xl transition-shadow duration-300'
              >
                <Descriptions column={1} size='small'>
                  <Descriptions.Item label='Status' className='font-semibold'>
                    <span className={device.isBind ? 'text-green-600' : 'text-red-600'}>
                      {device.isBind ? 'Online' : 'Offline'}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label='Sleep Report'>
                    {device.sleepReport ? 'Generated' : 'Not Generated'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Activity'>
                    {device.activity ? 'Has Activity' : 'No Activity'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Sleep Data'>
                    {device.score ? 'Has Data' : 'No Data'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Timezone'>
                    {device.timezone2Ip || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Current Time'>
                    {device.timezone2Ip
                      ? dayjs().tz(device.timezone2Ip).format('hh:mm:ss A')
                      : 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
}
