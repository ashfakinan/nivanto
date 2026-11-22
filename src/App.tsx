import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DemoSitePage } from './pages/DemoSitePage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, authReady, otpVerified } = useAuth();

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#1C2440] flex items-center justify-center text-white text-sm">
        Checking session...
      </div>
    );
  }

  if (!user || !otpVerified) {
    return <Navigate to="/inan1422008admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Website Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<PortfolioPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Built-in Live Interactive Portfolio & Template Demos */}
            <Route path="/demo/:slug" element={<DemoSitePage />} />

            {/* Secret Admin Routes */}
            <Route
              path="/inan1422008admin"
              element={
                <ProtectedAdminRoute>
                  <Navigate to="/inan1422008admin/dashboard" replace />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/inan1422008admin/login" element={<AdminLoginPage />} />
            <Route
              path="/inan1422008admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />

            {/* Explicitly block /admin and any unknown route with 404 */}
            <Route path="/admin" element={<NotFoundPage />} />
            <Route path="/admin/*" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
