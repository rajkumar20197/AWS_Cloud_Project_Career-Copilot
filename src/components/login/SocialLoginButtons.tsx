import { Button } from '../ui/button';
import { Github, Chrome } from 'lucide-react';

interface SocialLoginButtonsProps {
    onSocialLogin: (provider: 'github' | 'google') => void;
}

export function SocialLoginButtons({ onSocialLogin }: SocialLoginButtonsProps) {
    return (
        <>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-slate-400">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSocialLogin('github')}
                    className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:scale-105"
                >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSocialLogin('google')}
                    className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:scale-105"
                >
                    <Chrome className="w-5 h-5 mr-2" />
                    Google
                </Button>
            </div>
        </>
    );
}
