import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async(url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });
        const responseData = await response.json();

        // Clear abortCtrl once request is successful
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
    
        // Handling responses with a 4XX or 5XX code since they dont throw error in fetch() 
        if(!response.ok){
          throw new Error(responseData.message || 'Something went wrong please try again')
        }
        
        setIsLoading(false);
        return responseData;
      } catch(err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
    }, []);

  const clearError = () => {
    setError(null);
  };

  // useEffect to run CLEANUP logic
  // When useEffect returns a function, that function gets run by the component
  // using useEffect (or in this case, the component using our custom hook) when the component unmounts
  useEffect( () => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);


  return { isLoading, error, sendRequest, clearError };
};