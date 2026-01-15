import DOMPurify from 'dompurify';
import { LoaderCircleIcon, LogOut, Moon, Search, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUsers } from '@/MonitoringService/hooks/UseUser';
import { useWhiteLabeling } from '@/MonitoringService/hooks/useWhiteLabeling';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import { removeToken } from '@/utils/auth';
import { escapeRegExp } from '@/utils/regex';

import { useDemoMode } from '../../Context/DemoModeContext';
import TitleBanner from '../header/TitleBanner';
import { useTheme } from '../ThemeProvider';
import { Avatar, AvatarFallback,AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { ThemeToggleSwitch } from '../ui/ThemeToggleSwitch';
const BASE_IMAGE_URL = import.meta.env.VITE_S3_BASE_URL;
const FALLBACK_IMAGES = {
  logoUrl: '/seenyor.svg',
  logoDarkUrl: '/seenyor_black.svg',
  faviconUrl: '/vite.png',
};

const BrandingImage = ({ src, preview, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState(preview || src || fallback);
  console.log(preview || src || fallback);

  useEffect(() => {
    setImgSrc(preview || src || fallback);
  }, [preview, src, fallback]);

  return <img src={imgSrc} alt={alt} className={className} onError={() => setImgSrc(fallback)} />;
};

export default function HeaderUI() {
  const { appName, logoUrl, logoDarkUrl } = useWhiteLabeling().branding;

  const { getUser } = useUserStore();
  const [userData, setUserData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsFocused] = useState(false);
  const [searchResult, setSearchResult] = useState();

  const { isDemoMode, toggleDemoMode } = useDemoMode();

  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const {
    data: customer,
    isLoading,
    isSuccess,
    // refetch,
  } = useUsers(
    { search: searchQuery, role: 'monitoring_agent' },
    {
      enabled: searchQuery.length != 0,
    }
  );
  useEffect(() => {
    setSearchResult(customer?.data || []);
  }, [customer, isSuccess]);
  useEffect(() => {
    if (searchQuery?.length == 0) {
      setSearchResult([]);
    }
  }, [searchQuery]);
  useEffect(() => {
    setUserData(getUser());
  }, [currentPath]);
  const toggleTheme = (newTheme) => {
    if (newTheme === 'system') {
      setTheme('system');
    } else {
      setTheme(newTheme);
    }
  };
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text?.replace(regex, `<mark style="background-color: #80CAA7; color: white;">$1</mark>`);
  };
  const isDark = theme === 'light';
  const handelLogout = async () => {
    removeToken();
  };
  return (
    <header className='relative h-16 bg-background px-4 sm:px-6 flex items-center justify-between z-10 border-b border-border/40'>
      <div
        className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r 
        from-primary/20 via-background to-primary/20'
      />

      <div className='flex items-center gap-4 min-w-0'>
        <div className='flex items-center gap-2'>
          <BrandingImage
            src={isDark ? BASE_IMAGE_URL + (logoDarkUrl || '') : BASE_IMAGE_URL + (logoUrl || '')}
            alt='logo'
            className='h-8 w-auto'
            fallback={isDark ? FALLBACK_IMAGES.logoDarkUrl : FALLBACK_IMAGES.logoUrl}
          />
        </div>

        <div className='hidden sm:flex items-center min-w-0'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-muted-foreground' />
            </span>
            <Input
              aria-label='Search'
              placeholder='Search...'
              value={searchQuery}
              className='pl-10 pr-3 h-9 w-[350px] text-sm outline-none border-none !ring-0 bg-transparent'
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2'>
              {isLoading && (
                <LoaderCircleIcon className='h-4 w-4 animate-spin text-muted-foreground' />
              )}
              {searchQuery && !isLoading && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsFocused(false);
                  }}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                  aria-label='Clear search'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>

          {searchResult?.length !== 0 && searchQuery.trim() !== '' && (
            <div
              id='searchResult'
              className='mt-0 max-h-[600px] overflow-auto rounded-lg shadow-lg bg-card border border-border absolute top-14 left-22 z-[1000] w-[600px] '
            >
              <ul>
                {searchResult?.map((result) => (
                  <li
                    key={result._id}
                    className='p-4 hover:bg-card-50 border-b border-border cursor-pointer'
                    onClick={() => {
                      navigate(`/ms/role-managment/${result?._id}`);
                    }}
                  >
                    <div className='font-semibold text-lg text-text'>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(highlightText(result.name + ' ' + result.last_name, searchQuery)),
                        }}
                      />
                    </div>
                    <div className='text-sm text-gray-500'>
                      <strong>Email:</strong>{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(highlightText(result?.email, searchQuery)),
                        }}
                      />
                    </div>
                    <div className='text-sm text-text/80'>
                      <strong>Contact Number:</strong>{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(highlightText(
                            result?.contact_code + ' ' + result?.contact_number,
                            searchQuery
                          )),
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className='pointer-events-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block'>
        <TitleBanner title={appName} />
      </div>

      <div className='flex items-center gap-4 sm:gap-8'>
        <div className='hidden lg:block'>
          <ThemeToggleSwitch
            checked={isDark}
            onCheckedChange={(checked) => toggleTheme(checked ? 'light' : 'dark')}
          />
        </div>

        {/* Demo Mode Toggle */}

        <div className='flex items-center gap-3'>
          <div className='hidden md:flex flex-col text-right'>
            <span className='text-base opacity-90'>
              {userData?.name} {userData?.last_name}
            </span>
            <span className='text-xs text-muted-foreground capitalize'>{userData?.role}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='outline-none focus:ring-0'>
                <Avatar className='h-9 w-9 cursor-pointer'>
                  <AvatarImage src={userData?.avatar} alt={userData?.name} />
                  <AvatarFallback>{userData?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-fit'>
              <div className='flex flex-col items-start px-3 py-2 border-b border-border/40'>
                <span className='text-sm font-medium'>{userData?.name}</span>
                <span className='text-xs text-muted-foreground'>{userData?.email}</span>
              </div>

              <DropdownMenuItem
                onClick={() => toggleTheme(isDark ? 'dark' : 'light')}
                className='flex items-center justify-between  lg:hidden'
              >
                <span>Toggle Theme</span>
                {isDark ? (
                  <Sun className='h-4 w-4 text-yellow-400' />
                ) : (
                  <Moon className='h-4 w-4 text-blue-400' />
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* <DropdownMenuItem
                onClick={() => console.log("Profile clicked")}
                className="flex items-center justify-between"
              >
                <span>Profile</span>
                <User className="h-4 w-4 text-text hover:text-primary-foreground" />
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className='flex items-center justify-between gap-3 cursor-default'
              >
                <Label
                  htmlFor='demo-mode-dropdown'
                  className='text-sm font-medium cursor-pointer flex-1'
                >
                  Demo Mode
                </Label>
                <Switch
                  id='demo-mode-dropdown'
                  checked={isDemoMode}
                  onCheckedChange={(val) => toggleDemoMode(val)}
                  className='scale-90'
                />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant='destructive'
                onClick={() => handelLogout()}
                className='flex items-center justify-between'
              >
                <span>Logout</span>
                <LogOut className='h-4 w-4 text-danger' />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
