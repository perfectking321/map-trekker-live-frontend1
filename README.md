<div align="center">

# 🚌 Map Trekker Live

### Real-time Bus Tracking System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

*Inspired by the magical Marauder's Map - Keep track of every bus in real-time*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## 📖 About

**Map Trekker Live** (formerly Marauder's Map AI) is a real-time, intelligent bus tracking system designed specifically for small Tier 2 cities and towns. This project enhances public transport reliability and competitiveness by providing live location tracking, crowd density monitoring, and accurate ETA predictions.

### 🎯 Problem Statement

Public transportation in small cities often lacks real-time tracking, leading to:
- Uncertain wait times at bus stops
- Overcrowding and poor passenger experience
- Inefficient route planning
- Low ridership due to unreliability

### 💡 Our Solution

A comprehensive, user-friendly platform that:
- Tracks buses in real-time using GPS
- Provides accurate ETAs for passengers
- Monitors crowd density for better planning
- Works seamlessly across devices

---

## ✨ Features

### 🔐 Authentication System
- Secure login and registration for Drivers, Users, and Admins
- Firebase Authentication integration
- Role-based access control
- Automatic dashboard redirection

### 🚗 Driver Interface
- **Live Location Sharing**: Toggle GPS tracking on/off
- **Crowd Density Reporting**: Report current bus capacity (Low/Medium/High)
- **Real-time Updates**: Automatic sync with Firestore database
- **Simple, Intuitive UI**: Designed for minimal distraction while driving

### 👥 User Interface
- **Live Bus Tracking**: View all active buses on an interactive map
- **Bus Stop Locations**: See all stops along routes
- **Walking Directions**: Get walking routes to nearby bus stops
- **ETA Calculations**: 
  - Walking time to bus stops
  - Bus arrival time at next stop
- **Crowd Indicators**: See bus capacity before boarding
- **Current Location**: Real-time user position tracking
- **Route Visualization**: Clear bus route overlays

### 🛠️ Admin Interface
- Fleet monitoring capabilities
- Route management
- Analytics dashboard (*coming soon*)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Routing**: React Router DOM 6.30
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with animations
- **State Management**: React Context + React Query

### Mapping & Location
- **Maps**: Leaflet 1.9.4
- **Routing**: Leaflet Routing Machine
- **Routing Service**: OSRM (Open Source Routing Machine)
- **Geolocation**: Browser Geolocation API + geolib

### Backend & Database
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore (real-time NoSQL)
- **Hosting**: Firebase Hosting (*optional*)

### Development Tools
- **Package Manager**: npm / yarn / bun
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript 5.8

---

## 🚀 Demo

### Screenshots

> 📸 *Add screenshots of your application here*

**Landing Page**  
*Role selection interface*

**User Dashboard**  
*Real-time bus tracking with map interface*

**Driver Dashboard**  
*Location sharing and crowd reporting*

### Live Demo

> 🌐 *Add your deployed application link here*

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** / **yarn** / **bun** - Package manager
- **Git** - Version control
- **Firebase Account** - [Sign up](https://firebase.google.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/map-trekker-live-frontend1.git
cd map-trekker-live-frontend1
```

### Step 2: Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### Step 3: Set Up Firebase

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard

2. **Register Your Web App**
   - In your Firebase project, click the web icon (`</>`)
   - Register your app and copy the configuration

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Enable Authentication**
   - In Firebase Console, go to Authentication → Sign-in method
   - Enable "Email/Password" provider

5. **Set Up Firestore Database**
   - Go to Firestore Database in Firebase Console
   - Create database (start in test mode for development)
   - Create a collection named `busLocations`

6. **Configure Firestore Rules** (Development)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /busLocations/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

---

## 🎮 Usage

### For Users

1. **Access the Platform**: Navigate to the application URL
2. **Select User Interface**: Click on "User" from the landing page
3. **Login/Register**: Create an account or login
4. **View Live Buses**: See all active buses on the map
5. **Select a Bus Stop**: Click on any bus stop marker
6. **Get Directions**: View walking route and ETA to the stop
7. **Check Bus ETA**: See when the next bus will arrive

### For Drivers

1. **Access the Platform**: Navigate to the application URL
2. **Select Driver Interface**: Click on "Driver" from the landing page
3. **Login/Register**: Use driver credentials
4. **Start Location Sharing**: Toggle the tracking switch
5. **Update Crowd Density**: Select current crowd level
6. **Drive Your Route**: Location updates automatically

### For Administrators

1. **Access Admin Dashboard**: Navigate to `/admin`
2. **Login**: Use admin credentials
3. **Monitor Fleet**: View all active buses
4. **Manage Routes**: Configure bus routes and stops
5. **View Analytics**: Track system usage and performance

---

## 📁 Project Structure

```
map-trekker-live-frontend1/
├── public/
│   ├── images/              # Static images and icons
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Auth/            # Authentication components
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Map/             # Map-related components
│   │   │   └── BusMap.tsx
│   │   ├── BusStopDetails/  # Bus stop information
│   │   ├── DriverInterface/ # Driver dashboard components
│   │   ├── Filters/         # Filter and search
│   │   ├── Header/          # Navigation header
│   │   ├── Search/          # Search functionality
│   │   └── ui/              # Reusable UI components (shadcn/ui)
│   ├── contexts/            # React Context providers
│   │   └── ThemeContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── pages/               # Page components (routes)
│   │   ├── Index.tsx        # Landing page
│   │   ├── AuthPage.tsx     # Authentication
│   │   ├── UserPage.tsx     # User dashboard
│   │   ├── DriverPage.tsx   # Driver dashboard
│   │   ├── AdminPage.tsx    # Admin dashboard
│   │   └── NotFound.tsx     # 404 page
│   ├── services/            # API and external services
│   │   ├── api.ts           # API calls
│   │   └── busSimulation.ts # Bus movement simulation
│   ├── types/               # TypeScript type definitions
│   │   └── bus.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   ├── firebase.ts          # Firebase configuration
│   └── data.json            # Mock data (bus stops, routes)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── package.json             # Dependencies and scripts
├── README.md                # This file
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## 🧪 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development (with dev environment)
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🚧 Roadmap & Future Enhancements

### Phase 1: MVP Enhancement
- [ ] Enhanced UI/UX with animations
- [ ] Offline mode support
- [ ] Push notifications for bus arrivals
- [ ] Multi-language support

### Phase 2: AI Integration
- [ ] **Advanced ETA Predictions**: ML models using traffic, weather, and historical data
- [ ] **Route Optimization**: Suggest optimal routes based on demand
- [ ] **Predictive Delay Alerts**: Warn users of potential delays

### Phase 3: Advanced Features
- [ ] **AR Navigation**: Augmented reality guidance to bus stops
- [ ] **Gamified Green Miles**: Reward system for eco-friendly commuting
- [ ] **Social Features**: Share routes, rate buses, community feedback
- [ ] **Integration APIs**: Third-party app integration

### Phase 4: Admin & Analytics
- [ ] Advanced analytics dashboard
- [ ] Fleet performance monitoring
- [ ] Automated route suggestions
- [ ] Driver performance tracking
- [ ] Revenue and usage analytics

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of Conduct
- How to submit bug reports
- How to propose new features
- Pull request process
- Development setup

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team & Contact

**Project Maintainers**: [Your Team Name]

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Website**: [your-website.com](https://your-website.com)

---

## 🙏 Acknowledgments

- Inspired by the Marauder's Map from Harry Potter
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Maps powered by [Leaflet](https://leafletjs.com/)
- Routing by [OSRM](http://project-osrm.org/)
- Backend by [Firebase](https://firebase.google.com/)

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/map-trekker-live-frontend1)
![GitHub stars](https://img.shields.io/github/stars/yourusername/map-trekker-live-frontend1?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/map-trekker-live-frontend1?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/map-trekker-live-frontend1)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/map-trekker-live-frontend1)

---

<div align="center">

**Made with ❤️ for better public transportation**

[⬆ Back to Top](#-map-trekker-live)

</div>
