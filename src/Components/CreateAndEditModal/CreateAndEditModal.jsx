import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, TimePicker } from 'antd';
import CustomModal from '@/Shared/modal/CustomModal';
import CustomInput from '@/Shared/input/CustomInput';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';

import CustomDatePicker from '@/Shared/input/CustomDatePicker';
import CustomTimePicker from '@/Shared/input/CustomTimePicker';
import CustomDateTimePicker from '@/Shared/input/CustomDateTimePicker';
import CustomSelector from '@/Shared/input/CustomSelector';
import CustomMedicationStrengthPicker from '@/Shared/input/CustomMedicationStrengthPicker';
import CustomTextArea from '@/Shared/input/CustomTextArea';
import CustomPlaceSelect from '@/Shared/input/CustomPlaceSelect';
import CustomMultiSelect from '@/Shared/input/CustomMultiSelector';
import DaySelector from '@/Shared/input/DaySelector';
import MultiTimePicker from '@/Shared/input/MultiTimePicker';
import { addMedication } from '@/api/elderly';
import CustomPhoneInput from '@/Shared/input/CustomPhoneNumberInput';
import { getAllCountry } from '@/api/countries-v1';
export default function CreateAndEditModal({
  modalOpen,
  setModalOpen,
  type,
  mode = 'create',
  elderlyId,
  dataToEdit,
  diseases = [],
  allergies = [],
  medications = [],
  custom_condition = [],
  elderlyLatLng,
  onSubmitData,
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: dataToEdit,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [disease, setDisease] = useState(diseases);
  const [selectedCode, setSelectedCode] = useState(null);
  const [countries, setCountries] = useState([{}]);

  // Watch the select_elderly field
  const selectedElderly = watch('select_elderly');
  const selectedContact = watch('contact_type');
  const selectedMedicationFrequency = watch('medication_frequency');
  // Reset form with dataToEdit when modal opens in edit mode
  useEffect(() => {
    if (modalOpen && mode === 'edit' && dataToEdit) {
      Object.keys(dataToEdit).forEach((key) => {
        setValue(key, dataToEdit[key]);
      });
    }

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
  }, [modalOpen, mode, dataToEdit, setValue]);

  // handle submit
  const onSubmit = (data) => {
    console.log(data);

    if (mode === 'edit') {
      // Handle edit logic here
      if (type === 'healthConditions') {
        console.log('Editing data:', data);
      } else if (type === 'medication') {
        console.log('Editing data:', data);
      }
    } else {
      if (type === 'medication') {
        onSubmitData({
          id: elderlyId,
          data: [
            {
              name: data?.medication_name,
              type: data?.medication_type?.label,
              strength: Number(data?.medication_strength),
              unit: data?.medication_unit?.label,
              frequency: data?.medication_frequency?.label,
              interval:
                selectedMedicationFrequency.value === 'As Needed'
                  ? []
                  : selectedMedicationFrequency.value === 'At Regular Interval'
                    ? [data?.medication_interval]
                    : data?.medication_shedule_days,
              does_chart: data?.medication_time,
            },
          ],
        });
      } else if (type === 'event') {
        onSubmitData(data);
      } else if (type === 'contact') {
        onSubmitData({
          contact_person: data?.contact_name,
          contact_number: data?.phone_number,
          contact_number_code: selectedCode,
          relationship: data.relationship,
          gender: data.gender.value,
          coverage_area: Number(data.coverage_area),
        });
      }
      // Handle create logic here
      console.log('Editing data:', data);
      console.log('Creating data:', data);
    }
    reset();
    setModalOpen(false); // Close modal after submission
  };
  //handle multi select change
  const handleMultiSelectChange = (selectedOptions) => {
    console.log('Selected options:', selectedOptions);
  };

  // render custom title by type and mode
  const renderCustomTitle = () => {
    if (type === 'event') {
      return mode === 'create' ? 'Create Event' : 'Edit Event';
    } else if (type === 'elderly') {
      return mode === 'create' ? 'Create Elderly' : 'Update Elderly Profile';
    } else if (type === 'medication') {
      return mode === 'create' ? 'Create Medication' : 'Edit Medication';
    } else if (type === 'health-condition') {
      return mode === 'create' ? 'Create Health Condition' : 'Update Health Condition';
    } else if (type === 'doctor-appointments') {
      return mode === 'create' ? 'Create Doctor Appointments' : 'Update Doctor Appointments';
    } else if (type === 'contact') {
      return mode === 'create' ? 'Create Contact' : 'Update Contact';
    } else if (type === 'healthConditions') {
      return mode === 'create' ? 'Create Health Conditions' : 'Update Health Conditions';
    }
    return '';
  };

  // schemas for create and edit
  const eventSchema = ['event_name', 'datetime', 'select_elderly', 'place', 'textarea'];
  const medicationSchema = [
    'medication_name',
    'medication_type',
    'medication_strength_unit',
    'medication_time',
    // "medication_shedule",
    'medication_frequency',
    'medication_interval',
    'medication_shedule',
  ];
  const elderlySchema = [
    'name',
    'address',
    'age',
    'gender',
    'height',
    'contactPerson',
    'diseases',
    'allergies',
    'medications',
  ];
  const healthConditionSchema = ['diseases', 'allergies', 'custom_condition'];
  const doctorAppointmentsSchema = ['doctor', 'place', 'date', 'time', 'textarea'];
  const contactSchema = ['contact_name', 'gender', 'relationship', 'coverage_area', 'phone_number'];
  const healthConditionsSchema = ['diseases', 'allergies', 'custom_condition'];
  // render fields
  const renderFields = () => {
    if (type === 'event') {
      return eventSchema
        .filter((fieldName) => !(fieldName === 'select_elderly' && elderlyLatLng))
        .map((fieldName) => renderCustomInput(fieldName));
    } else if (type === 'medication') {
      return medicationSchema.map((fieldName) => renderCustomInput(fieldName));
    } else if (type === 'elderly') {
      return elderlySchema.map((fieldName) => renderCustomInput(fieldName));
    } else if (type === 'health-condition') {
      return healthConditionSchema.map((fieldName) => renderCustomInput(fieldName));
    } else if (type === 'doctor-appointments') {
      return doctorAppointmentsSchema.map((fieldName) => renderCustomInput(fieldName));
    } else if (type === 'contact') {
      return contactSchema.map((fieldName) => renderCustomInput(fieldName));
    } else if (type === 'healthConditions') {
      return healthConditionsSchema.map((fieldName) => renderCustomInput(fieldName));
    }
    return null;
  };
  // render custom input
  const renderCustomInput = (fieldName) => {
    const fieldConfig = {
      event_name: {
        label: 'Event Name',
        type: 'text',
        placeholder: 'eg: Appointment with Doctor',
      },
      phone_number: {
        label: 'Phone Number',
        type: 'phone_number',
        placeholder: 'eg: +1 123-456-7890',
        options: countries,
      },
      contact_type: {
        label: 'Contact Type',
        type: 'select',
        placeholder: 'Select contact type',
        options: [
          { value: 'person', label: 'Person' },
          { value: 'emergency', label: 'Emergency Contact' },
          { value: 'other', label: 'Other' },
        ],
      },
      coverage_area: {
        label: 'Distance from User',
        type: 'number',
        placeholder: '(e.g., 5 km)',
        suffix: 'KM',
      },
      relationship: {
        label: 'Relationship',
        type: 'text',
        placeholder: '(e.g., Son, Neighbor)',
      },
      contact_name: {
        label: 'Contact Name',
        type: 'text',
        placeholder: 'Contact Name',
      },
      doctor: {
        label: 'Doctor Name',
        type: 'text',
        placeholder: 'eg: Dr. John Doe',
      },
      medication_name: {
        label: 'Medication Name',
        type: 'text',
        placeholder: 'Medication Name',
      },
      medication_type: {
        label: 'Medication Type',
        type: 'select',
        placeholder: 'Select medication type',
        options: [
          { value: 'Capsule', label: 'Capsule' },
          { value: 'Tablet', label: 'Tablet' },
          { value: 'Liquid', label: 'Liquid' },
          { value: 'Topical', label: 'Topical' },
          { value: 'Topical', label: 'Topical' },
          { value: 'Cream', label: 'Cream' },
          { value: 'Device', label: 'Device' },
          { value: 'Drops', label: 'Drops' },
          { value: 'Foam', label: 'Foam' },
          { value: 'Gel', label: 'Gel' },
          { value: 'Inhaler', label: 'Inhaler' },
          { value: 'Injection', label: 'Injection' },
          { value: 'Lotion', label: 'Lotion' },
          { value: 'Oiltment', label: 'Oiltment' },
          { value: 'Patch', label: 'Patch' },
        ],
      },
      medication_strength_unit: {
        type: 'combined',
        fields: ['medication_strength', 'medication_unit'],
      },
      medication_strength: {
        label: 'Medication Strength',
        type: 'number',
        placeholder: 'Medication Strength',
      },
      medication_unit: {
        label: 'Unit',
        type: 'select',
        placeholder: 'Unit',
        options: [
          {
            value: 'mg',
            label: 'mg',
          },
          {
            value: 'ml',
            label: 'ml',
          },
          {
            value: 'mcg',
            label: 'mcg',
          },
          {
            value: 'g',
            label: 'g',
          },
        ],
      },
      medication_shedule: {
        label: 'Medication Schedule',
        type: 'day-selector',
        placeholder: 'Select days',
      },
      medication_interval: {
        label: 'Medication Interval',
        type: 'select',
        placeholder: 'Medication Interval',
        options: [
          { value: 'Every Day', label: 'Every Day' },
          { value: 'Every Other Day', label: 'Every Other Day' },
          { value: '3 Days', label: '3 Days' },
        ],
      },
      medication_time_and_unit: {
        label: 'Medication Time',
        type: 'multi-time',
        placeholder: 'Select time',
      },
      medication_time: {
        label: 'Medication Time & Amount',
        type: 'multi-time',
        placeholder: 'Select time',
      },
      medication_frequency: {
        label: 'Medication Frequency',
        type: 'select',
        placeholder: 'Select frequency',
        options: [
          { value: 'At Regular Intervals', label: 'At Regular Intervals' },
          {
            value: 'On Specific Days of the Week',
            label: 'On Specific Days of the Week',
          },
          { value: 'As Needed', label: 'As Needed' },
        ],
      },
      name: {
        label: 'Elderly Name',
        type: 'text',
        placeholder: 'Elderly Name',
      },
      age: {
        label: 'Age',
        type: 'number',
        placeholder: 'Age',
      },
      gender: {
        label: 'Gender',
        type: 'select',
        placeholder: 'Select gender',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ],
      },
      height: {
        label: 'Height (cm)',
        type: 'number',
        placeholder: 'Height',
      },
      contactPerson: {
        label: 'Contact Person',
        type: 'text',
        placeholder: 'Contact Person',
      },
      diseases: {
        label: 'Diseases',
        type: 'multi-select',
        placeholder: 'Select diseases',
        options: disease?.map((disease) => ({
          value: disease,
          label: disease,
        })),
      },
      allergies: {
        label: 'Allergies',
        type: 'multi-select',
        placeholder: 'Select allergies',
        options: allergies?.map((allergy) => ({
          value: allergy,
          label: allergy,
        })),
      },
      custom_condition: {
        label: 'Custom Text',
        type: 'multi-select',
        placeholder: 'Select custom text',
        options: custom_condition?.map((condition) => ({
          value: condition,
          label: condition,
        })),
      },
      medications: {
        label: 'Medications',
        type: 'multi-select',
        placeholder: 'Select medications',
        options: medications?.map((medication) => ({
          value: medication,
          label: medication,
        })),
      },
      disease_name: {
        label: 'Disease Name',
        type: 'text',
        placeholder: 'Disease Name',
      },
      date: {
        label: 'Date',
        type: 'date',
        placeholder: 'Select date',
      },
      time: {
        label: 'Time',
        type: 'time',
        placeholder: 'Select time',
      },
      datetime: {
        label: 'Date and Time',
        type: 'datetime',
        placeholder: 'Select date and time',
      },
      select_elderly: {
        label: 'Select Elderly',
        type: 'select',
        placeholder: 'Select elderly',
        options: elderlies,
      },
      disease_type: {
        label: 'Disease Type',
        type: 'select',
        placeholder: 'Select disease type',
        options: [
          { value: 'chronic', label: 'Chronic' },
          { value: 'acute', label: 'Acute' },
          { value: 'infectious', label: 'Infectious' },
        ],
      },
      textarea: {
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Notes',
      },
      place: {
        label: 'Locate A Place',
        type: 'place',
        placeholder: 'Locate a place',
      },
      number: {
        label: 'Contact Number',
        type: 'tel',
        placeholder: 'Contact Number',
      },
    };

    const config = fieldConfig[fieldName];
    const isGenderDisabled = fieldName !== 'gender';
    const isMedicationIntervalDisabled =
      (fieldName === 'medication_interval' &&
        selectedMedicationFrequency?.value === 'On Specific Days of the Week') ||
      (fieldName === 'medication_interval' && selectedMedicationFrequency?.value === 'As Needed') ||
      (fieldName === 'medication_interval' && !selectedMedicationFrequency?.value);
    const isDaySelectorDisabled =
      fieldName === 'medication_shedule' &&
      selectedMedicationFrequency?.value !== 'On Specific Days of the Week';
    console.log(isGenderDisabled, isMedicationIntervalDisabled);
    if (config?.type === 'select') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          defaultValue={dataToEdit ? dataToEdit[fieldName] : ''}
          rules={{
            required: isMedicationIntervalDisabled
              ? ''
              : `Please select ${config?.label.toLowerCase()}`,
          }}
          render={({ field }) => (
            <CustomSelector
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              options={config?.options}
              value={field.value}
              disabled={(type !== 'medication' && isGenderDisabled) || isMedicationIntervalDisabled}
              {...field}
            />
          )}
        />
      );
    }
    if (config?.type === 'combined') {
      return (
        <div className='flex gap-2'>
          {config.fields.map((subField, index) => (
            <div key={subField} className={index === 0 ? 'w-4/5' : 'w-1/5'}>
              {renderCustomInput(subField)}
            </div>
          ))}
        </div>
      );
    }
    if (config?.type === 'medication-strength-picker') {
      return (
        <div className='flex gap-4'>
          <div className='w-full'>
            <CustomInput
              key={fieldName}
              label={config?.label}
              type={config?.type}
              register={register(fieldName, {
                required: {
                  value: true,
                  message: `Please enter ${config?.label.toLowerCase()}`,
                },
              })}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
            />
          </div>
          <div className='w-full'>
            <Controller
              key={fieldName}
              name={fieldName}
              control={control}
              defaultValue={dataToEdit ? dataToEdit[fieldName] : ''}
              rules={{
                required: isGenderDisabled ? '' : `Please select ${config?.label.toLowerCase()}`,
              }}
              render={({ field }) => (
                <CustomMedicationStrengthPicker
                  label={config?.label}
                  error={errors[fieldName]}
                  placeholder={config?.placeholder}
                  options={config?.options}
                  value={field.value}
                  disabled={isGenderDisabled}
                  {...field}
                />
              )}
            />
          </div>
        </div>
      );
    }
    // multiple day selector
    if (config?.type === 'multi-time') {
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <MultiTimePicker
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              {...field}
            />
          )}
        />
      );
    }

    if (config?.type === 'day-selector') {
      return (
        <div
          key={fieldName}
          className={`${
            selectedMedicationFrequency?.value === 'On Specific Days of the Week'
              ? 'block'
              : ' hidden'
          }`}
        >
          <Controller
            name={`${fieldName}_days`}
            control={control}
            rules={{
              required: isDaySelectorDisabled ? '' : 'Please select at least one day',
            }}
            render={({ field }) => (
              <DaySelector
                label={config?.label}
                error={errors[`${fieldName}_days`]}
                placeholder={config?.placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      );
    }
    //select for multiple values
    if (config?.type === 'multi-select') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          // defaultValue={dataToEdit ? dataToEdit[fieldName] : []}
          // rules={{ required: `Please select ${config?.label.toLowerCase()}` }}
          render={({ field }) => (
            <CustomMultiSelect
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              options={config?.options}
              value={field.value}
              onChange={(e) => handleMultiSelectChange(e, field.onChange)}
            />
          )}
        />
      );
    }
    if (config?.type === 'datetime') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          rules={{ required: `Please select ${config.label.toLowerCase()}` }}
          render={({ field }) => (
            <CustomDateTimePicker
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              {...field}
            />
          )}
        />
      );
    }
    if (config?.type === 'date') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          rules={{ required: `Please select ${config.label.toLowerCase()}` }}
          render={({ field }) => (
            <CustomDatePicker
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              {...field}
            />
          )}
        />
      );
    }

    if (config?.type === 'time') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          rules={{ required: `Please select ${config.label.toLowerCase()}` }}
          render={({ field }) => (
            <CustomTimePicker
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              {...field}
            />
          )}
        />
      );
    }
    // Add a new condition in renderCustomInput for textarea
    if (config?.type === 'textarea') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          rules={{}}
          render={({ field }) => (
            <CustomTextArea
              label={config?.label}
              placeholder={config?.placeholder}
              error={errors[fieldName]}
              {...field}
            />
          )}
        />
      );
    }
    if (config?.type === 'phone_number') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          rules={{
            required: {
              value: true,
              message: `Please enter ${config?.label.toLowerCase()}`,
            },
            pattern: {
              value: /^[0-9]{6,15}$/, // only digits, 6–15 chars
              message: 'Phone number must be 6–15 digits',
            },
          }}
          render={({ field }) => (
            <CustomPhoneInput
              label='Phone Number'
              error={errors[fieldName]}
              placeholder='Enter your phone number'
              countryCodes={config.options}
              selectedCode={selectedCode}
              onCodeChange={(value) => {
                setSelectedCode(value.split('_')[0]);
              }}
              disabled={false}
              {...field} // registers value + onChange + onBlur
            />
          )}
        />
      );
    }

    if (config?.type === 'place') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          rules={{}}
          render={({ field }) => (
            <CustomPlaceSelect
              label={config?.label}
              error={errors[fieldName]}
              placeholder={config?.placeholder}
              // Remove the disabled property to ensure the field is always enabled
              elderlyLocation={
                selectedElderly
                  ? { lat: selectedElderly.lat, lng: selectedElderly.lng }
                  : elderlyLatLng
              }
              {...field}
            />
          )}
        />
      );
    }
    return (
      <CustomInput
        key={fieldName}
        label={config?.label}
        type={config?.type}
        register={register(fieldName, {
          required: {
            value: true,
            message: `Please enter ${config?.label.toLowerCase()}`,
          },
        })}
        error={errors[fieldName]}
        placeholder={config?.placeholder}
      />
    );
  };

  return (
    <CustomModal
      handleSubmit={handleSubmit(onSubmit)}
      modalOPen={modalOpen}
      setModalOpen={setModalOpen}
      title={renderCustomTitle()}
      buttonText={mode === 'create' ? 'Create' : 'Update'}
      onclose={() => {
        reset();
      }}
    >
      {renderFields()}
    </CustomModal>
  );
}

export const elderlies = [
  { value: 'elderly_1', label: 'Elderly 1', lat: -25.274398, lng: 133.775136 },
  { value: 'elderly_2', label: 'Elderly 2', lat: -33.86882, lng: 151.209296 },
  { value: 'elderly_3', label: 'Elderly 3', lat: -37.813628, lng: 144.963058 },
];
