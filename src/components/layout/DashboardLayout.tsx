import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useNotifications } from '../../hooks/useNotifications';
import { toast } from 'sonner';
import type { NavigationPage, UserData } from '../../types';
import type { NavigationItem } from '../../config/navigation';

interface DashboardLayoutProps {
    children: ReactNode;
    isSidebarOpen: boolean;
    onSidebarToggle: () => void;
    currentPage: NavigationPage;
    onNavigate: (page: NavigationPage) => void;
    navigationItems: NavigationItem[];
    userData: UserData | null;
    onLogoClick: () => void;
    onLogout: () => void;
}

export function DashboardLayout({
    children,
    isSidebarOpen,
    onSidebarToggle,
    currentPage,
    onNavigate,
    navigationItems,
    userData,
    onLogoClick,
    onLogout,
}: DashboardLayoutProps) {
    const {
        notifications,
        isOpen: isNotificationOpen,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        togglePanel,
        closePanel,
    } = useNotifications();

    const handleNotificationClick = (notification: any) => {
        // Navigate to the action URL if available
        if (notification.actionUrl) {
            const pageMap: Record<string, NavigationPage> = {
                '/scheduling': 'scheduling-dashboard',
                '/job-swiper': 'job-swiper',
                '/applications': 'application-tracking',
                '/dashboard': 'dashboard',
            };
            const page = pageMap[notification.actionUrl];
            if (page) {
                onNavigate(page);
                closePanel();
                toast.success('Navigated to ' + notification.title);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AppSidebar
                isOpen={isSidebarOpen}
                onToggle={onSidebarToggle}
                currentPage={currentPage}
                onNavigate={onNavigate}
                navigationItems={navigationItems}
                userData={userData}
                onLogoClick={onLogoClick}
                onLogout={onLogout}
            />

            <main className="flex-1">
                <AppHeader
                    onMenuToggle={onSidebarToggle}
                    notificationCount={unreadCount}
                    notifications={notifications}
                    isNotificationOpen={isNotificationOpen}
                    onNotificationToggle={togglePanel}
                    onNotificationClose={closePanel}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onClearAll={clearAll}
                    onNotificationClick={handleNotificationClick}
                    onUpgradeClick={() => {
                        onNavigate('settings');
                        // Note: The billing tab will need to be selected via URL hash or state
                        toast.info('Navigate to Settings → Billing to upgrade!');
                    }}
                />

                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
