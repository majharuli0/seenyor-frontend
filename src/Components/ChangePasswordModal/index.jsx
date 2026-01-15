import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import CustomModal from '@/Shared/modal/CustomModal';
import PasswordInput from '@/Shared/input/PasswordInput';
import { updateUserPasswordByOwn } from '@/api/Users';
import ls from 'store2';

const ChnaePasswordModal = ({ modalOPen, setModalOpen, item, getlist }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  // useEffect(()=>{},[modalOPen])
  const [role, setRole] = useState(ls.get('role'));

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      updateUserPasswordByOwn(data)
        .then((res) => {
          reset();
          setModalOpen(false);
          setTimeout(() => {
            toast.custom((t) => (
              <CustomToast t={t} text='Password has been successfully changed' />
            ));
          }, 900);
        })
        .catch((error) => {
          setTimeout(() => {
            toast.custom((t) => <CustomErrorToast t={t} text={error?.response?.data?.message} />);
          }, 900);
        });
    } else {
      console.log('Validation errors:', errors);
    }
  };
  return (
    <CustomModal
      modalOPen={modalOPen}
      setModalOpen={setModalOpen}
      handleSubmit={handleSubmit(onSubmit)}
      width={590}
      title='Change Password'
      buttonText={'Change'}
    >
      <div className='pt-4 '>
        <PasswordInput
          label='Current Password'
          register={register('oldPassword', {
            required: 'Current Password is Required!',
          })}
          error={errors.oldPassword}
          placeholder={'Current Password'}
        />
        <PasswordInput
          label='New Password'
          placeholder={'New Password'}
          register={register('newPassword', {
            required: 'New Password is Required!',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            validate: {
              hasNumber: (value) =>
                /[0-9]/.test(value) || 'Password must contain at least one number',
              hasUpperCase: (value) =>
                /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
              hasSpecialChar: (value) =>
                /[!@#$%^&*]/.test(value) || 'Password must contain at least one special character',
            },
          })}
          error={errors.newPassword}
        />
      </div>
    </CustomModal>
  );
};

export default ChnaePasswordModal;
