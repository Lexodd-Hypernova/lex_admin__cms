const formatDetails = (details) => {
  if (!details || typeof details !== 'object') return '';
  return Object.entries(details)
    .map(([field, message]) => `${field}: ${typeof message === 'string' ? message : JSON.stringify(message)}`)
    .join('\n');
};

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const message = error?.response?.data?.message || error?.message || fallback;
  const details = formatDetails(error?.response?.data?.details);
  return details ? `${message}\n\n${details}` : message;
};

export default getErrorMessage;
