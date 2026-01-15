import React, { useCallback, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { Space, Table, Tag, Modal } from 'antd';
import { getUserPage, updateUser } from '@/api/AdminUser';
import { useLocation, useNavigate } from 'react-router-dom';
import ls from 'store2';
import CustomButton from '../../Shared/button/CustomButton';
import throttle from '@/utils/throttle';
import SearchInput from '../../Shared/Search/SearchInput';
import Sort from '../../Shared/sort/Sort';
import AdminSupportAgentTable from '@/Components/PubTable/AdminSupportAgentTable';
import AdminSupportAgentTableAction from '@/Components/PubTable/AdminSupportAgentTableAction';
import AdminFiled from '@/Shared/AdminFiled/AdminFiled';
import { Switch } from 'antd';
import CreateAdminSupportAgent from '@/Components/PubTable/CreateAndEditUsers';
import { SidebarContext } from '@/Context/CustomUsertable';
import TabMenus from '@/Components/TabMenus';
import { useCountStore } from '@/store/index';
import { allElderProfilePage } from '@/api/RecentAlerts';
import { useGetColumnsByRoleAndActiveTab } from './utiles';
import { getUser } from '@/api/Users';
import { getElderlies } from '@/api/elderly';
import service from '@/utils/axiosRequest';
import axios from 'axios';
import useApi from '@/hook/useApi';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/features/users/usersSlice';

const AdminDashboard = () => {
  const { response, loading, error, makeRequest } = useApi(getUser);
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeParams, setChangeParams] = useState({});
  const [role, setRole] = useState('');
  const [createText, setCreateText] = useState('Monitoring Stations');
  const [mainRole, setMainRole] = useState(ls.get('mainRole'));
  const [elderlyRes, setElderlyRes] = useState([]);
  const [loadingEl, setLoadingEl] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [menus] = useState([
    { bo: true, warring: false, text: 'Monitoring Stations' },
    { bo: true, warring: false, text: 'Distributors' },
    { bo: true, warring: false, text: 'Offices' },
    { bo: true, warring: false, text: 'Sales Agents' },
    { bo: true, warring: false, text: 'Nursing Homes' },
    { bo: true, warring: false, text: 'Nurses' },
    { bo: true, warring: false, text: 'Control Centers' },
    { bo: true, warring: false, text: 'Support Agents' },
    { bo: true, warring: false, text: 'Installers' },
    { bo: true, warring: false, text: 'End Users' },
    { bo: true, warring: false, text: 'Users' },
  ]);
  const [user, SetUser] = useState(ls.get('user'));
  const [search, setSearch] = useState('');
  const [modalOPen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState('Time');
  const [page, SetPage] = useState({});
  const [query, setQuey] = useState({});
  const [list, SetList] = useState([]);
  const [total, SetTotle] = useState(0);
  const [columns, SetColumns] = useState([]);
  const roleMappings = {
    Distributors: 'Distributor',
    'Nursing Homes': 'Nursing Home',
    'Sales Agents': 'Sales Agent',
    'Support Agents': 'Support Agent',
    'Super Admins': 'Super Admin',
    Users: 'User',
    Installers: 'Installer',
    'Monitoring Stations': 'Monitoring Station',
    'Control Centers': 'Control Center',
    Offices: 'Office',
    'End Users': 'End User',
    Nurses: 'Nurse',
  };
  const roleMappings2 = {
    Distributors: 'distributor',
    'Nursing Homes': 'nursing_home',
    'Sales Agents': 'sales_agent',
    'Support Agents': 'supports_agent',
    'Monitoring Stations': 'monitoring_agency',
    'Control Centers': 'monitoring_station',
    Installers: 'installer',
    'End Users': 'end_user',
    Offices: 'office',
    'Super Admins': 'super_admin',
    Users: 'elderly',
    Nurses: 'nurse',
  };
  const data = ['Time', 'Name'];
  const getCulumns = useGetColumnsByRoleAndActiveTab(activeTab);

  useEffect(() => {
    if (getCulumns) {
      SetColumns(getCulumns);
    }
  }, [getCulumns, activeTab]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const menuItems = menus.map((menu) => menu.text);
    if (menuItems.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('Monitoring Stations');
    }
    navigate(`/super-admin/users?tab=${tab}`);
  }, []);
  const handelOpenModal = () => {
    setModalOpen(true);
  };

  const HandleTabText = (e) => {
    SetPage({ page: 1 });
    setActiveTab(e.name);

    // navigate(`/super-admin/users?tab=${e.name}`);
  };
  const getlist = useCallback(async () => {
    SetList([]);
    let queries = { ...page, ...query };
    const formattedRoleName = roleMappings[activeTab];
    setCreateText(formattedRoleName);
    queries.role = roleMappings2[activeTab];
    setRole(queries.role);
    navigate(`/super-admin/users?tab=${activeTab}`);

    if (queries.role === 'elderly') {
      setLoadingEl(true);

      delete queries.role;
      getElderlies({
        // skipFields:
        //   "rooms,hierarchy_user_ids,medications,diseases,comments,emergency_contacts,alarms_data",
        ...queries,
      })
        .then((res) => {
          setElderlyRes(res.data);
          SetTotle(res?.total);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoadingEl(false);
        });
    } else {
      // dispatch(fetchUsers({ ...queries }));
      setLoadingUser(true);

      try {
        await makeRequest({ ...queries });
      } catch (error) {
        console.log(error);
      }
    }
  }, [query, activeTab, page]);
  useEffect(() => {
    if (response && !loading) {
      setLoadingUser(false);
    }
  }, [response]);
  useEffect(() => {
    getlist();
  }, [getlist]);

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      if (selected && query.orderType !== selected) {
        delete query.sort_by_created_at;
        delete query.sort_by_name;
        setQuey({
          ...query,
          ...(selected === 'Name' ? { sort_by_name: -1 } : { sort_by_created_at: -1 }),
        });

        SetPage({ ...page, page: 1 });
      }
    } else {
      isMounted.current = true;
    }
  }, [selected]);

  const handleSearchChange = useCallback(
    debounce((value) => {
      setQuey((prev) => ({ ...prev, search: value.trim() }));
      SetPage((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );
  useEffect(() => {
    return () => {
      handleSearchChange.cancel();
    };
  }, []);
  return (
    <div className=''>
      {/* <div className='h-[100px] flex items-center justify-between'>
                <div className='flex items-center'>

                    <div className='  text-[28px] font-semibold font-cblock ' >Super Admin</div>

                </div>

            </div> */}
      <div className='pt-[20px] pb-[10px] flex'>
        <TabMenus
          menus={menus}
          activeTab={activeTab}
          setActiveTab={false}
          handleChange={HandleTabText}
        />
        {/* {
                    menus.map((e, key) => {
                        return (
                            <div
                                key={key}
                                onClick={() => HandleTabText(e.text)}
                                className={` relative re cursor-pointer h-[40px] mr-[10px] pl-[20px] pr-[20px]  rounded-[20px]   flex items-center ${activeTab == e.text ? "text-white bg-cblock " : "text-OnButtonNormal bg-white  "} `}>
                                {e.lable}
                                {e.warring && <div className={`w-[8px] h-[8px] rounded-[100px] bg-onBackWarring  absolute  right-[5px]`} > </div>}
                            </div>
                        )
                    })
                } */}
      </div>

      <div className=' bg-white rounded-2xl overflow-hidden'>
        <div className=' px-[22px] py-6 flex items-start flex-col lg:flex-row justify-between gap-2'>
          <div className=' flex items-center justify-between w-full'>
            <h2 className=' text-2xl font-bold text-text-primary'>{activeTab}</h2>
          </div>
          <div className=' flex items-center justify-end gap-5 w-full'>
            {/* =====Search sort and add admin button===== */}

            <SearchInput
              search={search}
              setSearch={(value) => {
                setSearch(value);
                handleSearchChange(value);
              }}
              placeholder={`Search ${createText}`}
            />
            {!['User']?.includes(createText) && (
              <Sort
                query={query}
                setQuery={setQuey}
                selected={selected}
                setSelected={setSelected}
                data={data}
              />
            )}
            <CustomButton
              onClick={() => handelOpenModal()}
              className={' hidden lg:flex '}
              style={{
                display: ['User']?.includes(createText) ? 'none' : 'flex',
              }}
            >
              <div
                className='mr-1'
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 19 19" fill="none">
                <path d="M10.0941 5.54102C10.0941 5.2131 9.82824 4.94727 9.50033 4.94727C9.17241 4.94727 8.90658 5.2131 8.90658 5.54102V8.9056H5.54199C5.21407 8.9056 4.94824 9.17143 4.94824 9.49935C4.94824 9.82727 5.21407 10.0931 5.54199 10.0931H8.90658V13.4577C8.90658 13.7856 9.17241 14.0514 9.50033 14.0514C9.82824 14.0514 10.0941 13.7856 10.0941 13.4577V10.0931H13.4587C13.7866 10.0931 14.0524 9.82727 14.0524 9.49935C14.0524 9.17143 13.7866 8.9056 13.4587 8.9056H10.0941V5.54102Z" fill="white"/>
                </svg>`
                  ),
                }}
              ></div>
              Add New {createText}
            </CustomButton>
          </div>
        </div>

        <div className=' grid grid-cols-1'>
          <SidebarContext.Provider
            value={{
              getlist,
              query,
              total: activeTab == 'Users' ? total : response?.total || [],
              page,
              SetPage,
              role,
            }}
          >
            <AdminSupportAgentTable
              loading={activeTab == 'Users' ? loadingEl : loadingUser}
              tableData={activeTab == 'Users' ? elderlyRes : response?.data}
              getlist={getlist}
              columns={columns}
            />
          </SidebarContext.Provider>
        </div>
      </div>
      <div className='mt-[38px] '>
        <div className='font-semibold'></div>
      </div>

      <CreateAdminSupportAgent
        changeParams={changeParams}
        item={{}}
        getlist={getlist}
        role={role}
        modalOPen={modalOPen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default AdminDashboard;
