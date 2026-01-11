import type { NavigationPage } from '../../types';

interface LandingFooterProps {
    onNavigate?: (page: NavigationPage) => void;
}

/**
 * Landing Footer Component
 * Footer with legal links, technology info, and copyright
 */
export function LandingFooter({ onNavigate }: LandingFooterProps) {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-2xl font-bold text-white">Agentic AI Career Coach</h3>
                        <p className="text-slate-500 text-sm max-w-sm">
                            AI-powered career platform helping graduates land their dream jobs with automation and intelligence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            <button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition-colors text-left">Privacy Policy</button>
                            <button onClick={() => onNavigate?.('terms')} className="hover:text-white transition-colors text-left">Terms of Service</button>
                            <a href="/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">License (MIT)</a>
                            <button onClick={() => onNavigate?.('contact')} className="hover:text-white transition-colors text-left">Contact Us</button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Technology</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            <span>AI-Powered Intelligence</span>
                            <span>Built with React & TypeScript</span>
                            <span>Serverless Architecture</span>
                            <span>Enterprise Security</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm">
                            <strong className="text-white">© 2025 Agentic AI Career Coach | By Rajkumar Thota.</strong> All rights reserved.
                        </div>
                        <div className="text-sm">
                            Licensed under <span className="text-blue-400">MIT License</span> • Open Source
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
