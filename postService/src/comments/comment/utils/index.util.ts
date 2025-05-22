export const ErrorMessageGenerator = (error: Error) => {
  const err = { message: '', error: '' };
  if (error.message) {
    err.message = error.message;
    err.error = error.name;
    return err;
  }

  return {
    message: 'can not perform action now, please try later',
    error: 'Internal Error',
  };
};
