import React from 'react';

const CustomButton = ({
  type = 'submit',
  style,
  children,
  className,
  onClick = () => {},
  disabled,
  loading = false, // new prop
}) => {
  return (
    <button
      disabled={disabled || loading} // disable while loading
      style={style}
      type={type}
      onClick={onClick}
      className={`px-3.5 h-[44px] w-fit bg-primary hover:bg-primary/70 duration-300 rounded-[10px] font-medium text-[13px] text-white flex items-center justify-center ${className} disabled:opacity-70 disabled:cursor-not-allowed text-nowrap`}
    >
      {loading ? (
        <span className='flex items-center gap-2'>
          <svg
            className='animate-spin h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4h-4z'
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
