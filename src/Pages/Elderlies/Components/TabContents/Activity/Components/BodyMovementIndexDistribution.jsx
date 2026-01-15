import React from 'react';

import { numberData } from './mockData';
import BarChart from '@/Components/GraphAndChart/barChart';
import Template from '@/Components/GraphAndChartTemp/Template';
import { getTemplateData } from '@/Pages/Elderlies/Components/Utiles/utiles';

export default function BodyMovementIndexDistribution() {
  const { title, color, icon, dataAnalysis, summaryProps, description } = getTemplateData(
    'Body Movement Index Distribution'
  );
  return (
    <Template
      title={title}
      color={color}
      icon={icon}
      dataAnalysis={dataAnalysis}
      description={description}
      isSummaryBtn={false}
    >
      <BarChart data={[]} color={color} dataType='number' />
    </Template>
  );
}
