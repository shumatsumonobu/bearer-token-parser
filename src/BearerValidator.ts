import express from "express";
import BearerParser from '~/BearerParser';
import BearerValidatorOptions from '~/types/BearerValidatorOptions';
import isAsyncFunction from '~/utils/isAsyncFunction';

/**
 * Express middleware for Bearer token authentication.
 * Validates Bearer tokens from the `Authorization` header, query parameters, or request body,
 * and responds with appropriate `WWW-Authenticate` headers on failure.
 */
export default class BearerValidator {
  /**
   * Creates an Express middleware that validates Bearer tokens.
   *
   * The middleware extracts a token from the configured location (header, query, or body),
   * validates its format, runs optional validation callbacks, and either calls `next()` on
   * success or responds with a `401`/`400` status and `WWW-Authenticate` header on failure.
   *
   * @param {BearerValidatorOptions} options - Configuration options for token validation.
   * @returns {(req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>} Express middleware function.
   * @throws {TypeError} If `tokenLocation` is `'query'` or `'body'` and `tokenParameter` is not specified.
   * @throws {TypeError} If `tokenLocation` is not one of `'header'`, `'query'`, or `'body'`.
   * @example
   * ```typescript
   * import {BearerValidator} from 'bearer-token-parser';
   *
   * // Validate token from Authorization header
   * app.use('/api', BearerValidator.validation({
   *   realm: 'my-api',
   *   tokenCheckCallback: async (token) => {
   *     const user = await db.findUserByToken(token);
   *     return user != null;
   *   },
   * }));
   *
   * // Validate token from query parameter
   * app.use('/api', BearerValidator.validation({
   *   tokenLocation: 'query',
   *   tokenParameter: 'api_key',
   *   realm: 'my-api',
   *   tokenCheckCallback: (token) => token === process.env.API_KEY,
   * }));
   * ```
   */
  public static validation(options: BearerValidatorOptions): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> {
    // Apply default values to options.
    const resolvedOptions = {
      tokenLocation: 'header' as const,
      tokenParameter: 'access_token',
      realm: '',
      ...options,
    };

    // Validate that tokenParameter is provided for query/body token locations.
    if ((resolvedOptions.tokenLocation === 'query' || resolvedOptions.tokenLocation === 'body') && !resolvedOptions.tokenParameter)
      throw new TypeError('If the token location is `query` or `body`, the token parameter name is required');

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Check if the token source exists in the request.
      if (
        (resolvedOptions.tokenLocation === 'header' && (!req.headers || !req.headers.authorization))
        || (resolvedOptions.tokenLocation === 'query' && (!req.query || !req.query.hasOwnProperty(resolvedOptions.tokenParameter)))
        || (resolvedOptions.tokenLocation === 'body' && (!req.body || !req.body.hasOwnProperty(resolvedOptions.tokenParameter)))
      )
        return void this.resWithWwwAuthenticate(res, 401, resolvedOptions.realm, 'token_required');

      // Extract the token from the configured location.
      let token;
      switch (resolvedOptions.tokenLocation) {
      case 'header':
        token = BearerParser.parseBearerTokenHeader(req);
        break;
      case 'query':
        token = BearerParser.parseBearerTokenQuery(req, resolvedOptions.tokenParameter);
        break;
      case 'body':
        token = BearerParser.parseBearerTokenBody(req, resolvedOptions.tokenParameter);
        break;
      default:
        throw new TypeError('tokenLocation must be one of `header`, `query`, or `body`');
      }

      // Respond with 401 if token is empty or has an invalid format.
      if (!token)
        return void this.resWithWwwAuthenticate(res, 401, resolvedOptions.realm, 'invalid_token', 'Token format error');

      // Run the token validation callback if provided.
      if (resolvedOptions.tokenCheckCallback) {
        const isValid = isAsyncFunction(resolvedOptions.tokenCheckCallback) ? await resolvedOptions.tokenCheckCallback(token) : resolvedOptions.tokenCheckCallback(token);
        if (!isValid)
          return void this.resWithWwwAuthenticate(res, 401, resolvedOptions.realm, 'invalid_token', 'Token cannot be authenticated');
      }

      // Run the request parameter validation callback if provided.
      if (resolvedOptions.requestParameterCheck) {
        const isValid = isAsyncFunction(resolvedOptions.requestParameterCheck) ? await resolvedOptions.requestParameterCheck(req) : resolvedOptions.requestParameterCheck(req);
        if (!isValid)
          return void this.resWithWwwAuthenticate(res, 400, resolvedOptions.realm, 'invalid_request');
      }

      // All validations passed; proceed to the next middleware.
      next();
    };
  }

  /**
   * Sends an HTTP response with a `WWW-Authenticate` header following RFC 6750.
   *
   * @param {express.Response} res - The Express response object.
   * @param {number} statusCode - The HTTP status code (e.g., `401`, `400`).
   * @param {string} realm - The realm name for the `WWW-Authenticate` header.
   * @param {string} [error] - The error code (e.g., `'invalid_token'`, `'token_required'`).
   * @param {string} [errorDescription] - A human-readable description of the error.
   * @example
   * ```typescript
   * BearerValidator.resWithWwwAuthenticate(res, 401, 'my-api', 'invalid_token', 'The token has expired');
   * // Response header: WWW-Authenticate: Bearer realm="my-api", error="invalid_token", error_description="The token has expired"
   * ```
   */
  public static resWithWwwAuthenticate(
    res: express.Response,
    statusCode: number,
    realm: string,
    error?: string,
    errorDescription?: string
  ) {
    let wwwAuthenticate = `Bearer realm="${realm}"`;
    if (error)
      wwwAuthenticate += `, error="${error}"`;
    if (errorDescription)
      wwwAuthenticate += `, error_description="${errorDescription}"`;
    res
      .header('WWW-Authenticate', wwwAuthenticate)
      .sendStatus(statusCode);
  }
}
