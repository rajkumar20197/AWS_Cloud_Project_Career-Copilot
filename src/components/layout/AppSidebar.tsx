import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Menu, X, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import type { NavigationPage, UserData } from '../../types';
import type { NavigationItem } from '../../config/navigation';

interface AppSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    currentPage: NavigationPage;
    onNavigate: (page: NavigationPage) => void;
    navigationItems: NavigationItem[];
    userData: UserData | null;
    onLogoClick: () => void;
    onLogout: () => void;
}

export function AppSidebar({
    isOpen,
    onToggle,
    currentPage,
    onNavigate,
    navigationItems,
    userData,
    onLogoClick,
    onLogout,
}: AppSidebarProps) {
    const handleLogout = async () => {
        try {
            const { signOut } = await import('aws-amplify/auth');
            await signOut();
            onLogout();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };

    return (
        <>
            {/* Floating Toggle Button - Always Visible */}
            <button
                onClick={onToggle}
                className={`fixed top-4 z-50 p-2 bg-white border border-slate-200 rounded-lg shadow-lg hover:bg-slate-50 transition-all ${isOpen ? 'left-[240px]' : 'left-4'
                    }`}
                title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <aside
                className={`fixed lg:sticky top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-0 lg:w-20'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 flex items-center justify-center">
                        {isOpen ? (
                            <Logo size="sm" variant="full" onClick={onLogoClick} />
                        ) : (
                            <Logo size="sm" variant="icon" onClick={onLogoClick} />
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        if (window.innerWidth < 1024) onToggle();
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {isOpen && (
                                        <>
                                            <span className="flex-1 text-left text-sm">{item.label}</span>
                                            {item.badge && (
                                                <Badge
                                                    className={`text-xs ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                                                        }`}
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <Separator />

                    {/* User Profile */}
                    <div className="p-3">
                        <div
                            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer ${isOpen ? '' : 'justify-center'
                                }`}
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            {isOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">{userData?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500">{userData?.email || 'Graduate'}</p>
                                </div>
                            )}
                        </div>
                        {isOpen && (
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                size="sm"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    );
}
