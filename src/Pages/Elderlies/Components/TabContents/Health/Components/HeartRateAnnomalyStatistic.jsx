import { useState, useEffect, useContext, useCallback } from 'react';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import BarChart from '@/Components/GraphAndChart/barChart';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import { getSleepEvents } from '@/api/deviceReports';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';

export default function HeartRateAnomalyStatistic({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Heart Rate Anomaly Statistic'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [heartRate, setHeartRate] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeartRateAnomaly = useCallback(() => {
    if (!elderlyDetails?.deviceId || !elderlyDetails._id || !fromDate || !toDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getSleepEvents({
      uids: elderlyDetails?.deviceId,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        const filtered = filteredData(res?.data);
        setHeartRate(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getHeartRateAnomaly();
  }, [getHeartRateAnomaly]);

  useEffect(() => {
    if (chartToDate && chartFromDate) {
      setToDate(chartToDate);
      setFromDate(chartFromDate);
    }
  }, [chartToDate, chartFromDate]);

  function filteredData(data) {
    const result = [];
    data?.forEach((item) => {
      const eventDate = item.date;
      item?.events?.forEach((ev) => {
        if (ev.event_type === 14 || ev.event_type === 15) {
          const existingEntry = result.find((entry) => entry.date === eventDate);
          if (existingEntry) {
            existingEntry.anomalyHeartRate += 1;
          } else {
            result.push({ date: eventDate, anomalyHeartRate: 1 });
          }
        }
      });
    });
    return result;
  }

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
        <SkeletonBarChart barGroups={25} barsPerGroup={2} gridLines={5} barWidth={40} />
      ) : (
        <BarChart
          data={heartRate}
          color={color}
          dataType='number'
          fromDate={fromDate}
          toDate={toDate}
          chartFor='heartRateAnomaly'
        />
      )}
    </Template>
  );
}
