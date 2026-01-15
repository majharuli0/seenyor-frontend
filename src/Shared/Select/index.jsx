import React, { useState } from 'react';
import { Button, Popconfirm, Dropdown, Popover } from 'antd';

const CSelect = ({ label, type, register, error, placeholder, list, setvalue, name }, ref) => {
  const [selectedOption, setSelectedOption] = useState(null); // 保存选项的状态

  const onOpenChange = (row) => {
    const { key } = row;
    let row1 = list.find((e) => e.key == key);
    //  NursingsetValue("Nursing Home", row1.label); // 更新表单的值
    setvalue(name, row1.label);
    setSelectedOption(row1); // 更新所选项的状态
  };
  const rest = () => {
    setSelectedOption(null);
    setvalue(name, null);
  };
  React.useImperativeHandle(ref, () => ({
    rest,
  }));
  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label htmlFor='otp' className='mb-1 font-medium text-[13px] text-[#1B2559]'>
        {label}
      </label>
      <Dropdown
        menu={{
          items: list,
          onClick: onOpenChange,
        }}
        placement='bottomLeft'
        arrow
      >
        <a onClick={(e) => e.preventDefault()} style={{ width: '100%' }}>
          <input
            value={selectedOption ? selectedOption.label : ''}
            readOnly
            className='py-[18px] px-4 text-text-primary placeholder:text-[#A3AED0] h-[50px]  rounded-[16px] w-full text-base outline-none   border-[1px] focus:border-primary'
            type={type}
            placeholder={placeholder}
            autocomplete='off'
            id='otp'
            {...register}
          />
        </a>
      </Dropdown>
      <label className='label'>
        {error?.type === 'required' && (
          <span className=' text-sm mt-1 text-red-500'>{error.message}</span>
        )}
      </label>
    </div>
  );
};

const ForwardedChild = React.forwardRef(CSelect);

export default ForwardedChild;
