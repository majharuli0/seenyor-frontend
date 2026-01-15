import React, { useContext } from 'react';
import Event from './Components/Event';
import HealthCondition from './Components/HealthCondition';
import Medication from './Components/Medication';

export default function HealthDataTab() {
  return (
    <>
      <div className='flex flex-col gap-4 mt-6'>
        {/* <Medication /> */}
        <HealthCondition />
        {/* <Event /> */}
      </div>
    </>
  );
}
