import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function TrustIndicators() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-center space-y-3"
        >
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>AWS Protected</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>GDPR Compliant</span>
                </div>
            </div>

            {/* Copyright Notice */}
            <div className="text-xs text-slate-500 border-t border-white/10 pt-3">
                © 2025 AI Career Agent Coach • MIT License • All rights reserved
            </div>
        </motion.div>
    );
}
