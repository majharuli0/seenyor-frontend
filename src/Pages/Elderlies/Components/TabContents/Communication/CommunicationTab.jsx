import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown } from 'antd';
import { LuPhoneCall } from 'react-icons/lu';
import { CustomContext } from '@/Context/UseCustomContext';
import { getTokenToCall, makeCallToDevice } from '@/api/deviceCall';
import ChatBox from './Components/ChatBox';
import { initiateCall } from '@/utils/makeDeviceCall';
const CommunicationTab = () => {
  const { elderlyDetails } = useContext(CustomContext);
  const devices = elderlyDetails?.rooms?.filter((room) => room.device_no) || [];
  const defaultDevice = devices[0]; // first valid device
  const otherDevices = devices.slice(1); // all except first

  // Get token and make the call
  function handleClick(id) {
    if (id) {
      initiateCall(id);
    }
  }

  // // Request a new token if necessary and make the call
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

  // // Open a popup with the specified URL and query parameters
  // function openPopup(uid, accessToken) {
  //   const data = {
  //     uid: uid,
  //     token: accessToken,
  //     // freshToken: refreshToken,
  //     lang: "en_US",
  //   };

  //   const popupUrl = `https://console.elderlycareplatform.com/metting?${new URLSearchParams(
  //     data
  //   ).toString()}`;

  //   // Window features for customization
  //   const windowFeatures =
  //     "width=500,height=600,scrollbars=no,resizable=no,location=no,toolbar=no,status=no,menubar=no";

  //   // Open the window with the custom features
  //   const popup = window.open(popupUrl, "Device Calling", windowFeatures);

  //   if (popup) {
  //     popup.focus(); // Focus on the new popup window
  //   } else {
  //     console.error("Popup window could not be opened");
  //   }
  // }

  return (
    <div
      id='communication-tab'
      className='communication-tab mt-6 flex flex-col bg-white rounded-2xl w-full '
    >
      <div className='flex items-center justify-between w-full p-4 border-b border-gray-200'>
        <h1 className='text-2xl font-bold'>Communication</h1>

        <div>
          {devices.length > 1 ? (
            <Dropdown.Button
              menu={{
                items: otherDevices.map((room) => ({
                  label: room.name,
                  key: room.device_no,
                  disabled: room.is_device_bind === false,
                })),
                onClick: ({ key }) => handleClick(key),
              }}
              size='large'
              buttonsRender={([leftButton, rightButton]) => [
                React.cloneElement(leftButton, {
                  disabled: defaultDevice?.is_device_bind === false,
                }),
                rightButton,
              ]}
              onClick={() => handleClick(defaultDevice?.device_no)}
            >
              <LuPhoneCall />
              {`Call To ${defaultDevice?.name || 'Device'}`}
            </Dropdown.Button>
          ) : (
            <Button
              size='large'
              disabled={defaultDevice?.is_device_bind === false}
              onClick={() => handleClick(defaultDevice?.device_no)}
            >
              <LuPhoneCall />
              {`Call To ${defaultDevice?.name || 'Device'}`}
            </Button>
          )}
        </div>
      </div>
      <ChatBox />
    </div>
  );
};

export default CommunicationTab;
