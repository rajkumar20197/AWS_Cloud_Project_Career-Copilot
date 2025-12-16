import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';

interface Testimonial {
    name: string;
    role: string;
    company: string;
    avatar: string;
    text: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        name: 'Alex Chen',
        role: 'CS Graduate',
        company: 'Tech Corp',
        avatar: '🎓',
        text: 'Got my dream job 3 months before graduation! The AI matched me perfectly.',
        rating: 5,
    },
    {
        name: 'Sarah Johnson',
        role: 'Software Engineer',
        company: 'StartupXYZ',
        avatar: '👩‍💻',
        text: 'Interview scheduling was automatic. Saved me 15+ hours of back-and-forth emails.',
        rating: 5,
    },
    {
        name: 'Marcus Williams',
        role: 'Data Scientist',
        company: 'AI Labs',
        avatar: '🧑‍🔬',
        text: 'The resume optimizer increased my response rate by 3x. Game changer!',
        rating: 5,
    },
];

/**
 * Testimonials Section Component
 * Displays customer success stories and ratings
 */
export function TestimonialsSection() {
    return (
        <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4">Testimonials</Badge>
                    <h2 className="text-5xl font-bold mb-4">Loved by Graduates</h2>
                    <p className="text-xl text-slate-600">
                        Join thousands who found their dream jobs with AI
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{testimonial.avatar}</div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">
                                            {testimonial.role} at {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
