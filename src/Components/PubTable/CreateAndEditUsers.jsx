import React, { useEffect, useState, useRef } from 'react';
import CustomModal from '@/Shared/modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomSelector from '@/Shared/input/CustomSelector';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import CustomInput from '@/Shared/input/CustomInput';
import CustomSelect from '@/Shared/input/CustomSelect';
import Select from '@/Shared/Select/index';
import { isEmptyObject } from '@/utils/comFunction';
import DeleteModal from '@/Shared/delete/DeleteModal';
import ls from 'store2';
import { updateUserDetails, addNewUser, addNewEndUser } from '@/api/Users';
import PasswordInput from '@/Shared/input/PasswordInput';
import CustomPhoneInput from '@/Shared/input/CustomPhoneNumberInput2';
import { getAllCountry } from '@/api/countries-v1';

import {
  fieldRoleMapping,
  getRoleLabel,
  getRoleMessage,
  getModalConfig,
  filterDataByRole,
  getDefaultFormValues,
  passwordValidationRules,
} from './userRoleUtils';
import { deletUser } from '@/api/AdminUser';
import { updateElderlies } from '@/api/elderly';

const CreateAndEditUsers = ({
  isEditMode,
  modalOPen,
  setModalOpen,
  role = '',
  getlist,
  ownEdit,
  item = {},
  parentID,
  changeParams = {},
  handleClose = () => {},
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    clearErrors,
  } = useForm({
    defaultValues: getDefaultFormValues(item),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [title, setTitle] = useState('');
  const [isOwnEditModal, setIsOwnEditModal] = useState(false);
  const [okbtn, setOkbtn] = useState('');
  const [cstatus, setCstatus] = useState('create');
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delRole, setDelRole] = useState('');
  const [parentId, setParentId] = useState('');
  const loginRole = ls.get('user')['role'];
  const [mainRole, setMainRole] = useState(ls.get('mainRole'));
  const [resetTrigger, setResetTrigger] = useState(false);
  const [countries, setCountries] = useState([{}]);

  useEffect(() => {
    setIsOwnEditModal(ownEdit);
    if (modalOPen) {
      reset();

      if (!isEmptyObject(item)) {
        setDelRole(item.role);
        const {
          firstName,
          lastName,
          businessEmail,
          businessName,
          businessAdress,
          contactPerson,
          contactNumber,
          contact_code,
          //newPortal V1
          country_id,
          name,
          last_name,
          contact_number,
          contact_person,
          address,
          email,
          gender,
          age,
          room_no,
          office_id,
          agent_id,
          distributor_id,
          monitoring_station_id,
          installer_id,
          id,
          managerName,
        } = item;
        setValue('firstName', firstName);
        setValue('lastName', lastName);
        setValue('businessEmail', businessEmail);
        setValue('businessName', businessName);
        setValue('businessAdress', businessAdress);
        setValue('contactPerson', contactPerson);
        setValue('contactNumber', contactNumber);

        //NewPortal V1
        setValue('name', name);
        setValue('last_name', last_name);
        setValue('email', email);
        setValue('country_id', country_id);
        setValue('contact_number', contact_number);
        setValue('address', address);
        setValue('office_id', office_id);
        setValue('agent_id', agent_id);
        setValue('distributor_id', distributor_id);
        setValue('monitoring_station_id', monitoring_station_id);
        setValue('installer_id', monitoring_station_id);
        setValue('age', age);
        setValue('room_no', room_no);
        setValue('gender', gender);
        setValue('contact_person', contact_person);
        setValue('managerName', managerName);
        setValue('contact_code', contact_code);
        setValue('id', id);
      } else {
        setCstatus('create');
      }

      if (!isOwnEditModal) {
        const modalConfig = getModalConfig(role, isEmptyObject, item, isOwnEditModal);
        setTitle(modalConfig.title);
        setOkbtn(modalConfig.okbtn);
      } else {
        setTitle('Edit Profile');
        setOkbtn('Save');
      }
    }
  }, [modalOPen]);

  useEffect(() => {
    if (modalOPen) {
      getAllCountry()
        .then((res) => {
          const seen = new Set();
          const customizedCountryLabel = res?.data
            .map((country) => ({
              label: `${country.country_name} (${country.country_code})`,
              value: `${country.country_code}_${country.country_name}`,
            }))
            .filter((item) => {
              if (seen.has(item.value)) {
                return false;
              }
              seen.add(item.value);
              return true;
            });

          setCountries(customizedCountryLabel);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [modalOPen]);

  const onSubmit = (data1) => {
    const creatorID = ls.get('user')._id;
    const agent_id = ls.session.get('agent_id');
    const country_id = ls.session.get('country_id');
    const parent_id = ls.session.get('parent_id');

    if (country_id) data1.country_id = country_id;
    if (parent_id) {
      data1.parent_id = parent_id;
    } else {
      data1.parent_id = creatorID;
    }

    let changeParams1 = { ...changeParams };
    let data = { ...data1 };

    // Filter out fields based on role using utility function
    data = filterDataByRole(data, role);

    setLoading(true);
    if (!isEmptyObject(item)) {
      if (mainRole === 'super_admin') {
        delete data['parent_id'];
      }
      if (mainRole === 'super_admin' && role === 'end_user') {
        delete data['agent_id'];
        delete data['country_id'];
      }
      if (mainRole == 'office') {
        delete data['parent_id'];
      } else if ((mainRole == 'distributor' && role === 'sales_agent') || role === 'office') {
        delete data['parent_id'];
        delete data['parent_id'];
      } else if (mainRole === 'sales_agent' || mainRole === 'monitoring_station') {
        delete data['parent_id'];
      } else if (mainRole === 'nursing_home' && role === 'nurse') {
        delete data['parent_id'];
      } else if (mainRole === 'nurse' && role === 'nurse') {
        delete data['parent_id'];
      }
      if (role !== 'elderly') {
        updateUserDetails(item?._id, { ...data })
          .then((res) => {
            toast.custom((t) => <CustomToast t={t} text={'Modified successfully!'} />);
            setModalOpen(false);
            getlist();
            reset();
            setResetTrigger(!resetTrigger);
            ls.session.set('country_id', null);
          })
          .catch((err) => {
            toast.custom((t) => (
              <CustomErrorToast t={t} title='Error' text={err.response.data.message} />
            ));
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        updateElderlies(item?._id, {
          ...data,
          age: Number(data.age),
          room_no: Number(data.room_no),
        })
          .then((res) => {
            toast.custom((t) => <CustomToast t={t} text={'Modified successfully!'} />);
            setModalOpen(false);
            getlist();
            reset();
            setResetTrigger(!resetTrigger);
            ls.session.set('country_id', null);
          })
          .catch((err) => {
            toast.custom((t) => (
              <CustomErrorToast t={t} title='Error' text={err.response.data.message} />
            ));
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (Object.keys(errors).length === 0) {
      if (mainRole === 'sales_agent' && (role !== 'installer' || role !== 'supports_agent')) {
        if (role === 'installer' || role === 'supports_agent') {
          data.parent_id = parent_id;
          console.log('1');
        } else {
          data.parent_id = creatorID;
        }
      }
      if (mainRole === 'nursing_home' && role === 'end_user') {
        data.parent_id = parentID;
      }
      if (
        mainRole === 'distributor' ||
        (mainRole === 'monitoring_station' && role !== 'end_user') ||
        role === 'nurse'
      ) {
        if (role === 'nurse') {
          data.parent_id = parentID;
        } else if (role !== 'sales_agent') {
          data.parent_id = creatorID;
        }
      }
      if (role == 'end_user' && mainRole == 'super_admin') {
        delete data.parent_id;
      }
      if (role == 'monitoring_agent' && mainRole == 'super_admin') {
        data.parent_id = parentID;
      }
      if (role !== 'elderly') {
        addNewUser({
          ...data,
          role,
        })
          .then((res) => {
            toast.custom((t) => <CustomToast t={t} text={'New User Created Successfully!'} />);
            setModalOpen(false);
            getlist();
            reset();
            setResetTrigger(!resetTrigger);
            ls.session.set('country_id', null);
            ls.session.set('parent_id', null);
          })
          .catch((err) => {
            toast.custom((t) => (
              <CustomErrorToast t={t} title='Error' text={err.response.data.message} />
            ));
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      console.log('Validation errors:', errors);
      setLoading(false);
      console.log(data);
    }
  };

  const onModalClose = () => {
    reset();
    setResetTrigger(!resetTrigger);
  };

  const handalDelete = () => {
    setDeleteModal(false);
    deletUser({ id: item.id });

    setTimeout(() => {
      getlist();
      setModalOpen(false);
      toast.custom((t) => <CustomToast t={t} text={`${role} has been successfully deleted`} />);
      handleClose();
    }, 900);
  };

  const handalDelete1 = () => {
    setDeleteModal(true);
  };

  const renderCustomInput = (
    label,
    type,
    name,
    placeholder,
    registerOptions
    // errors
  ) =>
    name === 'contact_number' ? (
      <div>
        <Controller
          name='contact_code'
          control={control}
          rules={registerOptions.code || { required: 'Country code is required' }}
          defaultValue={getValues('contact_code') || (countries && countries[0].value)}
          render={({ field: codeField }) => (
            <Controller
              name='contact_number'
              control={control}
              rules={
                registerOptions.number || {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{7,15}$/,
                    message: 'Phone number must be 6-15 digits',
                  },
                }
              }
              defaultValue=''
              render={({ field: numberField }) => (
                <CustomPhoneInput
                  label='Phone Number'
                  error={errors?.contact_number || errors?.contact_code}
                  placeholder='Enter your phone number'
                  countryCodes={countries}
                  selectedCode={getValues('contact_code')}
                  onCodeChange={codeField.onChange}
                  disabled={false}
                  field={numberField}
                />
              )}
            />
          )}
        />
      </div>
    ) : (
      <CustomInput
        label={label}
        type={type}
        register={register(name, registerOptions)}
        error={errors[name]}
        placeholder={placeholder}
      />
    );

  return (
    <CustomModal
      modalOPen={modalOPen}
      setModalOpen={setModalOpen}
      handleSubmit={handleSubmit(onSubmit)}
      handalDelete={handalDelete1}
      loading={loading}
      width={590}
      title={title}
      cstatus={cstatus}
      id={item?.id}
      buttonText={okbtn}
      onclose={onModalClose}
    >
      {/* <=================newPortal V1======================> */}

      {/* <=================All Type Of Name Feild=================> */}
      {/* <=================First Name Last name Feild=================> */}

      <div className='flex items-center gap-4'>
        {fieldRoleMapping.name.includes(role) &&
          renderCustomInput(
            `${getRoleLabel(role)} Name`,
            'text',
            'name',
            `Enter ${getRoleLabel(role)} Name`,
            {
              required: {
                value: true,
                message: `Please enter ${getRoleLabel(role)} Name`,
              },
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
            },
            errors
          )}
        {fieldRoleMapping.last_name.includes(role) &&
          renderCustomInput(
            `Last Name`,
            'text',
            'last_name',
            `Enter Last Name`,
            {
              required: {
                value: true,
                message: `Please enter last Name`,
              },
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
            },
            errors
          )}
      </div>

      {/* <============Email Feild===============> */}
      {fieldRoleMapping.email.includes(role) && (
        <div>
          {renderCustomInput(
            'E-mail',
            'email',
            'email',
            'Enter E-Mail',
            {
              required: {
                value: true,
                message: 'Please enter E-mail',
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address',
              },
            },
            errors
          )}
        </div>
      )}

      {/* <=================Phone Number Feild=================> */}
      {fieldRoleMapping.phoneNumber.includes(role) && (
        <>
          {renderCustomInput(
            'Contact Number',
            'text',
            'contact_number',
            'Enter Contact Number',
            errors
          )}
        </>
      )}

      {/* <=================Sales Agent Code=================> */}
      {fieldRoleMapping.supportAgentCode.includes(role) && mainRole == 'super_admin' && (
        <>
          {isEmptyObject(item) &&
            renderCustomInput(
              'Agent ID',
              'text',
              'agent_id',
              'Enter 6-digit Agent ID',
              {
                required: {
                  value: true,
                  message: 'Please enter Agent ID',
                },
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Agent ID must be exactly 6 digits',
                },
              },
              errors
            )}
        </>
      )}
      {fieldRoleMapping.subscriptionId.includes(role) && mainRole === 'super_admin' && (
        <>
          {isEmptyObject(item) &&
            renderCustomInput(
              'Subscription ID',
              'text',
              'subscription_id',
              'Enter a  Subscription ID',
              {
                required: {
                  value: true,
                  message: 'Please enter Subscription ID',
                },
              },
              errors
            )}
          {isEmptyObject(item) && (
            <>
              {window.location.href.includes('elderlycareplatform.com') ? (
                <p>
                  <b>Test ID:</b> sub_1RdXSyG2eKiLhL9BPiIccjda
                </p>
              ) : (
                <p>
                  <b>Test ID: </b> sub_1SB4s2G2eKiLhL9BZE2bNCEz
                </p>
              )}
            </>
          )}
        </>
      )}

      {/* <=================Contact Person Name=================> */}
      {fieldRoleMapping.contactPerson.includes(role) && (
        <>
          {renderCustomInput(
            'Contact Person',
            'text',
            'contact_person',
            'Enter Contact Person Name',
            {
              required: {
                value: true,
                message: 'Please enter contact person name',
              },
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
            },
            errors
          )}
        </>
      )}

      {/* <=================Assigne=================> */}
      {fieldRoleMapping.selectDistributor.includes(role) &&
        !ownEdit &&
        mainRole == 'super_admin' &&
        !isEditMode && (
          <CustomSelect
            clearErr={clearErrors}
            setValue={setValue}
            valueForEdit={item}
            valueType='parent_id'
            label='Select Distributor'
            type='select'
            role='distributor'
            register={register}
            resetTrigger={resetTrigger}
            error={errors.parent_id}
            errorMessage='You need to select a distributor'
            placeholder='Select a Distributor'
          />
        )}

      {fieldRoleMapping.selectOffice.includes(role) &&
        !ownEdit &&
        mainRole !== 'office' &&
        !isEditMode && (
          <CustomSelect
            clearErr={clearErrors}
            setValue={setValue}
            valueForEdit={item}
            valueType='parent_id'
            label='Select Office'
            type='select'
            role='office'
            register={register}
            resetTrigger={resetTrigger}
            error={errors.parent_id}
            errorMessage='You need to select an office'
            placeholder='Select an office'
          />
        )}

      {fieldRoleMapping.selectAgent.includes(role) &&
        !ownEdit &&
        (mainRole == 'super_admin' || mainRole == 'distributor') &&
        !isEditMode && (
          <CustomSelect
            clearErr={clearErrors}
            setValue={setValue}
            valueForEdit={item}
            valueType='parent_id'
            label='Select Agent'
            type='select'
            role='sales_agent'
            userRole={role}
            register={register}
            resetTrigger={resetTrigger}
            error={errors.parent_id}
            errorMessage='You need to select an Agent'
            placeholder='Select an agent'
          />
        )}

      {fieldRoleMapping.selectMonitoringStation.includes(role) &&
        !ownEdit &&
        mainRole !== 'monitoring_station' &&
        mainRole !== 'office' &&
        (mainRole === 'super_admin' || mainRole === 'sales_agent') &&
        !isEditMode && (
          <CustomSelect
            clearErr={clearErrors}
            setValue={setValue}
            valueForEdit={item}
            valueType='parent_id'
            label='Select Control Center'
            type='select'
            role='monitoring_station'
            register={register}
            resetTrigger={resetTrigger}
            error={errors.parent_id}
            errorMessage='You need to select a control center'
            placeholder='Select a Control Center'
          />
        )}

      {fieldRoleMapping.selectInstaller.includes(role) &&
        !ownEdit &&
        mainRole === 'super_admin' &&
        !isEditMode && (
          <CustomSelect
            clearErr={clearErrors}
            setValue={setValue}
            valueForEdit={item}
            valueType='installer_id'
            label='Select Installer'
            type='select'
            role='installer'
            register={register}
            resetTrigger={resetTrigger}
            error={errors.agent_id}
            errorMessage='You need to select an installer'
            placeholder='Select an Installer'
          />
        )}

      {/* <=================Location=================> */}
      {fieldRoleMapping.location.includes(role) && !ownEdit && !isEditMode && (
        <CustomSelect
          label='Location'
          type='select'
          clearErr={clearErrors}
          role='location'
          valueType='country_id'
          setValue={setValue}
          valueForEdit={item}
          register={register}
          resetTrigger={resetTrigger}
          error={errors.country_id}
          errorMessage='You need to select a Location'
          placeholder='Select Location'
        />
      )}

      {/* <=================Address=================> */}
      {fieldRoleMapping.address.includes(role) && (
        <>
          {renderCustomInput(
            'Address',
            'text',
            'address',
            'Enter Address',
            {
              required: {
                value: true,
                message: 'Please enter address',
              },
              minLength: {
                value: 5,
                message: 'Address must be at least 5 characters',
              },
            },
            errors
          )}
        </>
      )}
      {fieldRoleMapping.age.includes(role) && (
        <>
          {renderCustomInput(
            'Age',
            'number',
            'age',
            'Enter Age',
            {
              required: {
                value: true,
                message: 'Please enter age',
              },
              minLength: {
                value: 1,
                message: 'Age must be at least 1 characters',
              },
            },
            errors
          )}
        </>
      )}
      {fieldRoleMapping.room_no.includes(role) && (
        <>
          {renderCustomInput(
            'Room No',
            'number',
            'room_no',
            'Enter Room No',
            {
              required: {
                value: true,
                message: 'Please enter room no',
              },
              minLength: {
                value: 1,
                message: 'Room no must be at least 1 characters',
              },
            },
            errors
          )}
        </>
      )}
      {fieldRoleMapping.gender.includes(role) && (
        <CustomSelect
          clearErr={clearErrors}
          setValue={setValue}
          valueForEdit={item}
          valueType='gender'
          label='Select Gender'
          type='select'
          role='gender'
          register={register}
          resetTrigger={resetTrigger}
          error={errors.gender}
          errorMessage='You have to select gender'
          placeholder='Select Gender'
        />
      )}
      {/* <=================Password=================> */}
      {!isEditMode && fieldRoleMapping.password.includes(role) && (
        <PasswordInput
          label='Password'
          placeholder='Enter Password'
          register={register('password', passwordValidationRules)}
          error={errors.password}
        />
      )}

      {/* <====================== end of new portal V1 =================> */}
      {/* 
      {["Distributor", "Nursing Home"].includes(role) ? (
        renderCustomInput(
          `${getRoleLabel(role)} Name`,
          "text",
          "businessName",
          `Enter ${getRoleLabel(role)} Name`,
          {
            required: {
              value: true,
              message: `Please enter ${getRoleMessage(role)} Name`,
            },
          },
          errors
        )
      ) : [
          "office",
          "sales_agent",
          "nursing_home",
          "monitoring_station",
          "installer",
          "nurse",
          "monitoring_agent",
          "supports_agent",
          "end_user",
          "super_admin",
          "distributor",
          "monitoring_agency",
        ].includes(role) ? null : (
        <div className="flex items-center gap-4">
          {renderCustomInput(
            "First Name",
            "text",
            "firstName",
            "Enter First Name",
            {
              required: {
                value: true,
                message: "Please enter first name",
              },
              minLength: {
                value: 2,
                message: "Must be at least 2 characters",
              },
            },
            errors
          )}
          {renderCustomInput(
            "Last Name",
            "text",
            "lastName",
            "Enter Last Name",
            {
              required: {
                value: true,
                message: "Please enter last name",
              },
              minLength: {
                value: 2,
                message: "Must be at least 2 characters",
              },
            },
            errors
          )}
        </div>
      )} */}

      {['Office'].includes(role) && (
        <>
          {renderCustomInput(
            `${getRoleLabel(role)} Manager Name`,
            'text',
            'managerName',
            `Enter ${getRoleLabel(role)} Manager Name`,
            {
              required: {
                value: true,
                message: `Please enter ${getRoleMessage(role)} manager name`,
              },
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
            },
            errors
          )}
        </>
      )}

      {(role === 'Nursing Home' || role === 'Sales Agent') &&
        !['Distributor', 'Sales Agent'].includes(loginRole) && (
          <CustomSelect
            setParentId={setParentId}
            label='Distributor'
            type='select'
            role='Distributor'
            clearErr={clearErrors}
            setValue={setValue}
            valueForEdit={item}
            register={register}
            error={errors.parentId}
            errorMessage='You need to select distributor'
            placeholder='Select Distributor'
          />
        )}

      {role === 'Support Agent' && loginRole !== 'Nursing Home' && (
        <CustomSelect
          setParentId={setParentId}
          clearErr={clearErrors}
          setValue={setValue}
          valueForEdit={item}
          label='Nursing Home'
          type='select'
          role='Nursing Home'
          register={register}
          error={errors.parentId}
          errorMessage='You need to select nursing home'
          placeholder='Select Nursing Home'
        />
      )}

      {/* Common Fields */}
      {[
        'Distributor',
        'Nursing Home',
        'Sales Agent',
        'End Users',
        'Super Admin',
        'Support Agent',
        'Nurse',
      ].includes(role) && (
        <div>
          {renderCustomInput(
            'E-mail',
            'email',
            'businessEmail',
            'Enter E-Mail',
            {
              required: {
                value: true,
                message: 'Please enter E-mail',
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            },
            errors
          )}

          {isEmptyObject(item) &&
            renderCustomInput(
              'Password',
              'password',
              'password',
              'Enter Password',
              {
                required: {
                  value: true,
                  message: 'Please enter Password',
                },
              },
              errors
            )}

          {[
            'Distributor',
            'Nursing Home',
            'Sales Agent',
            'End Users',
            'Support Agent',
            'Super Admin',
            'Office',
          ].includes(role) && (
            <>
              {renderCustomInput(
                'Address',
                'text',
                'businessAdress',
                'Enter Address',
                {
                  required: {
                    value: true,
                    message: 'Please enter address',
                  },
                  minLength: {
                    value: 5,
                    message: 'Address must be at least 5 characters',
                  },
                },
                errors
              )}
            </>
          )}

          {[
            'Distributor',
            'Nursing Home',
            'Sales Agent',
            'Office',
            'End Users',
            'Support Agent',
            'Super Admin',
            'Nurse',
          ].includes(role) && (
            <>
              {renderCustomInput(
                'Contact Number',
                'text',
                'contactNumber',
                'Enter Contact Number',
                {
                  required: {
                    value: true,
                    message: 'Please enter contact number',
                  },
                },
                errors
              )}
            </>
          )}

          {['Sales Agent'].includes(role) && (
            <CustomSelect
              setParentId={setParentId}
              clearErr={clearErrors}
              setValue={setValue}
              valueForEdit={item}
              label='Select Office'
              type='select'
              role='Office'
              register={register}
              error={errors.parentId}
              errorMessage='You need to select an office'
              placeholder='Select an office'
            />
          )}

          {['Sales Agent'].includes(role) && (
            <>
              {renderCustomInput(
                `Location of Sales`,
                'text',
                'location',
                `Enter Sales Location`,
                {
                  required: {
                    value: true,
                    message: `Please enter sales location`,
                  },
                },
                errors
              )}
            </>
          )}
        </div>
      )}

      <DeleteModal
        onDelete={() => handalDelete()}
        modalOPen={deleteModal}
        setModalOpen={setDeleteModal}
        title={`Are you sure to delete this ${delRole} account? This`}
        title2=" process CAN'T be undone."
      />
    </CustomModal>
  );
};

export default CreateAndEditUsers;
