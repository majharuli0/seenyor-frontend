import SelectRolePage from '@/Pages/Login/index';

import NotFound from '@/Pages/NotFound/index';
import PasswordResetFlow from '../Pages/ForgotPassword/PasswordResetFlow';

export const publicRoutes = [
  { path: '/', Component: SelectRolePage },
  { path: '/forgot-password', Component: PasswordResetFlow },
  { path: '*', Component: NotFound },
];
