import { useState, useEffect, useContext, useCallback } from 'react';
import { getSleepSummary } from '@/api/deviceReports';
import dayjs from 'dayjs';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import ScatterChart from '@/Components/GraphAndChart/scatterChart';
import { CustomContext } from '@/Context/UseCustomContext';
import SkeletonScatterChart from '@/Components/Skeleton/SkeletonScatterChart';
import { transformDataForBedExit } from '@/utils/helper';

export default function DistributionOfBedExitTimes({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Distribution of Bed Exit Times'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [bedExitTimesData, setBedExitTimesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBedExitTimesData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails._id || !fromDate || !toDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getSleepSummary({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        // Use the existing helper function to transform data
        const transformedData = transformDataForBedExit(res.data);
        console.log('Bed Exit Times Data:', transformedData);
        setBedExitTimesData(transformedData);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Bed Exit Times Error:', err);
        setLoading(false);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getBedExitTimesData();
  }, [getBedExitTimesData]);

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
        <SkeletonScatterChart
          height={350}
          chartHeight={280}
          scatterPoints={8}
          gridLines={5}
          yAxisLabels={5}
          legendItems={1}
          showTitle={false}
          titleWidth='40%'
          pointSize={10}
        />
      ) : (
        <ScatterChart
          data={bedExitTimesData}
          color={color}
          chartFor='bedExitTimes'
          colorMapping={{
            inbed: '#4C956C',
            outofbed: '#FFC107',
            wakeup: '#5AB1EF',
            getup: '#FFB980',
            fallasleep: '#B6A2DE',
          }}
        />
      )}
    </Template>
  );
}
