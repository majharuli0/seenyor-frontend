import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { ConfigProvider, Input, Select, Tag, theme, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomModal from '@/Shared/modal/CustomModal';
import { updateDiseases, deleteComments, addComments } from '@/api/elderly';
import { CustomContext } from '@/Context/UseCustomContext';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
export default function HealthConditionModal({
  setModalOpen,
  modalOpen,
  mode = 'create',
  diseases,
  custom_condition = [],
  elderly_id,
}) {
  const { token } = theme.useToken();
  const { elderlyDetails, getElderlyDetails } = useContext(CustomContext);

  // State for managing tags
  const [diseaseText, setDiseaseText] = useState(elderlyDetails?.diseases || []);
  const prevDiseaseTextRef = useRef(elderlyDetails?.diseases || []);
  const [customText, setCustomText] = useState(null);
  const [diseaseInputVisible, setDiseaseInputVisible] = useState(false);
  const [customTextInputVisible, setCustomTextInputVisible] = useState(false);
  const [diseaseInputValue, setDiseaseInputValue] = useState('');
  const [customTextInputValue, setCustomTextInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const diseaseInputRef = useRef(null);
  const customTextInputRef = useRef(null);
  const commentInputRef = useRef(null);
  useEffect(() => {
    if (!modalOpen) {
      setCustomText([]);
    }
    setDiseaseText(elderlyDetails?.diseases);
    setCustomText(categorizeData(elderlyDetails?.comments));
  }, [modalOpen]);
  useEffect(() => {
    setCustomText(categorizeData(elderlyDetails?.comments));
  }, [elderlyDetails]);
  // useEffect(() => {
  //   setDiseaseText(elderlyDetails?.diseases);
  // }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // reset();
    // setDiseaseText([]);
    // setCustomText([]);
    // setModalOpen(false);
  };
  const updateDiseaseText = useCallback(
    (data) => {
      updateDiseases({ id: elderlyDetails?._id, data: { diseases: data } })
        .then(() => {
          toast.custom((t) => <CustomToast t={t} text={'Diseases have been updated!'} />);
          getElderlyDetails();
        })
        .catch((err) => {
          toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
        });
    },
    [elderlyDetails]
  );
  const renderCustomTitle = () =>
    mode === 'create' ? 'Create Health Condition' : 'Update Wellness Concerns';

  useEffect(() => {
    if (diseaseInputVisible) {
      diseaseInputRef.current?.focus();
    }
    if (customTextInputVisible) {
      customTextInputRef.current?.focus();
    }
  }, [diseaseInputVisible, customTextInputVisible]);

  // Handle tag operations
  const handleTagClose = (tags, setTags, tag) => {
    setTags(tags.filter((t) => t !== tag));

    updateDiseaseText(tags.filter((t) => t !== tag));
  };
  const handleCommentClose = (tags, setTags, tag) => {
    setTags(tags.filter((t) => t._id !== tag._id));
    deleteComments({ id: elderly_id, data: tags, commentId: tag._id })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={'Comment has been deleted!'} />);
        getElderlyDetails();
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  };

  const handleInputChange = (e, setInputValue) => {
    setInputValue(e.target.value);
  };
  function handleAddComment() {
    if (selectedCategory && inputValue) {
      setError('');
      addComments({
        id: elderly_id,
        data: {
          category: selectedCategory,
          comment: inputValue,
        },
      })
        .then((res) => {
          toast.custom((t) => <CustomToast t={t} text={'Comment has been added!'} />);
          getElderlyDetails();
        })
        .catch((err) => {
          toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
        });
      setSelectedCategory('');
      setInputValue('');
    } else {
      setError('Please select category and write comment.');
    }
  }

  const handleInputConfirm = (tags, setTags, inputValue, setInputVisible, setInputValue) => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    updateDiseaseText([...tags, inputValue]);
    setInputVisible(false);
    setInputValue('');
  };
  const categorizeData = (data) => {
    const categorizedData = {};
    data?.forEach((item) => {
      const { category } = item;
      if (!categorizedData[category]) {
        categorizedData[category] = [];
      }
      categorizedData[category].push(item);
    });
    return categorizedData;
  };

  const renderTagInput = (
    tags,
    setTags,
    inputVisible,
    setInputVisible,
    inputRef,
    inputValue,
    setInputValue,
    tagsFor = ''
  ) => (
    <div className='w-fit flex flex-wrap gap-1 h-auto'>
      <ConfigProvider theme={{ token: { colorPrimary: '#8086AC', fontSize: '15px' } }}>
        {tags?.map((tag, idx) => (
          <Tag
            key={tag}
            closable
            color='#7E60BF'
            onClose={() => handleTagClose(tags, setTags, tag)}
          >
            {tag}
          </Tag>
        ))}
        {inputVisible ? (
          <Input
            ref={inputRef}
            type='text'
            size='small'
            style={{ width: 120, marginTop: 8, paddingLeft: '10px' }}
            value={inputValue}
            onChange={(e) => handleInputChange(e, setInputValue)}
            onBlur={() =>
              handleInputConfirm(tags, setTags, inputValue, setInputVisible, setInputValue)
            }
            onPressEnter={() =>
              handleInputConfirm(tags, setTags, inputValue, setInputVisible, setInputValue)
            }
          />
        ) : (
          tagsFor !== 'customText' && (
            <Tag
              onClick={() => setInputVisible(true)}
              style={{
                background: token.colorBgContainer,
                borderStyle: 'dashed',
                marginTop: 8,
              }}
            >
              <PlusOutlined /> Create New
            </Tag>
          )
        )}
      </ConfigProvider>
    </div>
  );
  const healthConditionMapping = {
    Allergy: 'Environmental Sensitivities',
    Disability: 'Movement Adaptations',
  };
  return (
    <CustomModal
      handleSubmit={handleSubmit(onSubmit)}
      modalOPen={modalOpen}
      setModalOpen={setModalOpen}
      title={renderCustomTitle()}
      buttonText={mode === 'create' ? 'Create' : 'Update'}
      isBottomButtomShow={false}
      onclose={() => {
        reset();
      }}
    >
      <div>
        <div className='mb-4 flex flex-col gap-2'>
          <p className='text-base font-semibold text-[#7E60BF] leading-none flex items-center gap-2'>
            <div id='dot' className='w-2 h-2 bg-[#7E60BF] rounded-full'></div> Conditions
          </p>
          {renderTagInput(
            diseaseText || [],
            setDiseaseText,
            diseaseInputVisible,
            setDiseaseInputVisible,
            diseaseInputRef,
            diseaseInputValue,
            setDiseaseInputValue,
            'diseaseText'
          )}
        </div>

        {customText &&
          Object.keys(customText).map((category, index) => (
            <div key={index} className='mb-4'>
              <p
                className={`text-base font-semibold ${
                  category === 'Sensitivity'
                    ? 'text-[#4ca6cf]'
                    : category === 'Special Needs'
                      ? 'text-[#f37f13]'
                      : 'text-[#0a0a2b]'
                }  leading-none flex items-center gap-2 mb-2`}
              >
                <div
                  id='dot'
                  className={`w-2 h-2 ${
                    category === 'Sensitivity'
                      ? 'bg-[#4ca6cf]'
                      : category === 'Special Needs'
                        ? 'bg-[#f37f13]'
                        : 'bg-[#0a0a2b]'
                  }  rounded-full`}
                ></div>{' '}
                {healthConditionMapping[category] ?? category}
              </p>
              {Array.isArray(customText[category]) ? (
                customText[category].map((tag, idx) => (
                  <ConfigProvider
                    key={idx}
                    theme={{
                      token: { colorPrimary: '#8086AC', fontSize: '15px' },
                    }}
                  >
                    <Tag
                      closable
                      color={
                        tag.category === 'Sensitivity'
                          ? '#4ca6cf'
                          : tag.category === 'Special Needs'
                            ? '#f37f13'
                            : '#0a0a2b'
                      }
                      onClose={() =>
                        handleCommentClose(
                          customText[category],
                          (updatedTags) => {
                            // Update the specific category's tags state
                            setCustomText((prev) => ({
                              ...prev,
                              [category]: updatedTags,
                            }));
                          },
                          tag
                        )
                      }
                    >
                      {tag.comment}
                    </Tag>
                  </ConfigProvider>
                ))
              ) : (
                <p>No items available for this category</p>
              )}
            </div>
          ))}

        <div className='mb-4 flex flex-col gap-1'>
          <h3>Add New Comments</h3>
          <Select
            placeholder='Select a category'
            style={{ width: '100%' }}
            size='large'
            dropdownMatchSelectWidth={false}
            onChange={setSelectedCategory}
            value={selectedCategory ? selectedCategory : null}
            options={[
              {
                value: 'Sensitivity',
                label: 'Sensitivity',
              },
              {
                value: 'Special Needs',
                label: 'Special Needs',
              },
              {
                value: 'Custom Text',
                label: 'Custom Text',
              },
            ]}
          ></Select>
          <div className='flex mb-2'>
            <Input
              ref={commentInputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Enter comment'
              style={{ flex: 1, paddingLeft: '10px' }}
            />
            <Button
              onClick={handleAddComment}
              type='primary'
              style={{
                marginLeft: 8,
                backgroundColor: '#252f67',
                width: '100px',
              }}
            >
              Add
            </Button>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
      </div>
    </CustomModal>
  );
}
