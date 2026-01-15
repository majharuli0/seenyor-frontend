import { ChevronDown, Phone, Clipboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../Shared/shadncn-ui/dropdown-menu';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getTokenToCall } from '@/api/deviceCall';
import { Empty, Tooltip } from 'antd';
import { initiateCall } from '@/utils/makeDeviceCall';

export function CallButton({ emergencyContacts = [], devices = [] }) {
  const [hovered, setHovered] = useState(null);
  const handleCopy = (number) => {
    navigator.clipboard.writeText(number);
    toast.success('Number copied to clipboard');
  };

  // Get token and make the call
  function handleClick(id) {
    if (id) {
      initiateCall(id);
    }
  }

  // Request a new token if necessary and make the call
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-1.5 rounded-full bg-[#323250]/10 px-3 pr-2 outline-none py-2 hover:bg-[#323250]/20 transition'>
          <Phone size={12} className='text-gray-800' />
          <ChevronDown className='w-4 h-4 text-gray-500' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64' onClick={(e) => e.stopPropagation()}>
        {/* Emergency Contacts */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-[14px] opacity-60'>
            Emergency Contacts
          </DropdownMenuLabel>
          {emergencyContacts.map((contact, index) => {
            const fullNumber = `${contact.contact_number_code}${contact.contact_number}`;
            return (
              <Tooltip
                key={index}
                title={`${contact.contact_number_code} ${contact.contact_number}`}
                placement='top'
              >
                <DropdownMenuItem
                  key={index}
                  onSelect={() => handleCopy(fullNumber)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className='relative flex flex-col items-start gap-0.5 cursor-pointer pr-6'
                >
                  <span className='text-sm font-medium'>
                    {contact.contact_person} ({contact.relationship})
                  </span>
                  <span className='text-xs text-gray-500'>~{contact.coverage_area}km away</span>

                  {hovered === index && (
                    <Clipboard size={14} className='absolute right-2 top-2 text-gray-400' />
                  )}
                </DropdownMenuItem>
              </Tooltip>
            );
          })}
          {emergencyContacts?.length == 0 && (
            <p className='w-full items-center text-center opacity-30'>No Data</p>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Device Calling */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-[14px] opacity-60'>Device Calling</DropdownMenuLabel>
          {devices.map((device, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => handleClick(device.device_no)}
              className='cursor-pointer'
              disabled={device.is_device_bind === false}
            >
              <span className='text-sm'>{device.room}</span>
              {!device.is_device_bind && <>(Offline)</>}
            </DropdownMenuItem>
          ))}
          {devices?.length == 0 && (
            <p className='w-full items-center text-center opacity-30'>No Data</p>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
