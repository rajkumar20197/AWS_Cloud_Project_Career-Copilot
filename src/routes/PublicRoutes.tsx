import { EnhancedLandingPage } from '../components/EnhancedLandingPage';
import { LoginPage } from '../components/LoginPage';
import { Onboarding } from '../components/Onboarding';
import { Contact } from '../pages/Contact';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import FAQ from '../pages/FAQ';
import HelpCenter from '../pages/HelpCenter';
import SupportPage from '../components/SupportPage';
import { AuthGuard } from '../components/AuthGuard';
import type { NavigationPage } from '../types';

interface PublicRoutesProps {
    currentPage: NavigationPage;
    onGetStarted: () => void;
    onLogin: (userData?: any) => void;
    onBackToLanding: () => void;
    onOnboardingComplete: (userData: any) => void;
    onNavigate: (page: NavigationPage) => void;
    onAuthRequired: () => void;
}

export function PublicRoutes({
    currentPage,
    onGetStarted,
    onLogin,
    onBackToLanding,
    onOnboardingComplete,
    onNavigate,
    onAuthRequired,
}: PublicRoutesProps) {
    // Landing page
    if (currentPage === 'landing') {
        return <EnhancedLandingPage onGetStarted={onGetStarted} onNavigate={onNavigate} />;
    }

    // Login page
    if (currentPage === 'login') {
        return <LoginPage onLogin={onLogin} onBackToLanding={onBackToLanding} />;
    }

    // Onboarding (protected)
    if (currentPage === 'onboarding') {
        return (
            <AuthGuard onAuthRequired={onAuthRequired}>
                <Onboarding onComplete={onOnboardingComplete} />
            </AuthGuard>
        );
    }

    // Legal & Support pages
    if (currentPage === 'contact') {
        return <Contact onBack={onBackToLanding} />;
    }

    if (currentPage === 'privacy') {
        return <PrivacyPolicy onBack={onBackToLanding} />;
    }

    if (currentPage === 'terms') {
        return <TermsOfService onBack={onBackToLanding} />;
    }

    if (currentPage === 'faq') {
        return <FAQ onBack={onBackToLanding} />;
    }

    if (currentPage === 'help') {
        return <HelpCenter onBack={onBackToLanding} />;
    }

    if (currentPage === 'support') {
        return <SupportPage />;
    }

    return null;
}
