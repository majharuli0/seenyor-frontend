import { useState, useEffect, useContext, useCallback } from 'react';
import { getSleepDurationDistribution } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import { durationData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
export default function DurationDistribution({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Duration Distribution');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [sleepDurationDistributionData, setSleepDurationDistributionData] = useState([]);
  const getSleepDurationDistributionData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getSleepDurationDistribution({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,

      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        filteredData(res?.data);
        // const result = generateSleepDistribution(res?.data);
        setSleepDurationDistributionData(res?.data);
        // console.log("===============asdasd>", result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate, fromDate, elderlyDetails]);
  useEffect(() => {
    getSleepDurationDistributionData();
  }, [getSleepDurationDistributionData]);
  useEffect(() => {
    if (chartToDate && chartFromDate) {
      setToDate(chartToDate);
      setFromDate(chartFromDate);
    }
  }, [chartToDate]);

  function filteredData(data) {
    // Initialize an array to hold counts for each hour (1-12)
    const sleepCounts = Array(12).fill(0);

    // Count occurrences of each sleep duration (rounded to nearest hour)
    data?.forEach((item) => {
      const sleepHours = Math.round(item.sleepDuration); // Round to nearest hour
      if (sleepHours >= 1 && sleepHours <= 12) {
        sleepCounts[sleepHours - 1] += 1; // Increment the corresponding hour bucket
      }
    });

    // Calculate total data points
    const totalSleepEntries = data?.length || 0;

    // Convert counts to percentages
    const sleepDistribution = sleepCounts.map((count, index) => ({
      hour: index + 1, // x-axis: Hour of sleep (1-12)
      percentage: totalSleepEntries > 0 ? (count / totalSleepEntries) * 100 : 0, // y-axis: Percentage
    }));

    // Set the processed data to state
    setSleepDurationDistributionData(sleepDistribution);
    console.log(sleepDistribution);
  }

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
        data={sleepDurationDistributionData}
        dataType='percentage'
        xUnit='hour'
        chartFor='durationDistribution'
        color={color}
        toDate={''}
        fromDate={''}
      />
    </Template>
  );
}
