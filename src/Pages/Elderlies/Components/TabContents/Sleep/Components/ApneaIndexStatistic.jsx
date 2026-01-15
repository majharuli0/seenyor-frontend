import { useState, useEffect, useContext, useCallback } from 'react';
import { getApneaIndexStatistic } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import { numberData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';

export default function ApneaIndexStatistic({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Apnea Index');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [apneaIndexStatistic, setApneaIndexStatistic] = useState([]);

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
        setApneaIndexStatistic(res.data);
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
  }, [chartFromDate, chartToDate]);

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
      <BarChart
        data={apneaIndexStatistic}
        color={color}
        dataType='number'
        fromDate={fromDate}
        toDate={toDate}
      />
    </Template>
  );
}
