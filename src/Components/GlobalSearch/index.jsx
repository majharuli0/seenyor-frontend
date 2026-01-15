import { Input, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMail, FiPhone, FiUser, FiMapPin, FiShield } from 'react-icons/fi';
import { FaBirthdayCake } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';

const GlobalSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  // Shortcut: Shift + S to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    if (!isFocused) {
      setQuery('');
    }
  }, [isFocused]);
  // Fetch results with debounce
  const fetchResults = debounce(async (q) => {
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      setResults([
        {
          type: 'user',
          name: 'Majharul Islam',
          email: 'majharul@example.com',
          phone: '+880 1234-567890',
          role: 'Super Admin',
        },
        {
          type: 'elderly',
          name: 'Rahima Khatun',
          age: 79,
          address: 'Green Home, Dhaka',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, 500);

  useEffect(() => {
    fetchResults(query);
  }, [query]);

  return (
    <>
      {/* Background Blur */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsFocused(false);
              inputRef.current.blur();
            }}
          />
        )}
      </AnimatePresence>

      {/* Search Bar Container */}
      <div className='fixed z-50  flex justify-center px-4 top-4 min-w-[350px] max-w-[650px] w-full left-[50%] -translate-x-[50%]'>
        <div className='w-full max-w-xl'>
          {/* Search Bar */}
          <motion.div
            initial={false}
            animate={{
              y: isFocused ? 60 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className='relative'
          >
            <Input
              ref={inputRef}
              size='large'
              placeholder='Search anything...'
              prefix={<FiSearch className='text-gray-400' />}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!query) setIsFocused(false);
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='rounded-xl pr-20 border border-gray-300'
              style={{ boxShadow: 'none' }}
            />

            {!isFocused && (
              <span className='absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-md select-none'>
                Shift + S
              </span>
            )}
          </motion.div>

          {/* Results or Loading */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className='mt-2 bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden'
              >
                <div className='p-4 pt-12 space-y-4'>
                  {loading ? (
                    <div className='flex justify-center py-6'>
                      <Spin />
                    </div>
                  ) : results.length > 0 ? (
                    results.map((item, index) => {
                      if (item.type === 'user') {
                        return (
                          <div
                            key={index}
                            className='p-4 cursor-pointer hover:opacity-80 bg-gray-50 border border-gray-200 relative rounded-lg space-y-1'
                          >
                            <div className='text-lg font-semibold flex items-center gap-2'>
                              <FiUser /> {item.name}
                            </div>
                            <div className='text-sm text-gray-600 flex items-center gap-2'>
                              <FiMail /> {item.email}
                            </div>
                            <div className='text-sm text-gray-600 flex items-center gap-2'>
                              <FiPhone /> {item.phone}
                            </div>
                            <div className='text-sm text-gray-600 flex items-center gap-2'>
                              <FiShield /> Role: {item.role}
                            </div>
                            <div className='absolute right-3 top-3'>
                              <LiaExternalLinkAltSolid size={20} />
                            </div>
                          </div>
                        );
                      }

                      if (item.type === 'elderly') {
                        return (
                          <div
                            key={index}
                            className='p-4 cursor-pointer hover:opacity-80 bg-blue-50 relative border border-blue-200 rounded-lg space-y-1'
                          >
                            <div className='text-lg font-semibold flex items-center gap-2'>
                              <FiUser /> {item.name}
                            </div>
                            <div className='text-sm text-gray-600 flex items-center gap-2'>
                              <FaBirthdayCake /> Age: {item.age}
                            </div>
                            <div className='text-sm text-gray-600 flex items-center gap-2'>
                              <FiMapPin /> {item.address}
                            </div>
                            <div className='absolute right-3 top-3'>
                              <LiaExternalLinkAltSolid size={20} />
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })
                  ) : (
                    <div className='text-gray-400 text-center text-sm'>No results found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default GlobalSearch;
