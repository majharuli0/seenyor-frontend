import {
  Alert,
  Button,
  Flex,
  Input,
  Radio,
  Slider,
  Spin,
  Switch,
  Tabs,
  TimePicker,
  Tooltip,
} from 'antd';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {} from 'react-icons/ri';
import { FaLeaf, FaPersonFalling } from 'react-icons/fa6';
import { RiToolsFill } from 'react-icons/ri';
import { MdOutlinePregnantWoman } from 'react-icons/md';
import { GiNightSleep } from 'react-icons/gi';
import { FaBedPulse } from 'react-icons/fa6';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { FcIdea } from 'react-icons/fc';
import dayjs from 'dayjs';
import sidemountImage from '../images/side-m.png';
import topemountImage from '../images/top-m.png';
import installationHeightImgTop from '../images/height-m.png';
import installationHeightImgSide from '../images/height-side-m.png';
import boundaryImageTop from '../images/boundary-m.png';
import boundaryImageSide from '../images/boundary-side-m.png';
import {
  getRoomInfo,
  updateBoundary,
  updateMountConf,
  updateFunctionParameters,
  updateFunctionStatus,
} from '@/api/deviceConfiguration';
import { AiTwotoneSave } from 'react-icons/ai';
import DetectionBoundaryCanvas from './DetectionBoundaryCanvas';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;
export default function DeviceConfiguration({ elderly_id, device_id, isActive }) {
  const [roomInfo, setRoomInfo] = useState({});
  const initialValues = useRef({
    installationHeight: roomInfo?.height ?? null,
    mountType: roomInfo?.mountType ?? null,
    boundary: {},
    parameters: null,
    status: null,
  });
  const [showWarningForInstallationH, setShowWarningForInstallationH] = useState(false);
  const [mountType, setMountType] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoadingIns, setIsLoadingIns] = useState(false);
  const [isloadingBn, setIsloadingBn] = useState(false);
  const [isloadingPr, setIsloadingPr] = useState(false);
  const [showSaveBoundry, setShowSaveBoundry] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [parametersData, setParametersData] = useState({});
  const [installationData, setInstallationData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetTab, setTargetTab] = useState(null);
  const [parameters, setParameters] = useState();
  const [boundary, setBoundary] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const [installationHeight, setInstallationHeight] = useState(0);
  const [parameterQuarry, setParameterQuarry] = useState(null);
  const [statusQuarry, setStatusQuarry] = useState(null);
  const handleChange = (type, value) => {
    // Update state immediately
    if (type === 'mount') setMountType(value);
    if (type === 'height') setInstallationHeight(value);

    // Calculate new state values
    const newMount = type === 'mount' ? value : mountType;
    const newHeight = type === 'height' ? value : installationHeight;

    // Check against initial values
    const isChanged =
      newMount !== initialValues.current.mountType ||
      newHeight !== initialValues.current.installationHeight;

    setHasChanges(isChanged);

    // Height validation
    if (type === 'height') {
      const isValid = newMount === 1 ? value >= 2 && value <= 3 : value >= 1.5 && value <= 1.6;
      setShowWarningForInstallationH(!isValid);
    }
  };
  useEffect(() => {
    console.log('Parameters changed:', parametersData);
  }, [parametersData]);
  useEffect(() => {
    setParameters(
      [
        {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <RiToolsFill />
              Installation
            </div>
          ),
          key: 0,
          children: (
            <Installation
              key={initialValues.current.mountType}
              initialValues={initialValues && initialValues.current}
              currentValues={setInstallationData}
              onChange={(data) => {
                setInstallationData((prev) => ({ ...prev, ...data }));
              }}
            />
          ),
        },
        {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <FaPersonFalling />
              Fall
            </div>
          ),
          key: 1,
          children: (
            <Fall
              key={initialValues.current.parameters}
              initialValues={initialValues && initialValues.current.parameters}
              currentValues={parametersData}
              onChange={(data) => {
                setParametersData((prev) => ({ ...prev, ...data }));
                setParameterQuarry({ ...data, event: '2' });
              }}
            />
          ),
        },
        {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <FaPersonFalling />
              Sit on Ground
            </div>
          ),
          key: 7,
          children: (
            <SitOnGround
              key={initialValues.current.parameters}
              initialValues={initialValues && initialValues.current.parameters}
              currentValues={parametersData}
              status={initialValues && initialValues.current.status}
              onStatusChange={(status) => {
                setStatusData((prev) => ({
                  ...prev,
                  [status.event]: status.status,
                }));
                setStatusQuarry(status);
              }}
              onChange={(data) => {
                setParametersData((prev) => ({ ...prev, ...data }));
                setParameterQuarry({ ...data, event: '9', alarm_type: '4' });
              }}
            />
          ),
        },
        {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <GiNightSleep />
              Sleep
            </div>
          ),
          key: 2,
          children: (
            <Sleep
              key={initialValues.current.parameters}
              initialValues={initialValues && initialValues.current.parameters}
              currentValues={parametersData}
              status={initialValues && initialValues.current.status}
              onStatusChange={(status) => {
                setStatusData((prev) => ({
                  ...prev,
                  [status.event]: status.status,
                }));
                setStatusQuarry(status);
              }}
              onChange={(data) => {
                setParametersData((prev) => ({ ...prev, ...data }));
                setParameterQuarry({ ...data, event: '3' });
              }}
            />
          ),
        },
        {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <FaBedPulse />
              Off-Bed
            </div>
          ),
          key: 3,
          children: (
            <OffBed
              key={initialValues.current.parameters}
              initialValues={initialValues && initialValues.current.parameters}
              currentValues={parametersData}
              status={initialValues && initialValues.current.status}
              onStatusChange={(status) => {
                setStatusData((prev) => ({
                  ...prev,
                  [status.event]: status.status,
                }));
                setStatusQuarry(status);
              }}
              onChange={(data) => {
                setParametersData((prev) => ({ ...prev, ...data }));
                setParameterQuarry({ ...data, event: '6' });
              }}
            />
          ),
        },
        roomInfo?.room_type == 3 && {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <MdOutlinePregnantWoman />
              Stay
            </div>
          ),
          key: 4,
          children: (
            <Stay
              key={initialValues.current.parameters}
              initialValues={initialValues && initialValues.current.parameters}
              currentValues={parametersData}
              status={initialValues && initialValues.current.status}
              onStatusChange={(status) => {
                setStatusData((prev) => ({
                  ...prev,
                  [status.event]: status.status,
                }));
                setStatusQuarry(status);
              }}
              onChange={(data) => {
                setParametersData((prev) => ({ ...prev, ...data }));
                setParameterQuarry({ ...data, event: '9' });
              }}
            />
          ),
        },
        {
          label: (
            <div className='flex items-center gap-2 text-primary font-medium'>
              {' '}
              <TbActivityHeartbeat />
              Inactivity
            </div>
          ),
          key: 5,
          children: (
            <Activity
              key={initialValues.current.parameters}
              status={initialValues && initialValues.current.status}
              onStatusChange={(status) => {
                setStatusData((prev) => ({
                  ...prev,
                  [status.event]: status.status,
                }));
                setStatusQuarry(status);
              }}
            />
          ),
        },
      ].filter(Boolean)
    );
  }, [roomInfo]);

  const handleTabChange = async (newKey) => {
    if (unsavedChanges) {
      const confirmation = await showConfirm({
        oktext: 'Save Changes',
        canceltext: 'Discard Chnages',
        titles: 'Save Changes!',
        description:
          'Please save changes after making any new changes or discard changes to procced.',
      });
      if (confirmation) {
        handleSaveParameters();
        setActiveTabKey(newKey);
      } else {
        setActiveTabKey(newKey);
        setUnsavedChanges(null);
      }
    } else {
      setActiveTabKey(newKey);
    }
  };
  const showConfirm = ({
    oktext = 'Confirm',
    canceltext = 'Cancel',
    titles = 'Delete Object!',
    description = 'Are you sure you want to delete this item?',
  }) => {
    return new Promise((resolve) => {
      confirm({
        title: titles,
        icon: <ExclamationCircleFilled />,
        content: description,
        className: 'mini-modal',
        centered: true,
        okText: oktext,
        cancelText: canceltext,
        okButtonProps: {
          style: {
            backgroundColor: oktext == 'Delete' ? '#ff4d4f' : '#1B2559',
            color: 'white',
          },
        },
        cancelButtonProps: {
          style: {
            backgroundColor: canceltext === 'Discard Chnages' ? '#ff4d4f' : '#FAFAFA',
            border: 'none',
            color: canceltext === 'Discard Chnages' ? '#fff' : '#1B2559',
          },
        },
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  };
  const handleSaveParameters = () => {
    setIsloadingPr(true);
    if (parameterQuarry) {
      updateFunctionParameters({
        elderly_id,
        data: {
          uid: roomInfo.device_no,
          ...parameterQuarry,
        },
      })
        .then(() => {
          getRoomInformation();
          setParameterQuarry(null);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsloadingPr(false);
        });
    }
    if (statusQuarry) {
      updateFunctionStatus({
        elderly_id,
        room_id: roomInfo?._id,
        event_id: statusQuarry.event,
        data: {
          status: statusQuarry.status,
        },
      })
        .then(() => {
          getRoomInformation();
          setStatusQuarry(null);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsloadingPr(false);
        });
    }
    if (installationData) {
      updateMountConf({
        room_id: device_id,
        elderly_id,
        data: {
          uid: roomInfo.device_no,
          height: installationData?.installation_height * 10,
          mount_type: installationData?.mount_type,
          scene: '1',
        },
      })
        .then(() => {
          setShowSave(false);
          setHasChanges(false);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          getRoomInformation();
          setIsloadingPr(false);
        });
    }
  };

  useEffect(() => {
    const isParamsChanged =
      initialValues.current.parameters &&
      JSON.stringify(parametersData) !== JSON.stringify(initialValues.current.parameters);
    const isStatusChanged =
      initialValues.current.status &&
      JSON.stringify(statusData) !== JSON.stringify(initialValues.current.status);

    setUnsavedChanges(isStatusChanged || isParamsChanged);
    const isInstallationChanged =
      initialValues.current.installationHeight &&
      installationData.installation_height !== initialValues.current.installationHeight;
    const isMountTypeChanged =
      initialValues.current.mountType &&
      installationData.mount_type !== initialValues.current.mountType;

    // setUnsavedChanges(
    //   isStatusChanged ||
    //     isParamsChanged ||
    //     isInstallationChanged ||
    //     isMountTypeChanged
    // );
  }, [parametersData, statusData, installationData]);
  useEffect(() => {
    const isChanged = JSON.stringify(initialValues.current.boundary) !== JSON.stringify(boundary);
    setShowSaveBoundry(isChanged);
  }, [boundary]);
  const handleSaveBoundaries = () => {
    setIsloadingBn(true);
    updateBoundary({
      elderly_id,
      data: {
        uid: device_id,
        lowLeft: `-${boundary.right * 10},-${boundary.top * 10}`,
        lowRight: `${boundary.left * 10},-${boundary.top * 10}`,
        upRight: `${boundary.left * 10},${boundary.bottom * 10}`,
        upLeft: `-${boundary.right * 10},${boundary.bottom * 10}`,
      },
    })
      .then(() => {
        setShowSaveBoundry(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        getRoomInformation();
        setIsloadingBn(false);
      });
  };
  const getRoomInformation = useCallback(() => {
    setLoading(true);

    getRoomInfo({ room_id: device_id, elderly_id: elderly_id })
      .then((res) => {
        const data = res?.data;
        setRoomInfo(data);
        const apiBoundaries = data?.device_boundaries || {};

        const parsedBoundaries = {
          left: parseBoundaryValue(Number(apiBoundaries.low_right?.split(',')[0]), 0),
          right: parseBoundaryValue(Number(apiBoundaries.low_left?.split(',')[0]), 0),
          top: parseBoundaryValue(Number(apiBoundaries.low_left?.split(',')[1]), 0),
          bottom: parseBoundaryValue(Number(apiBoundaries.up_left?.split(',')[1]), 0),
          front: parseBoundaryValue(Number(apiBoundaries.up_left?.split(',')[1]), 0),
        };

        // Helper function to parse decimeter values to meters
        function parseBoundaryValue(value, defaultValue) {
          const numericValue = Number(value);
          return !isNaN(numericValue) ? Math.abs(numericValue) / 10 : defaultValue;
        }

        setBoundary(parsedBoundaries);
        // Update state first
        const newMountType = data?.mount_type;
        const newHeight = data?.height / 10;

        // Normalize settings with defaults
        const normalizedSettings = {
          ...data?.settings,
          sit_ground_duration: data?.settings?.sit_ground_duration ?? 0,
          leave_detection_range: data?.settings?.leave_detection_range ?? '24:00-01:00',
        };

        setMountType(newMountType);
        setInstallationHeight(newHeight);
        setParametersData(normalizedSettings);
        setInstallationData({
          mount_type: newMountType,
          installation_height: newHeight,
        });
        setStatusData(data?.eventStatus);
        // Then update the initialValues ref
        initialValues.current = {
          installationHeight: newHeight,
          mountType: newMountType,
          boundary: parsedBoundaries,
          parameters: normalizedSettings,
          status: data?.eventStatus,
        };
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }, [elderly_id]);
  useEffect(() => {
    getRoomInformation();
  }, [getRoomInformation]);
  return (
    <Spin tip='Loading...' spinning={loading}>
      <div className='flex w-full flex-col'>
        <div className='flex border-b border-b-slate-200 flex-col py-4 gap-3'>
          <div className='flex flex-col items-start gap-0'>
            <h1 className='text-xl font-semibold text-primary'>Working mode</h1>
            <p className='text-base text-text-secondary'>
              Please select the working mode for different functions
            </p>
          </div>
          <Radio.Group value={roomInfo?.scene ?? null} size='large' className='flex'>
            <Radio value='1' className='custom-radio'>
              Full Function
            </Radio>
          </Radio.Group>
        </div>
        <div className='flex border-b border-b-slate-200 flex-col py-4 gap-3 bg-slate-50 px-4'>
          <div className='w-full flex items-center justify-between'>
            <div className='flex flex-col items-start gap-0'>
              <h1 className='text-xl font-semibold text-primary'>Function Parameter</h1>
              <p className='text-base text-text-secondary'>
                Enable or disable alarm, setting alarm parameters.
              </p>
            </div>
          </div>
          <Tabs
            activeKey={activeTabKey}
            onChange={handleTabChange}
            type='card'
            style={{
              marginBottom: 32,
            }}
            tabBarGutter={10}
            items={parameters}
            className='!mb-0'
          />
          {unsavedChanges && (
            <Button
              size='large'
              onClick={handleSaveParameters}
              variant='solid'
              color='default'
              icon={<AiTwotoneSave />}
              className='w-[300px] m-auto'
              loading={isloadingPr}
            >
              Save Changes
            </Button>
          )}
        </div>

        <div className='flex border-b border-b-slate-200 items-start justify-between py-4 gap-3'>
          <div className='flex flex-col gap-8 w-full'>
            <div className='w-full flex justify-between items-center gap-8'>
              <div className='flex flex-col items-start gap-0'>
                <h1 className='text-xl font-semibold text-primary'>Setting Boundaries</h1>
                <p className='text-base text-text-secondary'>
                  Walk around the wall to automatically identify boundary or manually input boundary
                </p>
              </div>
              {showSaveBoundry && (
                <Button
                  variant='solid'
                  color='default'
                  icon={<AiTwotoneSave />}
                  loading={isloadingBn}
                  size='large'
                  onClick={() => handleSaveBoundaries()}
                >
                  Save Changes
                </Button>
              )}
            </div>
            <div className='w-full flex justify-between items-center'>
              <div className='flex flex-col gap-3 items-start'>
                <div className='flex flex-col items-start w-full'>
                  <h2 className='text-lg font-semibold text-primary'>Left boundary (meters)</h2>
                  <Slider
                    marks={{
                      0: '0',
                      1: '1',
                      2: '2',
                      3: '3',
                      [boundary.left]: `${boundary.left}`,
                    }}
                    min={0}
                    max={3}
                    step={0.1}
                    value={boundary.left}
                    onChange={(value) => {
                      setBoundary((prev) => ({ ...prev, left: value }));
                    }}
                    className='min-w-[350px]'
                    disabled={initialValues.current.mountType !== installationData?.mount_type}
                  />
                </div>
                <div className='flex flex-col items-start w-full'>
                  <h2 className='text-lg font-semibold text-primary'>Right boundary (meters)</h2>
                  <Slider
                    marks={{
                      0: '0',
                      1: '1',
                      2: '2',
                      3: '3',
                      [boundary.right]: `${boundary.right}`,
                    }}
                    min={0}
                    max={3}
                    step={0.1}
                    value={boundary.right}
                    onChange={(value) => {
                      setBoundary((prev) => ({ ...prev, right: value }));
                    }}
                    disabled={initialValues.current.mountType !== installationData?.mount_type}
                    className='min-w-[350px]'
                  />
                </div>
                {mountType === 2 && (
                  <div className='flex flex-col items-start w-full'>
                    <h2 className='text-lg font-semibold text-primary'>Front boundary (meters)</h2>
                    <Slider
                      marks={{
                        0: '0',
                        1: '1',
                        2: '2',
                        3: '3',
                        4: '4',
                        [boundary.bottom]: `${boundary.bottom}`,
                      }}
                      min={0}
                      max={4}
                      step={0.1}
                      value={boundary.bottom}
                      onChange={(value) => {
                        setBoundary((prev) => ({ ...prev, bottom: value }));
                      }}
                      disabled={initialValues.current.mountType !== installationData?.mount_type}
                      className='min-w-[400px]'
                    />
                  </div>
                )}

                {mountType === 1 && (
                  <>
                    <div className='flex flex-col items-start w-full'>
                      <h2 className='text-lg font-semibold text-primary'>Up boundary (meters)</h2>
                      <Slider
                        marks={{
                          0: '0',
                          1: '1',
                          2: '2',
                          [boundary.top]: `${boundary.top}`,
                        }}
                        min={0}
                        max={2}
                        step={0.1}
                        value={boundary.top}
                        onChange={(value) => {
                          setBoundary((prev) => ({ ...prev, top: value }));
                        }}
                        disabled={initialValues.current.mountType !== installationData?.mount_type}
                        className='min-w-[250px]'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <h2 className='text-lg font-semibold text-primary'>
                        Front boundary (meters)
                      </h2>
                      <Slider
                        marks={{
                          0: '0',
                          1: '1',
                          2: '2',
                          [boundary.bottom]: `${boundary.bottom}`,
                        }}
                        min={0}
                        max={2}
                        step={0.1}
                        value={boundary.bottom}
                        onChange={(value) => {
                          setBoundary((prev) => ({ ...prev, bottom: value }));
                        }}
                        disabled={initialValues.current.mountType !== installationData?.mount_type}
                        className='min-w-[250px]'
                      />
                    </div>
                  </>
                )}
              </div>

              <div
                style={{ height: '300px', width: '400px' }}
                className='flex items-center justify-center relative'
              >
                <Tooltip
                  title={
                    <>
                      {mountType === 1 && (
                        <img
                          src={boundaryImageTop}
                          alt='sidemount'
                          style={{ height: '250px', padding: '8px' }}
                        />
                      )}
                      {mountType === 2 && (
                        <img
                          src={boundaryImageSide}
                          alt='sidemount'
                          style={{ height: '250px', padding: '8px' }}
                        />
                      )}
                    </>
                  }
                  overlayStyle={{ maxWidth: 'none' }}
                  overlayInnerStyle={{ padding: 0 }}
                  className='absolute  -top-4 left-[50%] -translate-x-[50%] cursor-pointer'
                >
                  {/* <InfoCircleOutlined
                style={{
                  color: "#1890ff",
                  marginLeft: "8px",
                  cursor: "pointer",
                }}
              /> */}
                  <BsFillInfoCircleFill size={18} className='text-secondary' />
                </Tooltip>
                <DetectionBoundaryCanvas
                  device_boundaries={{
                    low_left: `-${boundary.right * 10},-${boundary.top * 10}`,
                    low_right: `${boundary.left * 10},-${boundary.top * 10}`,
                    up_right: `${boundary.left * 10},${boundary.bottom * 10}`,
                    up_left: `-${boundary.right * 10},${boundary.bottom * 10}`,
                  }}
                  mountType={mountType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}

const Installation = ({ initialValues, currentValues, onChange }) => {
  const [mountType, setMountType] = useState(initialValues && initialValues?.mountType);
  const [installationHeight, setInstallationHeight] = useState(
    0 || (initialValues && initialValues?.installationHeight)
  );
  const [showWarningForInstallationH, setShowWarningForInstallationH] = useState(false);
  console.log(initialValues);

  const handleChange = (type, value) => {
    // Update state immediately
    if (type === 'mount') setMountType(value);
    if (type === 'height') setInstallationHeight(value);
    onChange({
      installation_height: type === 'height' ? value : installationHeight,
      mount_type: type === 'mount' ? value : mountType,
    });
    console.log(installationHeight, mountType);

    // Calculate new state values
    const newMount = type === 'mount' ? value : mountType;
    const newHeight = type === 'height' ? value : installationHeight;

    // Check against initial values
    // const isChanged =
    //   newMount !== initialValues.current.mountType ||
    //   newHeight !== initialValues.current.installationHeight;

    // setHasChanges(isChanged);

    // Height validation
    if (type === 'height') {
      const isValid = newMount === 1 ? value >= 2 && value <= 3 : value >= 1.5 && value <= 1.6;
      setShowWarningForInstallationH(!isValid);
    }
  };
  return (
    <div className='p-2 bg-white flex gap-3'>
      <div className='flex flex-col items-center py-4 gap-10 w-[40%]'>
        <div className='flex flex-col gap-8 w-full items-center'>
          <div className='flex flex-col items-start gap-0 w-full'>
            <h1 className='text-xl font-semibold text-primary'>Installation Method</h1>
            <p className='text-base text-text-secondary'>
              This radar supports side or top mounting, please choose according to the actual
              situation
            </p>
          </div>
          <Radio.Group
            value={mountType}
            size='large'
            className='flex'
            onChange={(e) => handleChange('mount', e.target.value)}
          >
            <Radio value={1} className='custom-radio'>
              Top Mounting
            </Radio>
            <Radio value={2} className='custom-radio'>
              Side Mounting
            </Radio>
          </Radio.Group>
        </div>
        {mountType === 1 && (
          <img className='w-fit' src={topemountImage} alt='topemount' style={{ height: '200px' }} />
        )}
        {mountType === 2 && (
          <img className='w-fit' src={sidemountImage} alt='sidemount' style={{ height: '200px' }} />
        )}
      </div>
      <div className='flex flex-col items-center w-[60%] py-4 gap-6'>
        <div className='flex flex-col gap-8 w-full items-center'>
          <div className='flex  items-center gap-10 w-full'>
            <div className='flex flex-col items-start gap-0 w-full'>
              <h1 className='text-xl font-semibold text-primary'>Installation Height</h1>
              <p className='text-base text-text-secondary'>
                Please set the accurate installation height of the radar, with a deviation within ±
                5cm
              </p>
            </div>
            {/* {hasChanges && (
              <Button
                variant="solid"
                color="default"
                icon={<AiTwotoneSave />}
                loading={isLoadingIns}
                size="large"
                onClick={handleSaveInstallation}
              >
                Save Changes
              </Button>
            )} */}
          </div>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-semibold text-primary'>Installation Height (m)</h2>

            <Slider
              marks={{
                0: '0',
                1: '1',
                2: '2',
                3: '3',
                [installationHeight]: `${installationHeight}`,
              }}
              min={0}
              max={3.5}
              step={0.1}
              value={installationHeight ?? 0}
              onChange={(e) => {
                // setInstallationHeight(e);
                handleChange('height', e);
                if (mountType === 1) {
                  if (e > 3 || e < 2) {
                    setShowWarningForInstallationH(true);
                  } else {
                    setShowWarningForInstallationH(false);
                  }
                } else if (mountType === 2) {
                  if (e > 1.6 || e < 1.5) {
                    setShowWarningForInstallationH(true);
                  } else {
                    setShowWarningForInstallationH(false);
                  }
                }
              }}
              className='min-w-[350px]'
            />

            {showWarningForInstallationH && (
              <Alert
                message='The height is not within the recommended range. Please install and set it according to the diagram'
                type='warning'
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        </div>
        {mountType === 1 && (
          <img
            className='w-fit'
            src={installationHeightImgTop}
            alt='sidemount'
            style={{ height: '300px' }}
          />
        )}
        {mountType === 2 && (
          <img
            className='w-fit'
            src={installationHeightImgSide}
            alt='sidemount'
            style={{ height: '300px' }}
          />
        )}
      </div>
    </div>
  );
};

const Fall = ({ initialValues, currentValues, onChange }) => {
  const handleChnages = (value) => {
    onChange({ time: Number(value.target.value / 10) });
  };
  return (
    <div className='p-2 bg-white'>
      <div
        id='hint'
        className='flex items-center gap-2 bg-Warning/10 w-fit p-1 rounded-sm px-2 my-2'
      >
        <FcIdea />
        <p className='text-sm '>
          The fall alarm has been activated, with a detection area of 4 * 6 meters
        </p>
      </div>
      <div id='item' className='py-2'>
        <div id='feild' className='flex flex-col gap-1 '>
          <h2 className='text-lg font-semibold text-primary'>Notification Time</h2>
          <Input
            type='number'
            size='large'
            defaultValue={initialValues && initialValues?.time * 10}
            // value={fallParams.time}
            onChange={handleChnages}
            min={1}
            max={150}
            className='w-fit'
            suffix='seconds'
          />
        </div>
      </div>
    </div>
  );
};
const Sleep = ({ initialValues, currentValues, status, onChange, onStatusChange }) => {
  const [showResHeartAlarmConf, setShowResHeartAlarmConf] = useState(status[3]);
  const [showWarning, setShowWarning] = useState(false);

  const [parameters, setParameters] = useState([
    {
      name: 'Normal Resp rate range',
      key: 'resp_rate',
      min: initialValues && initialValues?.lower_breath,
      max: initialValues && initialValues?.upper_breath,
    },
    {
      name: 'Normal heart rate range',
      key: 'heart_rate',
      min: initialValues && initialValues?.lower_heartbeat,
      max: initialValues && initialValues?.upper_heartbeat,
    },
  ]);
  const [abnormalAlarmParameters, setAbnormalAlarmParameters] = useState([
    {
      name: 'Detect Duration Threshold',
      key: 'detect_threshold',
      min: 0,
      max: 15,
      warnPoint: 5,
      value: initialValues && initialValues?.sudden_duration,
    },
    {
      name: 'Sensitivity',
      key: 'sensitivity',
      min: 1,
      max: 99,
      value: initialValues && initialValues?.sensitivity,
    },
  ]);
  const handleChange = (index, type, value) => {
    const newParams = [...parameters];
    newParams[index][type] = value;
    setParameters(newParams);
    const param = newParams[index];
    console.log(`Changed ${param.name}:`, {
      parameter: param.key,
      min: param.min,
      max: param.max,
    });
  };
  useEffect(() => {
    const outputData = {};
    parameters.forEach((param) => {
      if (param.key === 'resp_rate') {
        outputData.upper_breath = param.max;
        outputData.lower_breath = param.min;
      } else if (param.key === 'heart_rate') {
        outputData.upper_heartbeat = param.max;
        outputData.lower_heartbeat = param.min;
      }
    });

    abnormalAlarmParameters.forEach((param) => {
      if (param.key === 'detect_threshold') {
        outputData.sudden_duration = param.value;
      } else if (param.key === 'sensitivity') {
        outputData.sensitivity = param.value;
      }
    });
    onChange(outputData);
  }, [parameters, abnormalAlarmParameters, onChange]);
  const onSwithvhChange = (checked) => {
    setShowResHeartAlarmConf(!showResHeartAlarmConf);
    onStatusChange({ event: 3, status: !showResHeartAlarmConf });
  };
  return (
    <div className='p-2 bg-white'>
      <div id='item' className='py-2'>
        {parameters.map((param, index) => (
          <div
            id='feild'
            className='flex flex-col gap-1 '
            key={param.key}
            style={{ marginBottom: parameters.length - 1 === index ? 0 : 24 }}
          >
            <h2 className='text-lg font-semibold text-primary'>{param.name}</h2>
            <div className='flex items-center gap-2 w-fit'>
              <Input
                type='number'
                label='Min'
                value={param.min}
                onChange={(e) => handleChange(index, 'min', Number(e.target.value))}
                placeholder='Minimum'
                size='large'
                addonBefore='Min'
                min={1}

                // min={0}
                // max={param.max}
              />
              -
              <Input
                type='number'
                label='Max'
                value={param.max}
                onChange={(e) => handleChange(index, 'max', Number(e.target.value))}
                placeholder='Maximum'
                size='large'
                addonBefore='Max'
                min={2}
                // min={param.min}
                // max={500}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        id='hint'
        className='flex items-center gap-2 bg-Warning/10 w-fit p-1 rounded-sm px-2 my-2'
      >
        <FcIdea />
        <p className='text-sm '>
          Record events in sleep report when respiratory rate exceeding the normal range
        </p>
      </div>
      <div
        id='hint'
        className='flex items-center gap-2 bg-Warning/10 w-fit p-1 rounded-sm px-2 my-2'
      >
        <FcIdea />
        <p className='text-sm '>Respiratory events are datas for sleep report,not alarms</p>
      </div>
      <hr className='w-[50%] bg-slate-200 mx-auto my-8' />
      <div className='w-full '>
        <div id='item' className='py-2'>
          <div id='feild' className='flex flex-col gap-1 '>
            <div className='flex flex-col '>
              <h2 className='text-lg font-semibold text-primary'>
                Abnormal Resp & Heart Rate Alarm
              </h2>
              <span className='text-text-secondary'>
                Alarm condition: no respiratory and heart rate detected when person alone in
                monitoring bed area.
              </span>
            </div>
            <Switch
              value={showResHeartAlarmConf}
              onChange={onSwithvhChange}
              className='w-fit bg-slate-300'
            />
          </div>
          {showResHeartAlarmConf && (
            <div className='mt-4 flex gap-4 justify-between'>
              <div id='feild' className='flex flex-col gap-1 w-full'>
                <div className='flex flex-col '>
                  <h2 className='text-lg font-semibold text-primary'>Detect Duration Threshold</h2>
                  <span className='text-text-secondary'>
                    Weak warning time for vital signs, default to 10 minutes
                  </span>
                </div>
                <Input
                  type='number'
                  size='large'
                  value={abnormalAlarmParameters[0].value}
                  min={abnormalAlarmParameters[0].min}
                  max={abnormalAlarmParameters[0].max}
                  className='w-fit'
                  suffix='minute'
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    if (!isNaN(newValue)) {
                      // Check if the value is below the warnPoint (5)
                      if (newValue < abnormalAlarmParameters[0].warnPoint) {
                        setShowWarning(true);
                      } else {
                        setShowWarning(false);
                      }
                      setAbnormalAlarmParameters((prevParams) =>
                        prevParams.map((param) =>
                          param.key === 'detect_threshold' ? { ...param, value: newValue } : param
                        )
                      );
                    }
                  }}
                />
                {showWarning && (
                  <Alert
                    message='Too short detection time may cause false alarm '
                    type='warning'
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </div>
              <div id='feild' className='flex flex-col gap-1 w-full'>
                <div className='flex flex-col '>
                  <h2 className='text-lg font-semibold text-primary'>Sensitivity</h2>
                  <span className='text-text-secondary'>
                    Higher value will increase both sensitivity and false alarms
                  </span>
                </div>
                <div className='px-4'>
                  <Slider
                    marks={{
                      0: 'Low',
                      [abnormalAlarmParameters[1].value]: `${abnormalAlarmParameters[1].value}`,
                      100: 'High',
                    }}
                    value={abnormalAlarmParameters[1].value}
                    min={abnormalAlarmParameters[1].min}
                    max={abnormalAlarmParameters[1].max}
                    onChange={(value) => {
                      setAbnormalAlarmParameters((prevParams) =>
                        prevParams.map((param) =>
                          param.key === 'sensitivity' ? { ...param, value } : param
                        )
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OffBed = ({ initialValues, currentValues, onChange, status, onStatusChange }) => {
  const [showoffBedConf, setshowoffBedConf] = useState(status[6]);
  const [offBedAlarmParameters, setOffBedAlarmParameters] = useState([
    {
      name: 'Off-Bed Duration Threshold',
      key: 'offBed_threshold',
      value: initialValues && initialValues.leave_detection_time,
    },
    {
      name: 'Time Range',
      key: 'time_range',
      from:
        (initialValues.leave_detection_range &&
          initialValues.leave_detection_range.split('-')[0]) ||
        '24:00',
      to:
        (initialValues.leave_detection_range &&
          initialValues.leave_detection_range.split('-')[1]) ||
        '01:00',
    },
  ]);
  const handleChange = (index, type, value) => {
    const newParams = [...offBedAlarmParameters];
    newParams[index][type] = value;
    setOffBedAlarmParameters(newParams);
    // Log the change with parameter name
    const param = newParams[index];
    console.log(`Changed ${param.name}:`, {
      parameter: param.key,
      from: param.from,
      to: param.to,
    });
  };
  useEffect(() => {
    const outputData = {};
    offBedAlarmParameters.forEach((param) => {
      if (param.key === 'offBed_threshold') {
        outputData.leave_detection_time = param.value;
      } else if (param.key === 'time_range') {
        outputData.leave_detection_range = `${param.from}-${param.to}`;
      }
    });

    onChange(outputData);
  }, [offBedAlarmParameters, onChange]);
  const onSwitchChange = (checked) => {
    setshowoffBedConf(!showoffBedConf);
    onStatusChange({ event: 6, status: !showoffBedConf });
  };
  return (
    <div className='p-2 bg-white'>
      <div className='w-full '>
        <div id='item' className='py-2'>
          <div id='feild' className='flex flex-col gap-1 '>
            <div className='flex flex-col '>
              <h2 className='text-lg font-semibold text-primary'>Off-bed alarm</h2>
              <span className='text-text-secondary'>
                Alarm condition: user leaves the bed during the monitoring time range and not return
                after duration threshold
              </span>
            </div>
            <Switch
              value={showoffBedConf}
              onChange={onSwitchChange}
              className='w-fit bg-slate-300'
            />
          </div>
          {showoffBedConf && (
            <div className='mt-4 flex gap-4 justify-between'>
              <div id='feild' className='flex flex-col gap-1 w-full'>
                <div className='flex flex-col '>
                  <h2 className='text-lg font-semibold text-primary'>
                    {offBedAlarmParameters[0].name}
                  </h2>
                </div>
                <Input
                  type='number'
                  size='large'
                  value={offBedAlarmParameters[0].value}
                  min={offBedAlarmParameters[0].min}
                  max={offBedAlarmParameters[0].max}
                  className='w-fit'
                  suffix='minute'
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    // Update the state
                    setOffBedAlarmParameters((prevParams) =>
                      prevParams.map((param) =>
                        param.key === 'offBed_threshold' ? { ...param, value: newValue } : param
                      )
                    );
                  }}
                />
              </div>
              <div id='feild' className='flex flex-col gap-1 w-full mt-2'>
                <h2 className='text-lg font-semibold text-primary'>Time Range</h2>
                <div className='flex items-center gap-2 w-fit'>
                  <TimePicker
                    use12Hours={false}
                    format='HH:mm'
                    size='large'
                    onChange={(e, k) => {
                      handleChange(1, 'from', k);
                    }}
                    value={dayjs(offBedAlarmParameters[1].from, 'HH:mm')}
                  />
                  -
                  <TimePicker
                    use12Hours={false}
                    format='HH:mm'
                    size='large'
                    value={dayjs(offBedAlarmParameters[1].to, 'HH:mm')}
                    onChange={(e, k) => {
                      handleChange(1, 'to', k);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const SitOnGround = ({ initialValues, currentValues, onChange, status, onStatusChange }) => {
  const [showoffBedConf, setshowoffBedConf] = useState(status[9]);
  const [offBedAlarmParameters, setOffBedAlarmParameters] = useState([
    {
      name: 'Sit on ground duration',
      key: 'sit_ground_duration',
      value: (initialValues && initialValues?.sit_ground_duration) * 10 || 0,
    },
  ]);

  useEffect(() => {
    const outputData = {};
    offBedAlarmParameters.forEach((param) => {
      if (param.key === 'sit_ground_duration') {
        outputData.sit_ground_duration = param.value / 10;
      }
    });

    onChange(outputData);
  }, [offBedAlarmParameters, onChange]);
  const onSwitchChange = (checked) => {
    setshowoffBedConf(!showoffBedConf);
    onStatusChange({ event: 9, status: !showoffBedConf });
  };
  return (
    <div className='p-2 bg-white'>
      <div className='w-full '>
        <div id='item' className='py-2'>
          <div id='feild' className='flex flex-col gap-1 '>
            <div className='flex flex-col '>
              <h2 className='text-lg font-semibold text-primary'>Sit on Ground Alarm</h2>
              <span className='text-text-secondary'>Restrict:top mounted, within ±1.5m range</span>
            </div>
            <Switch
              value={showoffBedConf}
              onChange={onSwitchChange}
              className='w-fit bg-slate-300'
            />
          </div>
          {showoffBedConf && (
            <div className='mt-4 flex gap-4 justify-between'>
              <div id='feild' className='flex flex-col gap-1 w-full'>
                <div className='flex flex-col '>
                  <h2 className='text-lg font-semibold text-primary'>
                    {offBedAlarmParameters[0].name}
                  </h2>
                </div>
                <Input
                  type='number'
                  size='large'
                  value={offBedAlarmParameters[0].value}
                  min={offBedAlarmParameters[0].min}
                  max={offBedAlarmParameters[0].max}
                  className='w-fit'
                  suffix='seconds'
                  step={10}
                  onChange={(e) => {
                    const newValue = e.target.value === '' ? '' : parseInt(e.target.value, 10);

                    setOffBedAlarmParameters((prevParams) =>
                      prevParams.map((param) =>
                        param.key === 'sit_ground_duration' ? { ...param, value: newValue } : param
                      )
                    );
                  }}
                  onBlur={(e) => {
                    let newValue = parseInt(e.target.value, 10);
                    if (isNaN(newValue)) newValue = 0;

                    const roundedValue = Math.round(newValue / 10) * 10;

                    setOffBedAlarmParameters((prevParams) =>
                      prevParams.map((param) =>
                        param.key === 'sit_ground_duration'
                          ? { ...param, value: roundedValue }
                          : param
                      )
                    );
                  }}
                />
                <i className='text-gray-500 mt-1 block'>
                  *Value must be in multiples of 10 seconds (e.g., 10, 20, 30, 40…)
                </i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const Stay = ({ initialValues, currentValues, onChange, status, onStatusChange }) => {
  const [showoStayConf, setshowStayConf] = useState(status[9]);
  const [stayAlarmParameters, setStayAlarmParameters] = useState([
    {
      name: 'Stay duration threshold',
      key: 'stay_threshold',
      value: initialValues && initialValues.entry_detection_time,
    },
  ]);

  useEffect(() => {
    const outputData = {};
    stayAlarmParameters.forEach((param) => {
      if (param.key === 'stay_threshold') {
        outputData.entry_detection_time = param.value;
      }
    });

    onChange(outputData);
  }, [stayAlarmParameters, onChange]);
  const onSwitchChange = (checked) => {
    setshowStayConf(!showoStayConf);
    onStatusChange({ event: 9, status: !showoStayConf });
  };
  return (
    <div className='p-2 bg-white'>
      <div className='w-full '>
        <div
          id='hint'
          className='flex items-center gap-2 bg-Warning/10 w-fit p-1 rounded-sm px-2 my-2'
        >
          <FcIdea />
          <p className='text-sm '>Constraint: Only applicable to single person bathroom scenes.</p>
        </div>
        <div id='item' className='py-2'>
          <div id='feild' className='flex flex-col gap-1 '>
            <div className='flex flex-col '>
              <h2 className='text-lg font-semibold text-primary'>Stay alarm</h2>
              <span className='text-text-secondary'>
                Alarm condition: user enters bathroom for more than the time threshold.
              </span>
            </div>
            <Switch
              value={showoStayConf}
              onChange={onSwitchChange}
              className='w-fit bg-slate-300'
            />
          </div>
          {showoStayConf && (
            <div className='mt-4 flex gap-4 justify-between'>
              <div id='feild' className='flex flex-col gap-1 w-full'>
                <div className='flex flex-col '>
                  <h2 className='text-lg font-semibold text-primary'>
                    {stayAlarmParameters[0].name}
                  </h2>
                </div>
                <Input
                  type='number'
                  size='large'
                  value={stayAlarmParameters[0].value}
                  className='w-fit'
                  suffix='minute'
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    // Update the state
                    setStayAlarmParameters((prevParams) =>
                      prevParams.map((param) =>
                        param.key === 'stay_threshold' ? { ...param, value: newValue } : param
                      )
                    );
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const Activity = ({ status, onStatusChange }) => {
  const [activityStatus, setActivityStatus] = useState(status[4]);
  const onSwitchChange = (checked) => {
    setActivityStatus(!activityStatus);
    onStatusChange({ event: 4, status: !activityStatus });
  };
  return (
    <div className='p-2 bg-white'>
      <div className='w-full '>
        <div id='item' className='py-2'>
          <div id='feild' className='flex flex-col gap-1 '>
            <div className='flex flex-col '>
              <h2 className='text-lg font-semibold text-primary'>Inactivity alarm</h2>
              <span className='text-text-secondary'>
                Alarm condition: no in-room or out-room event for more than 24 hours
              </span>
            </div>
            <Switch
              onChange={onSwitchChange}
              value={activityStatus}
              className='w-fit bg-slate-300'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
