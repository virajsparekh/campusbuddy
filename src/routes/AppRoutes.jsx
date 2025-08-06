import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import ContactUs from '../components/support/ContactUs';
import HelpCenter from '../components/support/HelpCenter';
import PrivacyPolicy from '../components/support/PrivacyPolicy';
import TermsOfService from '../components/support/TermsOfService';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Dashboard from '../components/dashboard/Dashboard';
import BrowseEvents from '../components/events/BrowseEvents';
import BrowseListings from '../components/marketplace/BrowseListings';
import MyListings from '../components/marketplace/MyListings';
import PostListing from '../components/marketplace/PostListing';
import ListingDetails from '../components/marketplace/ListingDetails';
import AccountSettings from '../components/profile/AccountSettings';
import EditProfile from '../components/profile/EditProfile';
import UserProfile from '../components/profile/UserProfile';
import ViewProfile from '../components/profile/ViewProfile';
import QALayout from '../components/qa/QALayout';
import AskQuestion from '../components/qa/AskQuestion';
import BrowseQuestions from '../components/qa/BrowseQuestions';
import QuestionDetail from '../components/qa/QuestionDetail';
import MyAnswers from '../components/qa/MyAnswers';
import MyQuestions from '../components/qa/MyQuestions';
import BrowseMaterials from '../components/studyhub/BrowseMaterials';
import MyUploads from '../components/studyhub/MyUploads';
import UploadMaterials from '../components/studyhub/UploadMaterials';
import SubscriptionPage from '../components/subscription/SubscriptionPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminPostEvent from '../components/admin/AdminPostEvent';
import AdminEventManagement from '../components/admin/AdminEventManagement';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin';
  
  // Debug authentication state

  
  return (
    <Routes>
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/users" element={isAdmin ? <AdminUserManagement /> : <Navigate to="/login" />} />
      <Route path="/admin/events" element={isAdmin ? <AdminEventManagement /> : <Navigate to="/login" />} />
      <Route path="/admin/post-event" element={isAdmin ? <AdminPostEvent /> : <Navigate to="/login" />} />
      
      {/* Always render these routes, let ProtectedRoute handle authentication */}
      <Route path="/" element={<Home />} />
      <Route path="/support/contact" element={<ContactUs />} />
      <Route path="/support/help" element={<HelpCenter />} />
      <Route path="/support/privacy" element={<PrivacyPolicy />} />
      <Route path="/support/terms" element={<TermsOfService />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute requirePremium><BrowseEvents /></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><BrowseListings /></ProtectedRoute>} />
      <Route path="/marketplace/listing/:id" element={<ProtectedRoute><ListingDetails /></ProtectedRoute>} />
      <Route path="/marketplace/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
      <Route path="/marketplace/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
      <Route path="/profile/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/profile/view" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
      <Route path="/qa" element={<ProtectedRoute><QALayout /></ProtectedRoute>}>
        <Route path="ask" element={<AskQuestion />} />
        <Route path="browse" element={<BrowseQuestions />} />
        <Route path="question/:id" element={<QuestionDetail />} />
        <Route path="my-answers" element={<MyAnswers />} />
        <Route path="my-questions" element={<MyQuestions />} />
      </Route>
      <Route path="/studyhub/browse" element={<ProtectedRoute><BrowseMaterials /></ProtectedRoute>} />
      <Route path="/studyhub/my-uploads" element={<ProtectedRoute><MyUploads /></ProtectedRoute>} />
      <Route path="/studyhub/upload" element={<ProtectedRoute><UploadMaterials /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;