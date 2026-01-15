import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Label } from '@/MonitoringService/Components/ui/label';
import { Input } from '@/MonitoringService/Components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/MonitoringService/Components/ui/select';
import { FiEdit2 } from 'react-icons/fi';
import { useTheme } from '../ThemeProvider';
import {
  useUpdateUserRole,
  useUploadImage,
  useUserDetails,
} from '@/MonitoringService/hooks/UseUser';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import { useWhiteLabeling } from '@/MonitoringService/hooks/useWhiteLabeling';
import { Button } from '../ui/button';
import { toast } from '../common/toast';
import { uploadImage } from '@/api/Users';
import { useBrandingStore } from '@/MonitoringService/store/useBrandingStore';
import { useFavicon } from '@/MonitoringService/hooks/useFavicon';
const BASE_IMAGE_URL = import.meta.env.VITE_S3_BASE_URL;
const FALLBACK_IMAGES = {
  logoUrl: '/seenyor.svg',
  logoDarkUrl: '/seenyor_black.svg',
  faviconUrl: '/vite.png',
};

const BrandingImage = ({ src, preview, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState(preview || src || fallback);
  useEffect(() => {
    setImgSrc(preview || src || fallback);
    console.log(src);
  }, [preview, src, fallback]);

  return <img src={imgSrc} alt={alt} className={className} onError={() => setImgSrc(fallback)} />;
};

const BrandingWhiteLabel = () => {
  const { theme, setTheme } = useTheme();
  const { setBranding } = useBrandingStore();

  const branding = useWhiteLabeling();
  const { user, getUser } = useUserStore();
  const [formDataInitialized, setFormDataInitialized] = useState(false);
  const { mutate: updateDetails, isPending: isUpdating } = useUpdateUserRole();
  const [formData, setFormData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  // updateDetails({ id: getUser()?._id, data: formData });
  const [iconPreviews, setIconPreviews] = useState({
    logoUrl: '',
    logoDarkUrl: '',
    faviconUrl: '',
  });
  useEffect(() => {
    if (branding && !formDataInitialized) {
      const data = {
        branding: {
          appName: branding.branding?.appName || 'SEENYOR MONITORING',
          welcomeText: branding.branding?.welcomeText || '',
          logoUrl: branding.branding?.logoUrl || '',
          logoDarkUrl: branding.branding?.logoDarkUrl || '',
          faviconUrl: branding.branding?.faviconUrl || '',
          language: branding.branding?.language || 'en',
        },
        theme: {
          defaultMode: branding.theme?.defaultMode || 'dark',
          colors: {
            light: {
              primary: branding.theme?.colors?.light?.primary || '66 132 244',
              secondary: branding.theme?.colors?.light?.secondary || '66 69 87',
              accent: branding.theme?.colors?.light?.accent || '245 245 245',
              background: branding.theme?.colors?.light?.background || '255 255 255',
              text: branding.theme?.colors?.light?.text || '17 18 27',
            },
            dark: {
              primary: branding.theme?.colors?.dark?.primary || '66 132 244',
              secondary: branding.theme?.colors?.dark?.secondary || '66 69 87',
              accent: branding.theme?.colors?.dark?.accent || '245 245 245',
              background: branding.theme?.colors?.dark?.background || '17 18 27',
              text: branding.theme?.colors?.dark?.text || '255 255 255',
            },
          },
        },
      };
      setFormData(data);
      setOriginalData(data);
      // setIconPreviews({
      //   logoUrl: branding.branding?.logoUrl || "",
      //   logoDarkUrl: branding.branding?.logoDarkUrl || "",
      //   faviconUrl: branding.branding?.faviconUrl || "",
      // });
      setFormDataInitialized(true);
      console.log(iconPreviews, branding);
    }
  }, [branding]);
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const handleChange = (path, value) => {
    if (path == 'theme.defaultMode') {
      setTheme(value);
    }

    setFormData((prev) => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };
  useFavicon(branding?.branding?.faviconUrl);
  const rgbToHex = (rgbString) => {
    if (!rgbString) return '#4f8bff';
    const [r, g, b] = rgbString.split(' ').map(Number);
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToRgb = (hex) => {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!match) return '66 132 244';
    return `${parseInt(match[1], 16)} ${parseInt(match[2], 16)} ${parseInt(match[3], 16)}`;
  };

  const handleColorChange = (themeMode, colorKey, hexValue) => {
    const rgbValue = hexToRgb(hexValue);
    console.log(colorKey, rgbValue);

    setFormData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: {
          ...prev.theme.colors,
          [themeMode]: {
            ...prev.theme.colors[themeMode],
            [colorKey]: rgbValue,
          },
        },
      },
    }));
  };

  const handleIconUpload = useCallback(async (iconType, file) => {
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setIconPreviews((prev) => ({ ...prev, [iconType]: previewURL }));
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    uploadImage(formData)
      .then((res) => {
        if (res) {
          handleChange(`branding.${iconType}`, res?.data?.key);
          toast.success('Image uploaded successfully');
        }
      })
      .catch((err) => {
        toast.error('Failed to upload image');
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, []);

  const handleCancel = () => {
    setFormData(originalData);
    setIconPreviews({
      logoUrl: originalData.branding.logoUrl,
      logoDarkUrl: originalData.branding.logoDarkUrl,
      faviconUrl: originalData.branding.faviconUrl,
    });
    toast('Changes discarded');
  };
  const handleSave = () => {
    if (!hasChanges) return;
    updateDetails(
      { id: getUser()?._id, data: { settings: formData } },
      {
        onSuccess: () => {
          setBranding((prev) => ({
            ...prev,
            ...formData.branding,
            theme: { ...formData.theme },
          }));
          setOriginalData(formData);
          setFormDataInitialized(false);
          setIsUpdated(true);
        },
        onError: () => {},
      }
    );
  };
  useEffect(() => {
    if (isUpdated) {
      const timer = setTimeout(() => setIsUpdated(false), 100000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated]);
  if (!formData) return null;
  const getHexColor = (theme, colorKey) => {
    const rgbValue = formData.theme.colors[theme]?.[colorKey];
    return rgbValue ? rgbToHex(rgbValue) : '#4f8bff';
  };

  return (
    <div className=''>
      {isUpdated && (
        <div className='fixed top-0 left-0 w-full bg-yellow-400 text-black py-3 px-6 flex items-center justify-between z-50 shadow-md'>
          <span>
            ⚡ Settings saved! Some updates may require a page refresh to take full effect.
          </span>
          <div className='flex gap-2'>
            <button
              onClick={() => window.location.reload()}
              className='bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 transition'
            >
              Refresh
            </button>
            <button
              onClick={() => setIsUpdated(false)}
              className='bg-white text-black px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition'
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className='mb-8'>
        <div className='flex justify-between w-full items-start mb-6'>
          <div className=' mb-4'>
            <h2 className='text-lg font-medium'>Branding & White-Label</h2>
            <p className='text-sm font-normal opacity-80'>
              Update colors, logos, and themes to align the system with your organization’s brand.
            </p>
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <Button
              size='lg'
              variant='tertiary'
              className='flex-1 sm:flex-none'
              onClick={handleCancel}
              disabled={!hasChanges}
            >
              Cancel
            </Button>
            <Button
              size='lg'
              className='flex-1 sm:flex-none'
              onClick={handleSave}
              disabled={!hasChanges || isUpdating || isUploading}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {[
            { label: 'Primary Color', key: 'primary' },
            { label: 'Secondary Color', key: 'secondary' },
          ].map((item) => (
            <div key={item.key} className='flex flex-col gap-2'>
              <Label>{item.label}</Label>
              <div
                className='relative w-full h-[50px] rounded-md border border-border overflow-hidden'
                style={{ backgroundColor: getHexColor('dark', item.key) }}
              >
                <input
                  type='color'
                  value={rgbToHex(formData.theme.colors.dark[item.key])}
                  onChange={(e) => {
                    console.log(e);

                    handleColorChange('light', item.key, e.target.value);
                    handleColorChange('dark', item.key, e.target.value);
                  }}
                  className='absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer'
                />
                <div className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-md p-2 pointer-events-none'>
                  <FiEdit2 className='text-white text-[16px]' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-8 p-6 border border-gray-200 rounded-lg bg-white'>
        <h2 className='text-lg font-medium mb-4 text-black'>Light Theme Colors</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {[
            { label: 'Background Color', key: 'background' },
            { label: 'Text Color', key: 'text' },
          ].map((item) => (
            <div key={item.key} className='flex flex-col gap-2'>
              <Label className='text-black'>{item.label}</Label>
              <div
                className='relative w-full h-[50px] rounded-md border border-border overflow-hidden'
                style={{ backgroundColor: getHexColor('light', item.key) }}
              >
                <input
                  type='color'
                  value={getHexColor('light', item.key)}
                  onChange={(e) => handleColorChange('light', item.key, e.target.value)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer'
                />
                <div className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-md p-2 pointer-events-none'>
                  <FiEdit2 className='text-white text-[16px]' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-8 p-6 border border-gray-800 rounded-lg bg-gray-900'>
        <h2 className='text-lg font-medium mb-4 text-white'>Dark Theme Colors</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {[
            { label: 'Background Color', key: 'background' },
            { label: 'Text Color', key: 'text' },
          ].map((item) => (
            <div key={item.key} className='flex flex-col gap-2'>
              <Label className='text-white'>{item.label}</Label>
              <div
                className='relative w-full h-[50px] rounded-md border border-gray-600 overflow-hidden'
                style={{ backgroundColor: getHexColor('dark', item.key) }}
              >
                <input
                  type='color'
                  value={getHexColor('dark', item.key)}
                  onChange={(e) => handleColorChange('dark', item.key, e.target.value)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer'
                />
                <div className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-md p-2 pointer-events-none'>
                  <FiEdit2 className='text-white text-[16px]' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {getUser()?.role !== 'monitoring_agent' && (
        <div className='mt-8'>
          <h2 className='text-lg font-medium mb-4'>Platform Icons</h2>

          <div className='space-y-6'>
            <div>
              <Label>Light Theme Icon</Label>
              <div className='mt-2 flex items-center gap-6'>
                <div className='relative w-[100px] h-[100px] p-2 border border-gray-600 rounded-md flex items-center justify-center overflow-hidden bg-white'>
                  <BrandingImage
                    key={iconPreviews.logoDarkUrl}
                    preview={iconPreviews.logoDarkUrl}
                    src={BASE_IMAGE_URL + (branding?.branding?.logoDarkUrl || '')}
                    alt='Light Theme Icon'
                    fallback={FALLBACK_IMAGES.logoDarkUrl}
                    className='object-contain w-full h-full'
                  />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleIconUpload('logoDarkUrl', file);
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                  <div className='absolute top-1 right-1 bg-black/50 rounded-md p-1'>
                    <FiEdit2 className='text-gray-300 text-sm' />
                  </div>
                </div>
                <span className='text-xs text-text/50'>Recommended: 30x30 px (max 2mb)</span>
              </div>
            </div>

            <div>
              <Label>Dark Theme Icon</Label>
              <div className='mt-2 flex items-center gap-6'>
                <div className='relative w-[100px] h-[100px] p-2 border border-gray-600 rounded-md flex items-center justify-center overflow-hidden bg-gray-800'>
                  <BrandingImage
                    key={BASE_IMAGE_URL + iconPreviews.logoUrl}
                    preview={iconPreviews.logoUrl}
                    src={BASE_IMAGE_URL + (branding?.branding?.logoUrl || '')}
                    alt='Light Theme Icon'
                    fallback={FALLBACK_IMAGES.logoUrl}
                    className='object-contain w-full h-full'
                  />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleIconUpload('logoUrl', file);
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                  <div className='absolute top-1 right-1 bg-black/50 rounded-md p-1'>
                    <FiEdit2 className='text-gray-300 text-sm' />
                  </div>
                </div>
                <span className='text-xs text-text/50'>Recommended: 30x30 px (max 2mb)</span>
              </div>
            </div>
            <div>
              <Label>Favicon</Label>
              <div className='mt-2 flex items-center gap-6'>
                <div className='relative w-[60px] h-[60px] p-2 border border-gray-600 rounded-md flex items-center justify-center overflow-hidden'>
                  <BrandingImage
                    key={iconPreviews.faviconUrl}
                    src={BASE_IMAGE_URL + (branding?.branding?.faviconUrl || '')}
                    preview={iconPreviews.faviconUrl}
                    alt='Light Theme Icon'
                    fallback={FALLBACK_IMAGES.faviconUrl}
                    className='object-contain w-full h-full'
                  />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleIconUpload('faviconUrl', file);
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                  <div className='absolute top-1 right-1 bg-black/50 rounded-md p-1'>
                    <FiEdit2 className='text-gray-300 text-sm' />
                  </div>
                </div>
                <span className='text-xs text-text/50'>Recommended: 16x16 px (max 2mb)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* <div>
          <Label className="mb-3">Typography</Label>
          <Select
            value={formData.branding?.language || "en"}
            onValueChange={(value) => handleChange("branding.language", value)}
          >
            <SelectTrigger className="w-full py-[27px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        {getUser()?.role !== 'monitoring_agent' && (
          <>
            <div>
              <Label className='mb-3'>Default Theme Mode</Label>
              <Select
                value={formData.theme?.defaultMode || 'dark'}
                onValueChange={(value) => handleChange('theme.defaultMode', value)}
              >
                <SelectTrigger className='w-full py-[27px]'>
                  <SelectValue placeholder='Select Default Mode' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='system'>System</SelectItem>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='mb-3'>Platform Title</Label>
              <Input
                type='text'
                value={formData.branding?.appName || ''}
                onChange={(e) => handleChange('branding.appName', e.target.value)}
                className='w-full'
              />
            </div>
          </>
        )}
      </div>
      {getUser()?.role !== 'monitoring_agent' && (
        <div className='mt-6'>
          <Label className='mb-3'>Welcome Text</Label>
          <Input
            type='text'
            value={formData.branding?.welcomeText || ''}
            onChange={(e) => handleChange('branding.welcomeText', e.target.value)}
            className='w-full'
            placeholder='Welcome message for users'
          />
        </div>
      )}
    </div>
  );
};

export default BrandingWhiteLabel;
