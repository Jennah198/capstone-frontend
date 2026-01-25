import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

// Layouts
import UserLayout from "./Layout/UserLayout";
import OrganizerLayout from "./Layout/OrganiztionLayout";
import AdminLayout from "./Layout/AdminLayout";

// Payment Pages
import SeatSelectionPage from "./pages/userPage/paymentPage/SeatSelectionPage";
import PaymentPage from "./pages/userPage/paymentPage/PaymentPage";
import VerifyPaymentPage from "./pages/userPage/paymentPage/VerifyPaymentPage";
import TicketSuccessPage from "./pages/userPage/paymentPage/TicketSuccessPage";

// User Pages
import HomePage from "./pages/userPage/HomePage";
import UserLogin from "./pages/userPage/UserLogin";
import RegisterPage from "./pages/userPage/RegisterPage";
import EventsPage from "./pages/userPage/EventsPage";
import ContactPage from "./pages/userPage/ContactPage";
import UserEventDetailPage from "./pages/userPage/UserEventDetailPage";
import UserOrdersPage from "./pages/userPage/UserOrderPage";
import CategoryEventsPage from "./pages/userPage/CategoryEventsPage";
import AboutUsPage from "./pages/userPage/AboutUsPage";
import CategoriesPage from "./pages/userPage/CategoriesPage";
// Organizer Pages (needed for nested routes)
import CreateVenue from "./pages/organizerPage/CreateVenue";
import CreateCategory from "./pages/organizerPage/CreateCategory";
import CreateEvent from "./pages/organizerPage/CreateEvent";
import EventList from "./pages/organizerPage/EventList";
import EventDetail from "./pages/organizerPage/EventDetail";
import EditEvent from "./pages/organizerPage/EventEdit";
import VenueList from "./pages/organizerPage/VenueList";
import UpdateVenue from "./pages/organizerPage/UpdateVenue";
import CategoryList from "./pages/organizerPage/CategoryList";
import EditCategory from "./pages/organizerPage/EditCategory";
import EventAnalytics from "./pages/organizerPage/EventAnalytics";

// Admin Pages
import AdminDashboardStats from "./pages/adminPage/AdminDashboardStats";
import Users from "./pages/adminPage/Users";
import AdminEvents from "./pages/adminPage/AdminEvents";
import AdminOrderListPage from "./pages/adminPage/AdminOrderListPage";
import AdminCategories from "./pages/adminPage/AdminCategories";
import AdminVenues from "./pages/adminPage/AdminVenues";
import AdminMedia from "./pages/adminPage/AdminMedia";

import { ApiProvider } from "./context/EventContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ApiProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          {/* ==================== PUBLIC / USER ROUTES ==================== */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/about" element={<AboutUsPage />} />

            <Route
              path="/user-event-detail/:id"
              element={<UserEventDetailPage />}
            />
            <Route path="/my-order" element={<UserOrdersPage />} />
            <Route
              path="/events-by-category/:categoryId"
              element={<CategoryEventsPage />}
            />
            <Route path="/categories" element={<CategoriesPage />} />

            <Route path="/seat-selection" element={<SeatSelectionPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/verify-payment" element={<VerifyPaymentPage />} />
            <Route path="/ticket-success" element={<TicketSuccessPage />} />
            <Route
              path="/categories-list"
              element={<Navigate to="/categories" replace />}
            />
          </Route>

          {/* ==================== ORGANIZER ROUTES ==================== */}
          <Route
            element={<ProtectedRoute allowedRoles={["organizer", "admin"]} />}
          >
            <Route path="/organizer" element={<OrganizerLayout />}>
              <Route index element={<EventList />} />{" "}
              {/* Default organizer page */}
              <Route path="create-venue" element={<CreateVenue />} />
              <Route path="venue-list" element={<VenueList />} />
              <Route path="update-venue/:id" element={<UpdateVenue />} />
              <Route path="create-category" element={<CreateCategory />} />
              <Route path="category-list" element={<CategoryList />} />
              <Route path="edit-category/:id" element={<EditCategory />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="event-list" element={<EventList />} />
              <Route path="event-detail/:id" element={<EventDetail />} />
              <Route path="edit-event/:id" element={<EditEvent />} />
              <Route path="event-analytics" element={<EventAnalytics />} />
            </Route>
          </Route>

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardStats />} />
              <Route path="users" element={<Users />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="admin-orders" element={<AdminOrderListPage />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="venues" element={<AdminVenues />} />
              <Route path="media" element={<AdminMedia />} />
            </Route>
          </Route>
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
};

export default App;
