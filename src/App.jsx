import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Feed from "./components/Feed";
import SearchResult from "./components/SearchResult";
import VideoDetails from "./components/VideoDetails";
import Login from "./pages/Login";
import History from "./pages/History";
import Favorites from "./pages/Favorites";
import WatchLater from "./pages/WatchLater";
import ProtectedRoute from "./components/ProtectedRoute";

import { AppContext } from "./context/contextApi";

function App() {
  return (
    <AppContext>
      <BrowserRouter>
        <div className="flex flex-col h-full">
          {/* Toast notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "8px",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          <Header />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Feed />} />
            <Route path="/searchResult/:searchQuery" element={<SearchResult />} />
            <Route path="/video/:id" element={<VideoDetails />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watch-later"
              element={
                <ProtectedRoute>
                  <WatchLater />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AppContext>
  );
}

export default App;
