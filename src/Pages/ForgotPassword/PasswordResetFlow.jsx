import React, { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import VerifyOTP from './VerifyOTP';
import ResetPassword from './ResetPassword';
import loginImage from '@/assets/login_image.svg';
import roleLogo from '@/assets/roleLogo.svg';

const PasswordResetFlow = () => {
  const [step, setStep] = useState('forgot'); // 'forgot', 'verify', 'reset'
  const [email, setEmail] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Prevent direct access to reset password page
  useEffect(() => {
    if (step === 'reset' && !isOtpVerified) {
      setStep('forgot');
    }
  }, [step, isOtpVerified]);

  return (
    <div className='md:flex w-full items-center justify-between gap-6 overflow-hidden'>
      <div className='flex items-center h-[100vh] md:w-[50%] w-full justify-center'>
        <div className='lg:w-[700px] h-full flex items-center justify-center px-5'>
          {step === 'forgot' && <ForgotPassword setStep={setStep} setEmail={setEmail} />}
          {step === 'verify' && (
            <VerifyOTP setStep={setStep} email={email} setIsOtpVerified={setIsOtpVerified} />
          )}
          {step === 'reset' && isOtpVerified && (
            <ResetPassword setStep={setStep} email={email} setIsOtpVerified={setIsOtpVerified} />
          )}
        </div>
      </div>
      <div className='hidden relative md:h-[100vh] w-full h-full md:w-[50%] md:flex justify-end'>
        <img className='h-full w-full object-cover' src={loginImage} alt='login background' />
        <div className='absolute top-[50%] left-[50%] flex items-center flex-col justify-center translate-x-[-50%] translate-y-[-50%]'>
          <img src={roleLogo} alt='role logo' className='w-[363px]' />
          <p className='font-[500] text-[18px] text-white/80 text-center pt-[15px] w-[500px]'>
            Caring Connections, Empowering Lives: Nurturing Well-being Through Every Click.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetFlow;
