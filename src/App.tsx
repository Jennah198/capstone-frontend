import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layouts
import UserLayout from "./Layout/UserLayout";
import OrganizerLayout from "./Layout/OrganiztionLayout";
import AdminLayout from "./Layout/AdminLayout";

// Context
import { ApiProvider } from "./context/EventContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// ==================== USER / PUBLIC PAGES ====================
import HomePage from "./pages/userPage/HomePage";
import UserLogin from "./pages/userPage/UserLogin";
import RegisterPage from "./pages/userPage/RegisterPage";
import EventsPage from "./pages/userPage/EventsPage";
import ContactPage from "./pages/userPage/ContactPage";
import AboutUsPage from "./pages/userPage/AboutUsPage";
import CategoriesPage from "./pages/userPage/CategoriesPage";
import CategoryEventsPage from "./pages/userPage/CategoryEventsPage";
import UserEventDetailPage from "./pages/userPage/UserEventDetailPage";
import UserOrdersPage from "./pages/userPage/UserOrderPage";

// Payment Pages
import SeatSelectionPage from "./pages/userPage/paymentPage/SeatSelectionPage";
import PaymentPage from "./pages/userPage/paymentPage/PaymentPage";
import VerifyPaymentPage from "./pages/userPage/paymentPage/VerifyPaymentPage";
import TicketSuccessPage from "./pages/userPage/paymentPage/TicketSuccessPage";

// ==================== ORGANIZER PAGES ====================
import EventList from "./pages/organizerPage/EventList";
import EventDetail from "./pages/organizerPage/EventDetail";
import CreateEvent from "./pages/organizerPage/CreateEvent";
import EditEvent from "./pages/organizerPage/EventEdit";
import EventAnalytics from "./pages/organizerPage/EventAnalytics";

import CreateVenue from "./pages/organizerPage/CreateVenue";
import VenueList from "./pages/organizerPage/VenueList";
import UpdateVenue from "./pages/organizerPage/UpdateVenue";

import CreateCategory from "./pages/organizerPage/CreateCategory";
import CategoryList from "./pages/organizerPage/CategoryList";
import EditCategory from "./pages/organizerPage/EditCategory";

// ==================== ADMIN PAGES ====================
import AdminDashboardStats from "./pages/adminPage/AdminDashboardStats";
import Users from "./pages/adminPage/Users";
import AdminEvents from "./pages/adminPage/AdminEvents";
import AdminOrderListPage from "./pages/adminPage/AdminOrderListPage";
import AdminCategories from "./pages/adminPage/AdminCategories";
import AdminVenues from "./pages/adminPage/AdminVenues";
import AdminMedia from "./pages/adminPage/AdminMedia";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ApiProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
        />

        <Routes>
          {/* ==================== PUBLIC / USER ROUTES ==================== */}
          <Route element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="events-by-category/:categoryId" element={<CategoryEventsPage />} />
            <Route path="user-event-detail/:id" element={<UserEventDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="login" element={<UserLogin />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Payments */}
            <Route path="seat-selection" element={<SeatSelectionPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="verify-payment" element={<VerifyPaymentPage />} />
            <Route path="ticket-success" element={<TicketSuccessPage />} />
          </Route>

          {/* ==================== AUTHENTICATED USER ==================== */}
          <Route element={<ProtectedRoute allowedRoles={["user", "organizer", "admin"]} />}>
            <Route path="/my-order" element={<UserOrdersPage />} />
          </Route>

          {/* ==================== ORGANIZER ROUTES ==================== */}
          <Route element={<ProtectedRoute allowedRoles={["organizer", "admin"]} />}>
            <Route path="/organizer" element={<OrganizerLayout />}>
              <Route index element={<EventList />} />

              {/* Events */}
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="edit-event/:id" element={<EditEvent />} />
              <Route path="analytics" element={<EventAnalytics />} />

              {/* Venues */}
              <Route path="create-venue" element={<CreateVenue />} />
              <Route path="venues" element={<VenueList />} />
              <Route path="update-venue/:id" element={<UpdateVenue />} />

              {/* Categories */}
              <Route path="create-category" element={<CreateCategory />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="edit-category/:id" element={<EditCategory />} />
            </Route>
          </Route>

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardStats />} />
              <Route path="users" element={<Users />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="orders" element={<AdminOrderListPage />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="venues" element={<AdminVenues />} />
              <Route path="media" element={<AdminMedia />} />
            </Route>
          </Route>

          {/* ==================== FALLBACK ==================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
};

export default App;
