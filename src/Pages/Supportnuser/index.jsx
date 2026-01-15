import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import TabMenus from '@/Components/TabMenus';
import ls from 'store2';
import AddIcon from '@/Components/AddIcon';
import Sort from '../../Shared/sort/Sort';
import { SidebarContext } from '@/Context/CustomContext';
import CustomButton from '../../Shared/button/CustomButton';
import SearchInput from '../../Shared/Search/SearchInput';
import AdminSupportAgentTable from '@/Components/PubTable/AdminSupportAgentTable';

// import PaymentMethod from "./components/PaymentMethod";
import { getUser } from '@/api/Users';
import { getEndUsers } from '@/api/ordersManage';
import CreatEendUser from '@/Components/PubTable/CreatEendUser';
import CreateAdminSupportAgent from '@/Components/PubTable/CreateAndEditUsers';
import * as SidebarContext1 from '@/Context/CustomUsertable';
import { useNavigate } from 'react-router-dom';
import { useCountStore } from '@/store/index';
import { useGetColumnsByRoleAndActiveTab } from './utiles';
import { getElderlies } from '@/api/elderly';
import debounce from 'lodash/debounce';

let roleConfig = {
  NursingHomes: {
    placeholder: 'Search Nursing Home',
    btnName: 'Add New Nursing Home',
    menuName: 'Nursing Homes',
    role: 'nursing_home',
  },
  SalesAgents: {
    placeholder: 'Search Sales Agents',
    btnName: 'Add New Sales Agent',
    menuName: 'Sales Agents',
    role: 'sales_agent',
  },
  Offices: {
    placeholder: 'Search Office',
    btnName: 'Add New Office',
    menuName: 'Offices',
    role: 'office',
  },
  SupportAgents: {
    placeholder: 'Search Support Agents',
    btnName: 'Add New Support Agents',
    menuName: 'Support Agents',
    role: 'supports_agent',
  },
  EndUsers: {
    placeholder: 'Search End User',
    btnName: 'Add New End User',
    menuName: 'End Users',
    role: 'end_user',
  },
  ControlCenters: {
    placeholder: 'Search Control Center',
    btnName: 'Add New Control Center',
    menuName: 'Control Centers',
    role: 'monitoring_station',
  },
  Installers: {
    placeholder: 'Search Installers',
    btnName: 'Add New Installer',
    menuName: 'Installers',
    role: 'installer',
  },
  Nurse: {
    placeholder: 'Search Nurse',
    btnName: 'Add New Nurse',
    menuName: 'Nurse',
    role: 'nurse',
  },
  Elderly: {
    placeholder: 'Search Elderly',
    btnName: '',
    menuName: 'Elderlies',
    role: 'elderly',
  },
};

export default function AdminDashboard() {
  const { setUserDetil } = useCountStore();
  const navigate = useNavigate();
  const childRef = useRef(false);
  const [page, setPage] = useState({});
  const [title, setTitle] = useState('Dashboard');
  const { role } = useContext(SidebarContext);
  const [mainRole, setMainRole] = useState(ls.get('mainRole'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [menuName, setMenuName] = useState('');
  const [btnName, setBtnName] = useState('Add New Support Agent');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('Time');
  const [modalOPen, setModalOpen] = useState(false);
  const [modalOPen1, setModalOpen1] = useState(false);
  const [menus, setMenus] = useState([]);
  const [changeParams, setChangeParams] = useState({});
  const [columns, setColumns] = useState([]);
  const [total, setTotal] = useState(0);
  const [placeholder, setPlaceholder] = useState('Search Nursing Home');
  const data = ['Time', 'Name'];
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({});
  const [list, setList] = useState([]);
  const handelOpenModal = () => {
    setModalOpen(true);
  };
  const getCulumns = useGetColumnsByRoleAndActiveTab(activeTab);
  useEffect(() => {
    if (getCulumns) {
      setColumns(getCulumns);
    }
  }, [getCulumns, activeTab]);

  const [user, SetUser] = useState(ls.get('user'));

  // Memoized initialization function
  const init = useCallback(() => {
    setTitle('Users');
    setColumns(getCulumns);

    let role1 = mainRole || user.role;

    const roleMenus = {
      nursing_home: {
        menus: [{ text: 'Nurse' }, { text: 'Elderly' }, { text: 'End Users' }],
        activeTab: 'Nurse',
      },
      distributor: {
        menus: [{ text: 'Offices' }, { text: 'Sales Agents' }],
        activeTab: 'Offices',
      },
      office: {
        menus: [{ text: 'Sales Agents' }, { text: 'Installers' }],
        activeTab: 'Sales Agents',
      },
      sales_agent: {
        menus: [
          { text: 'End Users' },
          { text: 'Nursing Homes' },
          { text: 'Control Centers' },
          { text: 'Installers' },
          { text: 'Support Agents' },
        ],
        activeTab: 'End Users',
      },
      monitoring_station: {
        menus: [{ text: 'Elderly' }, { text: 'Installers' }, { text: 'Support Agents' }],
        activeTab: 'Elderly',
      },
      nurse: { menus: [{ text: 'Elderly' }], activeTab: 'Elderly' },
      installer: { menus: [{ text: 'End Users' }], activeTab: 'End Users' },
    };

    if (roleMenus[role1]) {
      const { menus, activeTab } = roleMenus[role1];
      setMenus(menus);
      setActiveTab(activeTab);
    }
  }, [mainRole, role]);

  const getList = useCallback(() => {
    if (!query || activeTab == '') return;
    setLoading(true);

    if (['monitoring_station', 'installer'].includes(mainRole) && activeTab === 'End Users') {
      delete query.role;
      getEndUsers({ ...query, ...page })
        .then((data) => {
          setList(data.data);
          setTotal(data.total);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (
      ['nursing_home', 'monitoring_station'].includes(mainRole) &&
      activeTab === 'Elderly'
    ) {
      delete query.role;
      getElderlies({ ...query, ...page })
        .then((res) => {
          setList(res.data);
          setTotal(res.total);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (!query.role) return;
      getUser({ ...query, ...page })
        .then((data) => {
          setList(data.data);
          setTotal(data.total);
        })
        .catch((error) => {
          if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
          } else {
            console.error('Error fetching users:', error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query, activeTab, mainRole]);

  // Setup role based on activeTab
  const setUpRole = useCallback(() => {
    const role = activeTab.replace(/\s/g, '');
    // Check if roleConfig[role] is defined
    const roleConfigItem = roleConfig[role];
    if (roleConfigItem) {
      const { placeholder, btnName, menuName, role: roleFromConfig } = roleConfigItem; // Now it's safe to destructure

      setPlaceholder(placeholder);
      setBtnName(btnName);
      setMenuName(menuName);
      setQuery({ ...query, role: roleFromConfig });
      setPage({ ...page, page: 1 });
      setChangeParams({ nursingHomeId: user.id });
    } else {
      console.warn(`Role "${role}" not found in roleConfig.`);
    }
  }, [activeTab]);

  // useEffect to initialize the component
  useEffect(() => {
    init();
  }, [init]);

  // useEffect to handle activeTab
  useEffect(() => {
    setUpRole();
  }, [setUpRole]);

  // useEffect to handle list fetching with query and page changes
  useEffect(() => {
    getList();
  }, [getList]);

  // Handle selected option changes
  useEffect(() => {
    if (selected && query.orderType !== selected) {
      delete query.sort_by_created_at;
      delete query.sort_by_name;
      setQuery({
        ...query,
        ...(selected === 'Name' ? { sort_by_name: -1 } : { sort_by_created_at: -1 }),
      });
      setPage({ ...page, page: 1 });
    }
  }, [selected]);

  // Handle search input blur
  const handleSearchChange = useCallback(
    debounce((value) => {
      setQuery((prev) => ({ ...prev, search: value.trim() }));
      setPage((prev) => ({ ...prev, page: 1 }));
    }, 800), // 500ms delay
    []
  );
  useEffect(() => {
    return () => {
      handleSearchChange.cancel();
    };
  }, []);
  return (
    <div className=''>
      <div className='py-[20px] flex'>
        <TabMenus menus={menus} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className=''>
        {[
          'Support Agents',
          'Nursing Homes',
          'Sales Agents',
          'Offices',
          'End Users',
          'Control Centers',
          'Installers',
          'Nurse',
          'Elderly',
        ].includes(activeTab) && (
          <div>
            <div className=' bg-white rounded-2xl overflow-hidden'>
              <div className=' px-[22px] py-6 flex items-start flex-col lg:flex-row justify-between gap-2'>
                <div className=' flex items-center justify-between w-full'>
                  <h2 className=' text-2xl font-bold text-text-primary'>{menuName}</h2>
                </div>
                <div className=' flex items-center justify-end gap-5 w-full'>
                  {/* =====Search sort and add admin button===== */}
                  <SearchInput
                    search={search}
                    setSearch={(value) => {
                      setSearch(value);
                      handleSearchChange(value);
                    }}
                    placeholder={placeholder}
                  />
                  {!['Elderly'].includes() && !['nursing_home'].includes(mainRole) && (
                    <Sort
                      query={query}
                      setQuery={setQuery}
                      selected={selected}
                      setSelected={setSelected}
                      data={data}
                    />
                  )}

                  {
                    // Keep original rule for other tabs/roles
                    (['Elderly', 'Sales Agents', 'End Users'].includes(activeTab) &&
                    [
                      'installer',
                      'monitoring_station',
                      'office',
                      'sales_agent',
                      'nursing_home',
                    ].includes(mainRole)
                      ? null
                      : true) ||
                    // Exception: always show for End Users + nursing_home
                    (activeTab === 'End Users' && mainRole === 'nursing_home') ? (
                      <CustomButton
                        onClick={() => handelOpenModal()}
                        className='hidden lg:flex min-w-[80px]'
                      >
                        <AddIcon /> {btnName}
                      </CustomButton>
                    ) : null
                  }
                </div>
              </div>

              <div className=' grid grid-cols-1'>
                <SidebarContext1.SidebarContext.Provider
                  value={{
                    role: query.role,
                    getlist: getList,
                    query,
                    total,
                    page,
                    SetPage: (e) => {
                      setPage(e);
                    },
                  }}
                >
                  <AdminSupportAgentTable
                    loading={loading}
                    tableData={list}
                    columns={columns}
                    getlist={getList}
                  />
                </SidebarContext1.SidebarContext.Provider>
              </div>
            </div>
            <CreateAdminSupportAgent
              item={{}}
              changeParams={changeParams}
              getlist={getList}
              role={query.role}
              modalOPen={modalOPen}
              setModalOpen={setModalOpen}
              parentID={user._id}
            />
          </div>
        )}
        {/* {activeTab == "Elderlies" && (
          <PaymentMethod
            changeParams={changeParams}
            getlist={getList}
            query={query}
            role={role}
            activeTab={activeTab}
          />
        )} */}
      </div>
      <CreatEendUser modalOPen={modalOPen1} setModalOpen={setModalOpen1} />
    </div>
  );
}

// export default AdminDashboard;
