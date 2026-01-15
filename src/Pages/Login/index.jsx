import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd/lib';
import CustomButton from '@/Shared/button/CustomButton';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import { loginWithPass } from '@/api/login-v1';
import { setToken } from '@/utils/auth';
import { getDeviceId } from '@/utils/deviceId';
import ls from 'store2';
import { SidebarContext } from '@/Context/CustomContext';
import { useCountStore } from '@/store/index';
import loginImage from '@/assets/login_image.svg';
import roleLogo from '@/assets/roleLogo.svg';
import { jwtDecode } from 'jwt-decode';
import './index.css';
import { useTranslation } from 'react-i18next';
import { clearLocalStorageKeys } from '@/utils/helper';
import { generateToken } from '@/firebase/firebase';

const SelectRolePage = () => {
  ls.session.set('mapviewLati', []);
  const { setRole } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [active, setActive] = useState('Super Admin');
  const [show, setShow] = useState(false);
  const { setStoreRole, setUser } = useCountStore();
  const StoreRole = useCountStore((state) => state.StoreRole);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [captchaVal, setCaptchaVal] = useState(true);
  const captchaRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const nvto = (active, id) => {
    if (active == 'Support Agent') {
      navigate('/Agentadmin/dashboard/');
    } else if (active == 'super_admin') {
      navigate('/super-admin/dashboard');
    } else if (active == 'supports_agent') {
      navigate('/supporter/support-agent/dashboard');
    } else if (active == 'nurse') {
      navigate('/supporter/nurse/dashboard');
    } else if (active == 'end_user') {
      navigate('/supporter/end-user/dashboard');
    } else if (active == 'monitoring_agency' || active == 'monitoring_agent') {
      navigate('/ms/dashboard');
    } else if (active == 'distributor') {
      // _-<-_
      // navigate("/management/dashboard");
      navigate('/supporter/support-agent/dashboard');
    } else {
      navigate('/support-nurnt/dashboard');
    }
  };

  const onSubmit = async (data) => {
    // if (!captchaVal) {
    //   toast.custom((t) => (
    //     <CustomErrorToast
    //       t={t}
    //       text={"Please verify you are not a robot"}
    //       title={"Error"}
    //     />
    //   ));
    //   return;
    // }
    setLoading(true);
    const fcmToken = (await generateToken()) || null;
    const deviceId = await getDeviceId();
    clearLocalStorageKeys([
      'token',
      'mainRole',
      'role',
      'rootToken',
      'user',
      'elderly_details',
      'sleepData',
    ]);
    loginWithPass({
      email: data.email,
      password: data.password,
      fcmToken,
      deviceId,
    })
      .then((res) => {
        if (res) {
          const { access_token } = res?.data;
          if (res.data.role == 'end_user' && res.session_code == 0) {
            toast.custom((t) => (
              <CustomErrorToast
                t={t}
                title='Error'
                text={'This account has no active subscription.'}
              />
            ));
            setLoading(false);
            setCaptchaVal(null);
            captchaRef.current.reset();
            return;
          }
          // Store the token as a string
          setToken(String(access_token));
          if (access_token) {
            try {
              // Decode the JWT token
              const loggedUserData = jwtDecode(access_token);
              // setRole(loggedUserData?.role);
              // ls.set("role", loggedUserData?.role);
              ls.set('user', { ...loggedUserData, device_id: res?.deviceId });
              // setStoreRole(loggedUserData?.role);
              // setUser(loggedUserData);
              nvto(loggedUserData?.role, loggedUserData?._id);
              ls.set('mainRole', loggedUserData.role);
              setRole(loggedUserData.role);
              ls.set('role', loggedUserData.role);
              // ls.set("user", {role:active});
              setStoreRole({ role: loggedUserData.role });
              setUser({ role: loggedUserData.role });
              if (res?.data.role) {
                ls.set('rootRole', res?.data.role);
              }
              setLoading(false);
            } catch (error) {
              console.error('Failed to decode token:', error);
              setLoading(false);
              setCaptchaVal(null);
              captchaRef.current.reset();
            }
          }
        } else {
          // If no data, handle error message
          let msg = res?.data?.message;

          // Show error toast
          toast.custom((t) => <CustomErrorToast t={t} text={msg} title={'Error'} />);
          setLoading(false);
          setCaptchaVal(null);
          captchaRef.current.reset();
        }
      })
      .catch((error) => {
        console.log(error);
        // Handle errors here
        let msg =
          error?.response?.data?.message || 'System error, please contact the administrator';

        // Show error toast
        toast.custom((t) => <CustomErrorToast t={t} text={msg} title={'Error'} />);
        setLoading(false);
        setCaptchaVal(null);
        captchaRef.current.reset();
      });
    // if (active !== "Support Agent" && active === "Others") {
    //   loginWithPass({
    //     email: data.email,
    //     password: data.password,
    //   })
    //     .then((res) => {
    //       console.log(res);

    //       // If the response contains data
    //       if (res) {
    //         const { access_token } = res?.data;
    //         // Store the token as a string
    //         setToken(String(access_token));
    //         if (access_token) {
    //           try {
    //             // Decode the JWT token
    //             const loggedUserData = jwtDecode(access_token);
    //             // setRole(loggedUserData?.role);
    //             // ls.set("role", loggedUserData?.role);
    //             ls.set("user", loggedUserData);
    //             // setStoreRole(loggedUserData?.role);
    //             // setUser(loggedUserData);
    //             nvto(loggedUserData?.role);
    //             ls.set("mainRole", loggedUserData.role);
    //             setRole(active);
    //             ls.set("role", active);
    //             // ls.set("user", {role:active});
    //             setStoreRole({ role: active });
    //             setUser({ role: active });
    //             if (res?.data.role) {
    //               ls.set("rootRole", res?.data.role);
    //             }
    //           } catch (error) {
    //             console.error("Failed to decode token:", error);
    //           }
    //         }
    //       } else {
    //         // If no data, handle error message
    //         let msg = res?.data?.message;

    //         // Show error toast
    //         toast.custom((t) => (
    //           <CustomErrorToast t={t} text={msg} title={"Error"} />
    //         ));
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       // Handle errors here
    //       let msg =
    //         error?.response?.data?.message ||
    //         "System error, please contact the administrator";

    //       // Show error toast
    //       toast.custom((t) => (
    //         <CustomErrorToast t={t} text={msg} title={"Error"} />
    //       ));
    //     });
    // } else {
    //   LoginPassword({
    //     businessEmail: data.email,
    //     password: data.password,
    //     role: active,
    //   }).then((datas) => {
    //     setRole(active);

    //     //  const {data}=datas
    //     if (datas?.data) {
    //       const { token, user } = datas.data;

    //       setToken(token);
    //       ls.set("user", user);
    //       ls.set("role", active);
    //       setStoreRole(user.role);
    //       setUser(user);

    //       nvto(active);
    //     } else {
    //       let msg = datas?.msg;
    //       if (!msg) {
    //         msg = "System error, please contact the administrator";
    //       }
    //       toast.custom((t) => (
    //         <CustomErrorToast t={t} text={msg} title={"Error"} />
    //       ));
    //     }
    //     // const {code,data:{token,}}=datas
    //   });
    // }

    return;
  };
  return (
    <div className='md:flex w-full items-center justify-between gap-6 overflow-hidden'>
      <div className='flex items-center h-[100vh] md:w-[50%] w-full justify-center'>
        {/* 470 */}
        <div className='lg:w-[700px] h-full flex items-center justify-center px-5'>
          <div className='w-[470px'>
            <h1 className='font-bold text-[36px] text-primary'>{t('login')}</h1>
            <p className=' text-light-black text-[16px] font-[400] mt-2'>
              {t('welcomeDescription', {
                defaultValue:
                  'Select Your Role And Enter Additional Information To Sign In To Your Account',
              })}
            </p>

            {/* <div className="py-[35px] ">
              <div className=" grid md:grid-cols-3 grid-cols-1 items-center gap-5">
                {UserRole?.map((role) => (
                  <div
                    key={role.roll}
                    onClick={() => setActive(role.roll)}
                    className={` gap-[12px] cursor-pointer hover:border-[3px] hover:border-primary rounded-[16px] flex items-center justify-start md:justify-center md:flex-col py-2 md:py-6 px-[10px] ${
                      role.roll === active
                        ? " border-[3px] shadow-shadowOne border-primary"
                        : "border border-primary/25"
                    }`}
                  >
                    <div className=" w-[53px] h-[53px] bg-[#F9F5FF] rounded-full flex items-center justify-center">
                      {role?.icon}
                    </div>
                    <h4 className=" text-black text-center font-[500] text-[14px]">
                      {role.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div> */}

            <form onSubmit={handleSubmit(onSubmit)} className='lg:w-[470px] pt-10'>
              <div className='flex flex-col items-start '>
                <label htmlFor='otp' className='mb-1 font-[500] text-[14px] text-[#1B2559]'>
                  Email <span className=' text-primary'>*</span>
                </label>
                <input
                  className='py-[18px] px-[16px] h-[50px] text-[#3D4854] placeholder:text-[#A3AED0]  rounded-[16px] w-full text-[16px] outline-none  border-[1px] focus:border-primary'
                  type='email'
                  placeholder={'yourname@example.com'}
                  id='otp'
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Please enter a valid e-mail address',
                    },
                  })}
                />
                <label className='label'>
                  {errors.email?.type === 'required' && (
                    <span className=' text-sm mt-1 text-red-500'>{errors.email.message}</span>
                  )}
                </label>
              </div>
              <div className='flex flex-col items-start mt-5 mb-2'>
                <label htmlFor='otp' className='mb-1 font-[500] text-[14px] text-[#1B2559]'>
                  Password <span className=' text-primary'>*</span>
                </label>
                <div className='w-full relative'>
                  <input
                    className='py-[18px] px-[16px] h-[50px] text-[#3D4854] placeholder:text-[#A3AED0]  rounded-[16px] w-full text-[16px] outline-none  border-[1px] focus:border-primary'
                    type={show ? 'text' : 'password'}
                    placeholder={'Enter Your Password'}
                    id='otp'
                    {...register('password', {
                      required: {
                        value: true,
                        message: 'Please enter a password',
                      },
                    })}
                  />
                  <div className=' absolute top-[27%] right-[10px]'>
                    <button type='button' onClick={() => setShow((pre) => !pre)}>
                      {show ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="text-[25px] text-black iconify iconify--ic" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4m0 5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7"></path></svg>`,
                          }}
                        />
                      ) : (
                        // <Icon
                        //   icon="ic:outline-visibility"
                        //   className="text-[25px] text-black"
                        // />
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="text-[25px] text-black iconify iconify--mdi" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"></path></svg>`,
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                <label className='label'>
                  {errors.password?.type === 'required' && (
                    <span className=' text-sm mt-1 text-red-500'>{errors.password.message}</span>
                  )}
                </label>
              </div>
              <div className=' flex items-center justify-between py-4'>
                <div>
                  <Checkbox className=' text-primary text-[14px] font-[400]'>
                    Keep me logged in
                  </Checkbox>
                </div>
                <Link to='/forgot-password' className=' text-primary font-[500] text-[14px]'>
                  Forget password?
                </Link>
              </div>

              {/* <div className="flex justify-start mb-4 w-full">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(val) => setCaptchaVal(val)}
                />
              </div> */}
              {/* <div className="flex justify-start mb-4 w-full">
                {isCaptchaCrashed ? (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50 w-full">
                    <p className="text-red-500 text-sm mb-2 font-medium">
                      Prove you are human:
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700 min-w-[60px]">
                        {mathChallenge.q} = ?
                      </span>
                      <input
                        type="number"
                        className="py-2 px-3 rounded border border-gray-300 w-20 outline-none focus:border-primary"
                        value={mathInput}
                        onChange={handleMathChange}
                      />
                      <button
                        type="button"
                        onClick={generateMathChallenge}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                        title="New Question"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(val) => setCaptchaVal(val)}
                      onExpired={handleCaptchaExpired}
                      onErrored={handleCaptchaError}
                    />
                    <button
                        type="button"
                        onClick={manualReset}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        title="Reset Captcha"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                  </div>
                )}
              </div> */}

              <CustomButton
                loading={loading}
                className={'w-full h-[50px] font-[700] text-[14px] rounded-[18px]'}
              >
                Sign In
              </CustomButton>
            </form>
          </div>
        </div>
      </div>
      <div className='hidden relative -right md:h-[100vh] w-full h-full md:w-[50%] md:flex justify-end'>
        <img className=' h-full w-full object-cover' src={loginImage} alt='logo' />
        <div className=' absolute top-[50%] left-[50%] flex items-center flex-col justify-center translate-x-[-50%] translate-y-[-50%]'>
          <img src={roleLogo} alt='' className='w-[363px] ' />
          <p className=' font-[500] text-[18px] text-white/80 text-center pt-[15px] w-[500px]'>
            Caring Connections, Empowering Lives: Nurturing Well-being Through Every Click.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
