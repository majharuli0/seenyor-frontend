import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { User, Lock, Key, UserCheck, FolderKey, Globe, Link, Braces } from 'lucide-react';
import { Button } from '../ui/button';
import {
  useMonitoringCompanyConf,
  useUpdateMonitoringConf,
} from '@/MonitoringService/hooks/UseUser';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import toast from 'react-hot-toast';
import { Skeleton } from '../ui/skeleton';

export default function APIAndWebhooks() {
  const { user } = useUserStore();
  const { data, refetch, isLoading } = useMonitoringCompanyConf(
    { id: user?.alarms_monitor_by },
    {
      enabled: !!user?.alarms_monitor_by,
    }
  );

  const { mutate: updateConf, isPending } = useUpdateMonitoringConf();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      secret_key: '',
      token: '',
      access_key: '',
      content_type: '',
      language_type: '',
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        username: data.data.username || '',
        password: data.data.password || '****password****',
        secret_key: data.data.secret_key || '****secret_key****',
        token: data.data.token || '****token****',
        access_key: data.data.access_key || '****access_key****',
        content_type: data.data.content_type || '',
        language_type: data.data.language_type || '',
      });
    }
  }, [data, reset]);

  const onSubmit = (values) => {
    if (!user?.alarms_monitor_by) return;
    const payload = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => {
        return !String(value).startsWith('****');
      })
    );
    updateConf(
      { id: user.alarms_monitor_by, data: payload },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y-2'>
        <div className='flex w-full gap-4 justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-text'>API & Webhooks Configuration</h1>
            <p className='text-text/80 text-sm max-w-2xl'>
              Enter your API credentials and webhook settings to enable system integrations.
            </p>
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <Button
              type='button'
              size='lg'
              variant='tertiary'
              className='flex-1 sm:flex-none'
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              size='lg'
              className='flex-1 sm:flex-none'
              disabled={!isDirty || isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className='flex flex-col gap-2 w-full'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-80' />
          <Skeleton className='h-4 w-100' />
          <Skeleton className='h-4 w-120' />
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <User className='h-4 w-4' />
              Username
            </Label>
            <Input
              type='text'
              className='w-full'
              placeholder='Enter your username'
              {...register('username')}
            />
          </div>
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <Lock className='h-4 w-4' />
              Password
            </Label>
            <Input
              type='password'
              className='w-full'
              placeholder='Enter your password'
              {...register('password')}
            />
          </div>
          {/* <div className="flex flex-col">
            <Label className="mb-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Client No.
            </Label>
            <Input
              type="text"
              className="w-full"
              placeholder="Enter client number"
            />
          </div> */}
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <Globe className='h-4 w-4' />
              Content Type
            </Label>
            <Input
              type='text'
              className='w-full'
              placeholder='Enter content type'
              {...register('content_type')}
            />
          </div>
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <Braces className='h-4 w-4' />
              Language Type
            </Label>
            <Input
              type='text'
              className='w-full'
              placeholder='Enter language type'
              {...register('language_type')}
            />
          </div>
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <Key className='h-4 w-4' />
              Access Key
            </Label>
            <Input
              type='password'
              className='w-full'
              placeholder='Enter access key'
              {...register('access_key')}
            />
          </div>
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <Key className='h-4 w-4' />
              Secret Key
            </Label>
            <Input
              type='password'
              className='w-full'
              placeholder='Enter secret key'
              {...register('secret_key')}
            />
          </div>
          <div className='flex flex-col'>
            <Label className='mb-3 flex items-center gap-2'>
              <Link className='h-4 w-4' />
              Token
            </Label>
            <Input
              type='password'
              className='w-full'
              placeholder='Enter token'
              {...register('token')}
            />
          </div>
        </div>
      )}
    </form>
  );
}
