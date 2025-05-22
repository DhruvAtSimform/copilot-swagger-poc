export const ErrorMessageGenerator = (
  error: Error | { message: string; name: string },
) => {
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

export const PATTERN =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i; // to test uuid 4 is valid or not.

export const isValidUUID4 = (uuid: string) => {
  return PATTERN.test(uuid);
};

export const validateAndReturnUUID4s = (uuids: string[]) => {
  return uuids.filter((uuid) => isValidUUID4(uuid));
};
