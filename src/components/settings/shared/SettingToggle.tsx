import { Switch } from '../../ui/switch';

interface SettingToggleProps {
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

/**
 * Reusable toggle setting component
 * Provides consistent layout for on/off settings
 */
export function SettingToggle({
    title,
    description,
    checked,
    onCheckedChange
}: SettingToggleProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <h4 className="font-medium mb-1">{title}</h4>
                <p className="text-sm text-slate-600">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}
