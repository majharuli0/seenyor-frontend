import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ls from 'store2';
import { getUserDetails, getUserToken } from '@/api/Users';
import { useCountStore } from '@/store/index';
import Loader from '@/Components/Loader';
import { getToken, setToken } from '@/utils/auth';
import toast from 'react-hot-toast';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';

export default function UserProfileView() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setStoreRole, setUser } = useCountStore();

  const [loading, setLoading] = useState(true);
  const param = params.id.split('-');

  const storeOriginalToken = () => {
    const user = ls.get('user');
    const currentToken = getToken();
    if (!ls.get('rootToken')) {
      ls.set('rootToken', currentToken);
      ls.set('rootRole', user?.role);
    }
  };

  const switchToNewToken = (newToken) => setToken(newToken);

  const navigateToRole = (role) => {
    const routes = {
      super_admin: '/support-agent/dashboard/',
      supports_agent: '/supporter/support-agent/dashboard',
      nurse: '/supporter/nurse/dashboard',
      end_user: '/supporter/end-user/dashboard',
      monitoring_agency: '/ms/dashboard',
      elderly: `/supporter/elderlies/elderly-profile/${param[1]}?tab=overview`,
    };
    navigate(
      (Object.prototype.hasOwnProperty.call(routes, role) ? routes[role] : undefined) ||
        '/support-nurnt/dashboard'
    );
  };

  const setUpEverythingForViewProfile = (data) => {
    ls.set('user', data);
    ls.set('mainRole', data.role);
    ls.set('role', data.role);
    setStoreRole({ role: data.role });
    setUser({ role: data.role });

    setTimeout(() => {
      setLoading(false);
      navigateToRole(data.sub_role || data.role);
    }, 800);
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const userDetail = await getUserDetails({ id: param[0] });

      if (!userDetail?.data?.role) throw new Error('Invalid role');

      if (param.length >= 2) {
        const tokenRes = await getUserToken({
          id: param[0],
          params: {
            role: userDetail.data.role === 'nursing_home' ? 'nurse' : 'supports_agent',
          },
        });

        // if (tokenRes.data.role == "end_user" && tokenRes?.session_code == 0) {
        //   toast.custom((t) => (
        //     <CustomErrorToast
        //       t={t}
        //       title="Error"
        //       text={"This user does not have an active subscription."}
        //     />
        //   ));
        //   navigate(-1);
        // } else {
        storeOriginalToken();
        switchToNewToken(tokenRes.data.access_token);
        setUpEverythingForViewProfile({
          ...tokenRes.data,
          sub_role: 'elderly',
        });
        // }
      } else {
        const tokenRes = await getUserToken({ id: param[0] });

        // if (tokenRes.data.role == "end_user" && tokenRes?.session_code == 0) {
        //   toast.custom((t) => (
        //     <CustomErrorToast
        //       t={t}
        //       title="Error"
        //       text={"Subscription Expired!"}
        //     />
        //   ));
        //   navigate(-1);
        // } else {
        storeOriginalToken();
        switchToNewToken(tokenRes.data.access_token);
        setUpEverythingForViewProfile(userDetail.data);
        // }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // toast.error(err)
      toast.custom((t) => (
        <CustomErrorToast t={t} title='Error' text={err.response.data.message} />
      ));
      navigate(-1);
    }
  }, [params.id]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading) return <Loader loaderTitle='Loading User Profile' />;
}
