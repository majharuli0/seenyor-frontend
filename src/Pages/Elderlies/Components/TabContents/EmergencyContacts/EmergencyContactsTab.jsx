import React, { useState, useContext } from 'react';
import { MdPerson } from 'react-icons/md';
import { MdPerson2 } from 'react-icons/md';
import { RiBuilding3Fill } from 'react-icons/ri';
import { MdCrisisAlert } from 'react-icons/md';
import { MdCall } from 'react-icons/md';
import { Button, Dropdown } from 'antd';
import CustomButton from '@/Shared/button/CustomButton';
import { MdOutlineAdd } from 'react-icons/md';
import DeleteModal from '@/Shared/delete/DeleteModal';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import { CustomContext } from '@/Context/UseCustomContext';
import { addEmergencyContactNumber, deleteEmergencyContactNumber } from '@/api/elderlySupport';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import { TbPhoneCalling } from 'react-icons/tb';
import { Empty } from 'antd';
import { BiCopy } from 'react-icons/bi';
import { IoFemale, IoMale } from 'react-icons/io5';
import { MoreHorizontal, MoreVertical } from 'lucide-react';
export default function EmergencyContactsTab() {
  const { elderlyDetails, getElderlyDetails } = useContext(CustomContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const addContactNumber = (data) => {
    addEmergencyContactNumber({ id: elderlyDetails?._id, data: data })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={'Contact Number Added Successfully!'} />);
        getElderlyDetails();
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  };
  return (
    <>
      <div className='flex flex-col gap-4 mt-6'>
        <div className='flex justify-between items-center '>
          <h1 className='text-2xl font-bold'>Trusted Contacts</h1>
          <CustomButton
            onClick={() => setIsModalOpen(true)}
            size='large'
            className='bg-white !text-primary px-4 py-2 rounded-lg hover:!bg-primary/5 flex items-center gap-2'
          >
            <MdOutlineAdd size={20} />
            Add New Contact
          </CustomButton>
        </div>
        {elderlyDetails?.emergency_contacts?.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
            {elderlyDetails?.emergency_contacts?.map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className='w-full flex items-center justify-center'>
            <Empty description='No contact number available to show' />
          </div>
        )}
      </div>
      <CreateAndEditModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        type='contact'
        onSubmitData={addContactNumber}
      />
    </>
  );
}
export const EmergencyContactCard = ({ contact }) => {
  const { elderlyDetails, getElderlyDetails } = useContext(CustomContext);
  const [closeModal, setCloseModal] = useState(false);
  const onDeleteContactNumber = (id) => {
    deleteEmergencyContactNumber({
      id: elderlyDetails?._id,
      emergencyContactId: id,
    })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={'Contact Number Deleted Successfully!'} />);
        getElderlyDetails();
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  };
  const getRandomColor = () => {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 156) + 50; // Keep colors lighter (50-205 range)
    const g = Math.floor(Math.random() * 156) + 50;
    const b = Math.floor(Math.random() * 156) + 50;

    // Return the color as a hex string
    return `rgb(${r}, ${g}, ${b})`;
  };
  return (
    <>
      <div className='flex  bg-white p-4 rounded-lg items-center gap-8 justify-between'>
        <div
          // key={index}
          className='flex flex-col gap-1 cursor-pointer transition-shadow animate-fadeIn !w-full'
        >
          <div className='flex items-center gap-4 w-full'>
            {contact?.gender?.toLowerCase() == 'male' ? (
              <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl'>
                <IoMale />
              </div>
            ) : (
              <div className='w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl'>
                <IoFemale />
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <p className='font-semibold text-gray-900 text-[20px] !leading-none'>
                {contact.contact_person}
              </p>
              <p className='text-gray-600 text-base m-0 !leading-none'>
                {contact.relationship || 'Relation'}
              </p>
            </div>
          </div>
          <p className='text-base text-gray-600 mt-1 pl-4'>
            Distance Between:{' '}
            <span className='font-semibold'>{contact.coverage_area || '---'}km</span>
          </p>
          <div className='mt-3 py-3 border-t-2 border-t-[#F1F5F9] rounded-md text-start text-[20px] font-medium text-gray-800 flex items-center justify-between'>
            <span>
              {`${contact.contact_number_code} 
               ${contact.contact_number}`}
            </span>

            <div id='callbtnManu'>
              <Dropdown
                menu={{
                  items: [{ label: 'Remove', key: '1' }],
                  onClick: () => setCloseModal(true),
                }}
                trigger={['click']}
                placement='bottomRight'
              >
                <Button shape='circle' icon={<MoreVertical size='18px' />} />
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        onDelete={() => onDeleteContactNumber(contact?._id)}
        modalOPen={closeModal}
        setModalOpen={setCloseModal}
        title={`Are you sure to remove this contact?`}
        title2={'This process cannot be undo.'}
        okText={'Remove Contact'}
      />
    </>
  );
};

const contactNumbers = [
  {
    id: 1,
    name: 'Kabir',
    contactType: 'person',
    gender: 'male',
    number: '+8801234890',
  },
  {
    id: 2,
    name: 'Hospital ABX',
    contactType: 'others',
    number: '91168',
  },
  {
    id: 3,
    name: 'Police',
    contactType: 'emergency',
    number: '911',
  },
];
