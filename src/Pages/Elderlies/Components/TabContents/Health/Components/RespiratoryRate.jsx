import { useState, useEffect, useContext, useCallback } from 'react';
import RateChart from '@/Components/GraphAndChart/RateChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import { getBreathRate } from '@/api/deviceReports';
import SkeletonRateChart from '@/Components/Skeleton/SkeletonRateChart';

export default function RespiratoryRate({ isSummaryBtn = true, dataType = 'Week' }) {
  const context = useContext(CustomContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chartToDate = '', chartFromDate = '', elderlyDetails = {} } = context || {};
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Respiratory Rate');
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'days').format('YYYY-MM-DD'));

  const getBreathRateData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails._id || !fromDate || !toDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getBreathRate({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        const data = res.data;
        console.log('Breath Rate Data:', data);
        const transformedData = {
          xdata: data?.map((item) => item.date),
          maxArray: data?.map((item) => item.max),
          minArray: data?.map((item) => item.min),
          allAvgNumber: Math.round(data?.reduce((sum, item) => sum + item.avg, 0) / data.length),
        };
        console.log('Transformed Breath Rate Data:', transformedData);
        setChartData(transformedData);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Breath Rate Error:', err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getBreathRateData();
  }, [getBreathRateData]);

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
      isSummaryBtn={isSummaryBtn}
      summaryProps={summaryProps}
    >
      {loading ? (
        <SkeletonRateChart barCount={7} barWidth={40} gridLines={5} />
      ) : (
        <RateChart
          dateType={dataType}
          color={color}
          cheartInfo={chartData}
          fromDate={fromDate}
          toDate={toDate}
        />
      )}
    </Template>
  );
}
