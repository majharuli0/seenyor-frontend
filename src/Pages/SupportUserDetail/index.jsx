import React, { useEffect, useRef, useState, useContext } from 'react';
import { Space, Table, Tag, Modal } from 'antd';
import { useroverViewCount } from '@/api/AdminDashboard';
import TabMenus from '@/Components/TabMenus';
import TimeSelection from '@/Components/TimeSelection';
import ls from 'store2';
import AddIcon from '@/Components/AddIcon';
import Sort from '../../Shared/sort/Sort';
import { SidebarContext } from '@/Context/CustomContext';
import CustomButton from '../../Shared/button/CustomButton';
import SearchInput from '../../Shared/Search/SearchInput';
import AdminSupportAgentTable from '@/Components/PubTable/AdminSupportAgentTable';

import AdminFiled from '@/Shared/AdminFiled/AdminFiled';
// import AdminSupportAgentTableAction from '@/Components/Admin/AdminSupportAgent/AdminSupportAgentTableAction';
import AdminSupportAgentTableAction from '@/Components/PubTable/AdminSupportAgentTableAction';
import { getUserPage } from '@/api/AdminUser';
import CreateAdminSupportAgent from '@/Components/PubTable/CreateAndEditUsers';
import * as SidebarContext1 from '@/Context/CustomUsertable';
import { useParams, useLocation } from 'react-router-dom';
import throttle from '@/utils/throttle';

const AdminDashboard = () => {
  const params = useParams();
  let item = useLocation();
  const [title, setTitle] = useState('Dashboard');
  const { role } = useContext(SidebarContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Support Agents');
  const [menuName, setMenuName] = useState('[Nursing Home]’s Support Agents');
  const [btnName, setBtnName] = useState('Add New Support Agent');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const [modalOPen, setModalOpen] = useState(false);
  const [page, SetPage] = useState({
    current: 1,
    size: 10,
  });
  const [menus, setMenus] = useState([
    {
      text: 'Support Agents',
      bo: true,
      warring: false,
    },
  ]);
  const [changeParams, setChangeParams] = useState({});
  const [totle, SetTotle] = useState(0);
  let [columns, setColumns] = useState([
    {
      title: 'Nursing Home',
      key: 'id',

      render: (row) => (
        <button>
          <AdminFiled data={row} />
        </button>
      ),
    },
    {
      title: 'Contact',

      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.contactNumber}
          </span>
        </button>
      ),
    },

    {
      title: '',
      key: 'id',
      width: 100,
      render: (row) => (
        // <CustomButton  >Pay now</CustomButton>
        <AdminSupportAgentTableAction getlist={() => getList(query)} data={row} />
      ),
    },
  ]);
  const data = ['Time', 'Name'];
  const [statistics, SetStatistics] = useState({
    nursingHomes: 0,
    elderlies: 0,
    devicesConnected: 0,
    monthlyRevenue: 0,
  });
  const [query, setQuey] = useState({
    order: '1',
    orderType: 'time',
    name: '',
  });
  const [list, SetList] = useState([]);
  const handelOpenModal = () => {
    setModalOpen(true);
  };
  const [user, SetUser] = useState(ls.get('user'));

  const HandleTabText = (e) => {
    setActiveTab(e);
    setIsModalOpen(true);
  };

  const init = () => {
    let user = ls.get('user');
    let row = new URLSearchParams(item.search);
    let query1 = { ...query };
    let name = row.get('name');
    let id = row.get('id');

    setTitle('User');

    query1[name] = id;
    query1.role = 'Support Agent';
    if (name == 'salesAgentId') {
      setChangeParams({
        nursingHomeId: id,
        salesAgentId: params.id,
      });
    }
    if (name == 'distributorId') {
      setChangeParams({
        nursingHomeId: id,
        distributorId: params.id,
      });
    }
    let role1 = role;
    if (!role1) {
      role1 = user.role;
    }
    setQuey(query1);
    SetPage({
      current: 1,
      size: 10,
    });
  };
  const getList = (query) => {
    if (!query.role) return;
    throttle(() => {
      getUserPage({
        ...query,
        ...page,
      }).then((res) => {
        SetTotle(res.data.total);
        SetList(res?.data?.records);
      });
    });
  };

  useEffect(() => {
    init();
  }, [init]);
  useEffect(() => {
    getList(query);
  }, [page]);
  useEffect(() => {
    if (selected && query.orderType != selected) {
      setQuey({
        ...query,
        ...{
          orderType: selected.toLowerCase(),
          order: selected === 'Time' ? '1' : '0',
        },
      });
      SetPage({ ...page, current: 1 });
    }
  }, [selected]);
  useEffect(() => {
    SetPage({ ...page, current: 1 });
  }, [query.order]);
  const handBlurchange = () => {
    setQuey({ ...query, name: search.trim() });
    SetPage({ ...page, current: 1 });
  };

  return (
    <div className='pl-[20px] pr-[50px]'>
      <div className='h-[100px] flex items-center justify-between'>
        <div className='flex items-center'>
          <div className=' text-[28px] font-semibold font-cblock '>{title}</div>
        </div>
        <div className='h-[40px] pl-[20px] pr-[20px]  rounded-[20px] bg-cblock   flex items-center '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
          >
            <path
              d='M8.65073 2.31039L11.4807 5.14035L4.31724 12.3038L1.48886 9.47387L8.65073 2.31039ZM13.6281 1.62787L12.3661 0.365808C11.8783 -0.121936 11.0863 -0.121936 10.5969 0.365808L9.38799 1.57474L12.218 4.40473L13.6281 2.99457C14.0064 2.61625 14.0064 2.00617 13.6281 1.62787ZM0.00787518 13.4516C-0.0436269 13.6834 0.165643 13.8911 0.397455 13.8347L3.551 13.0701L0.722618 10.2401L0.00787518 13.4516Z'
              fill='white'
            />
          </svg>
          <div className='pl-[20px]  text-white text-[14px] font-semibold  '>Edit Nursing Home</div>
        </div>
      </div>
      <div className='pt-[20px] pb-[10px] flex'>
        <TabMenus menus={menus} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className=''>
        {(activeTab == 'Support Agents' || activeTab == 'Nursing Homes') && (
          <div>
            <div className=' bg-white rounded-2xl'>
              <div className=' px-[22px] py-6 flex items-start flex-col lg:flex-row justify-between gap-2'>
                <div className=' flex items-center justify-between w-full'>
                  <h2 className=' text-2xl font-bold text-text-primary'>{menuName}</h2>
                </div>
                <div className=' flex items-center justify-end gap-5 w-full'>
                  {/* =====Search sort and add admin button===== */}
                  <SearchInput
                    search={search}
                    setSearch={setSearch}
                    handBlurchange={handBlurchange}
                    placeholder='Search Nursing Home'
                  />
                  <Sort
                    query={query}
                    setQuey={setQuey}
                    selected={selected}
                    setSelected={setSelected}
                    data={data}
                  />
                  <CustomButton
                    onClick={() => handelOpenModal()}
                    className={' hidden lg:flex min-w-[80px]'}
                  >
                    <AddIcon /> {btnName}
                  </CustomButton>
                </div>
              </div>

              <div className=' grid grid-cols-1'>
                <SidebarContext1.SidebarContext.Provider
                  value={{ getlist: getList, query, totle, page, SetPage }}
                >
                  <AdminSupportAgentTable tableData={list} columns={columns} />
                </SidebarContext1.SidebarContext.Provider>
              </div>
            </div>
            <CreateAdminSupportAgent
              item={{}}
              changeParams={changeParams}
              getlist={() => getList(query)}
              role={query.role}
              modalOPen={modalOPen}
              setModalOpen={setModalOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
