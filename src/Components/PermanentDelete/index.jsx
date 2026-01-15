import React, { useState, useContext } from 'react';
import RestoreUserModal from '@/Shared/RestoreUser/RestoreUserModal';

import { SidebarContext } from '@/Context/CustomUsertable';
import { permanentDeleteUser } from '@/api/Users';
import { LiaTrashAltSolid } from 'react-icons/lia';
import PermanentDeleteModal from '@/Shared/delete/PermanentDeleteModal';
export default function PermanentDeleteAction({ data }) {
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const sharedMethod = useContext(SidebarContext);

  //handle permanent modal
  const handlePermanentDelete = () => {
    permanentDeleteUser(data?._id).then((res) => {
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
        className='flex gap-1 items-center text-red-500 font-semibold text-nowrap'
      >
        <LiaTrashAltSolid size={20} />
        Permanent Delete
      </button>
      <PermanentDeleteModal
        onDelete={() => handlePermanentDelete()}
        modalOPen={showRestoreModal}
        setModalOpen={setShowRestoreModal}
        body=" Are You Sure to Delete This Account? This Proccess Can't Be Undo!"
      />
    </>
  );
}
