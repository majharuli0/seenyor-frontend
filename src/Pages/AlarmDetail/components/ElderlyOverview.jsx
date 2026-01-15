import { Button, Empty, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { CopyOutlined, PhoneOutlined } from '@ant-design/icons';
import { IoMdCall } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import { IoFemale, IoMale } from 'react-icons/io5';
export default function ElderlyOverview({ elderlyDetails }) {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const getInitials = (name = '') => {
    const splitName = name?.split(' ');
    return `${splitName[0]?.[0]?.toUpperCase() || ''}${splitName[1]?.[0]?.toUpperCase() || ''}`;
  };

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

  const healthConditionMapping = {
    Allergy: 'Environmental Sensitivities',
    Disability: 'Movement Adaptations',
  };

  useEffect(() => {
    setComments(categorizeData(elderlyDetails?.comments));
  }, [elderlyDetails]);

  // Function to copy contact number to clipboard
  const handleCopyNumber = (number) => {
    navigator.clipboard
      .writeText(number)
      .then(() => {
        message.success('Contact number copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy number');
      });
  };

  // Function to initiate a call
  const handleCall = (number) => {
    window.location.href = `tel:${encodeURIComponent(number)}`;
  };

  return (
    <div className='max-w-[450px] w-full rounded-2xl '>
      <div>
        <div
          id='profileHeader'
          className='z-50 flex flex-col p-6 items-center  justify-center gap-4 rounded-2xl w-full bg-white relative'
        >
          <div className='flex items-start gap-4 w-full'>
            <span className='relative flex h-[80px] w-[80px]'>
              <span
                className={`relative rounded-full h-[80px] w-[80px] flex items-center justify-center overflow-hidden border-0 bg-[#80CAA7] font-semibold text-3xl text-white`}
              >
                {getInitials(elderlyDetails?.name)}
              </span>
              <div id='age' className='absolute -bottom-1 -right-1'>
                <p
                  className='text-sm text-text-white/70 px-1.5 py-1.5 rounded-full font-semibold leading-none border-2 border-white/20 border-inner'
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E0E0E0',
                  }}
                >
                  {elderlyDetails?.age}
                </p>
              </div>
            </span>
            <div id='elderlyNameAndAddress' className='pt-4'>
              <h1 className='text-[24px] font-bold'>{elderlyDetails?.name}</h1>
              <div
                id='addresandGoogleMapButton'
                className='flex items-center gap-2 md:flex-row flex-col'
              >
                <Tooltip title={'View on Google Map'}>
                  <a
                    href={`https://www.google.com/maps?q=${elderlyDetails.latitude},${elderlyDetails.longitude}`}
                    target='_blank'
                    className='cursor-pointer font-normal hover:text-text-primary transition-all duration-300 text-[17px] text-text-primary/80 flex items-center gap-1'
                  >
                    {elderlyDetails?.address || 'Address'}
                  </a>
                </Tooltip>
              </div>
            </div>
          </div>
          <Button
            className=''
            onClick={() => {
              navigate(`/supporter/elderlies/elderly-profile/${elderlyDetails?._id}?tab=overview`);
            }}
          >
            View Profile
          </Button>
        </div>
      </div>

      <div id='Call' className='mb-7 mt-5 w-full'>
        <h2 className='text-xl font-bold text-gray-800 flex items-center justify-start gap-2 w-full mb-3'>
          <IoMdCall size={'30px'} /> <span className='!w-fit text-nowrap'>Contact List</span>{' '}
          <div className='w-full h-[1px] bg-slate-200'></div>
        </h2>
        <div className='space-y-2 w-full flex flex-col gap-2'>
          {elderlyDetails?.emergency_contacts?.length == 0 && <Empty />}

          {/* <div
            onClick={() =>
              handleCopyNumber(
                `${elderlyDetails?.contact_code}${elderlyDetails.contact_number}`
              )
            }
            className="border border-gray-200 rounded-lg p-4 py-2 cursor-pointer flex items-center justify-between group hover:shadow-md transition-shadow duration-200 animate-fadeIn"
          >
            <div className=" flex justify-between w-full">
              <div className="flex flex-col">
                <p className="font-semibold text-lg text-gray-900">
                  User Contact Number
                </p>
                <p
                  className="text-gray-700 text-[18px] font-medium py-1 rounded-full cursor-pointer  transition-colors duration-200"
                  onClick={() =>
                    handleCopyNumber(
                      `${elderlyDetails.contact_code}${elderlyDetails.contact_number}`
                    )
                  }
                  title="Click to copy"
                >
                  {elderlyDetails.contact_code}
                  {elderlyDetails.contact_number}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip title="Copy number">
                  <CopyOutlined
                    className="text-gray-500 hover:text-gray-900 cursor-pointer text-[20px]"
                    onClick={() =>
                      handleCopyNumber(
                        `${elderlyDetails?.contact_code}${contact.contact_number}`
                      )
                    }
                  />
                </Tooltip>
              
              </div>
            </div>
          </div> */}
          {elderlyDetails?.emergency_contacts?.map((contact, index) => (
            <div
              key={index}
              onClick={() =>
                handleCopyNumber(`${contact.contact_number_code}${contact.contact_number}`)
              }
              className='bg-white rounded-xl  flex flex-col gap-1 cursor-pointer transition-shadow hover:shadow-md animate-fadeIn !w-full'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className='flex items-center gap-4 w-full p-4'>
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
                  <p className='font-semibold text-gray-900 text-[18px] !leading-none'>
                    {contact.contact_person}
                  </p>
                  <p className='text-gray-600 text-base m-0 !leading-none'>
                    {contact.relationship || 'Relation'}
                  </p>
                </div>
              </div>
              <p className='text-base text-gray-600 mt-0 pl-4'>
                Distance Between:{' '}
                <span className='font-semibold'>{contact.coverage_area || '---'}km</span>
              </p>
              <div className='mt-3 px-4 py-3 border-t-2 border-t-[#F1F5F9] rounded-md text-start text-[20px] font-medium text-gray-800 flex items-center justify-between'>
                <span>{`${contact.contact_number_code}  ${contact.contact_number}`}</span>

                <BiCopy />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        id='elderlyDiseasesAllergiesMedications'
        className='mt-0 flex flex-col gap-6 bg-white p-6 rounded-lg'
      >
        {elderlyDetails && elderlyDetails?.diseases?.length === 0 && comments?.length === 0 && (
          <p>
            <Empty />
          </p>
        )}
        {elderlyDetails?.diseases?.length !== 0 && (
          <div id='elderlyDiseases' className='flex flex-col gap-2'>
            <p className='text-base font-semibold text-[#7E60BF] leading-none flex items-center gap-2'>
              <div id='dot' className='w-2 h-2 bg-[#7E60BF] rounded-full'></div>
              Sensitivity Indicators
            </p>
            <ul className='list-none list-inside flex flex-wrap gap-2'>
              {elderlyDetails?.diseases?.map((disease, index) => (
                <li key={index} className='text-base font-medium p-1 px-3 bg-[#F5F3FF] rounded-lg'>
                  {disease}
                </li>
              ))}
            </ul>
          </div>
        )}
        {Object.keys(comments).map((category, index) => (
          <div key={index} id='elderlyDiseases' className='flex flex-col gap-2'>
            <p
              className={`text-base font-semibold ${
                category === 'Allergy'
                  ? 'text-[#4ca6cf]'
                  : category === 'Disability'
                    ? 'text-[#f37f13]'
                    : 'text-[#0a0a2b]'
              } leading-none flex items-center gap-2 mb-2`}
            >
              <div
                id='dot'
                className={`w-2 h-2 ${
                  category === 'Allergy'
                    ? 'bg-[#4ca6cf]'
                    : category === 'Disability'
                      ? 'bg-[#f37f13]'
                      : 'bg-[#0a0a2b]'
                } rounded-full`}
              ></div>
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
  );
}
