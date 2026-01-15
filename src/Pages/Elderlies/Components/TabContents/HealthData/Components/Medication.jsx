import React, { useCallback, useState, useContext, useEffect } from 'react';
import CustomButton from '@/Shared/button/CustomButton';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import { Popover } from 'antd';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import DeleteModal from '@/Shared/delete/DeleteModal';
import { CgPill } from 'react-icons/cg';
import { GiMedicinePills } from 'react-icons/gi';
import { BiSolidInjection } from 'react-icons/bi';
import { GiMedicines } from 'react-icons/gi';
import { CustomContext } from '@/Context/UseCustomContext';

import { deleteMedication } from '@/api/elderly';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import { addMedication } from '@/api/elderly';

export default function Medication() {
  const { elderlyDetails, getElderlyDetails } = useContext(CustomContext);
  const [medication, setMedication] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddMedication = (newMedication) => {
    addMedication(newMedication)
      .then((res) => {
        getElderlyDetails();
        toast.custom((t) => <CustomToast t={t} text={'Medication has been added successfully!'} />);
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  };
  const handleSetMedication = useCallback(() => {
    setMedication(elderlyDetails?.medications);
  }, [elderlyDetails, getElderlyDetails]);
  useEffect(() => {
    handleSetMedication();
  }, [handleSetMedication]);
  return (
    <>
      <div className='flex flex-col gap-4 bg-white rounded-2xl p-4 w-full'>
        <div id='header' className='flex justify-between items-center w-full'>
          <h1 className='text-2xl font-bold'>Medication</h1>
          <CustomButton onClick={() => setIsModalOpen(true)}>Add Medication</CustomButton>
        </div>
        <div id='medications' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {medication?.map((medication, index) => (
            <MedicationCard medication={medication} key={index} />
          ))}
        </div>
      </div>
      <CreateAndEditModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        type='medication'
        elderlyId={elderlyDetails._id}
        onSubmitData={handleAddMedication}
      />
    </>
  );
}

export const MedicationCard = ({ medication = {} }) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { elderlyDetails, getElderlyDetails } = useContext(CustomContext);
  function handleMedicationDelete(id) {
    deleteMedication({ id: elderlyDetails._id, medicationId: id })
      .then(() => {
        getElderlyDetails();
        toast.custom((t) => <CustomToast t={t} text={'Medication has been deleted!'} />);
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  }
  return (
    <>
      <div
        id='medicationCard'
        className={`flex flex-col gap-6  p-4 rounded-lg  w-full`}
        style={{
          backgroundColor:
            medication?.type === 'Pill'
              ? '#DCF3F2'
              : medication?.type === 'Injection'
                ? '#FCE8EE'
                : medication?.type === 'Supplement'
                  ? '#F5F3FA'
                  : '#F6F5F8',
        }}
      >
        <div id='header' className='flex flex-col gap-2'>
          <div id='type' className='flex items-center gap-2 w-full justify-between'>
            <div
              id='icon'
              className=' size-[40px] rounded-full bg-white flex items-center justify-center'
            >
              {medication?.type === 'Pill' ? (
                <CgPill size={20} color='#74CBC6' />
              ) : medication?.type === 'Injection' ? (
                <BiSolidInjection size={20} color='#FF0D0D' />
              ) : medication?.type === 'Supplement' ? (
                <GiMedicinePills size={20} color='#947FCA' />
              ) : (
                <GiMedicines size={20} color='#0B1132' />
              )}
            </div>
            <Popover
              content={
                <div className='flex flex-col gap-2 '>
                  <p
                    className={`text-base text-primary/80 leading-none p-2 rounded-md hover:bg-primary/5 cursor-pointer`}
                    onClick={() => {
                      setIsRemoveModalOpen(true);
                      setIsPopoverOpen(false);
                    }}
                  >
                    Remove
                  </p>
                </div>
              }
              open={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              placement='leftTop'
              trigger='click'
            >
              <div className='cursor-pointer p-2 rounded-full hover:bg-primary/5'>
                <HiOutlineDotsVertical
                  size={20}
                  onClick={() => setIsPopoverOpen(true)}
                  className='text-primary'
                />
              </div>
            </Popover>
          </div>
          <div id='name'>
            <h1 className='text-xl font-bold text-primary'>{medication?.name}</h1>
            <p className='text-[15px] text-primary/80 leading-none'>{medication?.type}</p>
          </div>
        </div>
        <div id='medicationTimes' className='flex flex-col gap-2'>
          <div id='times' className='flex flex-col gap-0 items-start'>
            <p className='text-sm text-primary/80 leading-none font-semibold py-2'>Times:</p>
            <div id='time' className='flex gap-1 flex-wrap'>
              {medication?.does_chart &&
                medication.does_chart.map((time, index) => (
                  <p
                    key={index}
                    className='text-sm text-primary/80 leading-none bg-white rounded-full p-2 font-semibold'
                  >
                    {time.time} - {time.tablet_count}x
                  </p>
                ))}
              {/* <p className="text-sm text-primary/80 leading-none bg-white rounded-full p-2">
                09:00 AM
              </p>
              <p className="text-sm text-primary/80 leading-none bg-white rounded-full p-2">
                10:00 AM
              </p> */}
            </div>
          </div>
          <div id='frequency' className='flex flex-col gap-0 items-start '>
            <p className='text-sm text-primary/80 leading-none font-semibold py-2'>Frequency:</p>
            <div id='time' className='flex gap-1 flex-wrap'>
              <p className='text-sm text-primary/80 leading-none bg-white rounded-full p-2 font-semibold '>
                {medication?.frequency}
              </p>
            </div>
          </div>
          <div id='days' className='flex flex-col gap-0  items-start '>
            <p className='text-sm text-primary/80 leading-none font-semibold py-2'>Interval:</p>
            <div id='time' className='flex gap-1 flex-wrap'>
              {medication?.interval &&
                medication.interval.map((item, index) => (
                  <p
                    key={index}
                    className='text-sm text-primary/80 leading-none bg-white rounded-full p-2 font-semibold'
                  >
                    {item}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        modalOPen={isRemoveModalOpen}
        setModalOpen={setIsRemoveModalOpen}
        title='You want to remove this medication?'
        okText='Remove'
        onDelete={() => {
          handleMedicationDelete(medication._id);
        }}
      />
    </>
  );
};
