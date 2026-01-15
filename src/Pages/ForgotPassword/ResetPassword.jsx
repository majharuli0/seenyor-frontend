import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from '../../Shared/button/CustomButton';
import toast from 'react-hot-toast';
import CustomToast from '../../Shared/Tosat/CustomToast';
import CustomErrorToast from '../../Shared/Tosat/CustomErrorToast';
import { resetPassword } from '../../api/login-v1';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ({ setStep, email, setIsOtpVerified }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    resetPassword({ email, password: data.password })
      .then((res) => {
        setIsOtpVerified(true);
        setStep('reset');
        toast.custom((t) => (
          <CustomToast t={t} text={'Password reset successfully!'} title={'Success!'} />
        ));
        navigate('/');
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
      <h1 className='font-bold text-[36px] '>Reset Password</h1>
      <p className='text-gray-600 text-[16px] font-[400] mt-2'>Enter your new password</p>

      <form onSubmit={handleSubmit(onSubmit)} className='lg:w-[470px] pt-10'>
        <div className='flex flex-col items-start mb-5'>
          <label htmlFor='password' className='mb-1 font-[500] text-[14px] text-[#1B2559]'>
            Password <span className='text-blue-600'>*</span>
          </label>
          <div className='w-full relative'>
            <input
              className='py-[18px] px-[16px] h-[50px] text-[#3D4854] placeholder:text-[#A3AED0]  rounded-[16px] w-full text-[16px] outline-none  border-[1px] focus:border-primary'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter new password'
              id='password'
              {...register('password', {
                required: {
                  value: true,
                  message: 'Please enter a password',
                },
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type='button'
              className='absolute top-[27%] right-[10px]'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className='text-[25px] text-black'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4m0 5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7'
                  />
                </svg>
              ) : (
                <svg
                  className='text-[25px] text-black'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13'
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className='text-sm mt-1 text-red-500'>{errors.password.message}</span>
          )}
        </div>

        <div className='flex flex-col items-start'>
          <label htmlFor='confirmPassword' className='mb-1 font-[500] text-[14px] text-[#1B2559]'>
            Confirm Password <span className='text-blue-600'>*</span>
          </label>
          <div className='w-full relative'>
            <input
              className='py-[18px] px-[16px] h-[50px] text-[#3D4854] placeholder:text-[#A3AED0]  rounded-[16px] w-full text-[16px] outline-none  border-[1px] focus:border-primary'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm new password'
              id='confirmPassword'
              {...register('confirmPassword', {
                required: {
                  value: true,
                  message: 'Please confirm your password',
                },
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            <button
              type='button'
              className='absolute top-[27%] right-[10px]'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg
                  className='text-[25px] text-black'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4m0 5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7'
                  />
                </svg>
              ) : (
                <svg
                  className='text-[25px] text-black'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13'
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className='text-sm mt-1 text-red-500'>{errors.confirmPassword.message}</span>
          )}
        </div>

        <CustomButton
          className='w-full h-[50px] font-[700] text-[14px] rounded-[18px] mt-6'
          type='submit'
        >
          Reset Password
        </CustomButton>
        {/* Back to login */}
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

export default ResetPassword;
