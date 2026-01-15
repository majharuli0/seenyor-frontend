import { Popover, Space } from 'antd';
import React, { useState, useContext, useEffect } from 'react';
import DeleteModal from '@/Shared/delete/DeleteModal';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CreateAdminSupportAgent from '@/Components/PubTable/CreateAndEditUsers';
import { SidebarContext } from '@/Context/CustomUsertable';
import { SidebarContext as SidebarContex2 } from '@/Context/CustomContext';
import { deletUser, deletElderly } from '@/api/AdminUser';
import { deleteUser, dismissAssignedUsers } from '@/api/Users';
import { BiSolidTrash } from 'react-icons/bi';
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
import ls from 'store2';
const ManageChileUserActions = (props) => {
  const { data, handleEmitEvet } = props;
  const [resetModal, setResetMOdal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const sharedMethod = useContext(SidebarContext);
  const { rolesFormatter } = useContext(SidebarContex2);
  const [role, setRole] = useState(data?.role);
  const [edit, setEdit] = useState(false);
  const [mainRole, setMainRole] = useState(ls.get('role'));

  const handleOpenChange = (newOpen) => {
    setPopupShow(newOpen);
  };
  const hanleDelte = () => {
    setRole(data.role);
    setDeleteModal(true);
  };

  // =====Action button Edit Reset Delete=====
  const handleEmited = () => {
    console.log('111', sharedMethod);

    if (!handleEmitEvet) {
      setEdit(true);
    } else {
      handleEmitEvet(data);
    }
  };
  const handalDelete = async () => {
    if (role === 'sales_agent') {
      await dismissAssignedUsers(data?._id)
        .then((res) => {
          if (res) {
            setTimeout(() => {
              toast.custom((t) => <CustomToast t={t} text={res.message} />);
            }, 900);
            sharedMethod?.getlist();
          }
        })
        .finally(() => {
          setDeleteModal(false);
        });
    } else {
      await deleteUser(data?._id).then((res) => {
        if (res) {
          sharedMethod?.getlist();
          setDeleteModal(false);
          setTimeout(() => {
            toast.custom((t) => <CustomToast t={t} text={res.message} />);
          }, 900);
        }
      });
    }
  };
  return (
    <>
      <Space size=''>
        <button
          onClick={() => hanleDelte(data.code)}
          className='group text-center dark-black !hover:text-red-700 px-2 py-2 text-base font-medium opacity-65 hover:opacity-100 hover:bg-red-100 transition-all delay-150 ease-in-out flex gap-2 items-center rounded-md'
        >
          <BiSolidTrash className='text-[#b9bfe2] group-hover:text-red-500 transition-all ease-in-out delay-150' />
        </button>
        {role == 'nurse' || role == 'monitoring_agent' ? (
          <button
            onClick={() => {
              handleEmited();
            }}
            className='group text-center text-blue-200 !hover:text-red-700 px-2 py-2 text-base font-medium opacity-65 hover:opacity-100 hover:bg-slate-200 transition-all delay-100 ease-in-out flex gap-2 items-center rounded-md'
          >
            <BiSolidMessageSquareEdit className='text-[#b9bfe2] group-hover:text-primary transition-all ease-in-out delay-150' />
          </button>
        ) : null}
      </Space>

      {/* ============= admin edit Modal============ */}
      <CreateAdminSupportAgent
        item={data}
        getlist={sharedMethod?.getlist}
        role={role}
        modalOPen={edit}
        setModalOpen={setEdit}
        isEditMode={true}
      />
      {/* ============= admin delete Modal============ */}
      <DeleteModal
        role={role}
        onDelete={() => handalDelete()}
        modalOPen={deleteModal}
        setModalOpen={setDeleteModal}
        title={`Are you sure to delete this ${rolesFormatter?.[data?.role]} account? This`}
        title2={'process CAN’T be undo.'}
      />
    </>
  );
};

export default ManageChileUserActions;
