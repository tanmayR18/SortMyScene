import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MobileLogin from "./pages/MobileLogin";
import MobileSignup from "./pages/MobileSignup";
import Profile from "./pages/Profile";
import MyBooking from "./pages/MyBooking";
import EventDetails from "./pages/EventDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="">
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
      </Routes>
    </div>
  );
}

export default App;
