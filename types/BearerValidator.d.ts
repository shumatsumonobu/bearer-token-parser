import express from "express";
import BearerValidatorOptions from '~/types/BearerValidatorOptions';
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
    static validation(options: BearerValidatorOptions): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
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
    static resWithWwwAuthenticate(res: express.Response, statusCode: number, realm: string, error?: string, errorDescription?: string): void;
}
