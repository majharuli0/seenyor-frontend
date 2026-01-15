import React, { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Drawer,
  Empty,
  Image,
  message,
  Modal,
  Skeleton,
  Tooltip,
  Upload,
} from 'antd';
import { FaRegEdit, FaRegHeart } from 'react-icons/fa';
import { Download, Eye, UploadCloud, UploadCloudIcon } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BsDoorOpen } from 'react-icons/bs';
import { TbExclamationCircleFilled, TbTarget } from 'react-icons/tb';
import { VscDebugDisconnect, VscTarget } from 'react-icons/vsc';
import Room1 from '@/Components/RoomMap/RoomMap3';
import Room2 from '@/Components/RoomMap/RoomMap4';
import RoomMapBox from '@/Pages/Supportnursing/components/Room';
import { MdOutlineSettings } from 'react-icons/md';
import { getDeviceInfo } from '@/api/deviceReports';
import { chnageReviewStatus, getDetails, requestChnage } from '@/api/elderly';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRoomInfo } from '@/api/deviceConfiguration';
import { calculateDimensions, objectTemplates } from '@/utils/helper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';

import axios from 'axios';
import DeviceConfigurationModal from '@/Components/Modal';
import { PiGearBold } from 'react-icons/pi';
let isSubmited = false;
// --- User Header ---
function UserHeader({ data = {}, room_id, room, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const chnageStatusToApprove = useCallback(() => {
    setLoading(true);
    chnageReviewStatus({ review_status: 'completed' }, data?._id, room_id)
      .then((res) => {
        toast.success('Installation Review Approved Successfully!');
      })
      .catch((err) => {
        toast.error('Something Went Wrong Approving Installation Review!');
      })
      .finally(() => {
        setLoading(false);
        onSubmit();
      });
  }, []);

  return (
    <div className='bg-white p-6 rounded-[10px]'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-[26px] font-semibold'>{data?.name || 'N/A'}</h2>
          <p className='text-gray-500 text-base'>
            {data?.contact_code + ' ' + data?.contact_number || 'N/A'}
          </p>
        </div>
        <div className='space-x-2 space-y-2 text-end'>
          <Button
            color='green'
            icon={<FaRegHeart />}
            onClick={chnageStatusToApprove}
            variant='filled'
            disabled={room?.review_status == 'completed' || !room?.review_files}
            loading={loading}
            size='large'
            className='px-4 py-1.5 rounded-md bg-green-100 !bg-[#EAF7F1] !text-[#26AB6C] font-medium disabled:opacity-50'
          >
            {room?.review_status == 'completed' ? 'Approved' : 'Approve'}
          </Button>
          <ConfigProvider
            theme={{
              token: {
                primaryColor: '#514EB5',
                defaultActiveBg: '#514EB5',
                defaultActiveBorderColor: '#514EB5',
                defaultActiveColor: '#514EB5',
                colorPrimary: '#514EB5',
              },
            }}
          >
            <Button
              size='large'
              icon={<FaRegEdit />}
              color='primary'
              variant='solid'
              onClick={() => setOpen(true)}
              className='px-4 py-1.5 rounded-md '
            >
              Request Change
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <RequestSubmit
        open={open}
        setOpen={setOpen}
        elderly_id={data?._id}
        room_id={room_id}
        onSubmit={onSubmit}
      />
    </div>
  );
}

const downloadAllImages = async (files, zipName = 'submissions.zip') => {
  const zip = new JSZip();
  const toastId = toast.loading('Preparing download...');

  try {
    const results = await Promise.allSettled(
      files.map(async (url, idx) => {
        try {
          const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          const blob = await response.blob();

          const ext = url.split('.').pop().split(/\#|\?/)[0]; // e.g. jpg, mp4
          const safeExt = ext && ext.length < 6 ? ext : blob.type.split('/')[1] || 'file'; // derive from MIME type

          return { idx, safeExt, blob };
        } catch (error) {
          console.error(`Failed to download file at ${url}:`, error);
          throw error;
        }
      })
    );

    let successCount = 0;
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { idx, safeExt, blob } = result.value;
        zip.file(`submission_${idx + 1}.${safeExt}`, blob);
        successCount++;
      }
    });

    if (successCount === 0) {
      toast.error('Failed to download any files.', { id: toastId });
      return;
    }

    if (successCount < files.length) {
      toast(`Downloaded ${successCount} of ${files.length} files. Some files failed.`, {
        icon: '⚠️',
        id: toastId,
      });
    } else {
      toast.success('Download Successful!', { id: toastId });
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipName);
  } catch (error) {
    console.error('Error generating zip:', error);
    toast.error('An error occurred while preparing the download.', {
      id: toastId,
    });
  }
};

const downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
    console.log(response);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'image.jpg';
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error('Download failed:', err);
  }
};

// --- Submission Card ---
function SubmissionCard({ title, isActive = false, data = {}, type = 1 }) {
  const { description, file, created_at } = data;
  const BASE_URL = 'https://elderlycare2.s3.amazonaws.com/';

  const mediaFiles = [
    data?.front_image,
    data?.back_image,
    data?.left_image,
    data?.right_image,
    data?.room_view,
  ]
    .filter(Boolean)
    .map((path) => {
      // Trim any accidental leading slash
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;

      // If already a full URL (http/https), return as is
      if (/^https?:\/\//i.test(cleanPath)) {
        return cleanPath;
      }

      // Otherwise prepend base URL
      return `${BASE_URL}${cleanPath}`;
    });

  const isVideo = (url) => url.match(/\.(mp4|mov|webm)$/i);

  const [videoModal, setVideoModal] = useState({ visible: false, src: '' });

  const handleVideoClick = (src) => {
    setVideoModal({ visible: true, src });
  };

  const handleVideoClose = () => {
    setVideoModal({ visible: false, src: '' });
  };

  const getFileName = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const getFileType = (url) => {
    if (!url) return null;
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'other';
  };
  const buildFileUrl = (filePath) => {
    if (!filePath) return '';
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return /^https?:\/\//i.test(cleanPath) ? cleanPath : `${BASE_URL}${cleanPath}`;
  };

  const handleFileClick = () => {
    if (!file) return;
    const fileUrl = buildFileUrl(file);
    const type = getFileType(fileUrl);
    if (['image', 'video', 'pdf'].includes(type)) {
      window.open(fileUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = getFileName(file);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileDownload = () => {
    const fileUrl = buildFileUrl(file);
    downloadImage(fileUrl, file);
  };
  const fileName = getFileName(file);
  return (
    <div
      className='bg-white p-5 rounded-[10px] border'
      style={{ borderColor: isActive ? '#514EB5' : 'transparent' }}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <h3 className='font-medium text-[18px] text-gray-800'>{title}</h3>
          <span className='text-base text-[#8F8F8F]'>
            • {created_at ? new Date(created_at).toLocaleString() : '--'}
          </span>
        </div>
        {type == 1 && (
          <a
            className='text-base font-medium text-[#0079DD] cursor-pointer'
            onClick={() => downloadAllImages(mediaFiles)}
          >
            Download All
          </a>
        )}
      </div>

      {/* Media Preview */}
      {type == 1 && (
        <Image.PreviewGroup>
          <div className='flex space-x-3 overflow-x-auto thin-scrollbar'>
            {mediaFiles.map((src, idx) => (
              <div key={idx} className='relative group'>
                {isVideo(src) ? (
                  <div
                    className='rounded-md object-cover w-[120px] h-[90px] bg-black flex items-center justify-center cursor-pointer'
                    onClick={() => handleVideoClick(src)}
                  >
                    <span className='text-white'>▶</span>
                  </div>
                ) : (
                  <Image
                    src={src}
                    alt={`submission_${idx + 1}`}
                    className='rounded-md object-cover'
                    width={120}
                    height={90}
                  />
                )}

                {/* Download Button */}
                <button
                  onClick={() =>
                    downloadImage(
                      src,
                      isVideo(src) ? `submission_${idx + 1}.mp4` : `submission_${idx + 1}.jpg`
                    )
                  }
                  className='absolute top-1 right-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition'
                >
                  <Download />
                </button>
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      )}

      {/* Video Modal */}
      {type == 1 && (
        <Modal
          open={videoModal.visible}
          onCancel={handleVideoClose}
          footer={null}
          centered
          width={600}
          className='video-modal'
        >
          <video
            key={videoModal.src} // force reload when src changes
            controls
            autoPlay
            className='w-full h-auto max-h-[90vh] max-w-[90vw] rounded-md'
          >
            <source src={videoModal.src} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </Modal>
      )}
      {description && (
        <div
          className='text-gray-700 text-sm'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description.replace(/\n/g, '<br/>')),
          }}
        />
      )}

      {file && (
        <div className='mt-4 flex items-center justify-between gap-2 p-2 bg-gray-100 rounded cursor-pointer max-w-[355px]'>
          <div>
            <FileTextOutlined className='text-xl text-gray-600' />
            <span className='text-gray-800' title={fileName}>
              {fileName.length > 30 ? fileName.slice(0, 30) + '…' : fileName}
            </span>
          </div>
          <div className='flex gap-2'>
            <div onClick={handleFileClick}>
              <Eye className='ml-auto text-gray-500 hover:text-blue-500' />
            </div>
            <Download
              onClick={handleFileDownload}
              className='ml-auto text-gray-500 hover:text-[#FF6633] '
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Request Card ---
function RequestCard({ data = {} }) {
  const { title, description, file, created_at } = data;
  const getFileName = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const getFileType = (url) => {
    if (!url) return null;
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'other';
  };

  const handleFileClick = () => {
    if (!file) return;
    const fileUrl = file.startsWith('http')
      ? file
      : `https://elderlycare2.s3.amazonaws.com/${file}`;

    const type = getFileType(file);
    if (['image', 'video', 'pdf'].includes(type)) {
      // open in new tab for previewable files
      window.open(fileUrl, '_blank');
    } else {
      // trigger download for others
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = getFileName(file);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const handleFileDownload = () => {
    const fileUrl = file.startsWith('http')
      ? file
      : `https://elderlycare2.s3.amazonaws.com/${file}`;
    downloadImage(fileUrl, file);
  };

  const fileName = getFileName(file);
  return (
    <div className='bg-white p-4 rounded-xl shadow-sm'>
      <div className='flex items-center gap-2 mb-3'>
        <h3 className='font-medium text-[18px] text-gray-800'>Request</h3>
        <span className='text-base text-[#8F8F8F]'>• {new Date(created_at).toLocaleString()}</span>
      </div>

      {description && (
        <div
          className='ql-editor !min-h-fit'
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
        />
      )}

      {file && (
        <div className='mt-4 flex items-center justify-between gap-2 p-2 bg-gray-100 rounded cursor-pointer max-w-[355px]'>
          <div>
            <FileTextOutlined className='text-xl text-gray-600' />
            <span className='text-gray-800' title={fileName}>
              {fileName.length > 30 ? fileName.slice(0, 30) + '…' : fileName}
            </span>
          </div>
          <div className='flex gap-2'>
            <div onClick={handleFileClick}>
              <Eye className='ml-auto text-gray-500 hover:text-blue-500' />
            </div>
            <Download
              onClick={handleFileDownload}
              className='ml-auto text-gray-500 hover:text-[#FF6633] '
            />
          </div>
        </div>
      )}
    </div>
  );
}
// --- Installation Info ---
function InstallationInfo({ data = {}, roomInfo = {} }) {
  const roomType = {
    1: 'Livingroom',
    2: 'Bedroom',
    3: 'Bathroom',
    4: 'Otherroom',
  };

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm relative'>
      {roomInfo?.is_device_bind ? (
        <div className='flex items-center gap-2 absolute top-4 right-4'>
          <span className='relative flex size-3'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[#26AB6C]/60 opacity-75'></span>
            <span className='relative inline-flex size-3 rounded-full bg-[#26AB6C]'></span>
          </span>
          <h2 className='text-sm font-medium text-[#26AB6C]'>Online</h2>
        </div>
      ) : (
        <div className='flex items-center gap-2 absolute top-4 right-4'>
          <span className='relative flex size-3'>
            {/* no ping for offline */}
            <span className='relative inline-flex size-3 rounded-full bg-gray-400'></span>
          </span>
          <h2 className='text-sm font-medium text-gray-500'>Offline</h2>
        </div>
      )}

      <div className='flex items-start mb-[22px] flex-col'>
        <h3 className='font-medium text-[18px]'>Installation Info</h3>
        <h3 className='font-medium text-sm text-[#656161]'>
          {' '}
          Installed on{' '}
          {roomInfo?.review_files?.created_at
            ? new Date(roomInfo?.review_files?.created_at).toLocaleString()
            : '--'}
        </h3>
      </div>
      <div className='flex items-center gap-2 w-full mb-[14px] flex-wrap lg2:flex-nowrap'>
        <div className='bg-[#9333EA]/10 w-full rounded-sm p-3 flex items-center gap-2'>
          <div className='p-[10px] bg-[#9333EA] text-[20px] rounded-full text-white'>
            <BsDoorOpen />
          </div>
          <div>
            <h1 className='text-[18px] font-medium leading-none'>{roomInfo?.name || 'N/A'}</h1>
            <span className='text-[12px] text-[#7B7B7B] '>
              {roomType[roomInfo?.room_type] ? roomType[roomInfo?.room_type] + ' Type' : 'N/A'}
            </span>
          </div>
        </div>
        <div className='bg-[#FF6633]/10 w-full rounded-sm p-3 flex items-center gap-2'>
          <div className='p-[10px] bg-[#FF6633] text-[20px] rounded-full text-white'>
            <VscTarget />
          </div>
          <div>
            <h1 className='text-[18px] font-medium leading-none'>{roomInfo?.device_no || 'N/A'}</h1>
            <span className='text-[12px] text-[#7B7B7B]'>Device UID</span>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center w-full flex-wrap bg-[#EEEEF8] p-3 py-4 rounded-sm'>
        <p className='text-[12px] text-[#514EB5]'>MCU Version: {data?.app_compile_time || '--'}</p>
        <p className='text-[12px] text-[#514EB5]'>
          Radar Version: {data?.radar_compile_time || '--'}
        </p>
      </div>
    </div>
  );
}

// --- Configuration ---
function Configuration({ data = {}, roomData = {}, elderly_id, room_id }) {
  const [boundary, setBoundary] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const [visible, setVisible] = useState(false);
  const [openOfflineModal, setOpenOfflineModal] = useState(false);
  const roomObjects = objectTemplates[roomData?.room_type];
  function parseTilt(accelStr) {
    const [x, y] = accelStr.split(':').map(Number);

    const tiltRight = Math.abs(x).toFixed(1);
    const tiltDown = Math.abs(y).toFixed(1);

    const tiltRightDir = x < 0 ? 'Right' : 'Left';
    const tiltDownDir = y < 0 ? 'Up' : 'Down';

    return `Tilt ${tiltRightDir} ${tiltRight}° Tilt ${tiltDownDir} ${tiltDown}°`;
  }
  const installation_height = Number(data?.radar_install_height);

  useEffect(() => {
    const apiBoundaries = roomData?.device_boundaries || {};
    const parsedBoundaries = {
      left: parseBoundaryValue(Number(apiBoundaries?.low_right?.split(',')[0]), 0),
      right: parseBoundaryValue(Number(apiBoundaries?.low_left?.split(',')[0]), 0),
      top: parseBoundaryValue(Number(apiBoundaries?.low_left?.split(',')[1]), 0),
      bottom: parseBoundaryValue(Number(apiBoundaries?.up_left?.split(',')[1]), 0),
      front: parseBoundaryValue(Number(apiBoundaries?.up_left?.split(',')[1]), 0),
    };

    function parseBoundaryValue(value, defaultValue) {
      const numericValue = Number(value);
      return !isNaN(numericValue) ? Math.abs(numericValue) / 10 : defaultValue;
    }
    setBoundary(parsedBoundaries);
  }, [roomData]);

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm'>
      <div className='flex items-center justify-between  mb-3'>
        <h3 className='font-medium  text-[18px]'>Configuration</h3>

        <Tooltip title='Settings'>
          <Button
            shape='circle'
            variant='ghost'
            onClick={() => {
              if (roomData?.is_device_bind) {
                setVisible(true);
              } else {
                setOpenOfflineModal(true);
              }
            }}
          >
            <PiGearBold size={16} className='text-[#5E5E5E] hover:text-primary' />
          </Button>
        </Tooltip>
      </div>
      {/* Config Diagram Placeholder */}
      <div className='bg-white rounded-md  mb-4 h- flex items-center justify-center text-gray-400 text-sm'>
        <div className='flex items-center justify-center gap-4 h-full w-full border border-gray-200 rounded-lg overflow-hidden relative'>
          {roomData?.mount_type === 2 && <Room2 roomInfo={roomData} />}
          {roomData?.mount_type === 1 && <Room1 roomInfo={roomData} />}
        </div>
      </div>

      <div className='flex flex-col text-sm bg-[#514EB5]/10 text-[#514EB5] rounded-sm font-medium'>
        <p className='p-3 border-b border-b-[#514EB5]/20 flex justify-between'>
          <span className='font-medium'>Mount Type:</span>
          <span className='font-medium'>
            {' '}
            {roomData?.mount_type ? (roomData?.mount_type == 2 ? 'Wall' : 'Ceilling') : '--'}
          </span>
        </p>
        <p className='p-3 border-b border-b-[#514EB5]/20 flex justify-between'>
          <span className='font-medium'>Tilt Angle:</span>
          <span className='font-medium'>{data?.accelera ? parseTilt(data?.accelera) : '--'}</span>
        </p>
        <p className='p-3 border-b border-b-[#514EB5]/20 flex justify-between'>
          <span className='font-medium'>RSSI:</span>
          <span className='font-medium'>{data?.signal_intensity || '--'}</span>
        </p>
        <p className='p-3 border-b border-b-[#514EB5]/20 flex justify-between'>
          <span className='font-medium'>Installation Height:</span>
          <span className='font-medium'>
            {installation_height ? installation_height * 10 + 'cm' : '--'}
          </span>
        </p>
        <p className='p-3 border-b border-b-[#514EB5]/20 flex justify-between'>
          <span className='font-medium'>Installation Area:</span>
          <span className='font-medium'>{`L:${boundary?.left * 100}  R:${boundary?.right * 100} ${
            roomData?.mount_type == 1 ? `T:${boundary?.top * 100}  ` : ''
          }  F:${boundary?.bottom * 100}`}</span>
        </p>
        <p className='p-3 flex justify-between'>
          <span className='font-medium'>Installation Object:</span>

          <ul className='list-disc list-inside ml-2'>
            {(roomData?.device_areas?.length > 0 &&
              roomData?.device_areas?.map((item, indx) => {
                let match = roomObjects?.find((obj) => {
                  if (obj?.object_type == (item?.object_type || item?.type)) {
                    return obj;
                  } else if (obj?.type == item?.type) {
                    console.log(obj);
                    return obj;
                  }
                });
                const WH = calculateDimensions(item);
                if (!match) {
                  match = roomObjects?.find((obj) => obj.type === item.type);
                }
                const label = match?.label || `Other`;
                const dims = WH.width && WH.length ? `${WH.width}x${WH.length || 0}cm` : '0x0cm';

                return (
                  <li key={indx}>
                    {label} {dims && `- ${dims}`}
                  </li>
                );
              })) ||
              '--'}
          </ul>
        </p>
      </div>
      <DeviceConfigurationModal
        isvisible={visible}
        setVisible={setVisible}
        elderly_id={elderly_id}
        device_id={roomData?.device_no}
        room_id={elderly_id}
      />
      <DeviceOfflineModal isvisible={openOfflineModal} setVisible={setOpenOfflineModal} />
    </div>
  );
}
const DeviceOfflineModal = ({ isvisible = false, setVisible }) => {
  function onClose() {
    setVisible(false);
  }
  return (
    <>
      <Modal
        centered
        open={isvisible}
        onCancel={onClose}
        onOk={onClose}
        className='device-offline-modal '
        title={
          <div className='flex items-center gap-2 p-6'>
            <TbExclamationCircleFilled className='text-yellow-500' />
            <span>Offline Device</span>
          </div>
        }
        footer={
          <div className='p-6'>
            <Button onClick={() => setVisible(false)}>Ok</Button>
          </div>
        }
        okText='OK'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className='px-4'>
          <p>This device is currently offline. You cannot make any changes now.</p>
        </div>
      </Modal>
    </>
  );
};
const RequestSubmit = ({ open, setOpen, elderly_id, room_id, onSubmit }) => {
  const [drawerWidth, setDrawerWidth] = useState(500);
  const [editorContent, setEditorContent] = useState('');
  const [attachmentRequired, setAttachmentRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadedKeys, setUploadedKeys] = useState([]);
  const baseApi = import.meta.env.VITE_APP_BASE_API_V1 + '/api/v1';
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setDrawerWidth(width * 0.9);
      else if (width < 1200) setDrawerWidth(800);
      else setDrawerWidth(1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRemove = (file) => {
    console.log(uploadedKeys);

    setUploadedKeys([]);
    setFileList([]);
  };
  const sendRequest = useCallback(() => {
    const payload = {
      title: 'Change Request',
      description: editorContent,
      file: uploadedKeys[0],
      type: 'changed_request',
      file_required: attachmentRequired || false,
    };
    requestChnage(payload, elderly_id, room_id)
      .then((res) => {
        toast.success(res?.message);
        setEditorContent('');
        setUploadedKeys([]);
        setFileList([]);
        setAttachmentRequired(false);
        setOpen(false);
        onSubmit();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [elderly_id, room_id, uploadedKeys, attachmentRequired, editorContent]);
  return (
    <Drawer
      title={
        <div className='flex justify-between items-center w-full'>
          <span>Request Change</span>
          <ConfigProvider
            theme={{
              token: {
                primaryColor: '#514EB5',
                defaultActiveBg: '#514EB5',
                defaultActiveBorderColor: '#514EB5',
                defaultActiveColor: '#514EB5',
                colorPrimary: '#514EB5',
              },
            }}
          >
            <Button
              type='primary'
              disabled={!(editorContent?.length >= 15) || !uploadedKeys || loading}
              onClick={() => sendRequest()}
              loading={loading}
            >
              Send Request
            </Button>
          </ConfigProvider>
        </div>
      }
      placement='right'
      closable={true}
      onClose={closeDrawer}
      open={open}
      width={drawerWidth}
    >
      {/* QuillJS editor */}
      <div className='mb-4'>
        <ReactQuill
          theme='snow'
          value={editorContent}
          onChange={setEditorContent}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
            ],
          }}
          placeholder='Write your request here...'
          style={{ height: '100%' }}
        />
      </div>

      {/* File / Image attachment */}
      <div className='mb-4'>
        <Upload
          fileList={fileList}
          onRemove={handleRemove}
          beforeUpload={async (file) => {
            // if (
            //   !file.type.startsWith("image/") &&
            //   !file.type.startsWith("video/") &&
            //   ![
            //     "application/pdf",
            //     "application/msword",
            //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            //   ].includes(file.type)
            // ) {
            //   message.error("Only image, video, or document allowed!");
            //   return Upload.LIST_IGNORE;
            // }

            setFileList([file]);
            file.status = 'uploading';

            let endpoint = file.type.startsWith('video/') ? '/users/video' : '/users/image';
            const formData = new FormData();
            formData.append('file', file);

            try {
              setLoading(true);
              const res = await axios.post(baseApi + endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              if (res.data.statusCode === 200) {
                message.success(res.data.message);
                setUploadedKeys([res.data.data.key]);
                file.status = 'done';
              } else {
                message.error('Upload failed');
                file.status = 'error';
              }
            } catch (err) {
              console.error(err);
              message.error('Upload error');
              file.status = 'error';
            } finally {
              setLoading(false);
            }

            return Upload.LIST_IGNORE;
          }}
          maxCount={1}
        >
          <Button icon={<UploadCloudIcon />}>Attach File/Image</Button>
        </Upload>
      </div>

      {/* Attachment required checkbox */}
      <Checkbox
        checked={attachmentRequired}
        onChange={(e) => setAttachmentRequired(e.target.checked)}
      >
        Attachment Required
      </Checkbox>
    </Drawer>
  );
};

// --- MAIN PAGE ---

export default function ReviewDetails() {
  const params = useParams();

  const [deviceInfo, setDeviceInfo] = useState();
  const [deviceUID, setDeviceUID] = useState('');
  const [elderlyDetail, setElderlyDetail] = useState({});
  const [room, setRoom] = useState({});
  const [roomInfo, setRoomInfo] = useState({});
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [loadingElderly, setLoadingElderly] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [loadingRoomInfo, setLoadingRoomInfo] = useState(false);

  const fetchElderlyAndRoom = useCallback(async () => {
    setLoadingElderly(true);
    try {
      const res = await getDetails({ id: params.elderly_id });
      const room = res?.data?.rooms?.find((item) => item?._id === params.room_id);
      setElderlyDetail(res?.data);
      setRoom(room);
      setDeviceUID(room?.device_no || '');
    } catch (err) {
      console.error('Error fetching elderly details', err);
    } finally {
      setLoadingElderly(false);
    }
  }, [params.elderly_id, params.room_id]);

  const fetchDeviceInfo = useCallback(async () => {
    if (!deviceUID) return;
    setLoadingDevice(true);
    try {
      const res = await getDeviceInfo(deviceUID);
      setDeviceInfo(res?.data);
    } catch (err) {
      console.error('Error fetching device info', err);
    } finally {
      setLoadingDevice(false);
    }
  }, [deviceUID]);

  const fetchRoomInfo = useCallback(async () => {
    if (!deviceUID) return;
    setLoadingRoomInfo(true);
    try {
      const res = await getRoomInfo({
        elderly_id: params.elderly_id,
        room_id: deviceUID,
      });
      setRoomInfo(res?.data);
    } catch (err) {
      console.error('Error fetching room info', err);
    } finally {
      setLoadingRoomInfo(false);
    }
  }, [deviceUID, params.elderly_id]);

  useEffect(() => {
    fetchElderlyAndRoom().finally(() => setInitialLoaded(true));
  }, [fetchElderlyAndRoom]);

  useEffect(() => {
    if (!deviceUID) return;
    Promise.all([fetchDeviceInfo(), fetchRoomInfo()]);
  }, [deviceUID, fetchDeviceInfo, fetchRoomInfo]);

  const loadingRight = loadingDevice || loadingRoomInfo;

  const noDeviceReady = initialLoaded && !deviceUID && !loadingRight;
  const showRightContent = deviceUID && !loadingRight;
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins',
          colorPrimary: '#001529',
          colorLinkActive: '#001529',
          colorLinkHover: '#001529',
          colorLink: '#001529',
        },
      }}
    >
      <div className='p-6 bg-[#F4F4F4] h-[calc(100svh-100px)] overflow-y-auto font-poppins pb-12'>
        <div className='grid grid-cols-12 gap-6'>
          {/* LEFT (65%) */}
          <div className='col-span-8 space-y-6'>
            <Skeleton loading={loadingElderly} active>
              <UserHeader
                data={elderlyDetail}
                room_id={params.room_id}
                room={room}
                onSubmit={fetchElderlyAndRoom}
              />
            </Skeleton>

            <Skeleton loading={loadingElderly || loadingRoomInfo} active>
              <div className='flex flex-col gap-6'>
                {room?.review_log?.length > 0 &&
                  [...room.review_log]
                    .reverse()
                    .map((item, indx) =>
                      item?.type === 'changed_request' ? (
                        <RequestCard key={indx} data={item} />
                      ) : (
                        <SubmissionCard key={indx} title='Submission' type={2} data={item} />
                      )
                    )}
                {roomInfo?.review_files && (
                  <SubmissionCard title='Submission' data={roomInfo?.review_files} />
                )}
                {!roomInfo?.review_files && room?.review_log?.length === 0 && (
                  <Empty
                    className='mt-24'
                    description='Looks like there are no submission or review change logs yet.'
                  />
                )}
              </div>
            </Skeleton>
          </div>

          {/* RIGHT (35%) */}
          <div className='col-span-4 space-y-6'>
            {noDeviceReady && (
              <div className='bg-white w-full h-fit p-6 min-h-[136px] rounded-lg py-12 flex gap-2 text-red-500 items-center flex-col justify-center'>
                <VscDebugDisconnect size={50} className='text-red-500 mb-3' />
                <span>No devices are currently associated with this room.</span>
              </div>
            )}
            {deviceUID && loadingRight && (
              <div className='space-y-6'>
                <Skeleton active />
                <Skeleton active />
              </div>
            )}
            {showRightContent && (
              <>
                <InstallationInfo data={deviceInfo} roomInfo={roomInfo} />
                <Configuration
                  data={deviceInfo}
                  roomData={roomInfo}
                  elderly_id={params.elderly_id}
                  room_id={params.room_id}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
