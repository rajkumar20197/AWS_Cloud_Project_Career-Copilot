import { ReactNode } from 'react';
import { Card } from '../../ui/card';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    className?: string;
}

/**
 * Reusable form section wrapper with icon and title
 * Provides consistent styling across all settings tabs
 */
export function FormSection({ icon: Icon, title, children, className = '' }: FormSectionProps) {
    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <Icon className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            {children}
        </Card>
    );
}
