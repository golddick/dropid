# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-XX-XX

### Added
- Initial release
- `dropid()` function for generating prefixed IDs
- `configure()` function for global configuration
- `resetConfig()` function to reset to defaults
- `getConfig()` function to get current configuration
- `createPrefixedId()` function for reusable prefixed generators
- Alphabet presets (alphanumeric, base58, hex, base64url, numeric)
- Length presets (short, medium, long, extraLong)
- Full TypeScript support with type definitions
- Comprehensive test suite with 100% coverage
- Complete documentation and examples

### Security
- Uses nanoid for cryptographically secure random generation
- Default 12-character length provides ~200 years to 1% collision at 1,000 IDs/sec
- No sequential enumeration - prevents ID guessing attacks

[Unreleased]: https://github.com/golddick/dropid/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/golddick/dropid/releases/tag/v1.0.0
