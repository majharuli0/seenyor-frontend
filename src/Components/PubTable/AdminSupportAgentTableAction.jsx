import { Popover } from 'antd';
import React, { useState, useContext, useEffect } from 'react';
import DOMPurify from 'dompurify';
import SupportAgentsEdit from './SupportAgentsEdit';
import SupportAgentsResetPasswordModal from './SupportAgentsResetPasswordModal';
import DeleteModal from '@/Shared/delete/DeleteModal';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CreateAndEditUsers from './CreateAndEditUsers';
import ManageChildUser from '../ManageChildUser/ManageChildUser';
import { SidebarContext } from '@/Context/CustomUsertable';
import { deletUser, deletElderly } from '@/api/AdminUser';
import { deleteUser } from '@/api/Users';
import ls from 'store2';
import { SidebarContext as SidebarContex2 } from '@/Context/CustomContext';
import { useNavigate } from 'react-router-dom';
import { deleteElderly } from '@/api/elderly';
const AdminSupportAgentTableAction = (props) => {
  const { data, handleEmitEvet } = props;
  const [edit, setEdit] = useState(false);
  const [resetModal, setResetMOdal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [manageChildUserModal, setManageChildUserModal] = useState(false);
  const [popupShow, setPopupShow] = useState(false);
  const sharedMethod = useContext(SidebarContext);
  const { rolesFormatter } = useContext(SidebarContex2);
  const [role, setRole] = useState(data?.role);
  const [mainRole, setMainRole] = useState(ls.get('role'));

  const navigate = useNavigate();
  const handleOpenChange = (newOpen) => {
    setPopupShow(newOpen);
  };
  const hanleDelte = () => {
    setRole(data.role);
    setDeleteModal(true);
    setPopupShow(false);
  };
  const handleEmited = () => {
    if (!handleEmitEvet) {
      setEdit(true);
      setPopupShow(false);
    } else {
      handleEmitEvet(data);
    }
  };
  function handleChildModalOpen() {
    setManageChildUserModal(true);
    setPopupShow(false);
  }
  // =====Action button Edit Reset Delete=====
  const content = (
    <div className=' w-fit p-2'>
      {data?.role === 'distributor' ? (
        <button
          onClick={() => {
            navigate(`/super-admin/users/distributor-deal/${data?._id}`);
          }}
          className=' text-sm flex  w-full items-start rounded-[10px] font-medium text-light-black hover:bg-primary/10 hover:text-[#252F67] py-3 px-5'
        >
          {' '}
          Manage Deal
        </button>
      ) : null}
      {data?.role === 'monitoring_agency' ? (
        <button
          onClick={() => {
            navigate(`/super-admin/users/monitoring-station-conf/${data?._id}`);
          }}
          className=' text-sm flex  w-full items-start rounded-[10px] font-medium text-light-black hover:bg-primary/10 hover:text-[#252F67] py-3 px-5'
        >
          {' '}
          Configurations
        </button>
      ) : null}
      {data?.role === 'office' ||
      data?.role === 'nursing_home' ||
      data?.role === 'monitoring_agency' ? (
        <button
          onClick={handleChildModalOpen}
          className=' text-sm flex  w-full items-start rounded-[10px] font-medium text-light-black hover:bg-primary/10 hover:text-[#252F67] py-3 px-5'
        >
          {' '}
          Manage{' '}
          {data?.role === 'nursing_home'
            ? 'Nurses'
            : data?.role === 'monitoring_agency'
              ? 'Monitoring Agent'
              : 'Sales Agents'}
        </button>
      ) : null}
      {data?.role !== 'user' && (
        <button
          onClick={() => {
            handleEmited();
          }}
          className=' text-sm w-full items-start rounded-[10px] font-medium text-light-black hover:bg-primary/10 hover:text-[#252F67] flex  py-3 px-5'
        >
          Edit Details
        </button>
      )}
      {data?.role === 'user' ? null : (
        <button
          onClick={() => {
            setResetMOdal(true);
            setPopupShow(false);
          }}
          className=' text-sm flex  w-full items-start rounded-[10px] font-medium text-light-black hover:bg-primary/10 hover:text-[#252F67] py-3 px-5'
        >
          {' '}
          Reset password
        </button>
      )}
      <button
        onClick={() => {
          hanleDelte();
        }}
        className=' text-sm w-full flex  items-start rounded-[10px] font-medium text-light-black hover:bg-danger/10 hover:text-danger py-3 px-5'
      >
        Delete {rolesFormatter?.[data?.role]}
      </button>
    </div>
  );

  const handalDelete = async () => {
    if (data?.role == 'user') {
      await deleteElderly(data._id).then((res) => {
        if (res) {
          console.log(res);
          setTimeout(() => {
            toast.custom((t) => <CustomToast t={t} text={res.message} />);
          }, 900);
          sharedMethod?.getlist();
        }
      });
    } else {
      await deleteUser(data._id).then((res) => {
        if (res) {
          console.log(res);
          setTimeout(() => {
            toast.custom((t) => <CustomToast t={t} text={res.message} />);
          }, 900);
          sharedMethod?.getlist();
        }
      });
    }
  };
  const handleOfficeDisable = async () => {
    console.log('Triggered The Disable Function');
  };
  return (
    <>
      <div>
        <div>
          <Popover
            open={popupShow}
            onOpenChange={handleOpenChange}
            content={content}
            placement='leftTop'
            trigger='click'
          >
            <button className=' hover:bg-primary/10 rounded-full w-[40px] h-[40px] flex items-center justify-center'>
              {/* <Icon icon="basil:other-2-outline" className=" text-[35px]"/> */}
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
<path d="M11 4.875C11.3452 4.875 11.625 5.15482 11.625 5.5C11.625 5.84518 11.3452 6.125 11 6.125C10.6548 6.125 10.375 5.84518 10.375 5.5C10.375 5.15482 10.6548 4.875 11 4.875ZM11 10.375C11.3452 10.375 11.625 10.6548 11.625 11C11.625 11.3452 11.3452 11.625 11 11.625C10.6548 11.625 10.375 11.3452 10.375 11C10.375 10.6548 10.6548 10.375 11 10.375ZM11 15.875C11.3452 15.875 11.625 16.1548 11.625 16.5C11.625 16.8452 11.3452 17.125 11 17.125C10.6548 17.125 10.375 16.8452 10.375 16.5C10.375 16.1548 10.6548 15.875 11 15.875Z" fill="#666D90" stroke="#666D90" stroke-width="1.5"/>
</svg>`
                  ),
                }}
              ></span>
            </button>
          </Popover>
        </div>
      </div>

      {/* ============= admin edit Modal============ */}
      {/* <SupportAgentsEdit item={data} modalOPen={edit} setModalOpen={setEdit}/> */}
      <CreateAndEditUsers
        item={data}
        getlist={sharedMethod?.getlist}
        role={sharedMethod?.role}
        modalOPen={edit}
        setModalOpen={setEdit}
        isEditMode={edit}
      />
      {/* ============= admin password change Modal============ */}
      <SupportAgentsResetPasswordModal
        item={data}
        getlist={sharedMethod?.getlist}
        modalOPen={resetModal}
        setModalOpen={setResetMOdal}
      />
      {/* ============= admin delete Modal============ */}
      <DeleteModal
        role={role}
        onOfficeDisable={() => handleOfficeDisable()}
        onDelete={() => handalDelete()}
        modalOPen={deleteModal}
        setModalOpen={setDeleteModal}
        title={`Are you sure to delete this ${rolesFormatter?.[data?.role]} account? This`}
        title2={'process CAN’T be undo.'}
      />

      {/* ================= Sales Agents View Of Office ================= */}
      <ManageChildUser
        modalOPen={manageChildUserModal}
        setModalOpen={setManageChildUserModal}
        data={data}
      />
    </>
  );
};

export default AdminSupportAgentTableAction;
