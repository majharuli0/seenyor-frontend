import { useState, useEffect, useContext, useCallback } from 'react';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import { getNumberOfRoomEntriesExitTimes } from '@/api/deviceReports';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';
import { getWalkStepsStatistics } from '../../../../../../api/deviceReports';

export default function NumberOfRoomEntriesAndExit() {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Number of Room Entries and Exits'
  );

  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [numberOfRoomEntriesExit, setNumberOfRoomEntriesExit] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getNumberOfRoomEntriesExit = useCallback(() => {
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
        setNumberOfRoomEntriesExit(res.data);
        console.log(res.data);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getNumberOfRoomEntriesExit();
  }, [getNumberOfRoomEntriesExit]);

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
        <SkeletonBarChart barGroups={25} barsPerGroup={2} gridLines={5} barWidth={40} />
      ) : (
        <BarChart
          data={numberOfRoomEntriesExit}
          color={color}
          dataType='number'
          fromDate={fromDate}
          toDate={toDate}
          chartFor='roomInOut'
          dataUnit=' times'
        />
      )}
    </Template>
  );
}
