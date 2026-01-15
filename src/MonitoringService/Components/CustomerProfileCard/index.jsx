import { MapPin, PhoneCall, Plug } from 'lucide-react';
import CardUI from '../common/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { MdDoNotDisturb, MdMyLocation } from 'react-icons/md';
import { Tooltip } from '../ui/tooltip';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import { PiEmptyBold } from 'react-icons/pi';
import { HiOutlinePhoneMissedCall } from 'react-icons/hi';

export const CustomerProfileCard = ({ data = {} }) => {
  return (
    <CardUI className='bg-secondary/40 border-none shadow-sm rounded-2xl !h-fit'>
      <div className='p-4'>
        <div className='flex items-center gap-4'>
          <div className='relative w-fit'>
            <Avatar className='size-20 rounded-md '>
              <AvatarImage
                src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.pngsss'
                alt='Hallie Richards'
                className='rounded-sm'
              />
              <AvatarFallback className='text-md font-bold uppercase bg-background'>
                {data?.name?.split('', 2) || 'UU'}
              </AvatarFallback>
            </Avatar>
            <Badge className='absolute -bottom-2.5 -right-2.5 h-5 min-w-5 rounded-full bg-primary px-1 tabular-nums'>
              {data?.age || 'N/A'}
            </Badge>
          </div>
          <div>
            <h2 className='text-xl text-primary font-semibold text-foreground'>
              {data?.name || 'Unknown User'}
            </h2>
            {/* <p className="text-sm text-text">
              <span className="opacity-70"> DOB:</span> 26/06/1978
            </p> */}
            <p className='text-sm text-text'>
              {' '}
              <span className='opacity-70'> Phone: </span>{' '}
              {data?.contact_code + ' ' + data?.contact_number || 'N/A'}
            </p>
            <p className='text-sm text-text capitalize'>
              {' '}
              <span className='opacity-70 '> Gender: </span> {data?.gender || 'N/A'}
            </p>
          </div>
        </div>

        <div className='space-y-4 mt-10'>
          <Section title='Address'>
            <div className='p-2 bg-background rounded-md flex items-start'>
              <p className='text-sm text-muted-foreground w-full'>
                {data?.address || 'No address provided yet.'}
              </p>

              <a
                href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                target='_blank'
                className='location_icon p-1 flex items-center justify-center cursor-pointer bg-primary rounded-full w-fit '
              >
                <MdMyLocation size={16} className='inline  text-white' />
              </a>
            </div>
          </Section>

          <Separator className='bg-muted/60' />

          <Section title='Notes'>
            <div className='p-2 bg-background rounded-md'>
              <p className='text-sm text-muted-foreground'>
                {data?.comments
                  ?.filter((item) => item.category === 'Custom Text' && item.comment)
                  ?.map((item) => item.comment)
                  .join(', ') || 'N/A'}
              </p>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {data?.diseases?.map((disease, index) => (
                <Badge
                  key={index}
                  variant='outline'
                  className='capitalize bg-background border-border p-2 text-text'
                >
                  {disease}
                </Badge>
              ))}
            </div>
          </Section>

          <Separator className='bg-muted/60' />

          <Section title='Contacts'>
            <div className='space-y-1 text-sm text-muted-foreground'>
              <ul className='flex flex-col gap-2 mt-0'>
                {(!data?.emergency_contacts || data.emergency_contacts.length === 0) && (
                  <Empty className='w-full text-center'>
                    <EmptyHeader>
                      <EmptyMedia variant='icon'>
                        <HiOutlinePhoneMissedCall className='w-16 h-16 text-muted-foreground' />
                      </EmptyMedia>
                      <EmptyDescription>Emergency contact number not available.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}

                {data?.emergency_contacts?.map((contact, index) => {
                  return (
                    <li
                      key={index}
                      className='p-2 pr-4 flex justify-between items-center bg-background rounded-md border border-border cursor-pointer hover:bg-background/80'
                    >
                      <div>
                        <p className='text-base text-text'>
                          {(contact?.contact_number_code?.startsWith('+')
                            ? contact.contact_number_code
                            : '+' + contact?.contact_number_code) || ''}{' '}
                          {contact?.contact_number || ''}
                        </p>

                        <p> {contact?.contact_person}</p>
                      </div>
                      <PhoneCall size={20} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>

          <Separator className='bg-muted/60' />

          <Section title='Devices'>
            <ul className='flex flex-col gap-2 mt-0 text-muted-foreground'>
              {data?.rooms && data?.rooms?.filter((item) => item?.device_no).length === 0 && (
                <Empty className='w-full text-center'>
                  <EmptyHeader>
                    <EmptyMedia variant='icon'>
                      <MdDoNotDisturb className='w-16 h-16 text-muted-foreground' />
                    </EmptyMedia>
                    <EmptyDescription>No Device Found</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
              {data?.rooms
                ?.filter((item) => item?.device_no)
                .map((room, index) => (
                  <li
                    key={index}
                    className='p-2 pr-4 flex justify-between items-center bg-background rounded-md border border-border  hover:bg-background/80'
                  >
                    <div>
                      <p className='text-base text-text'>
                        {room?.device_no || (
                          <i className='text-sm text-text/60'>- No Device Installed -</i>
                        )}
                      </p>
                      <p className='text-sm'> {room?.name}</p>
                    </div>
                    {room?.is_device_bind ? (
                      <span className='relative flex size-3'>
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${'bg-green-400'} opacity-75`}
                        ></span>
                        <span
                          className={`relative inline-flex size-3 rounded-full ${'bg-green-500'}`}
                        ></span>
                      </span>
                    ) : (
                      <span className='relative flex size-3'>
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${'bg-red-400'} opacity-75`}
                        ></span>
                        <span
                          className={`relative inline-flex size-3 rounded-full ${'bg-red-500'}`}
                        ></span>
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </Section>
        </div>
      </div>
    </CardUI>
  );
};

const Section = ({ title, actions, children }) => (
  <div>
    <div className='flex justify-between items-center w-full gap-2'>
      <h3 className='font-semibold text-sm mb-1 text-primary w-full'>{title}</h3>
      {actions && actions}
    </div>
    {children}
  </div>
);
