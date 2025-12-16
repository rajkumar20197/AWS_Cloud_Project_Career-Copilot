import { useState } from 'react';
import { AuthService } from '../services/authService';
import { toast } from 'sonner';
import type { UserData } from '../types';

export interface UseAuthReturn {
    // State
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    isLoading: boolean;
    needsConfirmation: boolean;
    confirmationCode: string;
    setConfirmationCode: (value: string) => void;
    error: string;
    acceptedTerms: boolean;
    setAcceptedTerms: (value: boolean) => void;
    // Handlers
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleConfirmSignUp: (e: React.FormEvent) => Promise<void>;
    handleResendCode: () => Promise<void>;
    handleSocialLogin: (provider: 'github' | 'google') => Promise<void>;
}

export function useAuth(onLogin: (userData?: UserData) => void): UseAuthReturn {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [needsConfirmation, setNeedsConfirmation] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Sign in
                const result = await AuthService.signIn({ email, password });
                if (result.isSignedIn) {
                    // Get user attributes after successful login
                    try {
                        const { getCurrentUser } = await import('aws-amplify/auth');
                        const user = await getCurrentUser();
                        const userData: UserData = {
                            name: user.signInDetails?.loginId || name || 'User',
                            email: email,
                            userId: user.userId,
                        };
                        toast.success(`Welcome back, ${userData.name}!`);
                        onLogin(userData);
                    } catch (error) {
                        console.log('Could not get user details, proceeding with basic info');
                        onLogin({ name: name || 'User', email: email, userId: '' });
                    }
                }
            } else {
                // Sign up
                const result = await AuthService.signUp({ email, password, name });
                if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                    setNeedsConfirmation(true);
                    toast.success('Verification code sent to your email!');
                } else if (result.isSignUpComplete) {
                    toast.success('Account created! Please sign in.');
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed');
            toast.error(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await AuthService.confirmSignUp({ email, code: confirmationCode });
            toast.success('Email verified! Please sign in.');
            setNeedsConfirmation(false);
            setIsLogin(true);
            setConfirmationCode('');
        } catch (err: any) {
            console.error('Confirmation error:', err);
            setError(err.message || 'Verification failed');
            toast.error(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            await AuthService.resendConfirmationCode(email);
            toast.success('Verification code resent!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to resend code');
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        try {
            if (provider === 'github') {
                await AuthService.signInWithGitHub();
            } else {
                await AuthService.signInWithGoogle();
            }
        } catch (err: any) {
            toast.error(err.message || `${provider} login failed`);
        }
    };

    return {
        // State
        isLogin,
        setIsLogin,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        isLoading,
        needsConfirmation,
        confirmationCode,
        setConfirmationCode,
        error,
        acceptedTerms,
        setAcceptedTerms,
        // Handlers
        handleSubmit,
        handleConfirmSignUp,
        handleResendCode,
        handleSocialLogin,
    };
}
