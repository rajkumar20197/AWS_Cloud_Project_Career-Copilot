import { useState, useCallback } from 'react';
import type { Notification } from '../components/notifications/NotificationPanel';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([
        // Demo notifications
        {
            id: '1',
            type: 'success',
            title: 'Interview Scheduled!',
            message: 'Your interview with TechCorp for Senior Software Engineer is scheduled for Dec 18, 2024 at 2:00 PM',
            time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            isRead: false,
            actionUrl: '/scheduling',
        },
        {
            id: '2',
            type: 'info',
            title: 'New Job Matches',
            message: '5 new jobs match your profile! Check them out in the Job Swiper.',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isRead: false,
            actionUrl: '/job-swiper',
        },
        {
            id: '3',
            type: 'warning',
            title: 'Application Deadline Soon',
            message: 'Your application to StartupXYZ expires in 2 days. Make sure to complete it!',
            time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            isRead: false,
            actionUrl: '/applications',
        },
        {
            id: '4',
            type: 'success',
            title: 'Profile Updated',
            message: 'Your resume has been successfully updated and is now visible to recruiters.',
            time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isRead: true,
        },
        {
            id: '5',
            type: 'info',
            title: 'AI Agent Active',
            message: 'Your AI scheduling agent has processed 12 emails and scheduled 2 interviews this week.',
            time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            isRead: true,
            actionUrl: '/scheduling',
        },
    ]);

    const [isOpen, setIsOpen] = useState(false);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            time: new Date(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const togglePanel = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const closePanel = useCallback(() => {
        setIsOpen(false);
    }, []);

    const openPanel = useCallback(() => {
        setIsOpen(true);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
        notifications,
        isOpen,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        removeNotification,
        togglePanel,
        closePanel,
        openPanel,
    };
}
