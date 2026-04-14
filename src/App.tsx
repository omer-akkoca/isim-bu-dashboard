import Dayjs from 'dayjs';
import AdvancedFormat from 'dayjs/plugin/advancedFormat';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components';
import { CvDetails, CVsPage, DashboardHome, HomePage, LoginPage, UserDetails, UsersPage } from './pages';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import { AuthProvider } from './providers/AuthProvider';

import 'dayjs/locale/tr';

Dayjs.extend(AdvancedFormat);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="user/:user_id" element={<UserDetails />} />
            <Route path="cvs" element={<CVsPage />} />
            <Route path="cv/:cv_id" element={<CvDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
