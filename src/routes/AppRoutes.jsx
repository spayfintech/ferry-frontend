// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import HomePage from "../pages/HomePage";
import FerryBookingPage from "../pages/FerryBookingPage";
import BoatListPage from "../pages/BoatListPage";
import BookingConfirmationPage from "../pages/BookingConfirmationPage";
import AboutPage from "../pages/AboutPage";
import FaqPage from "../pages/FaqPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import PrivacyPolicyPage from "../pages/Legal/PrivacyPolicyPage";
import TermsConditionsPage from "../pages/Legal/TermsConditionsPage";
import RefundCancellationPage from "../pages/Legal/RefundCancellationPage";
import CheckoutPage from "../pages/CheckoutPage";


import AdminLayout from "../pages/admin/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import BoatsPage from "../pages/admin/BoatsPage";
import TripsPage from "../pages/admin/TripsPage";
import TripSeatsPage from "../pages/admin/TripSeatsPage";
import BookingsPage from "../pages/admin/BookingsPage";
import AdminBookingDetailPage from "../pages/admin/AdminBookingDetailPage";
import LocationsPage from "../pages/admin/LocationsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC SITE */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ferry-booking" element={<FerryBookingPage />} />
        <Route path="/boat-list" element={<BoatListPage />} />
        <Route path="/booking/:reference" element={<BookingConfirmationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/refund-cancellation" element={<RefundCancellationPage />} />
        <Route path="/checkout/:reference" element={<CheckoutPage />} />
      </Route>

      {/* AUTH */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="boats" element={<BoatsPage />} />
        <Route path="trips" element={<TripsPage />} />
        <Route path="trips/:id/seats" element={<TripSeatsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/:reference" element={<AdminBookingDetailPage />} />
        <Route path="locations" element={<LocationsPage />} />
      </Route>

      {/* Legacy */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}