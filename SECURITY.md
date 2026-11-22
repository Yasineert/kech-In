# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's
[private vulnerability reporting](../../security/advisories/new) instead.
You will receive an answer within 7 days.

## Guidelines

- Never commit API keys, tokens or release keystores. Provide them through local, Git-ignored configuration.
- Store authentication tokens on the device with `react-native-keychain`, not in AsyncStorage.
- Every push is scanned for committed secrets with Gitleaks.
