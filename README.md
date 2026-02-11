# Map Trekker Live

A real-time bus tracking system for small cities and towns. Inspired by the Marauder's Map - track buses, check ETAs, and never miss your ride again. Built for a hackathon to solve the uncertainty of public transport in Tier 2 cities.

## 🚌 What It Does

- **Live Bus Tracking**: See where buses are in real-time on an interactive map
- **Walking ETAs**: Calculate how long it takes to walk to the nearest bus stop
- **Crowd Density**: Check if the bus is crowded before you board
- **Driver Interface**: Drivers can share their location and report crowd levels
- **Route Visualization**: See all bus routes and stops on the map

Pretty simple but effective. Still a work in progress!

## 📦 How to Run It

**Prerequisites**: Node.js (v18+), Firebase account, and a package manager (npm/yarn/bun)

1. **Clone the repo**:
   ```bash
   git clone https://github.com/perfectking321/Marauder-Map-AI-Real-time-Bus-Tracking-System.git
   cd Marauder-Map-AI-Real-time-Bus-Tracking-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or yarn install
   # or bun install
   ```

3. **Set up Firebase**:
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Create a Firestore database with a `busLocations` collection
   - Get your config from Project Settings

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the app**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript, Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Maps**: Leaflet + OSRM for routing
- **Backend**: Firebase (Auth + Firestore)

## 🤔 Why I Made This

In smaller cities, you never know when the next bus is coming. You wait at stops not knowing if you missed it or if it's running late. This project attempts to solve that by giving everyone real-time visibility into where buses actually are.

Also, it was a fun way to learn Firebase real-time features and map integrations!

## 🚧 Things I Might Add

- Push notifications for bus arrivals
- Offline mode for low-network areas
- AI-powered ETA predictions using traffic and weather data
- AR navigation to bus stops
- Admin dashboard for fleet management
- Gamification (reward eco-friendly commuters)

## 💡 Contributing

Got ideas or want to make this better? Fork it, open an issue, or submit a pull request! Check out [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

This is a learning project, so all contributions and feedback are welcome.

## 📄 License

MIT License - see [LICENSE](docs/LICENSE) for details.

## 🙏 Credits

- Inspired by Harry Potter's Marauder's Map
- Built with [shadcn/ui](https://ui.shadcn.com/), [Leaflet](https://leafletjs.com/), and [Firebase](https://firebase.google.com/)

---

**Want to contribute?** See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) and [docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md)

**Need detailed setup help?** Check [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

**Version history:** [docs/CHANGELOG.md](docs/CHANGELOG.md)
