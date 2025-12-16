import { Menu, Bell, Crown } from 'lucide-react';
import { NotificationPanel } from '../notifications/NotificationPanel';
import type { Notification } from '../notifications/NotificationPanel';

interface AppHeaderProps {
    onMenuToggle: () => void;
    notificationCount: number;
    // Notification props
    notifications: Notification[];
    isNotificationOpen: boolean;
    onNotificationToggle: () => void;
    onNotificationClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    onNotificationClick: (notification: Notification) => void;
    // Upgrade props
    onUpgradeClick?: () => void;
}

export function AppHeader({
    onMenuToggle,
    notificationCount,
    notifications,
    isNotificationOpen,
    onNotificationToggle,
    onNotificationClose,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
    onNotificationClick,
    onUpgradeClick,
}: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl">AI Career Agent Platform</h1>
                        <p className="text-sm text-slate-600">
                            Authenticated • © 2025 AI Career Agent Coach
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative">
                    {/* Upgrade Button */}
                    <button
                        onClick={onUpgradeClick}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                    >
                        <Crown className="w-4 h-4" />
                        <span>Upgrade to Pro</span>
                    </button>

                    {/* Notification Bell */}
                    <button
                        onClick={onNotificationToggle}
                        className={`relative p-2 hover:bg-slate-100 rounded-lg transition-all ${notificationCount > 0 ? 'animate-pulse' : ''
                            }`}
                        aria-label="Notifications"
                    >
                        <Bell className={`w-5 h-5 ${notificationCount > 0 ? 'text-blue-600' : ''}`} />
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 min-w-[20px] h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center px-1.5 font-medium shadow-lg transform translate-x-1/4 -translate-y-1/4">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Panel */}
                    <NotificationPanel
                        isOpen={isNotificationOpen}
                        onClose={onNotificationClose}
                        notifications={notifications}
                        onMarkAsRead={onMarkAsRead}
                        onMarkAllAsRead={onMarkAllAsRead}
                        onClearAll={onClearAll}
                        onNotificationClick={onNotificationClick}
                    />
                </div>
            </div>
        </header>
    );
}
