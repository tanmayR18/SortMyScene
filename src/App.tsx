import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import MobileLogin from "./pages/MobileLogin";
import MobileSignup from "./pages/MobileSignup";
import Profile from "./pages/Profile";
import MyBooking from "./pages/MyBooking";
import EventDetails from "./pages/EventDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<MobileLogin />} />
        <Route path="/signup" element={<MobileSignup />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBooking />
            </ProtectedRoute>
          }
        />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="*" element={<Home />} />

      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
