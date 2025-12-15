/**
 * Contact Page Component
 * Allows users to contact support or schedule a demo
 */

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Mail, Phone, MapPin, Send, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ContactProps {
    onBack?: () => void;
}

export function Contact({ onBack }: ContactProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general' // 'general' | 'demo' | 'support'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // TODO: Implement actual email sending via backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                type: 'general'
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Have questions? Want to schedule a demo? We're here to help!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Message Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    What can we help you with?
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="demo">Schedule a Demo</option>
                                    <option value="support">Technical Support</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Subject</label>
                                <Input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <Textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell us more about your inquiry..."
                                    rows={6}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>Sending...</>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Quick Demo Card */}
                        <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Schedule a Demo</h3>
                                    <p className="mb-4 opacity-90">
                                        See how AI Career Agent can transform your job search in just 15 minutes.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="bg-white text-blue-600 hover:bg-slate-100"
                                        onClick={() => setFormData({ ...formData, type: 'demo' })}
                                    >
                                        Book Demo Call
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Contact Details */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">Contact Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <a
                                            href="mailto:support@aicareeragent.com"
                                            className="text-blue-600 hover:underline"
                                        >
                                            support@aicareeragent.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-slate-600">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-slate-600">
                                            123 AI Street<br />
                                            San Francisco, CA 94102<br />
                                            United States
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Business Hours */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Monday - Friday</span>
                                    <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Saturday</span>
                                    <span className="font-medium">10:00 AM - 4:00 PM PST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Sunday</span>
                                    <span className="font-medium">Closed</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Back Button */}
                {onBack && (
                    <div className="text-center mt-8">
                        <Button variant="outline" onClick={onBack}>
                            ← Back to Home
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
