import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  ConfigProvider,
  DatePicker,
  Radio,
} from 'antd';
import { Calendar } from 'lucide-react';

const { RangePicker } = DatePicker;

const CreateSubscriptionModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('auto');
  const [durationType, setDurationType] = useState('fixed');

  return (
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
      <Modal
        title={<h1 className='text-2xl font-semibold p-3'>Create Subscription</h1>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={700}
        centered
        className='device-configuration-modal my-2'
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={onCreate}
          className='border-t p-6'
          initialValues={{
            plan: 'couple_shield',
            freeTrial: '30',
            payment: 'auto',
            durationType: 'fixed',
          }}
        >
          <Form.Item
            label='Select Plan'
            name='plan'
            required={false}
            rules={[{ required: true, message: 'Please select a plan' }]}
          >
            <Select
              placeholder='Select Plan'
              className='h-[40px]'
              options={[
                { value: 'couple_shield', label: 'Couple Sheild - $50/month' },
                { value: 'solo_guardian', label: 'Solo Guardian - $30/month' },
              ]}
            />
          </Form.Item>

          <Form.Item label='Duration' required={false}>
            <div className='flex flex-col gap-3'>
              <Radio.Group
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
                className='flex gap-4'
              >
                <Radio value='fixed'>Fixed Period</Radio>
                <Radio value='forever'>Forever</Radio>
              </Radio.Group>

              {durationType === 'forever' ? (
                <Form.Item
                  name='startDate'
                  noStyle
                  rules={[{ required: true, message: 'Please select start date' }]}
                >
                  <DatePicker
                    placeholder='Start Date'
                    className='w-full py-2'
                    format='MMM D, YYYY'
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name='dateRange'
                  noStyle
                  rules={[{ required: true, message: 'Please select date range' }]}
                >
                  <RangePicker className='w-full py-2' format='MMM D, YYYY' />
                </Form.Item>
              )}
            </div>
          </Form.Item>

          <Form.Item label='Add Free Trial' name='freeTrial'>
            <Input type='number' suffix='days' className='py-2' />
          </Form.Item>

          <Form.Item label='Payment' name='payment'>
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
              className='w-full flex gap-4'
            >
              <div
                className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${paymentMethod === 'auto' ? 'border-[#514EB5] bg-indigo-50' : 'border-gray-200'}`}
                onClick={() => {
                  setPaymentMethod('auto');
                  form.setFieldsValue({ payment: 'auto' });
                }}
              >
                <Radio value='auto' className='text-sm'>
                  Automatically charge on Default payment method
                </Radio>
              </div>
              <div
                className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${paymentMethod === 'manual' ? 'border-[#514EB5] bg-indigo-50' : 'border-gray-200'}`}
                onClick={() => {
                  setPaymentMethod('manual');
                  form.setFieldsValue({ payment: 'manual' });
                }}
              >
                <Radio value='manual' className='text-sm'>
                  Email invoice to the customer to pay manually
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>

          <div className='flex justify-center mt-6'>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              className='bg-[#514EB5] hover:bg-[#403d96] px-12 w-full'
            >
              Create Subscription
            </Button>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default CreateSubscriptionModal;
