import { useState, useEffect, useContext, useCallback } from 'react';
import { getSleepEfficiencyDistribution } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';
import { percentageData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';
import { CustomContext } from '@/Context/UseCustomContext';
export default function EfficiencyDistribution({ isSummaryBtn = true }) {
  const { title, color, icon, dataAnalysis, summaryProps, description } =
    getTemplateData('Efficiency Distribution');
  const context = useContext(CustomContext);
  const { chartToDate = '', chartFromDate = '', elderlyDetails } = context || {};
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const elderlyDetais = ls.get('elderly_details');
  const [sleepEfficiencyDistributionData, setSleepEfficiencyDistributionData] = useState([]);
  const getSleepEfficiencyDistributionData = useCallback(() => {
    if (!elderlyDetails?.bedRoomIds || !elderlyDetails?._id || !fromDate || !toDate) {
      return;
    }
    getSleepEfficiencyDistribution({
      uids: elderlyDetails?.bedRoomIds,
      elderly_id: elderlyDetails._id,

      to_date: fromDate,
      from_date: toDate,
    })
      .then((res) => {
        setSleepEfficiencyDistributionData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate, fromDate, elderlyDetails]);
  useEffect(() => {
    getSleepEfficiencyDistributionData();
  }, [getSleepEfficiencyDistributionData]);
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
      isSummaryBtn={false}
    >
      <BarChart
        data={sleepEfficiencyDistributionData}
        color={color}
        dataType='percentage'
        fromDate={''}
        toDate={''}
        xUnit='percentage'
        chartFor='efficiencyDistribution'
      />
    </Template>
  );
}
