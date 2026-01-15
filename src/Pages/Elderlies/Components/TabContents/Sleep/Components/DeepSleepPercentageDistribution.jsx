import { useState, useEffect, useContext, useCallback } from 'react';
import { getDeepSleedPercentageStatistics } from '@/api/deviceReports';
import dayjs from 'dayjs';
import { percentageData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';

export default function DeepSleepPercentageDistribution({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Deep Sleep Percentage Distribution'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [deepSleepPercentageDistribution, setDeepSleepPercentageDistribution] = useState([]);

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
        setDeepSleepPercentageDistribution(res.data);
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
      isSummaryBtn={false}
    >
      <BarChart
        data={deepSleepPercentageDistribution}
        color={color}
        dataType='percentage'
        fromDate={''}
        toDate={''}
        chartFor='deepSleepPercentageDistribution'
        xUnit='percentage'
      />
    </Template>
  );
}
