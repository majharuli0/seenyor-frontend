import React from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from '../../Shared/button/CustomButton';
import { sendOTP } from '../../api/login-v1';
import toast from 'react-hot-toast';
import CustomErrorToast from '../../Shared/Tosat/CustomErrorToast';
import CustomToast from '../../Shared/Tosat/CustomToast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ setStep, setEmail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    sendOTP({ email: data.email })
      .then((res) => {
        setEmail(data.email);
        setStep('verify');
        toast.custom((t) => (
          <CustomToast t={t} text={'OTP sent to your email!'} title={'Success!'} />
        ));
      })
      .catch((err) => {
        toast.custom((t) => (
          <CustomErrorToast
            t={t}
            text={err?.response?.data?.message || err.response}
            title={'Error'}
          />
        ));
      });
  };

  return (
    <div className='w-[470px]'>
      <h1 className='font-bold text-[36px] '>Forgot Password</h1>
      <p className='text-gray-600 text-[16px] font-[400] mt-2'>
        Please Enter Your Email Address To Reset Your Password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className='lg:w-[470px] pt-10'>
        <div className='flex flex-col items-start'>
          <label htmlFor='email' className='mb-1 font-[500] text-[14px] text-[#1B2559]'>
            Email <span className=''>*</span>
          </label>
          <input
            className='py-[18px] px-[16px] h-[50px] text-[#3D4854] placeholder:text-[#A3AED0]  rounded-[16px] w-full text-[16px] outline-none  border-[1px] focus:border-primary'
            type='email'
            placeholder='yourname@example.com'
            id='email'
            {...register('email', {
              required: {
                value: true,
                message: 'Please enter a valid e-mail address',
              },
            })}
          />
          {errors.email && (
            <span className='text-sm mt-1 text-red-500'>{errors.email.message}</span>
          )}
        </div>

        <CustomButton
          className='w-full h-[50px] font-[700] text-[14px] rounded-[18px] mt-6'
          type='submit'
        >
          Send OTP
        </CustomButton>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='text-primary text-base mt-4 hover:text-primary/80 transition w-full mx-auto'
        >
          ← Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
