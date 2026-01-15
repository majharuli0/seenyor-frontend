import { useState, useEffect, useCallback, useContext } from 'react';
import { getApneaIndexStatistic } from '@/api/deviceReports';
import dayjs from 'dayjs';
import { CustomContext } from '@/Context/UseCustomContext';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';

export default function ApneaIndexDistribution() {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Apnea Index Distribution'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [apneaIndexStatisticData, setApneaIndexStatisticData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getApneaIndexStatisticData = useCallback(() => {
    if (!elderlyDetails?.deviceId || !elderlyDetails._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getApneaIndexStatistic({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setApneaIndexStatisticData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getApneaIndexStatisticData();
  }, [getApneaIndexStatisticData]);

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
      isSummaryBtn={false}
    >
      {loading ? (
        <SkeletonBarChart
          height={350}
          chartHeight={280}
          barGroups={25}
          barsPerGroup={2}
          gridLines={5}
          barWidth={40}
        />
      ) : (
        <BarChart
          data={apneaIndexStatisticData}
          color={color}
          dataType='percentage'
          fromDate={''}
          toDate={''}
          dataUnit=' '
          xUnit='number'
          chartFor='apneaIndexDistribution'
        />
      )}
    </Template>
  );
}
