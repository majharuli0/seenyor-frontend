export const DashboardHeading = ({ className = '' }) => {
  return (
    <div id='welcome_msg' className={`flex flex-col gap-2 ${className}`}>
      <span className='text-lg uppercase text-text/60 font-medium'>Ai Care solution</span>
      <div className='flex flex-col gap-0'>
        <h1 className='text-[28px]  text-text font-medium m-0 p-0 leading-none'>Hello Guardian!</h1>
        <p className='text-base  text-text/80 font-extralight m-0 p-0 '>
          Every Customer Relies on you
        </p>
      </div>
    </div>
  );
};
