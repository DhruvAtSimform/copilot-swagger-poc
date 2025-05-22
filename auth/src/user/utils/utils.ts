export const isEmptyObject = (obj: Object) => {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
};

export const PATTERN =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i; // to test uuid 4 is valid or not.
