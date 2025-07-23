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
import AccountSettings from '../components/profile/AccountSettings';
import EditProfile from '../components/profile/EditProfile';
import UserProfile from '../components/profile/UserProfile';
import ViewProfile from '../components/profile/ViewProfile';
import AskQuestion from '../components/qa/AskQuestion';
import BrowseQuestions from '../components/qa/BrowseQuestions';
import MyAnswers from '../components/qa/MyAnswers';
import MyQuestions from '../components/qa/MyQuestions';
import BrowseMaterials from '../components/studyhub/BrowseMaterials';
import MyUploads from '../components/studyhub/MyUploads';
import UploadMaterials from '../components/studyhub/UploadMaterials';
import SubscriptionPage from '../components/subscription/SubscriptionPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin';
  return (
    <Routes>
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
      {!isAdmin && <>
        <Route path="/" element={<Home />} />
        <Route path="/support/contact" element={<ContactUs />} />
        <Route path="/support/help" element={<HelpCenter />} />
        <Route path="/support/privacy" element={<PrivacyPolicy />} />
        <Route path="/support/terms" element={<TermsOfService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute user={user} requirePremium><BrowseEvents /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute user={user}><BrowseListings /></ProtectedRoute>} />
        <Route path="/marketplace/my-listings" element={<ProtectedRoute user={user}><MyListings /></ProtectedRoute>} />
        <Route path="/marketplace/post" element={<ProtectedRoute user={user}><PostListing /></ProtectedRoute>} />
        <Route path="/profile/settings" element={<ProtectedRoute user={user}><AccountSettings /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute user={user}><EditProfile /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/view" element={<ProtectedRoute user={user}><ViewProfile /></ProtectedRoute>} />
        <Route path="/qa/ask" element={<ProtectedRoute user={user}><AskQuestion /></ProtectedRoute>} />
        <Route path="/qa/browse" element={<ProtectedRoute user={user}><BrowseQuestions /></ProtectedRoute>} />
        <Route path="/qa/my-answers" element={<ProtectedRoute user={user}><MyAnswers /></ProtectedRoute>} />
        <Route path="/qa/my-questions" element={<ProtectedRoute user={user}><MyQuestions /></ProtectedRoute>} />
        <Route path="/studyhub/browse" element={<ProtectedRoute user={user}><BrowseMaterials /></ProtectedRoute>} />
        <Route path="/studyhub/my-uploads" element={<ProtectedRoute user={user}><MyUploads /></ProtectedRoute>} />
        <Route path="/studyhub/upload" element={<ProtectedRoute user={user}><UploadMaterials /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute user={user}><SubscriptionPage /></ProtectedRoute>} />
      </>}
      <Route path="*" element={isAdmin ? <Navigate to="/admin" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;