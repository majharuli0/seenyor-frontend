import { useContext } from 'react';
import { SidebarContext } from '@/Context/CustomContext';

const NotFound = () => {
  const { setActiveMenu } = useContext(SidebarContext);
  // setActiveMenu("Page Not Found");
  return <div className='w-full h-full flex  justify-center'>404</div>;
};
export default NotFound;
