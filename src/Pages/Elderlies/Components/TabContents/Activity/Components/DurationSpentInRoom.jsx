import { useState, useEffect, useContext, useCallback } from 'react';
import { getWalkStepsStatistics } from '@/api/deviceReports';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import MultibarChart from '@/Components/GraphAndChart/multibarChart';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import SkeletonBarChart from '@/Components/Skeleton/SkeletonBarChart';

export default function DurationSpentInRoom() {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Duration Spent In Room');

  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [durationInRoom, setDurationInRoom] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setDurationInRoom(filterData(res?.data));
        console.log(filterData(res?.data));

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [elderlyDetails?.deviceId, elderlyDetails._id, fromDate, toDate, filterData]);

  useEffect(() => {
    getWalkSpeedStatisticsData();
  }, [getWalkSpeedStatisticsData]);

  useEffect(() => {
    if (chartToDate && chartFromDate) {
      setToDate(chartToDate);
      setFromDate(chartFromDate);
    }
  }, [chartToDate, chartFromDate]);

  function filterData(data) {
    const result = [];
    data?.forEach((item) => {
      const date = dayjs(item.datestr).subtract(1, 'day').format('YYYY-MM-DD');
      const entry = {
        date: date,
        data: [],
      };
      if (item.user_activity.static_duration !== undefined) {
        entry.data.push({
          name: 'still_time',
          value: convertDurationToMinutes(item.user_activity.static_duration),
          status: '30',
        });
      }

      if (item.user_activity.walk_duration !== undefined) {
        entry.data.push({
          name: 'walking_duration',
          value: convertDurationToMinutes(item.user_activity.walk_duration),
          status: '31',
        });
      }

      if (item.user_activity.other_duration !== undefined) {
        entry.data.push({
          name: 'other_duration',
          value: convertDurationToMinutes(item.user_activity.other_duration),
          status: '32',
        });
      }

      result.push(entry);
    });

    return result;
  }

  function convertDurationToMinutes(duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

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
        <SkeletonBarChart barGroups={25} barsPerGroup={8} gridLines={5} barWidth={40} />
      ) : (
        <MultibarChart data={durationInRoom} fromDate={fromDate} toDate={toDate} />
      )}
    </Template>
  );
}
