import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Trash2, Calendar, Briefcase, Mail, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string;
    time: Date;
    isRead: boolean;
    actionUrl?: string;
}

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    onNotificationClick: (notification: Notification) => void;
}

export function NotificationPanel({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
    onNotificationClick,
}: NotificationPanelProps) {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getNotificationBg = (type: string, isRead: boolean) => {
        const opacity = isRead ? '50' : '100';
        switch (type) {
            case 'success':
                return `bg-green-${opacity} border-green-200`;
            case 'warning':
                return `bg-yellow-${opacity} border-yellow-200`;
            case 'error':
                return `bg-red-${opacity} border-red-200`;
            default:
                return `bg-blue-${opacity} border-blue-200`;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="fixed right-4 top-16 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <p className="text-xs text-slate-600">{unreadCount} unread</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                                aria-label="Close notifications"
                            >
                                <X className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>

                        {/* Actions Bar */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <button
                                    onClick={onMarkAllAsRead}
                                    disabled={unreadCount === 0}
                                    className="text-xs text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Mark all as read
                                </button>
                                <button
                                    onClick={onClearAll}
                                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-12 text-center"
                                >
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                        <Bell className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                        All caught up!
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        No notifications at the moment.
                                        <br />
                                        We'll notify you when something important happens.
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => {
                                                onNotificationClick(notification);
                                                if (!notification.isRead) {
                                                    onMarkAsRead(notification.id);
                                                }
                                            }}
                                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors group ${!notification.isRead ? 'bg-blue-50/30' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'
                                                            }`}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-500">
                                                            {formatDistanceToNow(notification.time, { addSuffix: true })}
                                                        </span>
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onMarkAsRead(notification.id);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-opacity"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                                <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-white rounded-lg transition-colors">
                                    View all notifications →
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
