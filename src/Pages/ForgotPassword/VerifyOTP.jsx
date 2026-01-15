import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from '../../Shared/button/CustomButton';
import toast from 'react-hot-toast';
import CustomToast from '../../Shared/Tosat/CustomToast';
import CustomErrorToast from '../../Shared/Tosat/CustomErrorToast';
import { sendOTP, verifyOTP } from '../../api/login-v1';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = ({ setStep, email, setIsOtpVerified }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data) => {
    setLoadingVerify(true);
    verifyOTP({ email, otp: data.otp })
      .then(() => {
        setIsOtpVerified(true);
        setStep('reset');
        toast.custom((t) => (
          <CustomToast t={t} text={'OTP verified successfully!'} title={'Success!'} />
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
      })
      .finally(() => setLoadingVerify(false));
  };

  const handleResendOTP = async () => {
    setLoadingResend(true);
    sendOTP({ email })
      .then(() => {
        toast.custom((t) => (
          <CustomToast t={t} text={'OTP resent to your email!'} title={'Success!'} />
        ));
        setCooldown(30); // start 30s cooldown
      })
      .catch((err) => {
        toast.custom((t) => (
          <CustomErrorToast
            t={t}
            text={err?.response?.data?.message || err.response}
            title={'Error'}
          />
        ));
      })
      .finally(() => setLoadingResend(false));
  };

  return (
    <div className='w-[470px]'>
      <h1 className='font-bold text-[36px]'>Verify OTP</h1>
      <p className='text-gray-600 text-[16px] font-[400] mt-2'>
        Enter the OTP sent to <span className='font-semibold'>{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className='lg:w-[470px] pt-10'>
        <div className='flex flex-col items-start'>
          <label htmlFor='otp' className='mb-1 font-[500] text-[14px] text-[#1B2559]'>
            OTP <span className='text-blue-600'>*</span>
          </label>
          <input
            className='py-[18px] px-[16px] h-[50px] text-[#3D4854] placeholder:text-[#A3AED0] rounded-[16px] w-full text-[16px] outline-none border-[1px] focus:border-primary'
            type='text'
            placeholder='Enter OTP'
            id='otp'
            {...register('otp', {
              required: {
                value: true,
                message: 'Please enter the OTP',
              },
              pattern: {
                value: /^\d{6}$/,
                message: 'OTP must be 6 digits',
              },
            })}
          />
          {errors.otp && <span className='text-sm mt-1 text-red-500'>{errors.otp.message}</span>}
        </div>

        {/* Verify Button with loading */}
        <CustomButton
          className='w-full h-[50px] font-[700] text-[14px] rounded-[18px] mt-6 disabled:opacity-50'
          type='submit'
          disabled={loadingVerify}
        >
          {loadingVerify ? 'Verifying...' : 'Verify OTP'}
        </CustomButton>

        {/* Resend OTP Button with cooldown */}
        <button
          type='button'
          onClick={handleResendOTP}
          disabled={loadingResend || cooldown > 0}
          className={`text-blue-600 text-base mt-4 transition w-full mx-auto ${
            loadingResend || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-800'
          }`}
        >
          {loadingResend
            ? 'Resending...'
            : cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : 'Resend OTP'}
        </button>

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

export default VerifyOTP;
