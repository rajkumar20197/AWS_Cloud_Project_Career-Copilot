import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ProfileAvatarProps {
    currentAvatar?: string;
    userName: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    editable?: boolean;
    onUpload?: (file: File) => Promise<void>;
    showStatus?: boolean;
    status?: 'online' | 'offline' | 'away';
}

const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-3xl',
};

const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
};

export function ProfileAvatar({
    currentAvatar,
    userName,
    size = 'md',
    editable = false,
    onUpload,
    showStatus = false,
    status = 'online',
}: ProfileAvatarProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate gradient based on name
    const getGradient = (name: string) => {
        const gradients = [
            'from-blue-500 to-purple-500',
            'from-green-500 to-emerald-500',
            'from-orange-500 to-red-500',
            'from-pink-500 to-rose-500',
            'from-cyan-500 to-blue-500',
            'from-violet-500 to-purple-500',
            'from-amber-500 to-orange-500',
            'from-teal-500 to-cyan-500',
        ];
        const index = name.charCodeAt(0) % gradients.length;
        return gradients[index];
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        if (onUpload) {
            try {
                setIsUploading(true);
                await onUpload(file);
                toast.success('Profile picture updated!');
                setPreview(null);
            } catch (error) {
                toast.error('Failed to upload image');
                setPreview(null);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleClick = () => {
        if (editable && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const displayImage = preview || currentAvatar;

    return (
        <div className="relative inline-block">
            <motion.div
                className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${editable ? 'cursor-pointer' : ''
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                whileHover={editable ? { scale: 1.05 } : {}}
                whileTap={editable ? { scale: 0.95 } : {}}
            >
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className={`w-full h-full bg-gradient-to-br ${getGradient(
                            userName
                        )} flex items-center justify-center text-white font-semibold`}
                    >
                        {getInitials(userName)}
                    </div>
                )}

                {/* Upload Overlay */}
                <AnimatePresence>
                    {editable && isHovered && !isUploading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Uploading Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}

                {/* Status Indicator */}
                {showStatus && (
                    <div
                        className={`absolute bottom-0 right-0 ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                            } ${statusColors[status]
                            } rounded-full border-2 border-white`}
                    />
                )}
            </motion.div>

            {/* Hidden File Input */}
            {editable && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            )}
        </div>
    );
}
