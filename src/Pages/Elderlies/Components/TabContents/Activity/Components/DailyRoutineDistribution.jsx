import { useState, useEffect, useContext, useCallback } from 'react';
import { getDailyRoutine } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import Template from '@/Components/GraphAndChartTemp/Template';
import { lazy, Suspense } from 'react';
const ScatterChart = lazy(() => import('@/Components/GraphAndChart/scatterChart'));
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { transformDataDailyRoutine } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import SkeletonScatterChart from '@/Components/Skeleton/SkeletonScatterChart'; // Import the new component

export default function DailyRoutineDistribution() {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Distribution of Daily Routine'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [dailyRoutineData, setDailyRoutineData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDailyRoutineData = useCallback(() => {
    if (!elderlyDetails?.deviceId || !elderlyDetails._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getDailyRoutine({
      uids: elderlyDetails?.deviceId,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setDailyRoutineData(transformDataDailyRoutine(res.data));
        console.log(res.data);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getDailyRoutineData();
  }, [getDailyRoutineData]);

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
        <SkeletonScatterChart
          height={350}
          chartHeight={280}
          scatterPoints={8}
          gridLines={5}
          yAxisLabels={5}
          legendItems={0}
          showTitle={false}
          titleWidth='40%'
          pointSize={10}
        />
      ) : (
        <Suspense
          fallback={
            <SkeletonScatterChart
              height={350}
              chartHeight={280}
              scatterPoints={8}
              gridLines={5}
              yAxisLabels={5}
              legendItems={4}
              showTitle={true}
              titleWidth='40%'
              pointSize={10}
            />
          }
        >
          <ScatterChart
            data={dailyRoutineData}
            colors={{
              gotobed: '#2EC7C9',
              wakeup: '#5AB1EF',
              getup: '#FFB980',
              fallasleep: '#B6A2DE',
            }}
          />
        </Suspense>
      )}
    </Template>
  );
}
