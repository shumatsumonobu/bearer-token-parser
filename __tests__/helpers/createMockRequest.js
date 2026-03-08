/**
 * Creates a minimal mock Express Request object.
 * Only includes properties actually used by BearerParser and BearerValidator.
 *
 * @param {Object} [overrides] - Properties to merge into the mock request.
 * @param {Object} [overrides.headers] - Request headers (e.g., `{ authorization: 'Bearer token' }`).
 * @param {Object} [overrides.query] - Query parameters (e.g., `{ access_token: 'token' }`).
 * @param {Object} [overrides.body] - Body parameters (e.g., `{ access_token: 'token' }`).
 * @returns {Object} A mock request object.
 */
module.exports = (overrides = {}) => ({
  headers: {},
  query: {},
  body: {},
  ...overrides,
});
