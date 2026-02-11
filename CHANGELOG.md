# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README with badges and detailed documentation
- Contributing guidelines (CONTRIBUTING.md)
- MIT License
- Environment variables template (.env.example)
- Code of Conduct

## [1.0.0] - 2026-02-11

### Added
- Initial MVP release
- User authentication system (Firebase)
- Driver interface with live location sharing
- Driver interface with crowd density reporting
- User interface with live bus tracking
- Interactive map with Leaflet
- Bus stop locations and route visualization
- Walking ETA calculations to bus stops
- Bus ETA to next stop
- Real-time location updates via Firestore
- Responsive design with Tailwind CSS
- Dark/Light theme toggle
- Role-based routing (User, Driver, Admin)

### Technical Stack
- React 18.3 with TypeScript
- Vite 5.4 build tool
- Firebase Authentication & Firestore
- Leaflet for mapping
- shadcn/ui component library
- React Router DOM for navigation
- OSRM for routing calculations

## [0.1.0] - 2026-01-15

### Added
- Project initialization
- Basic project structure
- Component scaffolding

---

## How to Update This Changelog

### For Contributors
When you make a pull request, please add your changes under the `[Unreleased]` section following these categories:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

### For Maintainers
When releasing a new version:
1. Change `[Unreleased]` to the new version number with date
2. Add a new `[Unreleased]` section at the top
3. Update the version comparison links at the bottom

---

[Unreleased]: https://github.com/yourusername/map-trekker-live-frontend1/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/map-trekker-live-frontend1/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/yourusername/map-trekker-live-frontend1/releases/tag/v0.1.0
