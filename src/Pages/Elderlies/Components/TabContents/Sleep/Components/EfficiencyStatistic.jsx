import { useState, useEffect, useContext, useCallback } from 'react';
import { getSleepEfficiencyStatistics } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import { percentageData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';

export default function EfficiencyStatistic({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Efficiency');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [sleepEfficiencyStatistic, setSleepEfficiencyStatistic] = useState([]);

  const getSleepEfficiencyStatisticsData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getSleepEfficiencyStatistics({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setSleepEfficiencyStatistic(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getSleepEfficiencyStatisticsData();
  }, [getSleepEfficiencyStatisticsData]);

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
      isSummaryBtn={isSummaryBtn}
      summaryProps={summaryProps}
    >
      <BarChart
        data={sleepEfficiencyStatistic}
        color={color}
        dataType='percentage'
        fromDate={fromDate}
        toDate={toDate}
        xUnit='datesss'
      />
    </Template>
  );
}
