import { useState, useEffect, useContext, useCallback } from 'react';
import { numberData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import { getNumberOfBedExist } from '@/api/deviceReports';

export default function NumberOfBedExitStatistic({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Number of Bed Exit');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [numberOfBedExitStatistic, setNumberOfBedExitStatistic] = useState([]);

  const getNumberOfBedExitData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getNumberOfBedExist({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,
      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setNumberOfBedExitStatistic(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate, fromDate, elderlyDetails]);

  useEffect(() => {
    getNumberOfBedExitData();
  }, [getNumberOfBedExitData]);

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
      isSummaryBtn={isSummaryBtn}
      summaryProps={summaryProps}
    >
      <BarChart
        data={numberOfBedExitStatistic}
        color={color}
        dataType='number'
        fromDate={fromDate}
        toDate={toDate}
        chartFor='numberOfBedExitTime'
      />
    </Template>
  );
}
