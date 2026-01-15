import React, { useState, useContext, useEffect } from 'react';
import CustomButton from '@/Shared/button/CustomButton';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import CustomToast from '@/Shared/Tosat/CustomToast';
import HealthConditionModal from '@/Components/HealthConditionModal/HealthConditionModal';

import { CustomContext } from '@/Context/UseCustomContext';
export default function HealthCondition() {
  const { elderlyDetails, getElderlyDetails } = useContext(CustomContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const categorizeData = (data) => {
    const categorizedData = {};
    data?.forEach((item) => {
      const { category } = item;
      if (!categorizedData[category]) {
        categorizedData[category] = [];
      }
      categorizedData[category].push(item);
    });
    return categorizedData;
  };
  useEffect(() => {
    setComments(categorizeData(elderlyDetails.comments));
  }, [elderlyDetails]);
  const healthConditionMapping = {
    Allergy: 'Environmental Sensitivities',
    Disability: 'Movement Adaptations',
  };
  return (
    <>
      <div className='flex flex-col gap-4 bg-white rounded-2xl p-4'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl font-bold'>Wellness Concerns</h1>

          <CustomButton onClick={() => setIsModalOpen(true)}>Update Wellness Concerns</CustomButton>
        </div>

        <div id='elderlyDiseasesAllergiesMedications' className='mt-3 flex flex-col gap-6'>
          <div id='elderlyDiseases' className='flex flex-col gap-2'>
            <p className='text-base font-semibold text-[#7E60BF] leading-none flex items-center gap-2'>
              <div id='dot' className='w-2 h-2 bg-[#7E60BF] rounded-full'></div> Sensitivity
              Indicators
            </p>
            <ul className='list-none list-inside flex flex-wrap gap-2'>
              {elderlyDetails?.diseases?.map((disease, index) => (
                <li key={index} className='text-base font-medium p-1 px-3 bg-[#F5F3FF] rounded-lg'>
                  {disease}
                </li>
              ))}
            </ul>
          </div>
          {Object.keys(comments).map((category, index) => (
            <div key={index} id='elderlyDiseases' className='flex flex-col gap-2'>
              <p
                className={`text-base font-semibold ${
                  category === 'Allergy'
                    ? 'text-[#4ca6cf]'
                    : category === 'Disability'
                      ? 'text-[#f37f13]'
                      : 'text-[#0a0a2b]'
                }  leading-none flex items-center gap-2 mb-2`}
              >
                <div
                  id='dot'
                  className={`w-2 h-2 ${
                    category === 'Allergy'
                      ? 'bg-[#4ca6cf]'
                      : category === 'Disability'
                        ? 'bg-[#f37f13]'
                        : 'bg-[#0a0a2b]'
                  }  rounded-full`}
                ></div>{' '}
                {healthConditionMapping[category] ?? category}
              </p>
              <ul className='list-none list-inside flex flex-wrap gap-2'>
                {Array.isArray(comments[category]) ? (
                  comments[category].map((comment, index) => (
                    <li
                      key={index}
                      className={`text-base font-medium p-1 px-3 ${
                        category === 'Allergy'
                          ? 'bg-[#4ca6cf]/10'
                          : category === 'Disability'
                            ? 'bg-[#f37f13]/10'
                            : 'bg-[#0a0a2b]/10'
                      } rounded-lg`}
                    >
                      {comment.comment}
                    </li>
                  ))
                ) : (
                  <p>No Comments</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <HealthConditionModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        mode='edit'
        diseases={elderlyDetails?.diseases}
        custom_condition={elderlyDetails?.comments}
        elderly_id={elderlyDetails?._id}
      />
    </>
  );
}
const ElderlyDetailsData = {
  name: 'John Deo',
  address: '123 Main St, Anytown, USA',
  contactPerson: '+9952654987',
  cordinates: [45, -73],
  age: 65,
  height: '170',
  gender: 'Male',
  diseases: ['Diabetes', 'Hypertension'],
  allergies: ['Peanuts'],
  medications: ['Aspirin', 'Insulin'],
  custom_condition: ['Asthma', 'Migraine'],
};
