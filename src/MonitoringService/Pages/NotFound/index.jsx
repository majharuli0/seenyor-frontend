import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className='h-full w-full flex flex-col justify-center items-center '>
      <h1 className='text-9xl font-extrabold text-text tracking-widest'>404</h1>
      <div className='bg-primary px-2 text-sm text-primary-foreground rounded rotate-12 absolute'>
        Page Not Found
      </div>
      <button className='mt-5'>
        <a className='relative inline-block rounded-md text-sm font-medium text-primary group active:text-primary focus:outline-none focus:ring'>
          <span className='absolute inset-0 rounded-md transition-transform translate-x-0.5 translate-y-0.5 bg-primary group-hover:translate-y-0 group-hover:translate-x-0'></span>

          <span className='relative block px-8 py-3 rounded-md bg-background border border-current'>
            <NavLink to='/ms/dashboard'>Go Home</NavLink>
          </span>
        </a>
      </button>
    </main>
  );
}
