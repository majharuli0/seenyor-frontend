import React, { useState, useContext } from 'react';
import RestoreUserModal from '@/Shared/RestoreUser/RestoreUserModal';
import { SidebarContext } from '@/Context/CustomUsertable';
import { LiaTrashRestoreAltSolid } from 'react-icons/lia';
import { restoreUser } from '@/api/Users';
export default function RestoreAction({ data }) {
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const sharedMethod = useContext(SidebarContext);

  //handle restore modal
  const handleRestore = () => {
    restoreUser(data?._id).then((res) => {
      if (res) {
        console.log(res);
        sharedMethod?.getlist();
      }
    });
  };
  return (
    <>
      <button
        onClick={() => setShowRestoreModal(true)}
        className='flex gap-1 items-center text-blue-500 font-semibold'
      >
        <LiaTrashRestoreAltSolid size={20} />
        Restore
      </button>
      <RestoreUserModal
        onDelete={() => handleRestore()}
        modalOPen={showRestoreModal}
        setModalOpen={setShowRestoreModal}
      />
    </>
  );
}
