import { Button, Divider, Empty, Modal, Popconfirm, Spin, Steps, Tag } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { MdOutlineLocalPhone } from 'react-icons/md';
import { SidebarContext } from '@/Context/CustomContext';
import { useNavigate } from 'react-router-dom';
import { getLogins } from '@/api/Users';
import { logout, logoutSessionUser } from '@/api/login-v1';
import toast from 'react-hot-toast';
import { FaCodeCommit } from 'react-icons/fa6';
import { IoLogOut } from 'react-icons/io5';

export default function LoginsSessionsModal({ isvisible, setVisible, row_data }) {
  const { rolesFormatter } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [logins, setLogins] = useState([]);
  const onClose = () => {
    setVisible(false);
  };
  const getLoginsSession = useCallback(() => {
    if (!row_data?._id) return;
    setLoading(true);
    getLogins({ userId: row_data?._id })
      .then((res) => {
        setLogins(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [row_data?._id]);
  useEffect(() => {
    getLoginsSession();
  }, [getLoginsSession]);
  function getItems(data = {}) {
    function handleLogout(id) {
      setLoading(true);
      logoutSessionUser({ id })
        .then((res) => {
          toast.success('Logout Seccessfully!');
          getLoginsSession();
        })
        .catch((err) => {
          toast.error('Failed to Logout!');
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return {
      title: (
        <div className='flex items-center gap-2'>
          <h1 className='font-semibold font-base cursor-pointer select-none hover:text-primary/70'>
            {data?.deviceName}
          </h1>
          <Tag>{data?.deviceType}</Tag>
        </div>
      ),
      description: (
        <div>
          <ul>
            <li className='flex items-center gap-1'>
              <IoLogOut />
              <p>
                {' '}
                Logout Status:{' '}
                {data?.loggedOut ? (
                  <Tag color='red'>Logged Out</Tag>
                ) : (
                  <Tag color='green'>Active</Tag>
                )}
              </p>
            </li>
            <li className='flex items-center gap-1'>
              <FaCodeCommit />
              <p>IP Adress: {data?.ipAddress}</p>
            </li>
            {!data?.loggedOut && (
              <li className='flex items-center gap-1 logout_pop'>
                <Popconfirm
                  title='Logout!'
                  description='Are you sure to logout?'
                  onConfirm={() => handleLogout(data?._id)}
                  okText='Yes'
                  cancelText='No'
                  className='p-4 '
                >
                  <Button className='mt-4' icon={<IoLogOut />}>
                    Logout
                  </Button>
                </Popconfirm>
              </li>
            )}
          </ul>
        </div>
      ),
    };
  }

  return (
    <div>
      <Modal
        open={isvisible}
        onCancel={onClose}
        footer={null}
        centered
        width='80vw'
        className='device-configuration-modal my-6 lg:max-w-[50vw] !max-h-[90vh]'
      >
        <div className='p-3'>
          <h1 className='text-primary font-semibold text-2xl mb-4'> All Logins</h1>

          <Spin spinning={loading} className='w-full mx-auto py-16'>
            <div className='min-h-[300px] flex items-start justify-center h-full !max-h-[80vh] overflow-y-auto'>
              {logins.length == 0 && (
                <div className='w-full flex items-center mt-12 justify-center'>
                  <Empty className='mx-auto w-fit flex flex-col items-center justify-center'></Empty>
                </div>
              )}
              {logins?.length > 0 && (
                <Steps
                  current={10000}
                  direction='vertical'
                  progressDot={(dot, { index }) => {
                    const item = logins[index];
                    const color = item?.loggedOut ? 'red' : 'green';
                    return (
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          display: 'inline-block',
                          backgroundColor: color,
                        }}
                      />
                    );
                  }}
                  items={
                    Array.isArray(logins)
                      ? logins.map((data) => ({
                          ...getItems(data),
                          className: data.loggedOut ? 'loggedout-step' : 'active-step',
                        }))
                      : []
                  }
                />
              )}
            </div>
          </Spin>
        </div>
      </Modal>
    </div>
  );
}
