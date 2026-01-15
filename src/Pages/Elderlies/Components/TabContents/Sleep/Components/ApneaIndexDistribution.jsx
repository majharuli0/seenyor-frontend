import { useState, useEffect, useContext, useCallback } from 'react';
import { getApneaIndexStatistic } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import { numberData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';

export default function ApneaIndexDistribution({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Apnea Index Distribution'
  );
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));

  const [apneaIndexStatisticData, setApneaIndexStatisticData] = useState([]);
  const getApneaIndexStatisticData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getApneaIndexStatistic({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setApneaIndexStatisticData(res.data);
      })
      .catch((err) => {
        console.log(err);
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
  }, [chartToDate]);

  return (
    <Template
      title={title}
      color={color}
      icon={icon}
      dataAnalysis={dataAnalysis}
      description={description}
      isSummaryBtn={false}
    >
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
    </Template>
  );
}
