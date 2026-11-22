# Forsa+ — Internship Search Mobile App

[![CI](https://github.com/Yasineert/kech-In/actions/workflows/ci.yml/badge.svg)](https://github.com/Yasineert/kech-In/actions/workflows/ci.yml)
![React Native](https://img.shields.io/badge/React%20Native-0.73-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-lightgrey)

Cross-platform mobile application that helps students find, save and apply to internships. Built with React Native and TypeScript.

> Status: front-end prototype. Authentication and internship data are mocked; no backend is connected yet.

## Features

| Area | Screens |
|---|---|
| Onboarding & auth | Onboarding, Login, Register (validated forms) |
| Discovery | Home feed, full-text search, filters (sector, location, duration, contract type), internship details |
| Applications | Apply form, resume preview, confirmation, "My applications" tracking |
| Personal space | Saved internships, profile, profile editing |

## Tech stack

- **React Native 0.73** with **TypeScript**
- **React Navigation** (native stack + bottom tabs)
- **Redux Toolkit** and **Zustand** for state
- **Axios** for HTTP, **AsyncStorage** and **Keychain** for local and secure storage
- **Jest** for unit tests, **ESLint** and **Prettier** for code quality

## Getting started

**Requirements:** Node.js 18+, a configured [React Native environment](https://reactnative.dev/docs/set-up-your-environment) (Android Studio and/or Xcode), CocoaPods for iOS.

```bash
git clone https://github.com/Yasineert/kech-In.git
cd kech-In
npm install --legacy-peer-deps

npm start            # Metro bundler
npm run android      # in a second terminal
npm run ios          # macOS only (run `cd ios && pod install` first)
```

## Tests

```bash
npm test
```

Form validation (`src/utils/validation.ts`) is covered by unit tests: e-mail format, password strength (8+ characters with letters and digits), required fields and password confirmation. GitHub Actions runs the tests and a Gitleaks secret scan on every push.

## Project structure

```
src/
├── components/   Reusable UI (Button, Card, Input, SearchBar, FilterModal, …)
├── navigation/   Stack and tab navigators
├── screens/      One file per screen
├── theme/        Colors, spacing, typography
└── utils/        Pure helpers (validation) and their tests
```

## Security

- No secrets are stored in the repository. API keys (for example Google Maps) must be provided locally and never committed.
- Release builds must be signed with a private keystore kept outside the repository; the committed `debug.keystore` is the standard React Native debug key.
- See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Team

Developed as a team project. Initial UI by [Hamza Aglagal](https://github.com/Hamza-Aglagal).
