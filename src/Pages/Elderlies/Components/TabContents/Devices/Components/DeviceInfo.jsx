import { addEnvironmentImages, getEnvironmentImages } from '@/api/elderly';
import { Button, Form, Input, Select, DatePicker, Radio, Image, Upload } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function DeviceInfo({ elderly_id, room_id }) {
  const { TextArea } = Input;
  const [environmentInfo, setEnvironmentInfo] = useState({
    deviceName: 'Reaz',
    location: 'other',
    photos: [],
    videos: [],
    note: 'This is simple note',
  });
  const [userInfo, setUserInfo] = useState({
    name: 'Reaz',
    birthDate: '2000-01-01',
    checkIn: null,
    gender: 'male',
    medication: '1',
    diagnosis: null,
    aid: null,
    galt: null,
    metalStatus: null,
  });
  const [zoneInfo, setZoneInfo] = useState({
    region: 'Asia/Dhaka',
    ip: '0.0.0.0',
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [envImages, setEnvImages] = useState([]);
  const uploadImage = useCallback(() => {
    addEnvironmentImages({
      elderly_id,
      room_id,
      file: fileList[0]?.originFileObj,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  }, []);
  const getImages = useCallback(() => {
    getEnvironmentImages({
      elderly_id,
      room_id,
    })
      .then((res) => {
        setEnvImages(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  }, []);
  useEffect(() => {
    getImages();
  }, [getImages]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // uploadImage();
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type='button'
      className='flex flex-col items-center justify-center'
    >
      <FaPlus />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-col py-4 gap-3'>
        <div className='flex flex-col items-start gap-0'>
          <h1 className='text-xl font-semibold text-primary'>Environment Information</h1>

          <p className='text-base text-text-secondary'>Attached files:</p>
          <div className='w-full flex flex-wrap justify-start gap-2 mt-4'>
            {envImages.map((image, idx) => {
              return <Image key={idx} width={200} src={image.url} />;
            })}
            <Image
              width={200}
              src='https://sb.kaleidousercontent.com/67418/1920x1100/2ed9107761/bg.png'
            />

            <Image
              width={200}
              preview={{
                destroyOnClose: true,
                imageRender: () => (
                  <video
                    muted
                    width='100%'
                    controls
                    src='https://sb.kaleidousercontent.com/67418/1920x1100/2ed9107761/bg.png'
                  />
                ),
                toolbarRender: () => null,
              }}
              src='https://sb.kaleidousercontent.com/67418/1920x1100/2ed9107761/bg.png'
            />
          </div>

          <Upload
            action={`https://backend.elderlycareplatform.com/api/v1/elderly/upload-object/${elderly_id}/${room_id}`}
            listType='picture-card'
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            className='p-4'
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: 'none',
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </div>
      </div>
      {/* <div className="flex border-b border-b-slate-200 flex-col py-4 gap-3">
        <div className="flex flex-col items-start gap-0">
          <h1 className="text-xl font-semibold text-primary">
            Environment Information
          </h1>
          <p className="text-base text-text-secondary">
            Please input installation information to facilitate remote
            troubleshooting
          </p>
        </div>
        <div>
          <Form
            name="env-info"
            // layout="vertical"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 8,
            }}
          >
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Device Name
                </span>
              }
              name="device"
              className=""
            >
              <Input size="large" defaultValue={environmentInfo.deviceName} />
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Location
                </span>
              }
              name="location"
              className=""
            >
              <Select size="large" defaultValue={environmentInfo.location}>
                <Select.Option value="bedRoom">Bedroom</Select.Option>
                <Select.Option value="bathRoom">Bathroom</Select.Option>
                <Select.Option value="livingRoom">Living Room</Select.Option>
                <Select.Option value="other">Others</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Notes
                </span>
              }
              name="notes"
              className=""
            >
              <TextArea size="large" rows={4} />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="flex border-b border-b-slate-200 flex-col py-4 gap-3">
        <div className="flex flex-col items-start gap-0">
          <h1 className="text-xl font-semibold text-primary">
            User information
          </h1>
          <p className="text-base text-text-secondary">
            Fill the user information to use the dashboard correctly.
          </p>
        </div>
        <div>
          <Form
            name="user-info"
            // layout="vertical"
            labelCol={{
              span: 3,
            }}
            wrapperCol={{
              span: 8,
            }}
          >
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Name
                </span>
              }
              name="name"
              className=""
            >
              <Input size="large" defaultValue={userInfo.name} />
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Date of Birth
                </span>
              }
              name="birthDate"
              className=""
            >
              <DatePicker
                defaultValue={dayjs(userInfo.birthDate, "YYYY-MM-DD")}
                size="large"
                showToday={false}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Date of Birth
                </span>
              }
              name="gender"
              className=""
            >
              <Radio.Group defaultValue={userInfo.gender}>
                <Radio value="male"> Male </Radio>
                <Radio value="female"> Female </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Regular Medication
                </span>
              }
              name="medication"
              className=""
            >
              <Select
                size="large"
                defaultValue={userInfo.medication}
                placeholder="Please Select"
              >
                <Select.Option value="1">Yes</Select.Option>
                <Select.Option value="0">No</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Secondary Diagnosis
                </span>
              }
              name="diagnosis"
              className=""
            >
              <Select
                size="large"
                defaultValue={userInfo.diagnosis}
                placeholder="Please Select"
              >
                <Select.Option value="1">Yes</Select.Option>
                <Select.Option value="0">No</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Ambulatory Aid
                </span>
              }
              name="aid"
              className=""
            >
              <Select
                size="large"
                defaultValue={userInfo.aid}
                placeholder="Please Select"
              >
                <Select.Option value="1">
                  None/Bed rest/Nurse Assist
                </Select.Option>
                <Select.Option value="2">Crutches/Cane/Walker</Select.Option>
                <Select.Option value="3">Furniture</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Gait
                </span>
              }
              name="galt"
              className=""
            >
              <Select
                size="large"
                defaultValue={userInfo.galt}
                placeholder="Please Select"
              >
                <Select.Option value="1">
                  Normal/Bed Rest/Wheelchair
                </Select.Option>
                <Select.Option value="2">Weak</Select.Option>
                <Select.Option value="3">Empaired</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-sm font-medium text-secondary leading-0">
                  Mental Status
                </span>
              }
              name="mental"
              className=""
            >
              <Select
                size="large"
                defaultValue={userInfo.metalStatus}
                placeholder="Please Select"
              >
                <Select.Option value="1">Normal</Select.Option>
                <Select.Option value="1">Abnormal</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="flex border-b border-b-slate-200 flex-col py-4 gap-3">
        <div className="flex flex-col items-start gap-0">
          <h1 className="text-xl font-semibold text-primary">
            Environment Information
          </h1>
        </div>
        <div>
          <ul className="flex flex-col gap-4 mt-4">
            <li className="text-base text-primary">
              <p>
                <strong className="pr-2">Region:</strong> {zoneInfo.region}
              </p>
            </li>
            <li className="text-base text-primary">
              <p>
                <strong className="pr-2">IP:</strong> {zoneInfo.ip}
              </p>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
}
