import { useState, useEffect, useContext, useCallback } from 'react';
import { getWalkSpeedStatistics } from '@/api/deviceReports';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';
import { getWalkStepsStatistics } from '../../../../../../api/deviceReports';

export default function WalkSpeedStatistic() {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Walk Speed Statistic');

  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [walkSpeedStatisticsData, setWalkSpeedStatisticsData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getWalkSpeedStatisticsData = useCallback(() => {
    if (!elderlyDetails?.deviceId || !elderlyDetails._id || !fromDate || !toDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getWalkStepsStatistics({
      uids: elderlyDetails?.deviceId,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setWalkSpeedStatisticsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getWalkSpeedStatisticsData();
  }, [getWalkSpeedStatisticsData]);

  useEffect(() => {
    if (chartToDate && chartFromDate) {
      setToDate(chartToDate);
      setFromDate(chartFromDate);
    }
  }, [chartToDate, chartFromDate]);

  return (
    <Template
      title={title}
      color={color}
      icon={icon}
      dataAnalysis={dataAnalysis}
      description={description}
      isSummaryBtn={true}
      summaryProps={summaryProps}
    >
      {loading ? (
        <SkeletonBarChart barGroups={25} barsPerGroup={1} gridLines={5} barWidth={40} />
      ) : (
        <BarChart
          data={walkSpeedStatisticsData}
          color={color}
          dataType='number'
          fromDate={fromDate}
          toDate={toDate}
          chartFor='walkingSpeedStatistic'
          dataUnit=' meter/min'
        />
      )}
    </Template>
  );
}
