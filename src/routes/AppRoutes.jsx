import React, { useContext, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

// Lazy load components for better performance
const Home = lazy(() => import('../pages/Home'));
const ContactUs = lazy(() => import('../components/support/ContactUs'));
const HelpCenter = lazy(() => import('../components/support/HelpCenter'));
const PrivacyPolicy = lazy(() => import('../components/support/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../components/support/TermsOfService'));
const Login = lazy(() => import('../components/auth/Login'));
const Signup = lazy(() => import('../components/auth/Signup'));
const ForgotPassword = lazy(() => import('../components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../components/auth/ResetPassword'));
const Dashboard = lazy(() => import('../components/dashboard/Dashboard'));
const BrowseEvents = lazy(() => import('../components/events/BrowseEvents'));
const BrowseListings = lazy(() => import('../components/marketplace/BrowseListings'));
const MyListings = lazy(() => import('../components/marketplace/MyListings'));
const PostListing = lazy(() => import('../components/marketplace/PostListing'));
const ListingDetails = lazy(() => import('../components/marketplace/ListingDetails'));
const AccountSettings = lazy(() => import('../components/profile/AccountSettings'));
const EditProfile = lazy(() => import('../components/profile/EditProfile'));
const UserProfile = lazy(() => import('../components/profile/UserProfile'));
const ViewProfile = lazy(() => import('../components/profile/ViewProfile'));
const QALayout = lazy(() => import('../components/qa/QALayout'));
const AskQuestion = lazy(() => import('../components/qa/AskQuestion'));
const BrowseQuestions = lazy(() => import('../components/qa/BrowseQuestions'));
const QuestionDetail = lazy(() => import('../components/qa/QuestionDetail'));
const MyAnswers = lazy(() => import('../components/qa/MyAnswers'));
const MyQuestions = lazy(() => import('../components/qa/MyQuestions'));
const BrowseMaterials = lazy(() => import('../components/studyhub/BrowseMaterials'));
const MyUploads = lazy(() => import('../components/studyhub/MyUploads'));
const UploadMaterials = lazy(() => import('../components/studyhub/UploadMaterials'));
const SubscriptionPage = lazy(() => import('../components/subscription/SubscriptionPage'));
const ProtectedRoute = lazy(() => import('../components/auth/ProtectedRoute'));
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminPostEvent = lazy(() => import('../components/admin/AdminPostEvent'));
const AdminEventManagement = lazy(() => import('../components/admin/AdminEventManagement'));

// Loading component
const LoadingSpinner = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="200px"
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin';
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  );
};

export default AppRoutes;