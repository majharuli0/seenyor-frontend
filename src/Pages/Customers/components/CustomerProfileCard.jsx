import React, { useState } from 'react';
import { Button, Avatar, Tag } from 'antd';
import { Phone, Mail, MapPin, Edit, Trash2, PlusCircle } from 'lucide-react';
import EditUserModal from './EditUserModal';
import DeleteModal from '@/Shared/delete/DeleteModal';

const CustomerProfileCard = ({ customer }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = (values) => {
    console.log('Updated values:', values);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    console.log('Deleting user:', customer.id);
    setIsDeleteModalOpen(false);
    // Trigger API call to delete user
  };

  const initialValues = {
    firstName: customer.name.split(' ')[0],
    lastName: customer.name.split(' ')[1] || '',
    email: customer.email,
    phone: customer.phone,
    address1: customer.address,
    country: 'USA',
    city: 'New York',
    zipCode: '10011',
    state: 'NY',
    dynamicSubscription: 'Active',
  };

  return (
    <div className='bg-[#514EB5] rounded-[10px] p-6 text-white flex flex-col'>
      <div className='flex justify-end gap-2 mb-4'>
        <Button
          size='small'
          className='bg-white/10 border-none text-white hover:bg-white/20 flex items-center gap-1 text-xs'
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit size={12} /> Edit
        </Button>
        <Button
          size='small'
          className='bg-[#FF4D4F] border-none text-white hover:bg-[#ff7875] flex items-center gap-1 text-xs'
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash2 size={12} /> Delete
        </Button>
      </div>

      <div className='flex gap-4 mb-8'>
        <div className='relative'>
          <Avatar
            shape='square'
            size={100}
            src={customer.image}
            className='rounded-xl bg-indigo-400'
          >
            {customer.initials}
          </Avatar>
        </div>
        <div>
          <h2 className='text-2xl font-bold mb-1'>{customer.name}</h2>
          <p className='text-white/80 text-sm mb-1'>ID: {customer.id}</p>
          <p className='text-white/80 text-sm'>Joined on {customer.joinDate}</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-8'>
        <div className='bg-white/10 rounded-xl p-4 text-center border border-white/10'>
          <h3 className='text-2xl font-bold mb-1'>${customer.totalSpent}</h3>
          <p className='text-xs text-white/70 uppercase tracking-wider'>Total Spent</p>
        </div>
        <div className='bg-white/10 rounded-xl p-4 text-center border border-white/10'>
          <h3 className='text-2xl font-bold mb-1'>{customer.deviceCount}</h3>
          <p className='text-xs text-white/70 uppercase tracking-wider'>Device Purchased</p>
        </div>
      </div>

      <div className='mb-8'>
        <h4 className='text-sm font-semibold mb-4 text-white/90'>Contact Information</h4>
        <div className='space-y-3'>
          <div className='flex items-center gap-3 text-sm text-white/80'>
            <Phone size={16} />
            <span>{customer.phone}</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-white/80'>
            <Mail size={16} />
            <span>{customer.email}</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-white/80'>
            <MapPin size={16} />
            <span>{customer.address}</span>
          </div>
        </div>
      </div>

      <div className='mb-8'>
        <div className='flex justify-between items-center mb-3'>
          <h4 className='text-sm font-semibold text-white/90'>Tags</h4>
          <PlusCircle size={18} className='cursor-pointer hover:text-white text-white/70' />
        </div>
        <div className='flex flex-wrap gap-2'>
          <div className='bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/10'>
            <span className='text-sm'>VIP Customer</span>
            <Trash2 size={12} className='cursor-pointer hover:text-red-300 text-white/50' />
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <h4 className='text-sm font-semibold mb-3 text-white/90'>Seniors</h4>
        <div className='space-y-2'>
          {customer.seniors?.map((senior, idx) => (
            <div
              key={idx}
              className='bg-white/10 rounded-lg p-2 flex items-center justify-between border border-white/10'
            >
              <div className='flex items-center gap-3'>
                <Avatar src={senior.image} size={40} className='bg-indigo-300' />
                <div>
                  <p className='text-sm font-medium leading-tight'>{senior.name}</p>
                  <p className='text-[10px] text-white/60 truncate max-w-[120px]'>
                    {senior.address}
                  </p>
                </div>
              </div>
              <Button
                size='small'
                className='bg-white text-indigo-600 border-none hover:bg-gray-100 text-xs h-7 px-3'
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </div>

      <EditUserModal
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
        initialValues={initialValues}
      />

      <DeleteModal
        modalOPen={isDeleteModalOpen}
        setModalOpen={setIsDeleteModalOpen}
        title='Are you sure you want to delete this user?'
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CustomerProfileCard;
