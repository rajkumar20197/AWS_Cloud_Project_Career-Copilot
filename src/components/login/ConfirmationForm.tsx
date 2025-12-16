import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AlertCircle } from 'lucide-react';

interface ConfirmationFormProps {
    email: string;
    confirmationCode: string;
    setConfirmationCode: (value: string) => void;
    isLoading: boolean;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
    onResendCode: () => void;
}

export function ConfirmationForm({
    email,
    confirmationCode,
    setConfirmationCode,
    isLoading,
    error,
    onSubmit,
    onResendCode,
}: ConfirmationFormProps) {
    return (
        <motion.form
            key="confirmation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={onSubmit}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h3 className="text-xl text-white font-semibold">Verify Your Email</h3>
                <p className="text-sm text-slate-400">
                    We sent a verification code to <span className="text-blue-400">{email}</span>
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}

            <div>
                <label className="text-sm text-slate-300 mb-2 block">
                    Verification Code
                </label>
                <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    required
                    maxLength={6}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 h-12 rounded-xl text-center text-2xl tracking-widest"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
            >
                {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <button
                type="button"
                onClick={onResendCode}
                className="w-full text-sm text-blue-400 hover:text-blue-300"
            >
                Didn't receive code? Resend
            </button>
        </motion.form>
    );
}
