import express from "express";
/**
 * Utility class for extracting Bearer tokens from HTTP requests.
 * Supports extraction from the `Authorization` header, query parameters, and request body.
 */
export default class BearerParser {
    /**
     * Regular expression to extract the Bearer token from the `Authorization` header.
     * Matches the format: `Bearer <token>` where `<token>` consists of URL-safe Base64 characters.
     * @type {RegExp}
     */
    private static REGEX_BEARER_TOKEN;
    /**
     * Extracts a Bearer token from the `Authorization` request header.
     * This is an alias for {@link BearerParser.parseBearerTokenHeader}.
     *
     * @param {express.Request | {headers: {authorization?: string}}} req - The request object, either an Express `Request` or any object with a `headers.authorization` property.
     * @returns {string | undefined} The extracted token string, or `undefined` if not found.
     * @example
     * ```typescript
     * import {BearerParser} from 'bearer-token-parser';
     *
     * const token = BearerParser.parseBearerToken(req);
     * if (token) {
     *   console.log('Token:', token);
     * }
     * ```
     */
    static parseBearerToken(req: express.Request | {
        headers: {
            authorization?: string;
        };
    }): string | undefined;
    /**
     * Extracts a Bearer token from the `Authorization` request header.
     * Parses the header value matching the pattern `Bearer <token>` and returns the token portion.
     *
     * @param {express.Request | {headers: {authorization?: string}}} req - The request object, either an Express `Request` or any object with a `headers.authorization` property.
     * @returns {string | undefined} The extracted token string, or `undefined` if the header is missing or the format is invalid.
     * @example
     * ```typescript
     * import {BearerParser} from 'bearer-token-parser';
     *
     * // Express route handler
     * app.get('/api/resource', (req, res) => {
     *   const token = BearerParser.parseBearerTokenHeader(req);
     *   if (!token) {
     *     return res.status(401).json({error: 'No token provided'});
     *   }
     *   // Verify token...
     * });
     * ```
     */
    static parseBearerTokenHeader(req: express.Request | {
        headers: {
            authorization?: string;
        };
    }): string | undefined;
    /**
     * Extracts a Bearer token from a query string parameter.
     *
     * @param {express.Request | {query: {[key: string]: any}}} req - The request object, either an Express `Request` or any object with a `query` property.
     * @param {string} [tokenParameter='access_token'] - The name of the query parameter containing the token.
     * @returns {string | undefined} The extracted token string, or `undefined` if the parameter is missing.
     * @example
     * ```typescript
     * import {BearerParser} from 'bearer-token-parser';
     *
     * // GET /api/resource?access_token=abc123
     * app.get('/api/resource', (req, res) => {
     *   const token = BearerParser.parseBearerTokenQuery(req, 'access_token');
     *   if (!token) {
     *     return res.status(401).json({error: 'No token provided'});
     *   }
     *   // Verify token...
     * });
     * ```
     */
    static parseBearerTokenQuery(req: express.Request | {
        query: {
            [key: string]: any;
        };
    }, tokenParameter?: string): string | undefined;
    /**
     * Extracts a Bearer token from the request body.
     *
     * @param {express.Request | {body: {[key: string]: any}}} req - The request object, either an Express `Request` or any object with a `body` property.
     * @param {string} [tokenParameter='access_token'] - The name of the body parameter containing the token.
     * @returns {string | undefined} The extracted token string, or `undefined` if the parameter is missing.
     * @example
     * ```typescript
     * import {BearerParser} from 'bearer-token-parser';
     *
     * // POST /api/resource with body { access_token: 'abc123' }
     * app.post('/api/resource', (req, res) => {
     *   const token = BearerParser.parseBearerTokenBody(req, 'access_token');
     *   if (!token) {
     *     return res.status(401).json({error: 'No token provided'});
     *   }
     *   // Verify token...
     * });
     * ```
     */
    static parseBearerTokenBody(req: express.Request | {
        body: {
            [key: string]: any;
        };
    }, tokenParameter?: string): string | undefined;
}
