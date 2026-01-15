import { getTokenToCall } from '@/api/deviceCall';
import { getDetails } from '@/api/elderly';
import { initiateCall } from '@/utils/makeDeviceCall';
import { Button, Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdCall } from 'react-icons/io';
import { LuPhoneCall } from 'react-icons/lu';
import { PiEyeBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import ls from 'store2';
const FallAlarmModal = ({ isOpen, onClose, data, onCallRoom, onSelectContact, index }) => {
  const navigate = useNavigate();
  const [elderlyDetails, setElderlyDetails] = useState();
  const [isContactLoading, setIsContactLoading] = useState(true);
  const isToken = ls.get('token');
  useEffect(() => {
    if (isToken) {
      setIsContactLoading(true);
      getDetails({ id: data?.elderly_id })
        .then((res) => {
          setElderlyDetails(res?.data);
          setIsContactLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsContactLoading(false);
        });
    }
  }, [data.elderly_id]);

  if (!isOpen) return null;

  const dropdownItems =
    elderlyDetails?.emergency_contacts
      ?.filter((contact) => contact.contact_number_code)
      .map((contact) => ({
        label: (
          <p>
            ({contact.contact_person}) {contact.contact_number_code}
            {contact.contact_number}
          </p>
        ),
        key: contact.contact_number_code + contact.contact_number,
      })) || [];

  function handleClick(id) {
    if (id) {
      initiateCall(id);
    }
  }

  // function getToken(id) {
  //   getTokenToCall()
  //     .then((token) => {
  //       const accessToken = token?.data?.token;
  //       makeACall(id, accessToken);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching token:", error);
  //     });
  // }

  // function makeACall(uid, accessToken) {
  //   openPopup(uid, accessToken);
  // }

  // function openPopup(uid, accessToken) {
  //   const data = {
  //     uid: uid,
  //     token: accessToken,
  //     lang: "en_US",
  //   };

  //   const popupUrl = `https://console.elderlycareplatform.com/metting?${new URLSearchParams(
  //     data
  //   ).toString()}`;

  //   const windowFeatures =
  //     "width=500,height=600,scrollbars=no,resizable=no,location=no,toolbar=no,status=no,menubar=no";

  //   const popup = window.open(popupUrl, "Device Calling", windowFeatures);

  //   if (popup) {
  //     popup.focus();
  //   } else {
  //     console.error("Popup window could not be opened");
  //   }
  // }
  function onViewUser(id) {
    navigate(`/supporter/elderlies/elderly-profile/${id}?tab=overview`);
  }
  function handleCopyNumber(key) {
    console.log(key);
    toast.success(`${key} Copied!`);
  }
  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]'
      style={{
        zIndex: 50 + index,
      }}
    >
      <div
        className='bg-white rounded-lg w-fill w-max-[600px] overflow-hidden m-2'
        style={{ transform: `translateY(${index * 10}px)` }}
      >
        <div className='bg-Critical flex items-center justify-between p-6'>
          <div className='flex items-center'>
            <div className='w-10 h-10 mr-2 border-4 border-white rounded-full'>
              <svg
                width='32'
                height='32'
                viewBox='0 0 32 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g clip-path='url(#clip0_1_1839)'>
                  <circle cx='16' cy='16' r='16' fill='#FC4A4A' />
                  <path
                    d='M7.43776 9.25848C6.80263 9.97191 6.86608 11.0652 7.57953 11.7003C7.90918 11.9938 8.31978 12.138 8.72894 12.138C9.20534 12.138 9.67968 11.9423 10.0213 11.5585C10.6565 10.8451 10.593 9.75183 9.87956 9.11671C9.54991 8.82324 9.13932 8.67892 8.73016 8.67896C8.25379 8.67896 7.77945 8.87467 7.43776 9.25848Z'
                    fill='white'
                  />
                  <path
                    d='M25.3039 22.4853H23.638C23.7264 22.4066 23.8036 22.3102 23.8624 22.1941C24.0752 21.7736 23.9491 21.2597 23.5816 20.9648L18.8829 17.1953C18.7606 17.0972 18.6167 17.0297 18.463 16.9984L15.3914 16.3724L18.6003 14.7017L22.0188 17.9698C22.4112 18.3449 23.0351 18.333 23.4123 17.9384C23.7884 17.545 23.7744 16.9211 23.3809 16.545L19.4522 12.7892C19.1472 12.4977 18.6904 12.4326 18.316 12.6275L15.4708 14.1088L12.879 11.9252L14.6361 11.7434C14.8273 11.7236 15.0056 11.6374 15.1398 11.4996L17.649 8.92439C17.9598 8.60542 17.9764 8.0921 17.6687 7.77019C17.3457 7.43225 16.8097 7.43203 16.4862 7.76396L14.171 10.1401C12.183 10.3594 11.6168 10.388 11.3672 10.4317C11.2363 10.4546 11.1152 10.5184 11.0255 10.6165L11.0238 10.6183C10.9801 11.1068 10.7821 11.5667 10.45 11.9398C10.0861 12.3486 9.58962 12.6114 9.05401 12.6878C8.91827 12.795 8.81507 12.9456 8.76831 13.1259L7.83312 16.7305C7.77601 16.9505 7.81271 17.1844 7.93444 17.3765L9.98301 20.6079C10.2263 20.9917 10.734 21.1043 11.1164 20.8618C11.4995 20.6189 11.6132 20.1115 11.3704 19.7284L9.51261 16.798L9.91565 15.2444L12.5716 17.5016C12.8917 17.7737 13.2757 17.9601 13.6875 18.0433L17.8356 18.8822L22.3269 22.4853H9.08315C8.78556 22.4853 8.52949 22.714 8.51548 23.0113C8.50053 23.3286 8.75343 23.5906 9.06753 23.5906H25.3195C25.6336 23.5906 25.8865 23.3286 25.8716 23.0113C25.8576 22.714 25.6015 22.4853 25.3039 22.4853Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_1_1839'>
                    <rect width='32' height='32' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-white'>{data.title}</h2>
          </div>
          <button onClick={onClose} className='text-white/60 hover:text-white text-2xl'>
            ×
          </button>
        </div>
        <p className='p-6'>{data.body}</p>
        <div className='flex flex-col sm:flex-row gap-4 p-6 justify-between '>
          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              onClick={() => handleClick(data?.uid)}
              className='px-4 py-2 rounded'
              icon={<IoMdCall />}
            >
              Call to Room
            </Button>
            <Dropdown.Button
              style={{ width: 'fit-content' }}
              menu={{
                items: dropdownItems,
                onClick: ({ key }) => handleCopyNumber(key),
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              loading={isContactLoading}
              disabled={dropdownItems.length == 0}
            >
              {/* <LuPhoneCall /> */}
              {dropdownItems.length > 0 ? 'Contact List' : 'No Contact List'}
            </Dropdown.Button>
          </div>
          <Button
            onClick={() => onViewUser(data?.elderly_id)}
            className='px-4 py-2 rounded'
            icon={<PiEyeBold />}
          >
            View User
          </Button>
        </div>
      </div>
    </div>
  );
};
export default FallAlarmModal;
