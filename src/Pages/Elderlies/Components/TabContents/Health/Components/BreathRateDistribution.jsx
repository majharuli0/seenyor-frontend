import { useState, useEffect, useContext, useCallback } from 'react';
import { getBreathRate } from '@/api/deviceReports';
import dayjs from 'dayjs';
import Template from '@/Components/GraphAndChartTemp/Template';
import BarChart from '@/Components/GraphAndChart/barChart';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';

export default function BreathRateDistribution({ isSummaryBtn = true }) {
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Breath Rate Distribution'
  );
  const [breathRateDistributionData, setBreathRateDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBreathRateDistributionData = useCallback(() => {
    if (!elderlyDetails?.deviceId || !elderlyDetails._id || !fromDate || !toDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getBreathRate({
      uids: elderlyDetails?.deviceId,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setBreathRateDistributionData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getBreathRateDistributionData();
  }, [getBreathRateDistributionData]);

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
          color={color}
          dataType='percentage'
          data={breathRateDistributionData}
          toDate={''}
          xUnit='number'
          fromDate={''}
          chartFor='breathRateDistribution'
        />
      )}
    </Template>
  );
}
