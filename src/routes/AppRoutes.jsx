import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Home from '../pages/Home';
import UserProfile from '../components/profile/UserProfile';
import ViewProfile from '../components/profile/ViewProfile';
import EditProfile from '../components/profile/EditProfile';
import AccountSettings from '../components/profile/AccountSettings';
import Box from '@mui/material/Box';
import BrowseMaterials from '../components/studyhub/BrowseMaterials';
import UploadMaterials from '../components/studyhub/UploadMaterials';
import MyUploads from '../components/studyhub/MyUploads';
import BrowseListings from '../components/marketplace/BrowseListings';
import PostListing from '../components/marketplace/PostListing';
import MyListings from '../components/marketplace/MyListings';
import AskQuestion from '../components/qa/AskQuestion';
import MyQuestions from '../components/qa/MyQuestions';
import MyAnswers from '../components/qa/MyAnswers';
import BrowseQuestions from '../components/qa/BrowseQuestions';
import BrowseEvents from '../components/events/BrowseEvents';
import HelpCenter from '../components/support/HelpCenter';
import ContactUs from '../components/support/ContactUs';
import TermsOfService from '../components/support/TermsOfService';
import PrivacyPolicy from '../components/support/PrivacyPolicy';
import AdminPostEvent from '../components/admin/AdminPostEvent';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminDashboard from '../components/admin/AdminDashboard';
import SubscriptionPage from '../components/subscription/SubscriptionPage';

function AppRoutes() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Profile routes */}
            <Route path="/profile" element={<UserProfile user={{ name: 'Jane Doe', email: 'jane@example.com', studentId: 'S123456', role: 'student', college: { name: 'Sample College', type: 'Public', province: 'Ontario' } }} />} />
            <Route path="/profile/view" element={<ViewProfile user={{ name: 'Jane Doe', email: 'jane@example.com', studentId: 'S123456', role: 'student', college: { name: 'Sample College', type: 'Public', province: 'Ontario' } }} />} />
            <Route path="/profile/edit" element={<EditProfile user={{ name: 'Jane Doe', email: 'jane@example.com', studentId: 'S123456', role: 'student', college: { name: 'Sample College', type: 'Public', province: 'Ontario' } }} onSave={() => {}} />} />
            <Route path="/profile/settings" element={<AccountSettings user={{ name: 'Jane Doe', email: 'jane@example.com', studentId: 'S123456', role: 'student', isPremium: true, premiumExpiry: '2024-12-31', college: { name: 'Sample College', type: 'Public', province: 'Ontario' } }} />} />
            <Route path="/studyhub/browse" element={<BrowseMaterials />} />
            <Route path="/studyhub/upload" element={<UploadMaterials />} />
            <Route path="/studyhub/myuploads" element={<MyUploads />} />
            <Route path="/studyhub" element={<BrowseMaterials />} />
            <Route path="/marketplace" element={<BrowseListings />} />
            <Route path="/marketplace/post" element={<PostListing />} />
            <Route path="/marketplace/mylistings" element={<MyListings />} />
            <Route path="/qa/ask" element={<AskQuestion />} />
            <Route path="/qa/myquestions" element={<MyQuestions />} />
            <Route path="/qa/myanswers" element={<MyAnswers />} />
            <Route path="/qa/browse" element={<BrowseQuestions />} />
            <Route path="/events" element={<BrowseEvents />} />
            <Route path="/support/help" element={<HelpCenter />} />
            <Route path="/support/contact" element={<ContactUs />} />
            <Route path="/support/terms" element={<TermsOfService />} />
            <Route path="/support/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin/post-event" element={<AdminPostEvent />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            {/* Add other routes here */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default AppRoutes;