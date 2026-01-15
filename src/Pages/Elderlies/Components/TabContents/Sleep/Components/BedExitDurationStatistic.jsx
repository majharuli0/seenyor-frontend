import { useState, useEffect, useContext, useCallback } from 'react';
import { getBedExitDurationStatistic } from '@/api/deviceReports';
import { durationData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';

export default function BedExitDurationStatistic({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Bed Exit Duration');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [bedExitDurationStatistic, setBedExitDurationStatistic] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBedExitDurationStatisticData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getBedExitDurationStatistic({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
      status: 3,
    })
      .then((res) => {
        setBedExitDurationStatistic(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getBedExitDurationStatisticData();
  }, [getBedExitDurationStatisticData]);

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
        <SkeletonBarChart barGroups={25} barsPerGroup={1} gridLines={5} barWidth={40} />
      ) : (
        <BarChart
          data={bedExitDurationStatistic}
          color={color}
          dataType='duration'
          chartFor='bedExitDuration'
          fromDate={fromDate}
          toDate={toDate}
        />
      )}
    </Template>
  );
}
