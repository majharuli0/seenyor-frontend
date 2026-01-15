import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Upload,
  Button,
  Input,
  List,
  Typography,
  Row,
  Col,
  Statistic,
  Form,
  Tag,
  message,
  Divider,
  Checkbox,
  Tabs,
  Badge,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  InboxOutlined,
  LeftOutlined,
  SearchOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import Papa from 'papaparse';
import Dragger from 'antd/es/upload/Dragger';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { addNewDeal, validateDevices } from '@/api/dealManage';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
const { Title } = Typography;
const PRICE_PER_DEVICE = 600;
const UID_REGEX = /^[A-Z0-9]{12}$/;

export default function NewDeal() {
  const [form] = Form.useForm();
  const [devices, setDevices] = useState([]);
  const [validDevices, setValidDevices] = useState(devices.filter((d) => !d.is_active));
  const [invalidDevices, setInvalidDevices] = useState(devices.filter((d) => d.is_active));
  const [unitPrice, setUnitPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [barcode, setBarcode] = useState('');
  const navigate = useNavigate();
  const [validationNeed, setValidationNeed] = useState(false);
  const normalizeUID = (uid) => uid.trim().toUpperCase();
  const params = useParams();
  const [totalPrice, setTotalPrice] = useState(0);
  const [validating, setValidating] = useState(false);
  const inputRef = useRef(null);
  const [creatingDeal, setCreatingDeal] = useState(false);
  const handleManualAdd = (values) => {
    const rawUid = values.uid;
    const uid = normalizeUID(rawUid);
    if (!UID_REGEX.test(uid)) {
      message.error('Invalid UID format (12 hexadecimal characters required)');
      return;
    }

    if (devices.some((d) => d.uid === uid)) {
      message.error('UID already exists!');
      return;
    }

    setDevices((prev) => [...prev, { uid, is_active: !true }]);
    form.resetFields();
  };

  useEffect(() => {
    setValidDevices(devices.filter((d) => !d.is_active));
    // setInvalidDevices(devices.filter((d) => d.is_active));
  }, [devices]);
  const handleFileUpload = (file) => {
    setLoading(true);

    const processUploadData = (data) => {
      // Step 1: Normalize and validate UIDs
      const csvEntries = data
        .flatMap((row) => {
          const rawUid = row[0]?.trim();
          return rawUid ? [normalizeUID(rawUid)] : [];
        })
        .filter((uid) => UID_REGEX.test(uid));

      // Step 2: Remove duplicates WITHIN file
      const uniqueEntries = [...new Set(csvEntries)];

      // Step 3: Check against existing devices
      const newDevices = uniqueEntries
        .filter((uid) => !devices.some((d) => d.uid === uid))
        .map((uid) => ({ uid, is_active: !true }));

      // Step 4: Handle duplicates with existing state
      const duplicateCount = uniqueEntries.length - newDevices.length;
      if (duplicateCount > 0) {
        message.warning(`Skipped ${duplicateCount} duplicate(s) already in list`);
      }

      setDevices((prev) => [...prev, ...newDevices]);

      setLoading(false);
      message.success(`Added ${newDevices.length} UIDs`);
    };

    const handleError = () => {
      setLoading(false);
      message.error('Error processing file');
    };

    // Handle CSV
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      Papa.parse(file, {
        complete: (results) => processUploadData(results.data),
        error: handleError,
      });
    }
    // Handle Excel
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.xlsx')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          processUploadData(excelData);
        } catch (error) {
          handleError();
        }
      };
      reader.onerror = handleError;
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false);
      message.error('Unsupported file format');
    }

    return false;
  };

  const uploadProps = {
    accept: '.csv, .xlsx',
    beforeUpload: handleFileUpload,
    showUploadList: false,
    disabled: loading,
    multiple: false,
  };
  const handleBarcodeScan = (e) => {
    const inputValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setBarcode(inputValue);

    if (inputValue.length === 12 && UID_REGEX.test(inputValue)) {
      if (!devices.some((d) => d.uid === inputValue)) {
        setDevices((prev) => [...prev, { uid: inputValue, is_active: false }]);
        message.success(`Added UID: ${inputValue}`);
        setBarcode('');
        // Maintain focus after successful scan
        inputRef.current?.focus();
      } else {
        message.error('UID already exists!');
        setBarcode('');
        // Keep focus and select text for easy rescan
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
  };

  // let validDevices = devices.filter((d) => !d.is_active);
  // let invalidDevices = devices.filter((d) => d.is_active);
  function hnadleValidation() {
    const uids = {
      deviceUids: validDevices.map((item) => item.uid),
    };
    setValidating(true);
    if (uids) {
      validateDevices(uids)
        .then((res) => {
          if (res?.existingDevices) {
            let ex = res?.existingDevices.map((item) => {
              return {
                uid: item,
                is_active: false,
              };
            });
            setInvalidDevices(ex);
          }
          if (res?.existingDevices) {
            let vl = res?.nonExistingDevices.map((item) => {
              return {
                uid: item,
                is_active: false,
              };
            });
            // setDevices(vl);
            setValidDevices(vl);
          }
          if (res) {
            setValidationNeed(false);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setValidating(false);
        });
    }
  }
  const handleDelete = (uidToDelete) => {
    setDevices((prev) => prev.filter(({ uid }) => uid !== uidToDelete));
    setInvalidDevices((prev) => prev.filter(({ uid }) => uid !== uidToDelete));
    message.success('Device removed');
  };
  function handleCreateDeal() {
    const quary = {
      distributor_id: params?.id,
      devices: validDevices,
      price: Number(unitPrice),
    };
    if (validationNeed) {
      hnadleValidation();
    } else {
      setCreatingDeal(true);
      addNewDeal(quary)
        .then((res) => {
          if (res) {
            toast.custom((t) => <CustomToast t={t} text={'Deal Created Succesfully!'} />);
            navigate(-1);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setCreatingDeal(false);
        });
    }
  }

  useEffect(() => {
    if (devices.length > 0) {
      setValidationNeed(true);
    } else {
      setValidationNeed(false);
    }
    setTotalPrice(validDevices.length * unitPrice);
  }, [devices]);
  useEffect(() => {
    setTotalPrice(validDevices.length * unitPrice);
  }, [unitPrice, validDevices]);
  return (
    <>
      <div className='back_button mt-4'>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          icon={<LeftOutlined />}
        >
          Back
        </Button>
      </div>
      <div className='w-full flex gap-6 mt-4'>
        {/* Left Side - Input Section */}
        <div className='w-[40%] bg-white p-6 rounded-2xl h-fit'>
          <Title level={3} className='mb-6'>
            Add Devices
          </Title>
          <Form layout='vertical'>
            <Form.Item
              label='Unit Price'
              name='price'
              rules={[{ required: true, message: 'Please enter unit price' }]}
            >
              <Input
                placeholder='Enter Unit Price'
                maxLength={12}
                allowClear
                type='number'
                size='large'
                style={{ textTransform: 'uppercase' }}
                onChange={(e) => {
                  setUnitPrice(e.target.value);
                }}
                prefix='$'
                addonBefore='USD'
              />
            </Form.Item>
          </Form>
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='File Upload' key='1'>
              <div className='h-[200px]'>
                <Dragger {...uploadProps}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined style={{ fontSize: '48px', color: '#000' }} />
                  </p>
                  <p className='ant-upload-text' style={{ fontSize: '16px' }}>
                    Click or drag CSV or XLSX file to this area to upload
                  </p>
                  <p className='ant-upload-hint' style={{ color: '#666' }}>
                    Supports single column CSV or XLSX with 12-character alphanumeric UIDs
                    <br />
                    Example: ABC123DEF456, 789GHI789JKL
                  </p>
                </Dragger>
              </div>
              <Divider orientation='center'>Or</Divider>

              <Form form={form} onFinish={handleManualAdd} layout='vertical'>
                <Form.Item
                  label='Manual UID Entry'
                  name='uid'
                  rules={[
                    { required: true, message: 'Please enter UID' },
                    {
                      pattern: UID_REGEX,
                      message: 'Must be 12-character hexadecimal (0-9, A-F)',
                    },
                  ]}
                >
                  <Input
                    placeholder='Enter 12-character UID (e.g., 3525E3DD5D9B)'
                    maxLength={12}
                    allowClear
                    size='large'
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => {
                      // Auto-format to uppercase and remove invalid characters
                      const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '');
                      form.setFieldsValue({ uid: value });
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    htmlType='submit'
                    className='w-full'
                    size='large'
                    color='default'
                    variant='solid'
                  >
                    Add Device
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>

            <Tabs.TabPane tab='Scanning' key='2'>
              <div className='min-h-[300px] flex flex-col justify-center items-center p-5 bg-gray-50'>
                <div className='w-full max-w-md relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                  <Input
                    ref={inputRef}
                    value={barcode}
                    onChange={handleBarcodeScan}
                    placeholder='Scan Device UID (12 characters)'
                    maxLength={12}
                    autoFocus
                    className='text-xl p-3 text-center tracking-wider font-mono border-2  rounded focus:ring-2 focus:ring-slate-700 focus:outline-none w-full uppercase'
                  />

                  <div className='mt-4 space-y-2'>
                    {/* Validation Messages */}
                    {barcode.length === 12 && !UID_REGEX.test(barcode) && (
                      <div className='text-red-600 text-sm'>
                        ⚠ Invalid UID format - must match {UID_REGEX.toString()}
                      </div>
                    )}

                    {barcode.length === 12 &&
                      UID_REGEX.test(barcode) &&
                      devices.some((d) => d.uid === barcode) && (
                        <div className='text-red-600 text-sm'>⚠ UID already exists in the list</div>
                      )}

                    {/* Scanning Status */}
                    {barcode.length === 0 && (
                      <div className='text-gray-500 text-sm'>
                        Scan barcode or enter 12-character UID
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Scans Preview */}
                {devices.length > 0 && (
                  <div className='mt-8 w-full max-w-md'>
                    <h3 className='text-gray-600 text-sm font-semibold mb-2'>
                      Recently Added UIDs:
                    </h3>
                    <div className='space-y-1'>
                      {devices
                        .slice(-3)
                        .reverse()
                        .map((device) => (
                          <div
                            key={device.uid}
                            className='bg-blue-50 text-blue-800 px-3 py-1 rounded text-sm font-mono'
                          >
                            {device.uid}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>

        {/* Right Side - Summary Section */}
        <div className='w-[60%] bg-white p-6 rounded-2xl'>
          <Title level={4} className='mb-6'>
            Added Devices Summary
          </Title>

          <Row gutter={16} className='mb-8 '>
            <Col span={12} className='flex items-end'>
              <Statistic
                title='Valid Devices'
                value={validDevices.length}
                suffix={`/ ${devices.length}`}
                className='statistic-card'
              />
              <Badge dot={validationNeed}>
                <Button
                  color='default'
                  variant='solid'
                  icon={<RedoOutlined />}
                  disabled={!validationNeed}
                  loading={validating}
                  className='mb-2 ml-4'
                  onClick={() => hnadleValidation()}
                >
                  Verify UIDs
                </Button>
              </Badge>
            </Col>
            <Col span={12}>
              <Statistic
                title='Total Amount'
                value={totalPrice}
                prefix='$'
                className='statistic-card'
              />
            </Col>
          </Row>

          <div className='device-list-container'>
            {invalidDevices && invalidDevices.length > 0 && (
              <div className='invalid-section mb-4'>
                <div className='w-full flex justify-between items-center mb-2'>
                  <Title level={4} type='danger'>
                    Invalid Entries
                  </Title>
                  <Button
                    onClick={() => {
                      setDevices((prev) =>
                        prev.filter(
                          (device) => !invalidDevices.some((invalid) => invalid.uid === device.uid)
                        )
                      );
                      setInvalidDevices([]); // Clear all invalid devices
                      message.success('All invalid devices cleared!');
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className='invalid-entries flex flex-wrap gap-2'>
                  {invalidDevices
                    .slice() // Create a copy of the array
                    .reverse() // Reverse the array order
                    .map(({ uid }) => (
                      <Tag
                        key={uid}
                        closable
                        onClose={() => handleDelete(uid)}
                        className='invalid-tag text-base'
                        color='red'
                      >
                        {uid}
                      </Tag>
                    ))}
                </div>
              </div>
            )}

            <List
              bordered
              dataSource={validDevices.slice().reverse()}
              className='max-h-[500px] overflow-y-auto'
              renderItem={({ uid }) => (
                <List.Item
                  actions={[
                    <Button
                      key={uid}
                      type='link'
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(uid)}
                    />,
                  ]}
                  className='text-base font-semibold'
                >
                  {uid}
                </List.Item>
              )}
            />
          </div>
          <div className='w-full flex flex-col items-center justify-center gap-6 mt-6'>
            <div className='w-full'>
              <Checkbox
                value={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className='pr-2'
              />
              By checking this box, I confirm that I am aware of the prices and have selected all
              the products accurately for distribution to this distributor
            </div>
            <Button
              htmlType='submit'
              className='w-[300px]'
              size='large'
              color='default'
              variant='solid'
              onClick={handleCreateDeal}
              loading={creatingDeal}
              disabled={!isChecked || !validDevices.length > 0 || validationNeed}
            >
              Confirm Deal
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
