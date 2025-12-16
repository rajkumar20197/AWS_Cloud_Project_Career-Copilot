/**
 * AI Career Agent Platform - Main Application Component
 * Copyright (c) 2025 AI Career Agent Coach
 * 
 * This file is part of the AI Career Agent Platform project.
 * Licensed under the MIT License - see LICENSE file for details.
 * 
 * @author AI Career Agent Coach
 * @created 2025
 */

import { useState, useEffect } from 'react';
import './config/cognito'; // Initialize AWS Cognito
import { AuthGuard } from './components/AuthGuard';
import { Toaster } from './components/ui/sonner';
import { PublicRoutes } from './routes/PublicRoutes';
import { DashboardRoutes } from './routes/DashboardRoutes';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { getNavigationItems } from './config/navigation';
import type { NavigationPage, UserData } from './types';
import { PUBLIC_PAGES } from './types';
import { toast } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('landing');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check for existing Cognito session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const user = await getCurrentUser();

        if (user) {
          // User is already signed in
          const userData = {
            name: user.signInDetails?.loginId || 'User',
            email: user.signInDetails?.loginId || '',
            userId: user.userId,
          };

          setUserData(userData);
          setIsLoggedIn(true);
          setIsOnboarded(true);
          setCurrentPage('dashboard');
          console.log('✅ Existing Cognito session found, auto-login successful');
        }
      } catch (error) {
        console.log('No existing session - showing landing page');
      }
    };

    checkExistingSession();
  }, []);

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLogin = (userData?: any) => {
    setIsLoggedIn(true);
    if (userData) {
      setUserData(userData);
      // If user has data, skip onboarding and go to dashboard
      setIsOnboarded(true);
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('onboarding');
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleLogoClick = () => {
    if (isOnboarded) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }
  };

  const handleOnboardingComplete = (userData: any) => {
    console.log('User data:', userData);
    setIsOnboarded(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsOnboarded(false);
    setUserData(null);
    setCurrentPage('landing');
  };

  const navigationItems = getNavigationItems();

  // Determine if we should show dashboard or public pages
  const showDashboard = isLoggedIn && isOnboarded && !PUBLIC_PAGES.includes(currentPage);

  return (
    <div className="min-h-screen">
      {showDashboard ? (
        <AuthGuard onAuthRequired={() => setCurrentPage('login')}>
          <DashboardLayout
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            navigationItems={navigationItems}
            userData={userData}
            onLogoClick={handleLogoClick}
            onLogout={handleLogout}
          >
            <DashboardRoutes currentPage={currentPage} onNavigate={setCurrentPage} />
          </DashboardLayout>
        </AuthGuard>
      ) : (
        <PublicRoutes
          currentPage={currentPage}
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
          onBackToLanding={handleBackToLanding}
          onOnboardingComplete={handleOnboardingComplete}
          onNavigate={setCurrentPage}
          onAuthRequired={() => setCurrentPage('login')}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
}