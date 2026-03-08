/**
 * Creates a minimal mock Express Response object with chainable methods.
 * Uses `jest.fn()` to track calls to `header()` and `sendStatus()`,
 * which are the only response methods used by BearerValidator.
 *
 * @returns {Object} A mock response object with spied methods.
 */
module.exports = () => {
  const res = {};
  res.header = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};
