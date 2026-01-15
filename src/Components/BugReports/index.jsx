import React, { useState } from 'react';
import { Input, message } from 'antd';
import { FaBug } from 'react-icons/fa';
import store from 'store2';
import platform from 'platform';
import { sendBugReport } from '../../api/Users';
const { TextArea } = Input;

const BugReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [issue, setIssue] = useState('');

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const parsedDeviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    browser: platform.name,
    browserVersion: platform.version,
    os: platform.os?.toString(),
    device: platform.product || 'Desktop',
    description: platform.description,
    currentUrl: window.location.href,
  };
  const handleSubmit = () => {
    if (!email.trim() || !issue.trim()) {
      message.warning('Please provide both email and issue.');
      return;
    }
    const version = store.get('version');
    const user = store.get('user');
    console.log(user);

    const bugData = {
      issue,
      platform: 'Seenyor-Platform',
      version: version,
      client: user?.name + ' ' + user?.last_name,
      email,
      deviceId: '--',
      details: {
        deviceInfo: parsedDeviceInfo,
        loggedUserInfo: {
          id: user?._id,
          email: user?.email,
          phone: user?.contact_code + ' ' + user?.contact_number,
          fullName: user?.name + ' ' + user?.last_name,
          role: user?.role,
          subscriptionId: user?.subscription_id || 'No Subscription ID',
          hierarchy: user?.hierarchy,
        },
      },
    };
    sendBugReport(bugData)
      .then((res) => {
        console.log(res);
        setIsOpen(false);
        setEmail('');
        setIssue('');
        message.success('Bug report submitted!');
      })
      .catch((err) => {
        console.log(err);
        message.error('Something Wrong!');
      });
  };

  return (
    <>
      {/* Floating Button */}
      <div className='fixed bottom-6 right-6 z-[1000] flex flex-col items-end space-y-2'>
        {/* Bug Form Panel */}
        {isOpen && (
          <div className='w-100 bg-white shadow-xl border border-gray-200 rounded-lg p-4 space-y-3 animate-fade-in-down'>
            <h3 className='text-2xl font-semibold text-gray-800'>Report a Bug</h3>
            <Input
              type='email'
              placeholder='Your email'
              className='text-[16px]'
              size='large'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextArea
              rows={3}
              className='text-[16px]'
              size='large'
              placeholder='Describe the issue'
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
            <div className='flex justify-end gap-2'>
              <button
                className='px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300'
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600'
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Floating Icon Button */}
        <button
          onClick={toggleOpen}
          className='bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all'
          title='Report a bug'
        >
          <FaBug className='text-xl' />
        </button>
      </div>
    </>
  );
};

export default BugReportModal;
