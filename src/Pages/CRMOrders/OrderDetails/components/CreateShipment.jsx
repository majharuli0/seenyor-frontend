import React, { useState } from 'react';
import { Tabs, Form, Input, Select, Button, Row, Col, ConfigProvider, Radio, List } from 'antd';
import { Search, Trash2, PlusCircle } from 'lucide-react';

// --- Sub-components for each step ---

const SenderInfoForm = ({ onNext }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        savedSender: 'Seenyor HQ',
        name: 'Seenyor HQ',
        companyName: 'Seenyor PTY LTD',
        email: 'Info@seenyor.com',
        phone: '+12 5486 68768 323',
        streetAddress: '47 W 13th St',
        postCode: '26984',
        city: 'LA',
        country: 'USA',
      }}
      className='mt-4'
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label='Saved Sender' name='savedSender'>
            <Select>
              <Select.Option value='Seenyor HQ'>Seenyor HQ</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} className='flex items-end pb-[24px]'>
          <Button className='w-full bg-gray-50 border-none text-[#1B2559] font-medium h-[38px]'>
            Add New Sender
          </Button>
        </Col>
        <Col span={12}>
          <Form.Item label='Name' name='name'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Company Name' name='companyName'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Email' name='email'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Phone' name='phone'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Street Address' name='streetAddress'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Post Code' name='postCode'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='City' name='city'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Country' name='country'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
      </Row>
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          className='bg-gray-200 border-none text-gray-600 px-8 h-10 font-medium'
          onClick={() => form.resetFields()}
        >
          Clear Form
        </Button>
        <Button type='primary' className='bg-[#514EB5] px-8 h-10 font-medium' onClick={onNext}>
          Next
        </Button>
      </div>
    </Form>
  );
};

const ReceiverInfoForm = ({ onNext }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        customerId: '#2156845654',
        customerName: 'David Jonson',
        email: 'davidjonson@gmail.com',
        phone: '+12 5486 68768 323',
        streetAddress: '47 W 13th St',
        postCode: '26984',
        city: 'LA',
        country: 'USA',
      }}
      className='mt-4'
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label='Customer ID' name='customerId'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Customer Name' name='customerName'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Email' name='email'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Phone' name='phone'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Street Address' name='streetAddress'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Post Code' name='postCode'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='City' name='city'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Country' name='country'>
            <Input className='bg-gray-50 border-none py-2' />
          </Form.Item>
        </Col>
      </Row>
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          className='bg-gray-200 border-none text-gray-600 px-8 h-10 font-medium'
          onClick={() => form.resetFields()}
        >
          Clear Form
        </Button>
        <Button type='primary' className='bg-[#514EB5] px-8 h-10 font-medium' onClick={onNext}>
          Next
        </Button>
      </div>
    </Form>
  );
};

const ItemsForm = ({ onNext }) => {
  const [form] = Form.useForm();
  // Initial pool of all items
  const [allItems] = useState([
    { id: '5812DFG64FG6F6G2', name: 'AI Sensor' },
    { id: 'B456DFG64FG6F6G4', name: 'AI Sensor' },
    { id: 'S123DFG64FG6F6G1', name: 'AI Sensor' },
    { id: 'A123DFG64FG6F6G3', name: 'AI Speaker' },
    { id: 'C789DFG64FG6F6G5', name: 'AI Speaker' },
    { id: 'D012DFG64FG6F6G6', name: 'AI Speaker' },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [itemType, setItemType] = useState('AI Sensor');

  // Available items are those in allItems matching type and filter, AND NOT in selectedItems
  const availableItems = allItems.filter(
    (item) =>
      item.name === itemType &&
      item.id.toLowerCase().includes(filter.toLowerCase()) &&
      !selectedItems.find((selected) => selected.id === item.id)
  );

  const handleAdd = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleDelete = (id) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const selectedSensors = selectedItems.filter((item) => item.name === 'AI Sensor');
  const selectedSpeakers = selectedItems.filter((item) => item.name === 'AI Speaker');

  return (
    <div className='mt-4'>
      <Row gutter={24}>
        <Col span={12}>
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label='Select Item'>
                  <Select value={itemType} onChange={setItemType}>
                    <Select.Option value='AI Sensor'>AI Sensor</Select.Option>
                    <Select.Option value='AI Speaker'>AI Speaker</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Order ID'>
                  <Input defaultValue='#2156845654' className='bg-gray-50 border-none' readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label='Search UId'>
              <Input
                prefix={<Search size={16} />}
                placeholder='Search UId'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className='bg-gray-50 border-none'
              />
            </Form.Item>
            <div className='flex flex-col gap-2 h-[300px] overflow-y-auto'>
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between items-center bg-indigo-50 p-3 rounded-md'
                >
                  <span className='text-[#514EB5] font-medium'>{item.id}</span>
                  <PlusCircle
                    size={18}
                    className='text-[#514EB5] cursor-pointer'
                    onClick={() => handleAdd(item)}
                  />
                </div>
              ))}
              {availableItems.length === 0 && (
                <div className='text-gray-400 text-center py-4'>No available items</div>
              )}
            </div>
          </Form>
        </Col>
        <Col span={12}>
          <h3 className='text-gray-500 mb-4'>Selected Items</h3>

          {/* AI Sensor Section */}
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-600 mb-2'>AI Sensor</h4>
            <div className='flex flex-col gap-2'>
              {selectedSensors.length > 0 ? (
                selectedSensors.map((item) => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center bg-[#514EB5] text-white p-3 rounded-md'
                  >
                    <span>{item.id}</span>
                    <Trash2
                      size={18}
                      className='cursor-pointer'
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                ))
              ) : (
                <div className='text-gray-400 text-xs italic'>No sensors selected</div>
              )}
            </div>
          </div>

          {/* AI Speaker Section */}
          <div>
            <h4 className='text-sm font-medium text-gray-600 mb-2'>AI Speaker</h4>
            <div className='flex flex-col gap-2'>
              {selectedSpeakers.length > 0 ? (
                selectedSpeakers.map((item) => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center bg-[#514EB5] text-white p-3 rounded-md'
                  >
                    <span>{item.id}</span>
                    <Trash2
                      size={18}
                      className='cursor-pointer'
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                ))
              ) : (
                <div className='text-gray-400 text-xs italic'>No speakers selected</div>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <div className='flex justify-end gap-4 mt-6'>
        <Button type='primary' className='bg-[#514EB5] px-8 h-10 font-medium' onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

const ShippingMethodForm = ({ onNext }) => {
  const [courier, setCourier] = useState('DHL');
  return (
    <div className='mt-4'>
      <h3 className='text-gray-500 mb-4'>Select Courier Service</h3>
      <div className='flex gap-4 mb-6'>
        {['DHL', 'FedEx', 'UPS'].map((c) => (
          <div
            key={c}
            className={`border rounded-lg p-4 flex items-center justify-center w-[150px] h-[80px] cursor-pointer ${courier === c ? 'border-[#514EB5] bg-indigo-50' : 'border-gray-200'}`}
            onClick={() => setCourier(c)}
          >
            {/* Placeholder for logos */}
            <span
              className={`text-2xl font-bold ${c === 'DHL' ? 'text-yellow-500' : c === 'FedEx' ? 'text-purple-600' : 'text-yellow-700'}`}
            >
              {c === 'DHL' ? 'DHL' : c === 'FedEx' ? 'FedEx' : 'ups'}
            </span>
          </div>
        ))}
      </div>

      <Row gutter={24}>
        <Col span={12}>
          <Form layout='vertical'>
            <Form.Item label='Service Type'>
              <Input defaultValue='Express Worldwide' className='bg-gray-50 border-none py-2' />
            </Form.Item>
            <Form.Item label='Total Weight'>
              <Input defaultValue='8.00lbs' className='bg-gray-50 border-none py-2' />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form layout='vertical'>
            <Form.Item label='Packaging Type'>
              <Input defaultValue='My Own Package' className='bg-gray-50 border-none py-2' />
            </Form.Item>
            <Form.Item label='Declared Value'>
              <Input defaultValue='20.00USD' className='bg-gray-50 border-none py-2' />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <div className='flex justify-end gap-4 mt-6'>
        <Button type='primary' className='bg-[#514EB5] px-8 h-10 font-medium' onClick={onNext}>
          Create Shipment
        </Button>
      </div>
    </div>
  );
};

const Overview = () => {
  return (
    <div className='mt-4 flex justify-center'>
      <div className='border p-8 w-[400px] bg-white shadow-sm'>
        <div className='flex justify-between items-center mb-6'>
          <span className='text-2xl font-bold text-yellow-500'>DHL</span>
          <h2 className='text-xl font-bold'>Shipment Receipt</h2>
        </div>
        {/* Mock Receipt Content */}
        <div className='text-xs space-y-2'>
          <div className='flex justify-between border-b pb-2'>
            <div>
              <p className='font-bold'>Shipment From</p>
              <p>Seenyor HQ</p>
              <p>47 W 13th St, NY</p>
            </div>
            <div className='text-right'>
              <p className='font-bold'>Shipment To</p>
              <p>David Jonson</p>
              <p>47 W 13th St, NY</p>
            </div>
          </div>
          <div className='py-2'>
            <p className='font-bold mb-1'>Shipment Details</p>
            <div className='flex justify-between'>
              <span>Service: Express</span>
              <span>Weight: 8.00lbs</span>
            </div>
          </div>
          <div className='border-t pt-2 mt-4'>
            <div className='flex justify-between font-bold text-sm'>
              <span>Total Charges</span>
              <span className='text-yellow-600'>265.00 USD</span>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute top-4 right-4'>
        <Button type='primary' className='bg-[#514EB5]'>
          Print
        </Button>
      </div>
    </div>
  );
};

const CreateShipment = () => {
  const [activeKey, setActiveKey] = useState('1');

  const handleNext = () => {
    const nextKey = (parseInt(activeKey) + 1).toString();
    if (nextKey <= '5') {
      setActiveKey(nextKey);
    }
  };

  const items = [
    { key: '1', label: 'Sender Info', children: <SenderInfoForm onNext={handleNext} /> },
    { key: '2', label: 'Reciver Info', children: <ReceiverInfoForm onNext={handleNext} /> },
    { key: '3', label: 'Items', children: <ItemsForm onNext={handleNext} /> },
    { key: '4', label: 'Shipping Method', children: <ShippingMethodForm onNext={handleNext} /> },
    { key: '5', label: 'Overview', children: <Overview /> }, // Overview might not need Next
  ];

  return (
    <div className='bg-white rounded-[10px] pb-6 relative overflow-hidden'>
      <h2 className='text-[18px] font-normal text-[#1B2559] px-6 py-4 border-b'>Create Shipment</h2>
      <div className='px-6'>
        <ConfigProvider
          theme={{
            token: { colorPrimary: '#514EB5' },
            components: {
              Tabs: {
                itemSelectedColor: '#514EB5',
                itemActiveColor: '#514EB5',
                inkBarColor: '#514EB5',
              },
            },
          }}
        >
          <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CreateShipment;
