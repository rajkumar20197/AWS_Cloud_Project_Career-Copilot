import { motion } from 'motion/react';
import { Badge } from '../ui/badge';

interface AWSService {
    name: string;
    description: string;
}

const awsServices: AWSService[] = [
    { name: 'AWS Bedrock', description: 'AI Foundation' },
    { name: 'Lambda', description: 'Serverless Compute' },
    { name: 'DynamoDB', description: 'NoSQL Database' },
    { name: 'API Gateway', description: 'REST API' },
    { name: 'S3', description: 'File Storage' },
    { name: 'Cognito', description: 'Authentication' },
    { name: 'CloudFormation', description: 'Infrastructure as Code' },
    { name: 'CloudWatch', description: 'Monitoring' },
    { name: 'Step Functions', description: 'Orchestration' },
    { name: 'OpenSearch', description: 'Search & Analytics' },
];

/**
 * Technology Section Component
 * Showcases the AWS infrastructure powering the platform
 */
export function TechnologySection() {
    return (
        <div id="technology" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4">Technology</Badge>
                    <h2 className="text-5xl font-bold mb-4">Enterprise-Grade AWS Infrastructure</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        10 AWS services orchestrated for reliability, security, and scalability
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {awsServices.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group cursor-pointer"
                        >
                            <div className="text-3xl mb-2">☁️</div>
                            <div className="text-sm font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                                {service.name}
                            </div>
                            <div className="text-xs text-slate-500">{service.description}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
