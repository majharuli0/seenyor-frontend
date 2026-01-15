import axios from 'axios';
import { useCallback,useEffect, useRef, useState } from 'react';

const useApi = (apiFunction) => {
  const cancelTokenSource = useRef(null);
  const [response, setresponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      // Cancel the previous request if it exists
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Previous request canceled!');
      }

      // Create a new CancelToken
      cancelTokenSource.current = axios.CancelToken.source();

      try {
        // Pass the cancelToken to the API function
        const response = await apiFunction({
          ...params,
          cancelToken: cancelTokenSource.current.token,
        });
        setresponse(response); // Adjust according to your response structure
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Fetch error:', err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  // Cleanup function to cancel ongoing requests when the component unmounts
  useEffect(() => {
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Component unmounted, request canceled!');
      }
    };
  }, []);

  return { response, loading, error, makeRequest };
};

export default useApi;
