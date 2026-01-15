import React from 'react';

const SearchInput = ({
  search,
  setSearch,
  style,
  placeholder,
  handBlurchange = () => {},
  onInputChange = () => {},
  className = '',
}) => {
  const handleKeyPress = (event) => {
    if (event.key == 'Enter') {
      handBlurchange();
    }
  };
  return (
    <div className={`relative w-full lg:w-[220px] ${className}`}>
      <input
        onKeyPress={handleKeyPress}
        type='text'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onInputChange();
        }}
        placeholder={placeholder ? placeholder : 'Search...'}
        className='text-[13px] font-medium outline-none w-full h-full py-[9px] px-3 pr-10 flex items-center justify-between border-[1px] focus:border-primary rounded-[10px]'
      />
      <svg
        onClick={handBlurchange}
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 19 19'
        fill='none'
        className=' text-2xl text-[#E8E9EE] absolute top-[8px] right-[7px]'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M11.3884 12.2281C9.2903 13.9085 6.21909 13.7763 4.27413 11.8313C2.18727 9.74447 2.18727 6.361 4.27413 4.27413C6.361 2.18727 9.74447 2.18727 11.8313 4.27413C13.7763 6.21908 13.9086 9.2903 12.2281 11.3884L16.3097 15.47C16.5415 15.7018 16.5415 16.0778 16.3097 16.3097C16.0778 16.5415 15.7018 16.5415 15.47 16.3097L11.3884 12.2281ZM5.11382 10.9916C3.49071 9.36853 3.49071 6.73694 5.11382 5.11382C6.73694 3.49071 9.36853 3.49071 10.9916 5.11382C12.6136 6.73575 12.6148 9.36467 10.9952 10.9881C10.994 10.9892 10.9928 10.9904 10.9916 10.9916C10.9904 10.9928 10.9893 10.994 10.9881 10.9952C9.36467 12.6148 6.73575 12.6136 5.11382 10.9916Z'
          fill='#E8E9EE'
        />
      </svg>
    </div>
  );
};

export default SearchInput;
