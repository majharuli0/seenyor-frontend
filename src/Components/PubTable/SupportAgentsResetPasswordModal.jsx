import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomModal from '@/Shared/modal/CustomModal';
import PasswordInput from '@/Shared/input/PasswordInput';
import { resetPassword } from '@/api/AdminUser';
import { resetUserPasswordByAdmin } from '@/api/Users';
import ls from 'store2';

const SupportAgentsResetPasswordModal = ({ modalOPen, setModalOpen, item, getlist }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // useEffect(()=>{},[modalOPen])
  const [role, setRole] = useState(ls.get('role'));

  const onSubmit = (data) => {
    if (data.password == '') {
      toast.error('The new password cannot be empty');
      return;
    }
    try {
      // Simulate an API call
      // Replace this with your actual API call
      // await apiCallFunction(data);
      resetUserPasswordByAdmin(item._id, { password: data.password }).then((res) => {
        console.log(res);

        reset();
        setModalOpen(false);
        // Display the success toast
        setTimeout(() => {
          toast.custom((t) => (
            <CustomToast t={t} text='Temporary password has been successfully changed' />
          ));
        }, 900);
      });
    } catch (error) {
      // Handle API call or other errors
      console.error('An error occurred:', error);
      toast.error('An error occurred while creating a new admin.');
    }
  };
  return (
    <CustomModal
      modalOPen={modalOPen}
      setModalOpen={setModalOpen}
      handleSubmit={handleSubmit(onSubmit)}
      width={590}
      title='Reset Password'
      buttonText={'Reset'}
    >
      <div className='pt-4 '>
        <PasswordInput
          label={'Enter a New Password'}
          placeholder={'Enter Password'}
          register={register('password', {
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
          error={errors.password}
        />
      </div>
    </CustomModal>
  );
};

export default SupportAgentsResetPasswordModal;
