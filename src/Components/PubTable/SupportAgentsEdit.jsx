import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomModal from '@/Shared/modal/CustomModal';
import CustomInput from '@/Shared/input/CustomInput';

const SupportAgentsEdit = ({ item, setModalOpen, modalOPen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      businessAdress: item.businessAdress,
      contactPerson: item.contactPerson,
      contactNumber: item.contactNumber,
    },
  });

  const onSubmit = (data) => {
    try {
      // Simulate an API call
      // Replace this with your actual API call
      // await apiCallFunction(data);

      setModalOpen(false);
      // Display the success toast
      setTimeout(() => {
        toast.custom((t) => <CustomToast t={t} text='Changes has been successfully made' />);
      }, 900);
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
      title='Edit Support Agent Details'
      buttonText={'Save Changes'}
    >
      <div className='flex items-center gap-4'>
        <CustomInput
          label={'First Name'}
          type={'text'}
          register={register('firstName', {
            required: {
              value: true,
              message: 'Please enter first name',
            },
          })}
          error={errors.firstName}
          placeholder={'Enter First Name'}
        />

        <CustomInput
          label={'Last Name'}
          type={'text'}
          register={register('lastName', {
            required: {
              value: true,
              message: 'Please enter last name',
            },
          })}
          error={errors.lastName}
          placeholder={'Enter Last Name'}
        />
      </div>

      <CustomInput
        label={'E-mail'}
        type={'email'}
        register={register('email', {
          required: {
            value: true,
            message: 'Please enter E-mail',
          },
        })}
        error={errors.email}
        placeholder={'Enter E-mail'}
      />

      <CustomInput
        label={'Business Address'}
        type={'text'}
        register={register('businessAdress')}
        placeholder={'Business Address'}
      />

      <CustomInput
        label={'Contact Person'}
        type={'text'}
        register={register('contactPerson')}
        placeholder={'Enter Contact Person'}
      />

      <CustomInput
        label={'Contact Number'}
        type={'text'}
        register={register('contactNumber')}
        placeholder={'Enter Contact Number'}
      />
    </CustomModal>
  );
};

export default SupportAgentsEdit;
