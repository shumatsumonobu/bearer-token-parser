const {BearerParser} = require('../dist/build.common');
const createMockRequest = require('./helpers/createMockRequest');

// ---------------------------------------------------------------------------
// parseBearerTokenHeader
// ---------------------------------------------------------------------------
describe('parseBearerTokenHeader', () => {
  test('returns the token from a valid Authorization header', () => {
    const req = createMockRequest({headers: {authorization: 'Bearer abc123'}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBe('abc123');
  });

  test('returns the token when it contains URL-safe Base64 characters', () => {
    // Tokens may contain hyphens, dots, underscores, tildes, plus, and slashes.
    const req = createMockRequest({headers: {authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc-def_ghi~jkl+mno/pqr'}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBe('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc-def_ghi~jkl+mno/pqr');
  });

  test('returns the token when it has Base64 padding (trailing "=")', () => {
    const req = createMockRequest({headers: {authorization: 'Bearer dG9rZW4='}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBe('dG9rZW4');
  });

  test('returns undefined when the Authorization header is missing', () => {
    const req = createMockRequest();
    expect(BearerParser.parseBearerTokenHeader(req)).toBeUndefined();
  });

  test('returns undefined when headers object is missing', () => {
    expect(BearerParser.parseBearerTokenHeader({})).toBeUndefined();
  });

  test('returns undefined when the Authorization header is "Bearer " (no token)', () => {
    const req = createMockRequest({headers: {authorization: 'Bearer '}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBeUndefined();
  });

  test('returns undefined when the Authorization header uses a different scheme', () => {
    const req = createMockRequest({headers: {authorization: 'Basic dXNlcjpwYXNz'}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBeUndefined();
  });

  test('returns undefined when the Authorization header has no scheme prefix', () => {
    const req = createMockRequest({headers: {authorization: 'abc123'}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBeUndefined();
  });

  test('returns undefined when the Authorization header is "Bearer" without a space', () => {
    const req = createMockRequest({headers: {authorization: 'Bearer'}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBeUndefined();
  });

  test('strips double Base64 padding ("==") from the token', () => {
    const req = createMockRequest({headers: {authorization: 'Bearer dG9rZW4xMjM=='}});
    expect(BearerParser.parseBearerTokenHeader(req)).toBe('dG9rZW4xMjM');
  });
});

// ---------------------------------------------------------------------------
// parseBearerToken (alias for parseBearerTokenHeader)
// ---------------------------------------------------------------------------
describe('parseBearerToken', () => {
  test('returns the same result as parseBearerTokenHeader', () => {
    const req = createMockRequest({headers: {authorization: 'Bearer abc123'}});
    expect(BearerParser.parseBearerToken(req)).toBe(BearerParser.parseBearerTokenHeader(req));
  });

  test('returns undefined when the Authorization header is missing', () => {
    const req = createMockRequest();
    expect(BearerParser.parseBearerToken(req)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// parseBearerTokenQuery
// ---------------------------------------------------------------------------
describe('parseBearerTokenQuery', () => {
  test('returns the token from the default "access_token" query parameter', () => {
    const req = createMockRequest({query: {access_token: 'querytoken123'}});
    expect(BearerParser.parseBearerTokenQuery(req)).toBe('querytoken123');
  });

  test('returns the token from a custom query parameter name', () => {
    const req = createMockRequest({query: {api_key: 'customtoken'}});
    expect(BearerParser.parseBearerTokenQuery(req, 'api_key')).toBe('customtoken');
  });

  test('returns undefined when the query parameter does not exist', () => {
    const req = createMockRequest({query: {}});
    expect(BearerParser.parseBearerTokenQuery(req, 'access_token')).toBeUndefined();
  });

  test('returns undefined when the query object is missing', () => {
    expect(BearerParser.parseBearerTokenQuery({}, 'access_token')).toBeUndefined();
  });

  test('returns undefined when a different parameter name is present', () => {
    const req = createMockRequest({query: {other_param: 'value'}});
    expect(BearerParser.parseBearerTokenQuery(req, 'access_token')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// parseBearerTokenBody
// ---------------------------------------------------------------------------
describe('parseBearerTokenBody', () => {
  test('returns the token from the default "access_token" body parameter', () => {
    const req = createMockRequest({body: {access_token: 'bodytoken123'}});
    expect(BearerParser.parseBearerTokenBody(req)).toBe('bodytoken123');
  });

  test('returns the token from a custom body parameter name', () => {
    const req = createMockRequest({body: {token: 'customtoken'}});
    expect(BearerParser.parseBearerTokenBody(req, 'token')).toBe('customtoken');
  });

  test('returns undefined when the body parameter does not exist', () => {
    const req = createMockRequest({body: {}});
    expect(BearerParser.parseBearerTokenBody(req, 'access_token')).toBeUndefined();
  });

  test('returns undefined when the body object is missing', () => {
    expect(BearerParser.parseBearerTokenBody({}, 'access_token')).toBeUndefined();
  });

  test('returns undefined when a different parameter name is present', () => {
    const req = createMockRequest({body: {other_param: 'value'}});
    expect(BearerParser.parseBearerTokenBody(req, 'access_token')).toBeUndefined();
  });
});
