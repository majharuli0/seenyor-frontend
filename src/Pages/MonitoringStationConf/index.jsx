import React, { useCallback, useEffect, useState } from 'react';
import { Tree, Tag, Button, Modal, Popconfirm, ConfigProvider } from 'antd';
import { getByParentId, getUserDetails, setConfigurationForMonitoringStation } from '@/api/Users';
import { LeftOutlined } from '@ant-design/icons';
import CustomButton from '@/Shared/button/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';

const App = () => {
  const [treeData, setTreeData] = useState([
    {
      title: 'Super Admin',
      key: '66e9bee258630531b90a2dfd',
    },
  ]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [initialCheckedKeys, setInitialCheckedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const [monitoringIds, setMonitoringIds] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [currentMonitoringAgencyId, setCurrentMonitoringAgencyId] = useState(null);

  const roleColorMap = {
    distributor: 'gold',
    office: 'blue',
    sales_agent: 'green',
    end_user: 'purple',
    monitoring_station: 'red',
  };

  const formatRoleLabel = (role) => {
    if (!role) return 'Unknown';
    return role
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const updateTreeData = (list, key, children) =>
    list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const getAncestorKeys = (key, tree) => {
    const ancestors = [];
    const findAncestors = (nodes, targetKey) => {
      for (const node of nodes) {
        if (node.children && node.children.some((child) => child.key === targetKey)) {
          ancestors.push(node.key);
          return true;
        }
        if (node.children) {
          if (findAncestors(node.children, targetKey)) {
            ancestors.push(node.key);
            return true;
          }
        }
      }
      return false;
    };
    findAncestors(tree, key);
    return ancestors;
  };

  const getDescendantKeys = (key, tree) => {
    let descendants = [];
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.key === key) {
          const collectKeys = (n) => {
            if (n.children) {
              n.children.forEach((child) => {
                descendants.push(child.key);
                collectKeys(child);
              });
            }
          };
          collectKeys(node);
          return;
        }
        if (node.children) {
          findNode(node.children);
        }
      }
    };
    findNode(tree);
    return descendants;
  };

  const fetchChildData = async (parentId) => {
    try {
      const response = await getByParentId(parentId);
      const childData = response.data.map((user) => ({
        title: (
          <span>
            {`${user.name} ${user.last_name || ''}`}
            <Tag style={{ marginLeft: 8 }} color={roleColorMap[user.role] || 'default'}>
              {formatRoleLabel(user.role)}
            </Tag>
            {initialCheckedKeys.includes(user._id) && (
              <Tag style={{ marginLeft: 8 }} color='cyan'>
                Previously Selected
              </Tag>
            )}
            {user.monitoring_agency_id &&
              user.monitoring_agency_id !== currentMonitoringAgencyId && (
                <Tag style={{ marginLeft: 8 }} color='geekblue'>
                  Already Assigned
                </Tag>
              )}
          </span>
        ),
        key: user._id,
        isLeaf: user.role === 'monitoring_station' || user.role === 'end_user',
        disabled:
          user.monitoring_agency_id && user.monitoring_agency_id !== currentMonitoringAgencyId,
        monitoringAgencyId: user.monitoring_agency_id, // Store for reference
      }));
      return childData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue, info) => {
    const checked = checkedKeysValue.checked || checkedKeysValue;
    const newlyCheckedKey = info.node.key;
    const isChecked = info.checked;

    let newCheckedKeys = [...checkedKeys];

    if (isChecked) {
      const ancestorKeys = getAncestorKeys(newlyCheckedKey, treeData);
      const descendantKeys = getDescendantKeys(newlyCheckedKey, treeData);

      newCheckedKeys = newCheckedKeys.filter(
        (key) => !ancestorKeys.includes(key) && !descendantKeys.includes(key)
      );
      newCheckedKeys.push(newlyCheckedKey);
    } else {
      newCheckedKeys = newCheckedKeys.filter((key) => key !== newlyCheckedKey);
    }

    const newRemovedIds = monitoringIds.filter(
      (id) => !newCheckedKeys.includes(id) && !removedIds.includes(id)
    );

    setCheckedKeys(newCheckedKeys);
    setRemovedIds([...removedIds, ...newRemovedIds]);
  };

  const getConf = useCallback(() => {
    getUserDetails({ id: params.id })
      .then((res) => {
        const ids = res?.data?.monitoring_ids || [];
        setMonitoringIds(ids);
        setCheckedKeys(ids);
        setInitialCheckedKeys(ids);
        setCurrentMonitoringAgencyId(res?.data?._id);
      })
      .catch((err) => {
        toast.custom((t) => (
          <CustomErrorToast t={t} title='Error' text={err.response.data.message} />
        ));
      });
  }, [params.id]);

  useEffect(() => {
    getConf();
  }, [getConf]);

  const onLoadData = ({ key, children, isLeaf }) =>
    new Promise((resolve) => {
      if (children || isLeaf) {
        resolve();
        return;
      }
      fetchChildData(key).then((childData) => {
        setTreeData((origin) => updateTreeData(origin, key, childData));
        resolve();
      });
    });

  const saveConfiguration = () => {
    const finalRemovedIds = monitoringIds.filter((id) => !checkedKeys.includes(id));
    setConfigurationForMonitoringStation({
      id: params.id,
      data: {
        parents_ids: checkedKeys,
        remove_parent_ids: finalRemovedIds,
      },
    })
      .then((res) => {
        getConf();
        toast.custom((t) => <CustomToast t={t} text={'Configured successfully!'} />);
        setRemovedIds([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleResetConfiguration = () => {
    const newRemovedIds = [...monitoringIds];
    setCheckedKeys([]);
    setRemovedIds(newRemovedIds);
    setConfigurationForMonitoringStation({
      id: params.id,
      data: {
        parents_ids: [],
        remove_parent_ids: newRemovedIds,
      },
    })
      .then((res) => {
        getConf();
        setRemovedIds([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className='back_button mt-4'>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          icon={<LeftOutlined />}
        >
          Back
        </Button>
      </div>
      <div className='w-full rounded-xl p-6 bg-white mt-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-text-primary'>Configuration</h2>
          <div className='flex items-center gap-2'>
            <ConfigProvider
              theme={{
                token: { colorPrimary: '#000', colorText: '#000' },
              }}
            >
              <Popconfirm
                title={<p className='py-1 px-4 pb-0 pt-[17px] text-base'>Reset!</p>}
                description={
                  <p className='py-1 px-4 pb-0 pt-0 mt-0'>
                    Are you sure you want to reset the configuration?
                  </p>
                }
                onConfirm={handleResetConfiguration}
                okText='Yes'
                cancelText='No'
                icon={false}
                okType='danger'
                okButtonProps={{
                  color: 'danger',
                  style: { margin: '10px' },
                }}
              >
                <CustomButton className={'px-8 mr-2 bg-red-600 hover:bg-red-500 text-white'}>
                  Reset Configuration
                </CustomButton>
              </Popconfirm>
            </ConfigProvider>
            <CustomButton onClick={saveConfiguration} className={'px-8'}>
              Save Configuration
            </CustomButton>
          </div>
        </div>
        <Tree
          className='text-lg'
          checkable
          checkStrictly
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          loadData={onLoadData}
          treeData={treeData}
          showLine
        />
        <div className='mt-4'>
          <h3>Selected Keys:</h3>
          <ul>
            {checkedKeys.map((userId) => (
              <li key={userId}>
                {userId}
                {initialCheckedKeys.includes(userId) && (
                  <Tag style={{ marginLeft: 8 }} color='cyan'>
                    Previously Selected
                  </Tag>
                )}
              </li>
            ))}
          </ul>
          {removedIds.length > 0 && (
            <div>
              <h3>Removed Users:</h3>
              <ul>
                {removedIds.map((userId) => (
                  <li key={userId}>{userId}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
