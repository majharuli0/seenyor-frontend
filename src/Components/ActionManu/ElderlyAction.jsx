import { Button, Space } from 'antd';
import React, { useContext, useState } from 'react';
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import CreateAndEditUsers from '../PubTable/CreateAndEditUsers';
import { SidebarContext } from '@/Context/CustomUsertable';

export default function ElderlyAction({ row = {} }) {
  const navigate = useNavigate();
  const sharedMethod = useContext(SidebarContext);
  const [edit, setEdit] = useState(false);

  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${row?._id}`);
  };
  function handleEditClick() {
    setEdit(true);
    // sharedMethod?.getlist();
  }
  return (
    <>
      <Space>
        <Button type='primary' icon={<AiOutlineEdit />} onClick={() => handleEditClick()}>
          Edit
        </Button>
        <Button icon={<AiOutlineEye />} onClick={() => handleViewClick(row)}>
          View
        </Button>
      </Space>
      <CreateAndEditUsers
        item={{ ...row, role: 'elderly' }}
        getlist={sharedMethod?.getlist}
        role={'elderly'}
        modalOPen={edit}
        setModalOpen={setEdit}
        isEditMode={edit}
      />
    </>
  );
}
