import { useState, useEffect, useContext, useCallback } from 'react';
import { percentageData } from './mockData';
import { getDeepSleedPercentageStatistics } from '@/api/deviceReports';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';

export default function DeepSleepPercentageStatistic({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Deep Sleep Percentage');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [deepSleepPercentageStatistic, setDeepSleepPercentageStatistic] = useState([]);

  const getSleepEfficiencyStatisticsData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getDeepSleedPercentageStatistics({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setDeepSleepPercentageStatistic(res.data);
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
        data={deepSleepPercentageStatistic}
        color={color}
        dataType='percentage'
        fromDate={fromDate}
        toDate={toDate}
        chartFor='deepSleepPercentageStatistic'
        xUnit='date'
      />
    </Template>
  );
}
