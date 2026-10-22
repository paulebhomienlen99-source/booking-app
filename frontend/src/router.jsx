import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProvidersPending from "./pages/admin/ProvidersPending";
import ServicesPending from "./pages/admin/ServicesPending";

// PROVIDER
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderSetup from "./pages/provider/ProviderSetup";
import UploadDocument from "./pages/provider/UploadDocument";
import CreateListing from "./pages/provider/CreateListing";
import CreateSlot from "./pages/provider/CreateSlot";
import ProviderBookings from "./pages/provider/ProviderBookings";
// CUSTOMER
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Services from "./pages/customer/Services";
import Bookings from "./pages/customer/Bookings";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function ProtectedRoute({
  children,
  role,
}) {
  const userRole =
    localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (
    role &&
    userRole !== role
  ) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/providers"
          element={
            <ProtectedRoute role="admin">
              <ProvidersPending />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute role="admin">
              <ServicesPending />
            </ProtectedRoute>
          }
        />
        {/* PROVIDER */}

<Route
  path="/provider"
  element={
    <ProtectedRoute role="provider">
      <ProviderDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/setup"
  element={
    <ProtectedRoute role="provider">
      <ProviderSetup />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/upload-document"
  element={
    <ProtectedRoute role="provider">
      <UploadDocument />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/create-listing"
  element={
    <ProtectedRoute role="provider">
      <CreateListing />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/create-slot"
  element={
    <ProtectedRoute role="provider">
      <CreateSlot />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/bookings"
  element={
    <ProtectedRoute role="provider">
      <ProviderBookings />
    </ProtectedRoute>
  }
/>
        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/services"
          element={
            <ProtectedRoute role="customer">
              <Services />
            </ProtectedRoute>
          }
        />

       
       <Route
  path="/customer/bookings"
  element={
    <ProtectedRoute role="customer">
      <Bookings />
    </ProtectedRoute>
  }
/>

<Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>

{/* DEFAULT */}
<Route
  path="*"
  element={
    <Navigate to="/login" />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}