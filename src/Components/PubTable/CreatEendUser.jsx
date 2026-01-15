import React, { useEffect, useState, useRef } from 'react';
import CustomModal from '@/Shared/modal/CustomModal';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomInput from '@/Shared/input/CustomInput';
import Select from '@/Shared/Select/index';
import { addUsers, updateenldUser, getUserPage } from '@/api/AdminUser';
import { isEmptyObject } from '@/utils/comFunction';
import { Upload } from 'antd';
import { deletUser } from '@/api/AdminUser';
import DeleteModal from '@/Shared/delete/DeleteModal';
import XLSX from 'xlsx';

const CreateAdminSupportAgent = ({
  modalOPen,
  setModalOpen,
  role = '',
  getlist,
  item = {},
  distributorId = '',
  changeParams = {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
    control,
  } = useForm({
    // 初始化表单的默认值
    defaultValues: {
      testArray: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testArray', // 指定数组字段的名称
  });
  const watchedValue = watch('Nursing Home');
  const [title, setTitle] = useState('Create Elderly');
  const [okbtn, setOkbtn] = useState('Create Elderly');
  const [cstatus, setCstatus] = useState('create');
  const [NursingList, setNursingList] = useState([]);
  const [AgentIdUserList, setAgentIdUserList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [delRole, setDelRole] = useState('');

  useEffect(() => {
    if (modalOPen) {
      //

      if (!isEmptyObject(item)) {
        reset({ testArray: [] });

        setDelRole(item.role);
        setTitle('Edit Elderly');
        setOkbtn('Save');
        const { roomNumber, firstName, lastName } = item;
        console.log('oitem', item.roomNumber, item.firstName, item.lastName);
        setTimeout(() => {
          append({
            roomNumber,
            firstName,
            lastName,
          });
        }, 500);
      } else {
        reset({ testArray: [] });
        setTitle('Create Elderly');
        setOkbtn('Create Elderly');
        setTimeout(() => {
          append({
            roomNumber: undefined,
            firstName: undefined,
            lastName: undefined,
          });
        }, 100);
      }
    }
  }, [modalOPen]);

  // // 使用 useEffect 监听特定值的变化
  // useEffect(() => {
  //     // 在这里执行你想要进行的操作，比如打印值
  //     const specificValue = getValues('Nursing Home');
  //     if (specificValue) {
  //         let row1 = NursingList.find(e => e.label == specificValue)
  //         getsupportAgentIdUser(row1?.key)
  //     }
  // }, [watchedValue]); // 传递 getValues 作为 useEffect 的依赖项

  const onSubmit = (data1) => {
    if (!isEmptyObject(item)) {
      let guests = data1.guests[0];
      updateenldUser({ ...guests, id: item.id }).then((data) => {
        if (data?.code == '00000') {
          toast.custom((t) => <CustomToast t={t} text='Modified successfully' />);
          setModalOpen(false);
          getlist();
          reset();
        }
      });
    } else {
      addUsers([...data1.guests]).then((data) => {
        if (data?.code == '00000') {
          toast.custom((t) => (
            <CustomToast t={t} text={`${item.role} has been created Successfully!`} />
          ));
          setModalOpen(false);
          getlist();
          reset();
        }
      });
    }
  };

  const handalDelete1 = () => {
    setDeleteModal(true);
  };
  const handleAddChange = () => {
    append({ roomNumber: '', firstName: '', lastName: '' });
  };
  const handleExecl = () => {};
  function transformData(inputData) {
    const columnMapping = {
      A: 'roomNumber', //活泼名称
      B: 'firstName', //货号
      C: 'lastName', //入库数量

      // 添加其他字母标识的映射
    };
    return Object.keys(inputData).reduce((result, key) => {
      const column = key.charAt(0);
      const row = key.slice(1);
      const columnName = columnMapping[column] || column;

      result[`row${row}`] = result[`row${row}`] || {};
      result[`row${row}`][columnName] = inputData[key]?.v;
      return result;
    }, {});
  }
  const successUpload = (datas) => {
    let data = datas.file;

    let bo = true;
    let file = datas.file;

    if (file.status !== 'error') {
      return;
    }

    const fileReader = new FileReader();
    // 读取操作完成时
    fileReader.readAsBinaryString(file.originFileObj);
    fileReader.onload = function (ev) {
      try {
        // 二进制数据

        bo = false;
        const workdatas = ev.target.result;
        const workbook = XLSX.read(workdatas, { type: 'binary' });
        let Sheets = workbook.Sheets.Sheet1;
        delete Sheets['!margins'];
        delete Sheets['!ref'];

        let myArray = Object.values(transformData(Sheets));
        myArray.shift();

        myArray.forEach((item, index) => {
          append(item);
        });

        return;
      } catch (e) {
        return;
      }
    };
    // 读取指定文件内容
  };
  const props = {
    showUploadList: false,
    beforeUpload: false,
    onChange: successUpload,
    // beforeUpload: () => {
    //     return false
    // }
  };
  const Foot = () => {
    if (isEmptyObject(item)) {
      return (
        <Upload className='w-full' {...props}>
          <button
            type='button'
            style={{ width: '518px' }}
            className='mt-[10px] font-[500] text-[14px] h-[40px] w-full hover:border-primary hover:text-primary duration-300 px-5 rounded-[10px] bg-transparent text-[#666D90] border border-gray-300'
          >
            Import from File
          </button>
        </Upload>
      );
    } else {
      return (
        <div
          onClick={() => handalDelete1()}
          className='hover:brightness-110 duration-300  cursor-pointer mt-[7px] w-full text-center pt-[12px] pb-[12px]  pt-[7px] text-onBackWarring rounded-[10px] border border-onBackWarring pt-[7px] '
        >
          Delete Distributor
        </div>
      );
    }
  };
  const handalDelete = async () => {
    setDeleteModal(false);
    // setModalOpen(false)
    deletUser({ id: item.id });
    await getlist();
    setTimeout(() => {
      setModalOpen(false);
      toast.custom((t) => (
        <CustomToast t={t} text={`${item.role} has been successfully deleted`} />
      ));
    }, 900);
  };

  return (
    <CustomModal
      modalOPen={modalOPen}
      setModalOpen={setModalOpen}
      handleSubmit={handleSubmit(onSubmit)}
      handalDelete={handalDelete1}
      width={590}
      title={title}
      cstatus={cstatus}
      id={item?.id}
      Foot={<Foot />}
      buttonText={okbtn}
    >
      {fields.map((field, index) => (
        <div key={index} className='flex items-center gap-4'>
          <Controller
            name={`guests[${index}].roomNumber`}
            control={control}
            defaultValue={field.roomNumber} // 初始化字段值
            render={({ field }) => {
              return (
                <CustomInput
                  label={'Room Number'}
                  type={'text'}
                  register={register(`guests[${index}].roomNumber`, {
                    required: {
                      value: true,
                      message: 'Please enter Room Number',
                    },
                  })}
                  error={errors.roomNumber}
                  placeholder={'Enter Room Number'}
                />
              );
            }}
            // <input {...field} placeholder="Room Number" />
          />
          <Controller
            name={`guests[${index}].firstName`}
            control={control}
            defaultValue={field.firstName} // 初始化字段值
            render={({ field }) => {
              return (
                <CustomInput
                  label={'firstName'}
                  type={'text'}
                  register={register(`guests[${index}].firstName`, {
                    required: {
                      value: true,
                      message: 'Please enter first name',
                    },
                  })}
                  error={errors.firstName}
                  placeholder={'Enter firstName'}
                />
              );
            }}
          />
          <Controller
            name={`guests[${index}].lastName`}
            control={control}
            defaultValue={field.lastName} // 初始化字段值
            render={({ field }) => {
              return (
                <CustomInput
                  label={'lastName'}
                  type={'text'}
                  register={register(`guests[${index}].lastName`, {
                    required: {
                      value: true,
                      message: 'Please enter lastName',
                    },
                  })}
                  error={errors.lastName}
                  placeholder={'Enter lastName'}
                />
              );
            }}
          />

          {/* <CustomInput
                        label={"firstName"}
                        type={"text"}
                        register={
                            register("firstName", {
                                required: {
                                    value: true,
                                    message: "Please enter firstName",
                                },
                            })
                        }
                        error={errors.firstName}
                        placeholder={"Enter firstName"}

                    />
                    <CustomInput
                        label={"lastName"}
                        type={"text"}
                        register={
                            register("lastName", {
                                required: {
                                    value: true,
                                    message: "Please enter lastName",
                                },
                            })
                        }
                        error={errors.lastName}
                        placeholder={"Enter lastName"}

                    /> */}
        </div>
      ))}
      <DeleteModal
        onDelete={() => handalDelete()}
        modalOPen={deleteModal}
        setModalOpen={setDeleteModal}
        title={`Are you sure to delete this ${delRole} account? This`}
        title2={' process CAN’T be undo.'}
      />
    </CustomModal>
  );
};

export default CreateAdminSupportAgent;
