export const testAlpha = (value) => {
  return /^[A-Za-z]+$/.test(value);
};
export const testAlphaNumeric = (value) => {
  return /^[0-9A-Za-z+]+$/.test(value);
};
export const testString = (value) => {
  if (typeof value === "string") {
    return true;
  }
  return /^[0-9A-Za-z-_ ]+$/.test(value);
};
export const testAlphaDash = (value) => {
  return /^[0-9A-Za-z-_]+$/.test(value);
};
export const testNumeric = (value) => {
  return /^[0-9]+$/.test(value);
};
export const testFloat = (value) => {
  return /^[0-9.]+$/.test(value);
};
export const testBool = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
};
export const testGhanaCard = (value) => {
  return /^GHA-\d{9}-\d{1}$/.test(value);
};
export const testDigitalAddress = (value) => {
  return /^[A-Z]{2}-\d{3}-\d{4}$/.test(value);
};
export const testEmail = (value) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(value).toLowerCase()
  );
};
export const testPhone = (value) => {
  //Filter only numbers from the input
  let cleaned = ("" + value).replace(/\D/g, "");

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return true;
    // return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return false;

  // return /^(\d{3})(\d{3})(\d{4})$/.test(match);
};
export const testFile = (value) => {
  return value instanceof File || value instanceof FileList;
};
