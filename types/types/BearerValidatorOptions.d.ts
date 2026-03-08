import { Request } from "express";
/**
 * Options for configuring Bearer token validation middleware.
 *
 * @example
 * ```typescript
 * // Header-based token validation (default)
 * const options: BearerValidatorOptions = {
 *   realm: 'my-api',
 *   tokenCheckCallback: async (token) => {
 *     return await verifyToken(token);
 *   },
 * };
 *
 * // Query parameter-based token validation
 * const options: BearerValidatorOptions = {
 *   tokenLocation: 'query',
 *   tokenParameter: 'access_token',
 *   realm: 'my-api',
 *   tokenCheckCallback: (token) => token === expectedToken,
 * };
 * ```
 */
export default interface BearerValidatorOptions {
    /**
     * The location from which to extract the Bearer token.
     *
     * - `'header'` - Extract from the `Authorization` request header (default).
     * - `'query'`  - Extract from a query string parameter.
     * - `'body'`   - Extract from a request body parameter.
     *
     * @default 'header'
     */
    tokenLocation?: 'header' | 'query' | 'body';
    /**
     * The parameter name used to extract the token when `tokenLocation` is `'query'` or `'body'`.
     * Required when `tokenLocation` is `'query'` or `'body'`.
     *
     * @default 'access_token'
     */
    tokenParameter?: string;
    /**
     * The realm name included in the `WWW-Authenticate` response header.
     *
     * @default ''
     */
    realm?: string;
    /**
     * A callback function to validate the extracted token (e.g., verify against a database or JWT).
     * Receives the token string and must return `true` if valid, `false` otherwise.
     * Supports both synchronous and asynchronous functions.
     *
     * @param {string} token - The extracted Bearer token.
     * @returns {Promise<boolean> | boolean} Whether the token is valid.
     */
    tokenCheckCallback?: (token: string) => Promise<boolean> | boolean;
    /**
     * A callback function to validate the request parameters (e.g., check required fields in the body).
     * Receives the Express `Request` object and must return `true` if valid, `false` otherwise.
     * Supports both synchronous and asynchronous functions.
     *
     * @param {Request} req - The Express request object.
     * @returns {Promise<boolean> | boolean} Whether the request parameters are valid.
     */
    requestParameterCheck?: (req: Request) => Promise<boolean> | boolean;
}
