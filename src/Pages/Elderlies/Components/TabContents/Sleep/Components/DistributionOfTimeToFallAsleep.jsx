import { useState, useEffect, useContext, useCallback } from 'react';
import { percentageData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import { getFallAsleepStatistics } from '@/api/deviceReports';

export default function DistributionOfTimeToFallAsleep({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Distribution of Time to Fall Asleep'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [timeToFallAsleepDistribution, setTimeToFallAsleepDistribution] = useState([]);

  const getSleepDurationDistributionData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getFallAsleepStatistics({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
      status: '5',
    })
      .then((res) => {
        filteredData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate, fromDate, elderlyDetails]);

  function filteredData(data) {
    const filteredData = data.map((item) => {
      const totalDuration = item.sleep_index_common_list.reduce(
        (sum, sleepItem) => sum + parseInt(sleepItem.value, 10),
        0
      );
      return {
        date: item.date,
        totalFallAsleepDuration: totalDuration,
      };
    });
    setTimeToFallAsleepDistribution(filteredData);
  }

  useEffect(() => {
    getSleepDurationDistributionData();
  }, [getSleepDurationDistributionData]);

  useEffect(() => {
    if (chartToDate && chartFromDate) {
      setToDate(chartToDate);
      setFromDate(chartFromDate);
    }
  }, [chartToDate]);

  return (
    <Template
      title={title}
      color={color}
      icon={icon}
      dataAnalysis={dataAnalysis}
      description={description}
      isSummaryBtn={false}
    >
      <BarChart
        data={timeToFallAsleepDistribution}
        color={color}
        dataType='percentage'
        xUnit='hour'
        toDate={''}
        fromDate={''}
        chartFor='fallAsleepDurationDistribution'
      />
    </Template>
  );
}
