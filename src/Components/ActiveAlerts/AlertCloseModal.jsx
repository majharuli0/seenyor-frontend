import React, { useContext, useState } from 'react';
import { Button, Modal, Popconfirm } from 'antd';
import { useForm } from 'react-hook-form';
import CustomModal from '@/Shared/modal/CustomModal';
import CustomInput from '@/Shared/input/CustomInput';
import CustomTextArea from '@/Shared/input/CustomTextArea';
import CustomSelector from '@/Shared/input/CustomSelector';
import CustomButton from '@/Shared/button/CustomButton';
import { Controller } from 'react-hook-form';
import AlertBG from '@/assets/AlertBGABS.svg';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import {
  transformDateAndTime,
  transformDateAndTimeToDuration,
  getAlertType,
  getAlertInfoViaEvent,
} from '@/utils/helper';
import { markAsResolved } from '@/api/elderlySupport';
import { SidebarContext } from '@/Context/CustomContext';

export default function AlertCloseModal({
  openAlertCloseModal,
  setOpenAlertCloseModal,
  selectedAlert = [], // Renamed to selectedAlerts in the thinking trace, but kept as selectedAlert here to match your code
  getAlertListDatas,
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: '',
      comment: '',
    },
  });

  const [isResolving, setIsResolving] = useState(false);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { resolvedAlarm, setResolvedAlarm } = useContext(SidebarContext);
  const showPopconfirm = () => {
    console.log();
    if (control?._fields?.status?._f?.value) {
      setOpen(true);
    }
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  async function onSubmit(data) {
    setIsResolving(true);
    setResolvedCount(0);

    // Ensure selectedAlert is treated as an array, even for a single alarm
    const alertsArray = Array.isArray(selectedAlert) ? selectedAlert : [selectedAlert];

    const promises = alertsArray.map((alert) =>
      markAsResolved({
        id: alert._id || alert,
        data: { status: data.status.value, comment: data.comment },
      })
        .then(() => {
          setResolvedCount((prev) => prev + 1);
        })
        .catch((error) => {
          toast.custom((t) => (
            <CustomErrorToast
              t={t}
              title='Error'
              text={`Failed to resolve alarm ${alert._id}: ${error.message}`}
            />
          ));
        })
    );

    await Promise.all(promises);

    setIsResolving(false);
    toast.custom((t) => (
      <CustomToast t={t} text={`${alertsArray.length} alarm(s) have been processed.`} />
    ));
    getAlertListDatas();
    setResolvedAlarm(selectedAlert);
    reset();
    setOpenAlertCloseModal(false);
  }

  // Ensure selectedAlert is treated as an array
  const alertsArray = Array.isArray(selectedAlert) ? selectedAlert : [selectedAlert];

  return (
    <Modal
      open={openAlertCloseModal}
      onCancel={() => {
        setOpenAlertCloseModal(false);
        reset();
      }}
      footer={null}
    >
      <div id='alertCloseModalHeader'>
        {alertsArray.length >= 1 && !alertsArray[0]?._id && isResolving ? (
          <div className='p-4 text-center'>
            Resolved {resolvedCount} of {alertsArray.length} alarms
          </div>
        ) : (
          <>
            <div id='alertCardOverview'>
              <div
                id='alertItem'
                className={`rounded-2xl overflow-hidden w-full p-4 flex justify-between items-center ${
                  alertsArray.length === 1 && alertsArray[0]?._id
                    ? getAlertInfoViaEvent(alertsArray[0])?.label === 'Critical'
                      ? 'bg-red-500'
                      : getAlertInfoViaEvent(alertsArray[0])?.label === 'Warning'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    : 'bg-gray-500' // Default color for multiple alarms
                }`}
              >
                <div id='leftSide' className='z-50'>
                  <div id='alertItemHeader'>
                    <div id='alertItemTitleAndDescription' className='flex flex-col gap-4'>
                      {alertsArray.length >= 1 && !alertsArray[0]?._id ? (
                        <div>
                          <h1 className='text-xl font-bold text-white'>
                            Resolving {alertsArray.length} alarms
                          </h1>
                          <p className='text-white'>
                            Please select the status and add a comment for all alarms.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div id='time' className='flex gap-2'>
                            <span className='bg-white font-semibold p-1 px-2 rounded-full text-text-primary flex items-center gap-2'>
                              {transformDateAndTime(alertsArray[0]?.created_at)}
                            </span>
                            <span className='bg-white font-semibold p-1 px-2 rounded-full text-text-primary'>
                              {transformDateAndTimeToDuration(alertsArray[0]?.created_at)}
                            </span>
                          </div>
                          <div id='alertItemTitleAndDescription'>
                            <h1 className='text-xl font-bold text-white m-0'>
                              {getAlertInfoViaEvent(alertsArray[0])?.title}
                            </h1>
                            <p className='text-white text-base m-0 leading-none'>
                              {getAlertInfoViaEvent(alertsArray[0])?.message}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {alertsArray.length === 1 && (
                  <img src={AlertBG} alt='' className='absolute top-0 right-0 w-[280px]' />
                )}
              </div>
            </div>
            <div id='alertsConfirmationAndComment' className='mt-4 px-4'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='status'
                  control={control}
                  rules={{
                    required: 'Please select alert status',
                  }}
                  render={({ field }) => (
                    <CustomSelector
                      label='Notification Status'
                      error={errors.status}
                      placeholder='Select Notification Status'
                      options={[
                        { value: true, label: 'True Notifications' },
                        { value: false, label: 'False Notifications' },
                      ]}
                      value={field.value}
                      {...field}
                    />
                  )}
                />
                <Controller
                  key='comment'
                  name='comment'
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <CustomTextArea
                      label='Comment'
                      placeholder='Enter your comment'
                      error={errors.comment}
                      {...field}
                    />
                  )}
                />
                <div id='alertCloseModalFooter' className='py-4 flex gap-4'>
                  <CustomButton
                    type='button'
                    style={{
                      width: '100%',
                      background: '#F5F5F5',
                      color: '#1B2559',
                    }}
                    onClick={() => {
                      setOpenAlertCloseModal(false);
                      reset();
                    }}
                  >
                    Close
                  </CustomButton>
                  <CustomButton type='primary' htmlType='submit' className='w-full'>
                    Mark as Done
                  </CustomButton>

                  {/* <Popconfirm
                    title="Title"
                    description="Open Popconfirm with async logic"
                    open={open}
                    onConfirm={handleOk}
                    okButtonProps={{ loading: confirmLoading }}
                    onCancel={handleCancel}
                  >
                    <CustomButton onClick={showPopconfirm}>
                      Open Popconfirm with async logic
                    </CustomButton>
                  </Popconfirm> */}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
