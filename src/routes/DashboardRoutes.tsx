import { InteractiveDashboard } from '../components/InteractiveDashboard';
import { JobSearchDashboard } from '../components/JobSearchDashboard';
import { JobSwiper } from '../components/JobSwiper';
import { ApplicationTracker } from '../components/ApplicationTracker';
import { ResumeOptimizer } from '../components/ResumeOptimizer';
import { CoverLetterGenerator } from '../components/CoverLetterGenerator';
import { AIMockInterview } from '../components/AIMockInterview';
import { SkillGapAnalyzer } from '../components/SkillGapAnalyzer';
import { OfferComparison } from '../components/OfferComparison';
import { MarketIntelligence } from '../components/MarketIntelligence';
import { GmailIntegration } from '../components/GmailIntegration';
import { SettingsPage } from '../components/SettingsPage';
import { TestComponents } from '../pages/TestComponents';
import TestPage from '../TestPage';
import MorningDashboard from '../components/MorningDashboard';
import SchedulingDashboard from '../components/SchedulingDashboard';
import AvailabilitySettings from '../components/AvailabilitySettings';
import ApplicationTrackingDashboard from '../components/ApplicationTrackingDashboard';
import type { NavigationPage } from '../types';

interface DashboardRoutesProps {
    currentPage: NavigationPage;
    onNavigate: (page: NavigationPage) => void;
}

export function DashboardRoutes({ currentPage, onNavigate }: DashboardRoutesProps) {
    return (
        <>
            {currentPage === 'dashboard' && <InteractiveDashboard onNavigate={onNavigate} />}
            {currentPage === 'morning-dashboard' && <MorningDashboard />}
            {currentPage === 'scheduling-dashboard' && <SchedulingDashboard />}
            {currentPage === 'availability-settings' && <AvailabilitySettings />}
            {currentPage === 'application-tracking' && <ApplicationTrackingDashboard />}
            {currentPage === 'job-search' && <JobSearchDashboard />}
            {currentPage === 'job-swiper' && <JobSwiper />}
            {currentPage === 'application-tracker' && <ApplicationTracker />}
            {currentPage === 'resume' && <ResumeOptimizer />}
            {currentPage === 'cover-letter' && <CoverLetterGenerator />}
            {currentPage === 'mock-interview' && <AIMockInterview />}
            {currentPage === 'skill-gap' && <SkillGapAnalyzer />}
            {currentPage === 'offer-comparison' && <OfferComparison />}
            {currentPage === 'market-intelligence' && <MarketIntelligence />}
            {currentPage === 'gmail' && <GmailIntegration />}
            {currentPage === 'settings' && <SettingsPage />}
            {currentPage === 'test-components' && <TestComponents />}
            {currentPage === 'system-tests' && <TestPage />}
        </>
    );
}
