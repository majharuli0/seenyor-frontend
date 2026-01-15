import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CreateAdminSupportAgent from '@/Components/PubTable/CreateAndEditUsers';
import { SidebarContext } from '@/Context/CustomUsertable';

import CustomModal from '@/Shared/modal/CustomModal';
import { Table, ConfigProvider, Select, Space, Button } from 'antd';
import CustomButton from '@/Shared/button/CustomButton';
import { MdAdd } from 'react-icons/md';
import * as DemoData from './data';
import './style.css';
import DeleteModal from '@/Shared/delete/DeleteModal';
import { useGetColumnsByRoleAndActiveTab } from './utiles';
const { Option } = Select;
import { getUser, assignUsers, getAssignedUser, getAgent, getUserDetails } from '@/api/Users';
import * as SidebarContext1 from '@/Context/CustomUsertable';
import CustomTable from '@/Shared/Table/CustomTable';
import ls from 'store2';
export default function ManageChildUser({ modalOPen, setModalOpen, data }) {
  const [modalTitle, setModalTitle] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [createNurse, setCreateNurse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const sharedMethod = useContext(SidebarContext);
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = ls.get('user');
  const getCulumns = useGetColumnsByRoleAndActiveTab(data?.role);
  // Handle selection of items
  const handleSelectChange = (value) => {
    setSelectedItems(value);
  };
  const handleDelete = async () => {
    setDeleteModal(true);
  };
  const handleClick = () => {
    if (data?.role == 'office') {
      assignUsers({ parent_id: data?._id, child_ids: selectedItems }).then((res) => {
        setTimeout(() => {
          toast.custom((t) => <CustomToast t={t} text={res.message} />);
        }, 900);
        setSelectedItems([]);
        sharedMethod?.getlist();
        setModalOpen(false);
      });
    } else {
      setCreateNurse(true);
    }
  };
  // Filter data based on both name and code
  const filteredData = agentList.filter((item) => {
    const searchQuery = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchQuery) || item._id.toLowerCase().includes(searchQuery)
    );
  });
  async function getAgentList() {
    const distributorId = await getUserDetails({
      id: data?._id,
    })
      .then((res) => {
        return res?.data?.hierarchy?.distributor_id;
      })
      .catch((err) => {
        console.log(err);
        return '';
      });
    await getAgent({ distributor_id: distributorId, available: true })
      .then((res) => {
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    if (getCulumns) {
      setColumns(getCulumns);
    }
  }, [getCulumns]);
  function getlist() {
    setLoading(true);
    if (data?.role == 'office') {
      setModalTitle('Manage Sales Agents');
      getAssignedUser(data?._id, {
        role: 'sales_agent',
      })
        .then((res) => {
          if (res) {
            setDataSource(res?.data?.users);
          }
        })
        .finally((err) => {
          setLoading(false);
        });
    } else if (data?.role == 'nursing_home') {
      setModalTitle('Manage Nurses');
      getAssignedUser(data?._id, {
        role: 'nurse',
      })
        .then((res) => {
          if (res) {
            setDataSource(res?.data?.users);
          }
        })
        .finally((err) => {
          setLoading(false);
        });
    } else if (data?.role == 'monitoring_agency') {
      setModalTitle('Manage Monitoring Agent');
      getAssignedUser(data?._id, {
        role: 'monitoring_agent',
      })
        .then((res) => {
          if (res) {
            setDataSource(res?.data?.users);
          }
        })
        .finally((err) => {
          setLoading(false);
        });
    }
  }
  useEffect(() => {
    // Only call getlist if modal is open
    if (modalOPen) {
      getlist();
      if (data.role == 'office') getAgentList();
    }
  }, [modalOPen, deleteModal]);

  return (
    <>
      <CustomModal
        modalOPen={modalOPen}
        setModalOpen={setModalOpen}
        width={800}
        title={modalTitle}
        isBottomButtomShow={false}
        customPadding={10}
      >
        <div className='pt-4'>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'Baloo2',
                colorPrimary: '#8086AC',
                colorLinkActive: '#8086AC',
                colorLinkHover: '#8086AC',
                colorLink: '#8086AC',
              },
            }}
          >
            {data?.role !== 'office' && (
              <div id='addSalesAgent' className='flex gap-4 mb-5 px-9 justify-between items-center'>
                {data?.role == 'nursing_home' && (
                  <h2 className='text-xl font-bold text-primary'>Add Or Delete Nurse</h2>
                )}
                {data?.role == 'monitoring_agency' && (
                  <h2 className='text-xl font-bold text-primary'>Add Or Delete Monitoring Agent</h2>
                )}

                <CustomButton onClick={() => handleClick()} className={' w-fit text-nowrap'}>
                  <MdAdd size={20} className='mr-2' />{' '}
                  {data?.role == 'nursing_home' ? 'Add New Nurse' : 'Add Selected User'}
                </CustomButton>
              </div>
            )}
            <SidebarContext1.SidebarContext.Provider value={{ getlist: getlist }}>
              <CustomTable
                loading={loading}
                tableData={dataSource}
                columns={columns}
                scroll={{ x: 500, y: 500 }}
              />
              {/* <Table
              //  loading={loading}
              //  pagination={
              //    {
              //      total,
              //      current: query.current,
              //      onChange: (page, pageSize) => {
              //        updateQuery(page)
              //      }
              //    }
              //  }
              loading={loading}

              scroll={{
                x: 500,
                y: 500,
              }}
              className="custom-table-filter"
              columns={columns}
              dataSource={dataSource}
            /> */}
            </SidebarContext1.SidebarContext.Provider>
          </ConfigProvider>
        </div>
      </CustomModal>

      <CreateAdminSupportAgent
        getlist={getlist}
        role={
          data?.role === 'nursing_home'
            ? 'nurse'
            : data?.role === 'monitoring_agency'
              ? 'monitoring_agent'
              : 'sales_agent'
        }
        modalOPen={createNurse}
        setModalOpen={setCreateNurse}
        parentID={data?._id}
      />

      <DeleteModal
        onDelete={() => handleDelete()}
        modalOPen={deleteModal}
        setModalOpen={setDeleteModal}
        title={`Are you sure to remove this Sales Agent`}
        title2={'from this office?'}
      />
    </>
  );
}
