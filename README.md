
# 🧙‍♂️ WorldBuilder: RPG Campaign Tracker

WorldBuilder is a lightweight RPG campaign management platform designed for game masters. It allows you to create fantasy worlds with custom calendars, build rich timelines of sessions, manage characters, and track the progress of your campaigns — all with a nostalgic 8-bit look.

## 🎮 Features

- ✨ Create custom worlds with their own calendar systems  
- 📅 Define months and track in-world time progression  
- 🎭 Manage characters (PCs and NPCs) with class, race, and birthdate  
- 📚 Organize campaigns and sessions with story hooks and rich narrative tracking  
- 🔐 Secure login with JWT authentication  
- 🖼️ 8-bit pixel-art inspired user interface  

## 📦 Tech Stack

- **Frontend**: React, React Router, TailwindCSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (hosted on Atlas)  
- **Authentication**: JWT with token expiration  
- **Design**: Retro-style UI with pixel art elements  

## 🚀 Getting Started

### 🔧 Requirements

- Node.js v18+  
- npm or yarn  
- MongoDB Atlas account (or local MongoDB)  

### 📥 Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/worldbuilder.git
   cd worldbuilder
   ```

2. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the `server/` directory:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

5. In a new terminal tab, install frontend dependencies:

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

6. Visit the app at: [http://localhost:5173](http://localhost:5173)

## 🗃️ Project Structure

```
worldbuilder/
├── src/          # React frontend
│   ├── components/  # UI components
│   └── pages/       # Application pages
│   └── services/    # API services
│   └── styles/      # Global styles
│   └── utils/       # Other util functions
├── backend/      # Express backend
│   ├── models/      # Mongoose models (World, Calendar, Session, etc)
│   ├── controllers/ # Logic for each model
│   ├── routes/      # API routes
│   └── middleware/  # Auth and validation
│   └── scripts/     # Util scripts
```

## 🛡️ Authentication

Authentication is handled using **JWT tokens** with a 30-minute expiration.  
The frontend uses a custom `authFetch` wrapper to include the token in all protected requests.

## 📚 Planned Features

- 🧭 Session timeline with rich narrative display  
- 🧑‍🤝‍🧑 Player/GM roles (GM-only controls)  
- 🖼️ Portrait uploads for characters  
- 📦 Export data as PDF or JSON  
- 🌙 Dark mode  

## 🤝 Contributing

PRs are welcome! If you'd like to improve the app, fix a bug, or add new features, feel free to fork the repo and open a pull request.

## 📜 License

MIT License. Feel free to use or modify this project for personal and professional use.
