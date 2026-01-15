import React from 'react';
import { numberData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';

export default function BodyMovementIndexStatistic() {
  const { title, color, icon, dataAnalysis, description } = getTemplateData(
    'Body Movement Index Statistic'
  );
  return (
    <Template
      title={title}
      color={color}
      icon={icon}
      dataAnalysis={dataAnalysis}
      description={description}
    >
      <BarChart data={[]} color={color} dataType='number' />
    </Template>
  );
}
