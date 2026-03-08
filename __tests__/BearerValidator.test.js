const {BearerValidator} = require('../dist/build.common');
const createMockRequest = require('./helpers/createMockRequest');
const createMockResponse = require('./helpers/createMockResponse');

/**
 * Creates a BearerValidator middleware with sensible defaults.
 * @param {Object} [overrides] - Options to override the defaults.
 * @returns {Function} Express middleware function.
 */
const createMiddleware = (overrides = {}) => {
  return BearerValidator.validation({
    realm: 'test-api',
    tokenCheckCallback: token => token === 'valid-token',
    ...overrides,
  });
};

// ---------------------------------------------------------------------------
// Header token validation
// ---------------------------------------------------------------------------
describe('Header token validation', () => {
  test('calls next() when the token is valid', async () => {
    const middleware = createMiddleware();
    const req = createMockRequest({headers: {authorization: 'Bearer valid-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('responds with 401 token_required when Authorization header is missing', async () => {
    const middleware = createMiddleware();
    const req = createMockRequest();
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="token_required"'
    );
  });

  test('responds with 401 invalid_token when Authorization header has empty token', async () => {
    const middleware = createMiddleware();
    const req = createMockRequest({headers: {authorization: 'Bearer '}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="invalid_token", error_description="Token format error"'
    );
  });

  test('responds with 401 invalid_token when token fails validation callback', async () => {
    const middleware = createMiddleware();
    const req = createMockRequest({headers: {authorization: 'Bearer wrong-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="invalid_token", error_description="Token cannot be authenticated"'
    );
  });
});

// ---------------------------------------------------------------------------
// Query token validation
// ---------------------------------------------------------------------------
describe('Query token validation', () => {
  const queryOptions = {tokenLocation: 'query', tokenParameter: 'access_token'};

  test('calls next() when the query token is valid', async () => {
    const middleware = createMiddleware(queryOptions);
    const req = createMockRequest({query: {access_token: 'valid-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('responds with 401 token_required when query parameter is missing', async () => {
    const middleware = createMiddleware(queryOptions);
    const req = createMockRequest({query: {}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="token_required"'
    );
  });

  test('responds with 401 invalid_token when query token fails validation', async () => {
    const middleware = createMiddleware(queryOptions);
    const req = createMockRequest({query: {access_token: 'wrong-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="invalid_token", error_description="Token cannot be authenticated"'
    );
  });

  test('supports custom query parameter names', async () => {
    const middleware = createMiddleware({tokenLocation: 'query', tokenParameter: 'api_key'});
    const req = createMockRequest({query: {api_key: 'valid-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Body token validation
// ---------------------------------------------------------------------------
describe('Body token validation', () => {
  const bodyOptions = {tokenLocation: 'body', tokenParameter: 'access_token'};

  test('calls next() when the body token is valid', async () => {
    const middleware = createMiddleware(bodyOptions);
    const req = createMockRequest({body: {access_token: 'valid-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('responds with 401 token_required when body parameter is missing', async () => {
    const middleware = createMiddleware(bodyOptions);
    const req = createMockRequest({body: {}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="token_required"'
    );
  });

  test('responds with 401 invalid_token when body token fails validation', async () => {
    const middleware = createMiddleware(bodyOptions);
    const req = createMockRequest({body: {access_token: 'wrong-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="invalid_token", error_description="Token cannot be authenticated"'
    );
  });

  test('supports custom body parameter names', async () => {
    const middleware = createMiddleware({tokenLocation: 'body', tokenParameter: 'token'});
    const req = createMockRequest({body: {token: 'valid-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Async tokenCheckCallback
// ---------------------------------------------------------------------------
describe('Async tokenCheckCallback', () => {
  test('calls next() when async callback resolves to true', async () => {
    const middleware = createMiddleware({
      tokenCheckCallback: async token => token === 'valid-token',
    });
    const req = createMockRequest({headers: {authorization: 'Bearer valid-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('responds with 401 when async callback resolves to false', async () => {
    const middleware = createMiddleware({
      tokenCheckCallback: async token => token === 'valid-token',
    });
    const req = createMockRequest({headers: {authorization: 'Bearer wrong-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});

// ---------------------------------------------------------------------------
// requestParameterCheck callback
// ---------------------------------------------------------------------------
describe('requestParameterCheck callback', () => {
  test('calls next() when requestParameterCheck returns true', async () => {
    const middleware = createMiddleware({
      requestParameterCheck: req => req.body.username != null,
    });
    const req = createMockRequest({
      headers: {authorization: 'Bearer valid-token'},
      body: {username: 'admin'},
    });
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('responds with 400 invalid_request when requestParameterCheck returns false', async () => {
    const middleware = createMiddleware({
      requestParameterCheck: req => req.body.username != null,
    });
    const req = createMockRequest({
      headers: {authorization: 'Bearer valid-token'},
      body: {},
    });
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="invalid_request"'
    );
  });

  test('calls next() when async requestParameterCheck resolves to true', async () => {
    const middleware = createMiddleware({
      requestParameterCheck: async req => req.body.username != null,
    });
    const req = createMockRequest({
      headers: {authorization: 'Bearer valid-token'},
      body: {username: 'admin'},
    });
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('responds with 400 invalid_request when async requestParameterCheck resolves to false', async () => {
    const middleware = createMiddleware({
      requestParameterCheck: async req => req.body.username != null,
    });
    const req = createMockRequest({
      headers: {authorization: 'Bearer valid-token'},
      body: {},
    });
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="test-api", error="invalid_request"'
    );
  });
});

// ---------------------------------------------------------------------------
// No tokenCheckCallback (token extraction only)
// ---------------------------------------------------------------------------
describe('Without tokenCheckCallback', () => {
  test('calls next() when a valid token is present but no callback is provided', async () => {
    const middleware = createMiddleware({tokenCheckCallback: undefined});
    const req = createMockRequest({headers: {authorization: 'Bearer any-token'}});
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Default options
// ---------------------------------------------------------------------------
describe('Default options', () => {
  test('uses empty realm in WWW-Authenticate header when realm is not specified', async () => {
    const middleware = BearerValidator.validation({});
    const req = createMockRequest();
    const res = createMockResponse();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="", error="token_required"'
    );
  });
});

// ---------------------------------------------------------------------------
// Options validation (TypeError)
// ---------------------------------------------------------------------------
describe('Options validation', () => {
  test('throws TypeError when tokenLocation is "query" but tokenParameter is empty', () => {
    expect(() => {
      BearerValidator.validation({tokenLocation: 'query', tokenParameter: ''});
    }).toThrow(TypeError);
  });

  test('throws TypeError when tokenLocation is "body" but tokenParameter is empty', () => {
    expect(() => {
      BearerValidator.validation({tokenLocation: 'body', tokenParameter: ''});
    }).toThrow(TypeError);
  });
});

// ---------------------------------------------------------------------------
// resWithWwwAuthenticate (direct invocation)
// ---------------------------------------------------------------------------
describe('resWithWwwAuthenticate', () => {
  test('sets WWW-Authenticate header with realm only', () => {
    const res = createMockResponse();
    BearerValidator.resWithWwwAuthenticate(res, 401, 'my-realm');

    expect(res.header).toHaveBeenCalledWith('WWW-Authenticate', 'Bearer realm="my-realm"');
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test('sets WWW-Authenticate header with realm and error', () => {
    const res = createMockResponse();
    BearerValidator.resWithWwwAuthenticate(res, 401, 'my-realm', 'invalid_token');

    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="my-realm", error="invalid_token"'
    );
  });

  test('sets WWW-Authenticate header with realm, error, and description', () => {
    const res = createMockResponse();
    BearerValidator.resWithWwwAuthenticate(res, 401, 'my-realm', 'invalid_token', 'The token has expired');

    expect(res.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer realm="my-realm", error="invalid_token", error_description="The token has expired"'
    );
  });

  test('uses the provided HTTP status code', () => {
    const res = createMockResponse();
    BearerValidator.resWithWwwAuthenticate(res, 400, 'my-realm', 'invalid_request');

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  test('includes empty realm when realm is an empty string', () => {
    const res = createMockResponse();
    BearerValidator.resWithWwwAuthenticate(res, 401, '');

    expect(res.header).toHaveBeenCalledWith('WWW-Authenticate', 'Bearer realm=""');
  });
});
