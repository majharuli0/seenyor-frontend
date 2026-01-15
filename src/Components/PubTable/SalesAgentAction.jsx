import { Popover } from 'antd';
import React, { useState, useContext, useEffect } from 'react';
import SupportAgentsEdit from './SupportAgentsEdit';
import SupportAgentsResetPasswordModal from './SupportAgentsResetPasswordModal';
import DeleteModal from '@/Shared/delete/DeleteModal';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CreateAndEditUsers from './CreateAndEditUsers';
import ManageChildUser from '../ManageChildUser/ManageChildUser';
import { SidebarContext } from '@/Context/CustomUsertable';
import { deletUser, deletElderly } from '@/api/AdminUser';
import { deleteUser, makeDefaultSalesAgent } from '@/api/Users';
import ls from 'store2';
import { SidebarContext as SidebarContex2 } from '@/Context/CustomContext';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '@/Shared/Success/SuccessModal';
const SalesAgentAction = (props) => {
  const { data, handleEmitEvet } = props;
  const [defaultModal, setdDfaultModal] = useState(false);
  const [popupShow, setPopupShow] = useState(false);
  const sharedMethod = useContext(SidebarContext);
  const { rolesFormatter } = useContext(SidebarContex2);
  const [role, setRole] = useState(data?.role);
  const [mainUser, setMainUser] = useState(ls.get('user'));

  const navigate = useNavigate();
  const handleOpenChange = (newOpen) => {
    setPopupShow(newOpen);
  };
  const handleSetDefault = () => {
    setRole(data.role);
    setdDfaultModal(true);
    setPopupShow(false);
  };

  // =====Action button Edit Reset Delete=====
  const content = (
    <div className='w-fit p-2'>
      <button
        onClick={() => {
          handleSetDefault();
        }}
        disabled={data?.is_default}
        className='text-sm w-full flex disabled:opacity-50 disabled:cursor-not-allowed  items-start rounded-[10px] font-medium text-light-black hover:bg-black/10 hover:text-primary py-3 px-5'
      >
        Set as Default Agent
      </button>
    </div>
  );

  const handleDefualt = async () => {
    makeDefaultSalesAgent({
      sales_agent_id: data?._id,
      office_id: mainUser?._id,
    })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={res.message} />);
        sharedMethod?.getlist();
      })
      .catch((err) => {
        console.log(err);
      });
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
                  __html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
<path d="M11 4.875C11.3452 4.875 11.625 5.15482 11.625 5.5C11.625 5.84518 11.3452 6.125 11 6.125C10.6548 6.125 10.375 5.84518 10.375 5.5C10.375 5.15482 10.6548 4.875 11 4.875ZM11 10.375C11.3452 10.375 11.625 10.6548 11.625 11C11.625 11.3452 11.3452 11.625 11 11.625C10.6548 11.625 10.375 11.3452 10.375 11C10.375 10.6548 10.6548 10.375 11 10.375ZM11 15.875C11.3452 15.875 11.625 16.1548 11.625 16.5C11.625 16.8452 11.3452 17.125 11 17.125C10.6548 17.125 10.375 16.8452 10.375 16.5C10.375 16.1548 10.6548 15.875 11 15.875Z" fill="#666D90" stroke="#666D90" stroke-width="1.5"/>
</svg>`,
                }}
              ></span>
            </button>
          </Popover>
        </div>
      </div>

      {/* ============= admin delete Modal============ */}
      <SuccessModal
        role={role}
        onOk={() => handleDefualt(data)}
        modalOPen={defaultModal}
        setModalOpen={setdDfaultModal}
        title={`Are you sure to set this ${rolesFormatter?.[data?.role]} as default agent? This`}
        title2={'can be changed latter.'}
      />
    </>
  );
};

export default SalesAgentAction;
