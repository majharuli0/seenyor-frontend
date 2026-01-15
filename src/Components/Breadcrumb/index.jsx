import React from 'react';
import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  const location = useLocation();

  return (
    <AntdBreadcrumb
      separator={<ChevronRight size={16} className='text-gray-400' />}
      items={items.map((item, index) => ({
        title: item.path ? (
          <Link to={item.path} className='text-gray-500 hover:text-indigo-600 transition-colors'>
            {item.title}
          </Link>
        ) : (
          <span className='text-gray-800 font-medium'>{item.title}</span>
        ),
      }))}
      className='mb-6 font-poppins text-sm'
    />
  );
};

export default Breadcrumb;
