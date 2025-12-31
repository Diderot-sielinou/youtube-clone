# YouTube Clone with Firebase Integration

A complete YouTube clone, developed with React, Vite, and Firebase. This application transforms our previous version of a static video browser into a customized platform with user authentication, data persistence, and social features.

## 🚀 Features

### Authentication
- **Google OAuth** - One-click sign-in with Google
- **Email/Password** - Traditional authentication method
- **Persistent sessions** - Stay logged in across browser sessions
- **Protected routes** - Secure pages for authenticated users only

### Personalization
- **Watch History** - Automatically tracks viewed videos
- **Favorites** - Save your favorite videos
- **Watch Later** - Queue videos to watch later
- **Search History** - Quick access to recent searches

### Social Features
- **Platform Likes** - Like videos (independent of YouTube)
- **Comments** - Comment on videos and interact with others
- **User Profiles** - Display avatars and usernames

### User Experience
- **Toast Notifications** - Real-time feedback for all actions
- **Loading Skeletons** - Smooth loading states
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes

## 📁 Project Structure

```
youtube-clone/
├── src/
│   ├── assets/
│   │   └── images/          # Logo and static images
│   ├── components/
│   │   ├── CommentSection.jsx
│   │   ├── Feed.jsx
│   │   ├── Header.jsx
│   │   ├── LeftNav.jsx
│   │   ├── LeftNavMenuItem.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchResult.jsx
│   │   ├── SearchResultVideoCard.jsx
│   │   ├── SuggestionVideoCard.jsx
│   │   ├── VideoCard.jsx
│   │   └── VideoDetails.jsx
│   ├── context/
│   │   └── contextApi.jsx   # Global state management
│   ├── hooks/
│   │   ├── useAuth.js       # Authentication hook
│   │   └── useFirestore.js  # Firestore operations hook
│   ├── pages/
│   │   ├── Favorites.jsx
│   │   ├── History.jsx
│   │   ├── Login.jsx
│   │   └── WatchLater.jsx
│   ├── services/
│   │   ├── authService.js   # Firebase Auth functions
│   │   ├── firebase.js      # Firebase configuration
│   │   └── firestoreService.js # Firestore operations
│   ├── shared/
│   │   ├── loader.jsx
│   │   └── videoLength.jsx
│   ├── utils/
│   │   └── api.js           # YouTube API helper
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm
- Firebase account
- RapidAPI account (for YouTube138 API)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd youtube-clone

# Install dependencies
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable Authentication:
   - Go to **Authentication** > **Sign-in method**
   - Enable **Google** provider
   - Enable **Email/Password** provider
4. Create Firestore Database:
   - Go to **Firestore Database**
   - Click **Create database**
   - Start in **test mode** (we'll secure it later)
5. Get your config:
   - Go to **Project Settings** > **General**
   - Scroll to **Your apps** > **Web app**
   - Copy the configuration values

### 3. RapidAPI Setup

1. Go to [RapidAPI YouTube138](https://rapidapi.com/ytjar/api/youtube138)
2. Subscribe to the API (free tier available)
3. Copy your API key from the header parameters

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# RapidAPI YouTube138 API Key
VITE_RAPIDAPI_KEY=your_rapidapi_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      
      // User's private collections
      match /history/{videoId} {
        allow read, write: if request.auth.uid == userId;
      }
      match /favorites/{videoId} {
        allow read, write: if request.auth.uid == userId;
      }
      match /watchLater/{videoId} {
        allow read, write: if request.auth.uid == userId;
      }
      match /searchHistory/{queryId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Public video likes
    match /videoLikes/{videoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Video comments
    match /videoComments/{videoId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6. Run the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗂️ Firestore Data Structure

```
firestore/
├── users/{userId}
│   ├── displayName
│   ├── email
│   ├── photoURL
│   ├── createdAt
│   ├── lastLoginAt
│   ├── preferences
│   │   ├── categoryStats: { category: count }
│   │   └── lastWatchedCategory
│   ├── history/{videoId}
│   │   ├── videoId, title, thumbnail
│   │   ├── channelTitle, channelAvatar
│   │   ├── duration, views
│   │   ├── watchedAt, watchCount
│   ├── favorites/{videoId}
│   │   └── ... (same fields + addedAt)
│   ├── watchLater/{videoId}
│   │   └── ... (same fields + addedAt)
│   └── searchHistory/{queryId}
│       ├── query, searchedAt, searchCount
│
├── videoLikes/{videoId}
│   ├── likes (number)
│   └── likedBy (array of userIds)
│
└── videoComments/{videoId}/comments/{commentId}
    ├── userId, userName, userAvatar
    ├── text, createdAt
    └── likes, likedBy
```

## 🎨 Key Components

### Header
- Search bar with suggestions
- User profile dropdown (when authenticated)
- Sign in button (when not authenticated)
- Mobile menu toggle

### LeftNav
- Category navigation
- Library section (History, Favorites, Watch Later)
- Active state highlighting

### VideoCard
- Three-dot menu for quick actions
- Hover effects
- Add to Watch Later / Favorites

### VideoDetails
- Auto-saves to history
- Like, Favorite, Share buttons
- Comment section
- Related videos sidebar

## 📱 Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Home feed | No |
| `/searchResult/:query` | Search results | No |
| `/video/:id` | Video details | No |
| `/login` | Sign in/up page | No |
| `/history` | Watch history | Yes |
| `/favorites` | Liked videos | Yes |
| `/watch-later` | Watch later queue | Yes |

## 🔧 Technologies

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Firebase** - Backend services
  - Authentication
  - Cloud Firestore
- **React Router 7** - Navigation
- **React Hot Toast** - Notifications
- **React Player** - Video playback
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Moment.js** - Date formatting

## 📄 License

MIT License - feel free to use this project for learning or personal use.

Original YouTube Clone base by Fonou Tech.
