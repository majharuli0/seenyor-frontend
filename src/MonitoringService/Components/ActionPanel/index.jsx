import { ChevronLeft, ChevronRight, Pause, PhoneCall, Rotate3D, WifiOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import { AlertBanner } from '../AlertBanner';
import CardUI from '../common/card';
import { Button } from '../ui/button';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { Badge } from '../ui/badge';
import WallMountCanvas from '../RoomMapCanvas/WallMount';
import TopMountCanvas from '../RoomMapCanvas/TopMount';
import { FallPlayBack } from '../FallPlayBack';
import { LiveMap } from '../LiveMap';
import { RiPoliceBadgeFill } from 'react-icons/ri';
import { CircularTimer } from '../CircularTimer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { IoCall, IoCallOutline } from 'react-icons/io5';
import { Checkbox } from '../ui/checkbox';
import Modal from '../common/modal';
import {
  useAlertLogs,
  useAlertPick,
  useAlertResolve,
  useAlerts,
  useSendNotification,
  useSendSMS,
} from '@/MonitoringService/hooks/useAlert';
import data from '@/Components/ManageChildUser/data';
import { countryCodeToISOCode, formatSmartDate, getLogDisplayInfo } from '@/utils/helper';
import { Skeleton } from '../ui/skeleton';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { FcEmptyFilter } from 'react-icons/fc';
import { GrEmptyCircle } from 'react-icons/gr';
import { toast } from '../common/toast';
import { FiClipboard } from 'react-icons/fi';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import { EmergencyContactModal } from '../EmdergencyModal';
import CallNoteSection from '../CallNoteSection';
import { FaRegStickyNote } from 'react-icons/fa';

export const ActionPanel = ({ userData = {}, selectedAlert = {} }) => {
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const { mutate: pickAlert, isPending, isSuccess } = useAlertPick();

  const [user, serUser] = useState(null);
  const { getUser } = useUserStore();
  const token = localStorage.getItem('token');

  useEffect(() => {
    serUser(getUser);
  }, [token]);
  console.log(user);
  function actionReq() {
    if (user?.role == 'monitoring_agent' && !selectedAlert?.picked_by) {
      setVisible2(true);
      return false;
    }
    return true;
  }
  return (
    <>
      <CardUI
        title={<h1 className='text-base font-semibold text-text'>Action Panel</h1>}
        headerPadding='px-5 py-2'
        actions={
          <div className='flex items-center gap-8'>
            <div className='flex gap-2 items-center'>
              <CircularTimer />
              <div className='flex items-start flex-col'>
                <h2 className='text-base font-semibold text-text m-0 leading-none'>SLA</h2>
                <span className='text-sm  text-text/70 m-0 leading-none'>Timer</span>
              </div>
            </div>
            <Button
              variant='tertiary'
              onClick={() => {
                if (actionReq()) {
                  setVisible(true);
                }
              }}
            >
              {' '}
              <RiPoliceBadgeFill />
              Emergency Contacts
            </Button>
          </div>
        }
      >
        <div
          className={`grid grid-cols-1 ${
            user?.role !== 'monitoring_agency' ? 'md:grid-cols-2' : 'md:grid-cols-2'
          }  gap-4`}
        >
          <UserInfoCard userData={userData} selectedAlert={selectedAlert} actionReq={actionReq} />
          {user?.role !== 'monitoring_agency' && <AlertStatusCard actionReq={actionReq} />}
          <ActionLogsCard />
        </div>
      </CardUI>
      {user && (
        <EmergencyContactModal
          visible={visible}
          setVisible={setVisible}
          countryCode={countryCodeToISOCode[user?.contact_code] || ' '}
        />
      )}
      <Modal
        isVisible={visible2}
        setIsVisible={setVisible2}
        okText='Yes, Confirm'
        title='Confirm Resolution'
        description='are you sure you want to pick this alert?'
        onOk={async () => {
          await pickAlert(id);
        }}
        onCancel={() => console.log('Cancelled')}
      >
        {/* <p>This action cannot be undone.</p> */}
      </Modal>
    </>
  );
};
const UserInfoCard = ({ userData = {}, selectedAlert = {}, actionReq }) => {
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [contact, setContact] = useState({});

  const { mutate: sendSMS, isPending } = useSendSMS();
  const { mutate: sendNotification, isPending: isSendingNotification } = useSendNotification();
  const { cmd, event, event_name, uid } = selectedAlert;
  return (
    <div className=''>
      <div className='px-6 py-2 border-b border-border'>
        <h2 className='text-xs uppercase text-text/70 font-semibold'>User</h2>
      </div>

      <div className='p-3 space-y-2'>
        <div className='flex flex-col gap-1 dark:bg-background bg-border p-3 rounded-md'>
          <div className='w-full flex justify-between'>
            <h2 className='text-sm font-semibold text-text'>{userData?.name || '-'}</h2>
            <h2 className='text-sm font-semibold text-text'>{userData?.age || '-'}yr</h2>
          </div>
          <p className='text-xs text-muted-foreground'>{userData?.address || 'No address'}</p>
        </div>
        <div className='flex flex-col gap-3'>
          {userData?.emergency_contacts?.length > 0 ? (
            userData?.emergency_contacts?.map((contact, idx) => (
              // <Button
              //   key={idx}
              //   size="lg"
              //   className="w-full flex justify-between items-center bg-green-700 hover:bg-green-800 rounded-[6px]"
              // >
              //   <div className="flex gap-2 items-center">
              //     <IoCallOutline />
              //     {contact.name || "Contact"}
              //   </div>
              //   <Badge variant="secondary" className="bg-text text-background">
              //     Called
              //   </Badge>
              // </Button>
              <Button
                key={idx}
                variant='tertiary'
                size='lg'
                className='w-full flex justify-between items-center rounded-[6px]'
                onClick={() => {
                  if (actionReq()) {
                    setContact(contact);
                    setVisible(true);
                  }
                }}
              >
                <div className='flex gap-2 items-center'>
                  <IoCallOutline />
                  {contact.contact_person || 'Contact'}{' '}
                  <Badge variant='secondary' className='bg-text/10 text-text'>
                    {contact.relationship}
                  </Badge>
                </div>
                <Badge variant='secondary' className='bg-text/10 text-text'>
                  {contact.coverage_area} km
                </Badge>
              </Button>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>No emergency contacts</p>
          )}
          {/* <Button
            size="lg"
            className="w-full flex justify-between items-center bg-green-700 hover:bg-green-800 rounded-[6px]"
          >
            <div className="flex gap-2 items-center">
              <IoCallOutline />
              Contact 1
            </div>
            <Badge variant="secondary" className="bg-text text-background">
              Called
            </Badge>
          </Button>
          <Button
            variant="tertiary"
            size="lg"
            className="w-full flex justify-between items-center rounded-[6px]"
          >
            <div className="flex gap-2 items-center">
              <IoCallOutline />
              Contact 1
            </div>
            <Badge variant="secondary" className="bg-text/10 text-text">
              Call
            </Badge>
          </Button> */}
          <div className='flex gap-2 flex-wrap'>
            <Button
              className='flex-1 rounded-[6px] bg-[#514EB5] hover:bg-[#514EB5]/90 border-white/20 border-2'
              size='lg'
              disabled={isPending}
              onClick={() => {
                if (actionReq()) {
                  sendSMS({
                    id: id,
                    data: { uid, event, eventName: event_name, cmd },
                  });
                }
              }}
            >
              Send SMS
            </Button>
            <Button
              className='flex-1 rounded-[6px] bg-[#592A7E] hover:bg-[#592A7E]/90 border-white/20 border-2'
              size='lg'
              disabled={isSendingNotification}
              onClick={() => {
                if (actionReq()) {
                  sendNotification({
                    id: id,
                    data: { uid, event, eventName: event_name, cmd },
                  });
                }
              }}
            >
              Send Notification
            </Button>
          </div>
          <Button
            className='rounded-[6px]'
            size='lg'
            variant='tertiary'
            disabled={isPending}
            onClick={() => {
              if (actionReq()) {
                sendSMS({
                  id: id,
                  data: { uid, event, eventName: event_name, cmd },
                });
                sendNotification({
                  id: id,
                  data: { uid, event, eventName: event_name, cmd },
                });
              }
            }}
          >
            Notify Customer
          </Button>
        </div>
      </div>
      <Modal
        isVisible={visible}
        setIsVisible={setVisible}
        onCancel={() => console.log('Cancelled')}
        showFooter={false}
      >
        <div className='space-y-5'>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-xl font-semibold text-text mb-1'>Contact Number</h2>
            <div className='flex items-center space-x-2 bg-background px-4 py-2 rounded-lg border border-border'>
              <span className='text-2xl font-bold text-text tracking-wide select-all'>
                {contact?.contact_number_code + ' ' + contact?.contact_number}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('+8801711223344');
                  toast.success('Contact number copied!');
                }}
                className='p-2 rounded-md hover:bg-text-text/20 transition'
                title='Copy'
              >
                <FiClipboard />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='font-medium text-text text-xs'>Contact Person</p>
              <p className='text-text/80'>{contact?.contact_person}</p>
            </div>
            {/* <div>
              <p className="font-medium text-text text-xs">Gender</p>
              <p className="text-text/80">{contact?.gender}</p>
            </div> */}
            <div>
              <p className='font-medium text-text text-xs'>Relation</p>
              <p className='text-text/80'>{contact?.relationship}</p>
            </div>
            <div>
              <p className='font-medium text-text text-xs'>Distance</p>
              <p className='text-text/80'>{contact?.coverage_area} km away</p>
            </div>
          </div>

          <CallNoteSection
            contactName={contact?.contact_person}
            contactType=''
            contactNumber={contact?.contact_number}
            contactCode={contact?.contact_number_code}
          />
        </div>
      </Modal>
    </div>
  );
};

const AlertStatusCard = ({ actionReq }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFallType, setSelectedFallType] = useState(null);
  const [alarmNote, setAlarmNote] = useState('');
  const [visible, setVisible] = useState(false);
  const { mutate: resolveAlert, isPending, isSuccess } = useAlertResolve();
  useEffect(() => {
    if (isSuccess) {
      setSelectedFallType(null);
      setAlarmNote('');
      navigate('/ms/dashboard');
    }
  }, [isSuccess]);
  const handleFallTypeSelect = (type) => {
    setSelectedFallType(type);
  };
  return (
    <div className=''>
      <div className='px-6 py-2 border-b border-border'>
        <h2 className='text-xs uppercase text-text/70 font-semibold'>Alert Status </h2>
      </div>

      <div className='p-3 space-y-2'>
        <div className='flex gap-2 w-full'>
          <Button
            className={`flex-1 bg-green-700 hover:bg-green-700`}
            onClick={() => handleFallTypeSelect('true')}
          >
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={selectedFallType === 'true'}
                onCheckedChange={() => handleFallTypeSelect('true')}
                className='!bg-white border-none !text-black'
              />
              True Alert
            </div>
          </Button>

          <Button
            variant={'destructive'}
            className='flex-1'
            onClick={() => handleFallTypeSelect('false')}
          >
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={selectedFallType === 'false'}
                onCheckedChange={() => handleFallTypeSelect('false')}
                className='!bg-white border-none !text-black'
              />
              False Alert
            </div>
          </Button>
        </div>

        <Textarea
          placeholder='Write Alarm Note..'
          className='min-h-[100px]'
          onChange={(e) => {
            setAlarmNote(e.target.value);
          }}
        />
        <Button
          className='w-full rounded-[6px]'
          size='lg'
          onClick={() => {
            if (actionReq()) {
              setVisible(true);
            }
          }}
          disabled={!selectedFallType || isPending}
        >
          Mark as Resolved
        </Button>
      </div>
      <Modal
        isVisible={visible}
        setIsVisible={setVisible}
        okText='Resolve'
        title='Confirm Resolution'
        description='are you sure you want to resolve this alert?'
        onOk={async () => {
          await resolveAlert({
            id: id,
            data: {
              status: selectedFallType === 'true',
              comment: alarmNote,
            },
          });
        }}
        onCancel={() => console.log('Cancelled')}
      >
        {/* <p>This action cannot be undone.</p> */}
      </Modal>
    </div>
  );
};

const ActionLogsCard = () => {
  const { id } = useParams();
  const { data: logsData, isLoading } = useAlertLogs({ id: id });

  const logs = logsData?.data?.action_logs || [];
  const reversedLogs = [...logs].reverse();

  return (
    <div className=''>
      {/* Header */}
      <div className='px-6 py-2 border-b border-border flex justify-between'>
        <h2 className='text-xs uppercase text-text/70 font-semibold'>Action Logs</h2>
        <h2 className='text-xs uppercase text-text/70 font-semibold'>Agent</h2>
      </div>

      <div className='p-3'>
        <div className='h-[300px] overflow-y-auto scrollbar-thin'>
          {/* Loading state */}
          {isLoading ? (
            <div className='space-y-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex items-center justify-between gap-3 p-2 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-20 rounded' />
                    <Skeleton className='h-4 w-24 rounded' />
                  </div>
                  <Skeleton className='h-4 w-16 rounded' />
                </div>
              ))}
            </div>
          ) : reversedLogs.length > 0 ? (
            <div className='space-y-1'>
              {reversedLogs.map((log, idx) => (
                <div
                  key={idx}
                  className='flex hover:bg-text/5 items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50'
                >
                  <div className='w-[80%]'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary' className='text-text bg-text/10'>
                        {formatSmartDate(log.created_at)}
                      </Badge>
                      {getLogDisplayInfo(log).icon}
                      <p
                        className='text-sm capitalize truncate'
                        title={getLogDisplayInfo(log).title}
                      >
                        {' '}
                        {getLogDisplayInfo(log).title}{' '}
                        {log?.contact_name && (
                          <Badge variant='secondary' className='text-text bg-text/10'>
                            {log?.contact_name}
                          </Badge>
                        )}
                      </p>
                    </div>
                    {log?.action_note && (
                      <Badge
                        variant='outline'
                        className='text-xs font-thin opacity-85 border-border ml-20 mt-2 relative !text-wrap flex items-start gap-2'
                      >
                        <FaRegStickyNote />
                        {log?.action_note}
                      </Badge>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground text-right'>{log.action_by}</p>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className='flex items-center justify-center h-full'>
              <Empty className='w-full text-center'>
                <EmptyHeader className='pt-8'>
                  <EmptyMedia variant='icon'>
                    <GrEmptyCircle className='w-16 h-16 text-muted-foreground' />
                  </EmptyMedia>
                  <EmptyTitle>No Logs</EmptyTitle>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionLogsCard;
