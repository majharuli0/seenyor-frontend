// RefContext.js
import { createContext, useContext, useRef } from 'react';

const RefContext = createContext();

export const RefProvider = ({ children, onRefsUpdate }) => {
  const refs = useRef({});

  const registerRef = (key, ref) => {
    refs.current[key] = ref;
    if (onRefsUpdate) {
      onRefsUpdate(refs.current);
    }
  };

  return <RefContext.Provider value={{ registerRef, refs }}>{children}</RefContext.Provider>;
};

export const useRefContext = () => useContext(RefContext);
