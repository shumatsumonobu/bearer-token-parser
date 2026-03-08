# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [2.1.0] - 2026-03-09

### Added
- **`BearerValidatorOptions` export** — TypeScript users can now import the options type directly for type-safe middleware configuration
- **Express 5 support** — compatible with both Express 4 (`^4.17.0`) and Express 5 (`^5.0.0`)

### Changed
- **Zero runtime dependencies** — Express is now a peer dependency; no bundled runtime packages
- **Comprehensive README** — integrated API reference, validation flow diagram, and usage examples for all token sources
- **Enhanced TypeScript definitions** — full JSDoc with `@example`, `@default`, and `@throws` annotations across all public APIs
- **Modernized toolchain** — Rollup 4, Jest 30, TypeScript 5.9

### Removed
- `API.md` — API reference is now part of README

## [2.0.0] - 2024-03-19

### Added
- **Query & Body token support** — `BearerParser` and `BearerValidator` now handle tokens from query strings and request bodies, not just the `Authorization` header.
  - `BearerParser.parseBearerTokenQuery()` — extract a token from a query parameter
  - `BearerParser.parseBearerTokenBody()` — extract a token from the request body
  - `BearerValidator.validation()` accepts `tokenLocation` (`'header'` | `'query'` | `'body'`) and `tokenParameter` options
- `BearerParser.parseBearerTokenHeader()` — explicit method for header extraction
- `BearerParser.parseBearerToken()` — alias for `parseBearerTokenHeader` (backward compatible)

### Changed
- **TypeScript 3 → 5** — modernized type definitions
- **Breaking:** `BearerParser.parseBearerToken()` parameter type changed from `{authorization: string}` to `{headers: {authorization: string}}` to match the standard Express request shape

## [1.0.3] - 2021-11-11

### Changed
- Internal code cleanup and example app improvements

## [1.0.2] - 2020-11-22

### Fixed
- Corrected `WWW-Authenticate` header format when the token is missing — now returns `error="token_required"` as a separate field instead of embedding it in the realm

## [1.0.1] - 2020-11-22

### Fixed
- Documentation corrections

## [1.0.0] - 2020-11-22

Initial release — Bearer token parser & validator middleware for Express with RFC 6750-compliant error responses.

[1.0.0]: https://github.com/shumatsumonobu/bearer-token-parser/releases/tag/v1.0.0
[1.0.1]: https://github.com/shumatsumonobu/bearer-token-parser/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/shumatsumonobu/bearer-token-parser/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/shumatsumonobu/bearer-token-parser/compare/v1.0.2...v1.0.3
[2.0.0]: https://github.com/shumatsumonobu/bearer-token-parser/compare/v1.0.3...v2.0.0
[2.1.0]: https://github.com/shumatsumonobu/bearer-token-parser/compare/v2.0.0...v2.1.0
