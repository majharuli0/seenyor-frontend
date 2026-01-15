import { useState, useEffect, useContext, useCallback } from 'react';
import { getDailyRoutine } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import ScatterChart from '@/Components/GraphAndChart/scatterChart';
import { transformDataDailyRoutine } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';

export default function DistributionOfDailyRoutine({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Distribution of Daily Routine'
  );

  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));

  useEffect(() => {
    if (chartToDate && chartFromDate) {
      setToDate(chartToDate);
      setFromDate(chartFromDate);
    }
  }, [chartToDate]);

  const [dailyRoutineData, setDailyRoutineData] = useState([]);
  const getDailyRoutineData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getDailyRoutine({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setDailyRoutineData(transformDataDailyRoutine(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getDailyRoutineData();
  }, [getDailyRoutineData]);

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
      <ScatterChart
        data={dailyRoutineData}
        color={color}
        chartFor='dailyRoutine'
        colorMapping={{
          inbed: '#4C956C',
          outofbed: '#FFC107',
          wakeup: '#5AB1EF',
          getup: '#FFB980',
          fallasleep: '#B6A2DE',
        }}
      />
    </Template>
  );
}
