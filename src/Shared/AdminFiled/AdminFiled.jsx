import React, { useState } from 'react';
import ls from 'store2';
const AdminFiled = ({ data, role }) => {
  const [user, SetUser] = useState(ls.get('user'));
  function stringToColor(string) {
    if (!string) {
      return 'rgba(255,255,255)';
    }
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  return (
    <>
      {user?.role !== 'Super Admin' && user?.role !== 'Support Agent' ? (
        <div className='flex items-center gap-2.5 w-full'>
          <div
            style={{
              background: stringToColor(
                data?.businessName || data?.firstName || data?.lastName || data?.name
              ),
            }}
            className={`w-[40px] h-[40px] rounded-[11px] flex items-center justify-center bg-opacity-30`}
          >
            <div className='w-[40px] h-[40px] bg-white/90 rounded-[11px] flex items-center justify-center '>
              <p
                style={{
                  color: stringToColor(
                    data?.businessName || data?.firstName || data?.lastName || data?.name
                  ),
                }}
                className=' text-[19px] font-[400] AkayaTelivigala-Regular'
              >
                {!data?.last_name ? (
                  data?.name.slice(0, 2)
                ) : (
                  <>
                    {data?.name?.slice(0, 1)}&nbsp;
                    {data?.last_name?.slice(0, 1)}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className=' hidden xl:flex items-start flex-col'>
            <h3
              className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
              style={{ textAlign: 'left' }}
            >
              {/* {(data?.firstName||"") + " " + (data?.lastName||"")} */}
              {/* {(data?.firstName)}&nbsp;{(data?.lastName)} */}
              {!data?.name ? (
                data?.name
              ) : (
                <div>
                  {data?.name}&nbsp;{data?.last_name}
                </div>
              )}
            </h3>
            {role === 'elderly' ? (
              <p
                className=' text-[13px] mt-[-4px] font-[400] text-[#A3AED0]'
                style={{ textAlign: 'left' }}
              >
                {data?.address || 'No Address'}
              </p>
            ) : (
              <p
                className=' text-[13px] mt-[-4px] font-[400] text-[#A3AED0]'
                style={{ textAlign: 'left' }}
              >
                {role == 'review_changes'
                  ? data?.contact_code + ' ' + data?.contact_number
                  : data?.email || 'No email'}
              </p>
            )}
          </div>
          <div className='flex flex-col xl:hidden'>
            {!data?.name ? (
              <h3
                className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
                style={{ textAlign: 'left' }}
              >
                {data?.name}
              </h3>
            ) : data?.name || data?.last_name ? (
              <h3
                className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
                style={{ textAlign: 'left' }}
              >
                {/* {data?.firstName + " " + data?.lastName?.slice(0,2)+"..."} */}
                {data?.name} {data?.last_name && data?.last_name?.slice(0, 10) + '...'}
              </h3>
            ) : (
              <h3
                className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
                style={{ textAlign: 'left', color: '#ccc' }}
              >
                --
              </h3>
            )}
            {role === 'elderly' ? (
              <p
                className=' text-[13px] mt-[-4px] font-[400] text-[#A3AED0]'
                style={{ textAlign: 'left' }}
              >
                {data?.address || '--'}
              </p>
            ) : (
              <p
                className=' text-[13px] mt-[-4px] font-[400] text-[#A3AED0]'
                style={{ textAlign: 'left' }}
              >
                {data?.email ? data?.email?.slice(0, 18) + '...' : 'No email'}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-2.5 w-full'>
          <div
            style={{
              background: stringToColor(data?.businessName || data?.firstName || data?.lastName),
            }}
            className={`w-[40px] h-[40px] rounded-[11px] flex items-center justify-center bg-opacity-30`}
          >
            <div className='w-[40px] h-[40px] bg-white/90 rounded-[11px] flex items-center justify-center '>
              <p
                style={{
                  color: stringToColor(data?.businessName || data?.firstName || data?.lastName),
                }}
                className=' text-[19px] font-[400] AkayaTelivigala-Regular'
              >
                {data?.businessName ? (
                  data?.businessName.slice(0, 2)
                ) : (
                  <>
                    {data?.firstName?.slice(0, 1)}&nbsp;
                    {data?.lastName?.slice(0, 1)}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className=' hidden xl:flex items-start flex-col'>
            <h3
              className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
              style={{ textAlign: 'left' }}
            >
              {/* {(data?.firstName||"") + " " + (data?.lastName||"")} */}
              {/* {(data?.firstName)}&nbsp;{(data?.lastName)} */}
              {data?.businessName ? (
                data?.businessName
              ) : (
                <div>
                  {data?.firstName}&nbsp;{data?.lastName}
                </div>
              )}
            </h3>
            {role == 'elderly' ? (
              <>asd</>
            ) : (
              <p
                className=' text-[13px] mt-[-4px] font-[400] text-[#A3AED0]'
                style={{ textAlign: 'left' }}
              >
                {data.businessEmail || 'No email'}
              </p>
            )}
          </div>
          <div className='flex flex-col xl:hidden'>
            {data?.businessName ? (
              <h3
                className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
                style={{ textAlign: 'left' }}
              >
                {data?.businessName}
              </h3>
            ) : data?.firstName || data?.lastName ? (
              <h3
                className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
                style={{ textAlign: 'left' }}
              >
                {/* {data?.firstName + " " + data?.lastName?.slice(0,2)+"..."} */}
                {data?.firstName} {data?.lastName && data?.lastName?.slice(0, 10) + '...'}
              </h3>
            ) : (
              <h3
                className='text-[16px] text-text-primary mt-[-2px] p-0 font-[500]'
                style={{ textAlign: 'left', color: '#ccc' }}
              >
                --
              </h3>
            )}
            {role === 'elderly' ? null : (
              <p
                className=' text-[13px] mt-[-4px] font-[400] text-[#A3AED0]'
                style={{ textAlign: 'left' }}
              >
                {data?.businessEmail ? data?.businessEmail?.slice(0, 18) + '...' : 'No email'}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminFiled;
