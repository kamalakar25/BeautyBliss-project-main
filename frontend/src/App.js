import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/salon/Home';
import Salon from './Components/salon/Salon';
import PaymentHistory from './Components/salon/history';
import AdminPage from './Components/serviceProvider/ServiceProviderDashbord';
import ServicePage from './Components/serviceProvider/ServicePage';
import BookingPage from './Components/BookingPage';
import Doctor from './Components/doctor/doctor';
import Transformation from './Components/doctor/Transformation1';
import OurServices from './Components/doctor/OurServices';
import SignupForm from './Components/signup';
import Login from './Components/login';
import StagesPage from './Components/Beauty/BridalPage';
import BridalShowcase from './Components/Beauty/BridalShowcase';
import BookNow from './Components/Beauty/BookNow';
import BannerSplitHover from './Components/Beauty/Beauty';
import { Fab } from '@mui/material';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import Product from './Components/Product';
import RevenuePage from './Components/Admin/revenue';
import UserDetails from './Components/Admin/UserDetails';
import ProtectedRoute from './Components/ProtectedRoute';
import ServiceProviderDetails from './Components/Admin/ServiceProvidersDetails';
import BookingDetails from './Components/Admin/BookingDetails';
import Approvals from './Components/Admin/Approvals';
import Complaints from './Components/Admin/Complaints';
import SpBookingDetails from './Components/serviceProvider/SPbookingDetails';
import SPpaymentDetails from './Components/serviceProvider/SPpaymentDetails';
import Enquiries from './Components/serviceProvider/Enquiries';
import BookSlot from './Components/BookSlot';
import BlogCardsWithDropdown from './Components/doctor/blog';
import AboutSection from './Components/doctor/About';
import Pay from './Components/Pay';
import PaymentCallback from './Components/PaymentCallback';
import ForgotPassword from './Components/ForgotPassword';
import UserEnquiries from './Components/UserEnquiries';
import UserProfile from './Components/serviceProvider/UserProfile';
import SpProfile from './Components/SpProfile';
import UserNotifications from './Components/UserNotifications';
import Faqs from './Components/salon/Faqs';
import Footer from './Components/salon/Footer';
import AdminFaqs from './Components/Admin/AdminFaqs';
import SpNotifications from './Components/SpNotifications';
import SpHome from './Components/serviceProvider/SpHome';

const BASE_URL = process.env.REACT_APP_API_URL;

console.log("BASE_URL", BASE_URL);



function PageLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "50px" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Home /> <Faqs /> <Footer /> </>} />
          <Route path="/salon" element={<Salon />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/SpProfile" element={<SpProfile />} />
          <Route
            path="/skincare"
            element={
              <>
                <Doctor />
                <OurServices />
                <Transformation />
                <BlogCardsWithDropdown />
                {/* <AboutSection /> */}
              </>
            }
          />
          <Route
            path="/beauty"
            element={
              <PageLayout>
                <BannerSplitHover />
                <StagesPage />
                <BridalShowcase />
              </PageLayout>
            }
          />
          <Route
            path="/booknow"
            element={
              <PageLayout>
                <BookNow />
                <BookSlot />
              </PageLayout>
            }
          />
          <Route
            path="/bookslot"
            element={
              <PageLayout>
                <BookSlot />
              </PageLayout>
            }
          />
          <Route path="/products" element={<Product />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/Payments" element={<PaymentHistory />} />
            <Route path="/bookings" element={<BookingPage />} />
            <Route path="/UserEnquiries" element={<UserEnquiries />} />
            <Route path="/UserNotifications" element={<UserNotifications />} />
          </Route>

          {/* ServiceProvider Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["ServiceProvider"]} />}
          >
            <Route path="/AddEmployee" element={<AdminPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/SpBookingDetails" element={<SpBookingDetails />} />
            <Route path="/SPpaymentDetails" element={<SPpaymentDetails />} />
            <Route path="/Enquiries" element={<Enquiries />} />
            <Route path="/SpNotifications" element={<SpNotifications />} />
            <Route path="/SpHome" element={<SpHome />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route
              path="/revenue"
              element={
                <PageLayout>
                  <RevenuePage />
                </PageLayout>
              }
            />
            <Route
              path="/users"
              element={
                <PageLayout>
                  <UserDetails />
                </PageLayout>
              }
            />
            
            <Route
              path="/serviceProviders"
              element={
                <PageLayout>
                  <ServiceProviderDetails />
                </PageLayout>
              }
            />
            <Route
              path="/bookingDetails"
              element={
                <PageLayout>
                  <BookingDetails />
                </PageLayout>
              }
            />
            
            <Route
              path="/approvals"
              element={
                <PageLayout>
                  <Approvals />
                </PageLayout>
              }
            />
            <Route
              path="/AdminFaqs"
              element={
                <PageLayout>
                  <AdminFaqs />
                </PageLayout>
              }
            />
            <Route
              path="/complaints"
              element={
                <PageLayout>
                  <Complaints />
                </PageLayout>
              }
            />
          </Route>

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
