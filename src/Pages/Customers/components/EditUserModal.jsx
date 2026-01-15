import React from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, ConfigProvider } from 'antd';

const EditUserModal = ({ visible, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm();

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
        title={<h1 className='text-2xl font-semibold p-3'>Edit User</h1>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        centered
        className='device-configuration-modal my-2'
      >
        <Form
          form={form}
          layout='vertical'
          initialValues={initialValues}
          onFinish={onUpdate}
          className=' border-t p-6'
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='First Name'
                name='firstName'
                required={false}
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder='David' className='py-2' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Last Name'
                name='lastName'
                required={false}
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder='Jonson' className='py-2' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Email Address'
                name='email'
                required={false}
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' },
                ]}
              >
                <Input placeholder='Davidjonson@gmail.com' className='py-2' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Phone Number'
                name='phone'
                required={false}
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder='+11 54 564566 646' className='py-2' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Address Line 1'
            name='address1'
            required={false}
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input placeholder='Abc' className='py-2' />
          </Form.Item>

          <Form.Item label='Address Line 2' name='address2'>
            <Input placeholder='Abc' className='py-2' />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Country'
                name='country'
                required={false}
                rules={[{ required: true, message: 'Please enter country' }]}
              >
                <Input placeholder='USA' className='py-2' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='City'
                name='city'
                required={false}
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder='Janina' className='py-2' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Zip Code'
                name='zipCode'
                required={false}
                rules={[{ required: true, message: 'Please enter zip code' }]}
              >
                <Input placeholder='134152' className='py-2' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='State'
                name='state'
                required={false}
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder='Etao Janina' className='py-2' />
              </Form.Item>
            </Col>
          </Row>

          <h3 className='font-semibold text-base mb-4 mt-2'>Subscription</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Dynamic Subscription' name='dynamicSubscription'>
                <Select
                  placeholder='Select Status'
                  className='h-[40px]'
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Manual Subscription' name='manualSubscription'>
                <Input placeholder='Deactivated' className='py-2' disabled />
              </Form.Item>
            </Col>
          </Row>

          <div className='flex justify-center mt-6'>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              className='bg-[#514EB5] hover:bg-[#403d96] px-12'
            >
              Update User
            </Button>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default EditUserModal;
