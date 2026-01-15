function getSummaryData(apiFunction, query) {
  if (typeof apiFunction !== 'function') {
    console.error('apiFunction is not a function or is undefined');
    return Promise.reject(new Error('apiFunction is not a function'));
  }
  return apiFunction(query)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error('API Request Error:', error);
      throw error;
    });
}

export default getSummaryData;
