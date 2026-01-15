// @/MonitoringService/Components/ui/create-modal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Shadcn UI Components
import { Button } from '@/MonitoringService/Components/ui/button';
import { Input } from '@/MonitoringService/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/MonitoringService/Components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/MonitoringService/Components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/MonitoringService/Components/ui/form';
import { Checkbox } from '../../ui/checkbox';
import { useCountry } from '@/MonitoringService/hooks/useCountry';
import { Badge } from '../../ui/badge';

const permissionsList = [
  // { id: "manage_agent", label: "Manage Agent" },
  // { id: "agent_role_creation", label: "Agent Role Creation" },
  // { id: "delete_agent", label: "Delete Agent" },
  // { id: "sla_setting_access", label: "SLA Setting Access" },
  { id: 'edit_customer', label: 'Edit Customers' },
  // { id: "branding_setting_access", label: "Branding setting access" },
  { id: 'pause_resume_customer', label: 'Pause / Resume Customers' },
  // { id: "api_and_webhook_access", label: "API and Webhook access" },
  { id: 'deactive_customers', label: 'Deactivate Customers' },
  // { id: "billing_and_usage_access", label: "Billing and Usage Access" },
];

const CreateModal = ({
  isVisible,
  setVisible,
  mode = 'create',
  onSubmit,
  isLoading = false,
  isHeader = true,
  editData = null,
}) => {
  const formSchema = z.object({
    name: z.string().min(1, 'First Name is required'),
    last_name: z.string().min(1, 'Last Name is required'),
    note: z.string().optional(),
    password: mode === 'create' ? z.string().min(1, 'Password is required') : z.string().optional(),
    email: z.string().email('Invalid email address'),
    monitoring_agent_role_name: z.string().min(1, 'Role Name is required'),
    contact_code: z.string().min(1, 'Country code is required'),
    contact_number: z
      .string()
      .min(1, 'Contact number is required')
      .regex(/^\d+$/, 'Contact number must contain only digits'),
    monitoring_agency_access: z.object({
      manage_agent: z.boolean().default(false),
      delete_agent: z.boolean().default(false),
      edit_customer: z.boolean().default(false),
      pause_resume_customer: z.boolean().default(false),
      deactive_customers: z.boolean().default(false),
      agent_role_creation: z.boolean().default(false),
      sla_setting_access: z.boolean().default(false),
      branding_setting_access: z.boolean().default(false),
      api_and_webhook_access: z.boolean().default(false),
      billing_and_usage_access: z.boolean().default(false),
    }),
  });

  const {
    data: countriesData,
    isPending: isCountriesPending,
    isError: isCountriesError,
  } = useCountry();
  const countries = React.useMemo(() => {
    if (!countriesData?.data) return [];

    const seen = new Set();
    return countriesData.data
      .filter((country) => country.status && !country.soft_deleted)
      .map((country) => ({
        ...country,
        label: `${country.country_name} (${country.country_code})`,
        value: `${country.country_code}_${country.country_name}`,
      }))
      .filter((item) => {
        if (seen.has(item.value)) {
          return false;
        }
        seen.add(item.value);
        return true;
      })
      .sort((a, b) => a.country_name.localeCompare(b.country_name));
  }, [countriesData]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      password: '',
      monitoring_agent_role_name: '',
      contact_code: '',
      note: '',
      contact_number: '',
      monitoring_agency_access: {
        manage_agent: false,
        delete_agent: false,
        edit_customer: false,
        pause_resume_customer: false,
        deactive_customers: false,
        agent_role_creation: false,
        sla_setting_access: false,
        brandingSetting: false,
        api_and_webhook_access: false,
        billing_and_usage_access: false,
      },
    },
  });

  useEffect(() => {
    if (mode === 'edit' && editData) {
      const matchingCountry = countries.find(
        (country) => country.country_code === editData.contact_code
      );
      console.log(matchingCountry);
      console.log(editData);

      form.reset({
        name: editData.name || '',
        last_name: editData.last_name || '',
        email: editData.email || '',
        note: editData.note || '',
        monitoring_agent_role_name: editData.monitoring_agent_role_name || '',
        contact_code: `${matchingCountry?.country_code}_${matchingCountry?.country_name}` || '',
        contact_number: editData.contact_number || '',
        monitoring_agency_access: {
          ...form.getValues('monitoring_agency_access'),
          ...editData.monitoring_agency_access,
        },
      });
    }
  }, [mode, editData, form, countries]);
  // Add this inside your component to debug
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form values:', value);
      console.log('Form errors:', form.formState.errors);
    });
    return () => subscription.unsubscribe();
  }, [form]);
  const handleSubmit = (data) => {
    console.log(data);

    const code = data.contact_code.split('_')[0];
    onSubmit({ ...data, contact_code: code, role: 'monitoring_agent' });
  };

  const handleCancel = () => {
    setVisible(false);
    form.reset();
  };

  useEffect(() => {
    if (!isVisible) {
      form.reset();
    }
  }, [isVisible, form]);

  return (
    <Dialog open={isVisible} onOpenChange={setVisible}>
      <DialogContent className='sm:max-w-[600px] border-border h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]'>
        {/* {isHeader && ( */}
        <DialogHeader>
          <DialogTitle>{/* {mode === "create" ? "Create User" : "Edit User"} */}</DialogTitle>
          <DialogDescription>
            {/* {mode === "create"
                ? "Create a new monitoring agent user."
                : "Edit existing monitoring agent user details."} */}
          </DialogDescription>
        </DialogHeader>
        {/* )} */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='flex gap-3 w-full items-start'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Number Field */}
            <div className='flex gap-3 w-full items-start'>
              <FormField
                control={form.control}
                name='contact_code'
                render={({ field }) => (
                  <FormItem className='w-1/3'>
                    <FormLabel>Country Code</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isCountriesPending}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full py-[26px]'>
                          {isCountriesPending ? (
                            <SelectValue placeholder='Loading...' />
                          ) : (
                            <SelectValue placeholder='Select country code'>
                              {field.value && (
                                <div className='flex items-center gap-2 truncate w-full max-w-[135px]'>
                                  <span className='truncate'>
                                    {countries.find((c) => c.value === field.value)?.label}
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-[300px] overflow-y-auto'>
                        {isCountriesPending ? (
                          <SelectItem value='loading' disabled>
                            Loading countries...
                          </SelectItem>
                        ) : isCountriesError ? (
                          <SelectItem value='error' disabled>
                            Failed to load countries
                          </SelectItem>
                        ) : countries.length === 0 ? (
                          <SelectItem value='no-data' disabled>
                            No countries available
                          </SelectItem>
                        ) : (
                          countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              <div className='flex items-center gap-2'>
                                <img
                                  src={country.country_flag}
                                  alt={country.country_name}
                                  className='w-5 h-3 object-cover rounded flex-shrink-0'
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <span className='truncate'>{country.label}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contact_number'
                render={({ field }) => (
                  <FormItem className='w-2/3'>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter contact number'
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='monitoring_agent_role_name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter role name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>
                    Note{' '}
                    <Badge variant='outline' className='border-border'>
                      Optional
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Enter note' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'create' && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='space-y-4'>
              <h3 className='text-sm font-semibold'>Access</h3>

              <div className='grid gap-2 grid-cols-2 '>
                {permissionsList.map((permission) => (
                  <FormField
                    key={permission.id}
                    control={form.control}
                    name={`monitoring_agency_access.${permission.id}`}
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='rounded-full'
                          />
                        </FormControl>
                        <FormLabel className='font-normal text-sm'>{permission.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className='pt-4 w-full'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                className='w-full'
                size='lg'
              >
                Cancel
              </Button>
              <Button type='submit' className='w-full' size='lg' disabled={isLoading}>
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <span className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full' />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </span>
                ) : mode === 'create' ? (
                  'Create'
                ) : (
                  'Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
