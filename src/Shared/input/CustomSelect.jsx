import { disable } from 'ol/rotationconstraint';
import React, { useEffect, useState, useRef } from 'react';
import { Select, ConfigProvider } from 'antd';
import { getUserPage } from '@/api/AdminUser';
import { getAllCountry } from '@/api/countries-v1';
import { getUser } from '@/api/Users';
import ls from 'store2';

const CustomSelect = ({
  label,
  valueType,
  role,
  type,
  step,
  register,
  resetTrigger,
  setParentId,
  error,
  placeholder,
  clearErr,
  setValue,
  valueForEdit = {},
  errorMessage,
  userRole,
}) => {
  const [lists, setLists] = useState([]);
  const [selectedValue, setSelectedValue] = useState(
    valueForEdit
      ? valueForEdit.parentId
        ? valueForEdit.parentId
        : valueForEdit[valueType]
      : undefined
  );
  const isRequired =
    valueForEdit.parentId === undefined &&
    valueForEdit.gender === undefined &&
    valueForEdit.location === undefined;
  useEffect(() => {
    getLists();
    setValue('parentId', valueForEdit.parentId);
    setValue('gender', valueForEdit.gender);
  }, [role]);

  useEffect(() => {
    setSelectedValue(null);
    setValue('parent_id', null);
    clearErr('parent_id');
    clearErr('gender');
  }, [clearErr, resetTrigger, setValue]);

  const getLists = () => {
    if (role == 'location') {
      getAllCountry()
        .then((res) => {
          setLists(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (role == 'gender') {
      setLists([
        {
          _id: 'male',
          name: 'Male',
        },
        {
          _id: 'female',
          name: '  Female',
        },
      ]);
    } else {
      getUser({
        role: role,
      }).then((res) => {
        setLists(res.data);
      });
    }
  };

  const showLi = (item) => {
    console.log(item);
    if (role == 'location') {
      console.log(item);
      ls.session.set('country_id', item);
      setSelectedValue(item);
      setValue('country_id', item);
      clearErr('country_id');
    } else if (role == 'distributor') {
      ls.session.set('parent_id', item);
      setSelectedValue(item);
      setValue('parent_id', item);
      clearErr('parent_id');
    } else if (role == 'gender') {
      ls.session.set('gender', item);
      setSelectedValue(item);
      setValue('gender', item);
      clearErr('gender');
    } else if (role == 'monitoring_station') {
      ls.session.set('parent_id', item);
      setSelectedValue(item);
      setValue('parent_id', item);
      clearErr('parent_id');
    } else if (role == 'sales_agent') {
      ls.session.set('parent_id', item);
      setSelectedValue(item);
      setValue('parent_id', item);
      clearErr('parent_id');
    } else if (role === 'sales_agent' && userRole === 'end_user') {
      ls.session.set('agent_id', item);
      setSelectedValue(item);
      setValue('agent_id', item);
      clearErr('agent_id');
    } else if (role == 'installer') {
      ls.session.set('installer_id', item);
      setSelectedValue(item);
      setValue('installer_id', item);
      clearErr('installer_id');
    } else if (role == 'office') {
      ls.session.set('parent_id', item);
      setSelectedValue(item);
      setValue('parent_id', item);
      clearErr('parent_id');
    }
  };

  return (
    <div id='customSelectForForm' className='flex flex-col items-start w-full mt-3'>
      <label htmlFor='otp' className='mb-1 font-medium text-[13px] text-[#1B2559]'>
        {label}
      </label>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8086AC',
          },
        }}
      >
        <Select
          style={{
            width: '100%',
            height: '50px',

            fontSize: '16px',
          }}
          placeholder={placeholder}
          onChange={(value) => {
            console.log(value);
            showLi(value);
          }}
          dropdownMatchSelectWidth={false}
          value={selectedValue || valueForEdit[valueType]}
          optionLabelProp='children'
          className='!placeholder:text-[#A3AED0]'
          showSearch
          optionFilterProp='children'
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {role !== 'location'
            ? lists.map((list, index) => {
                return <Select.Option key={index} value={list._id}>{`${list.name}`}</Select.Option>;
              })
            : lists.map((list, index) => {
                return (
                  <Select.Option
                    key={index}
                    value={list._id}
                  >{`${list.country_name}`}</Select.Option>
                );
              })}
        </Select>
      </ConfigProvider>
      {/* Hidden input to handle validation */}
      {
        <input
          type='hidden'
          {...register(valueType, {
            required: isRequired ? errorMessage : false,
          })}
          value={selectedValue || ''}
        />
      }

      <label className='label'>
        {error?.type === 'required' && (
          <span className=' text-sm mt-1 text-red-500'>{error.message}</span>
        )}
      </label>
    </div>
  );
};

export default CustomSelect;
