import { Key, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { FormSection } from './shared/FormSection';
import type { User } from '../../types';

interface IntegrationsTabProps {
    user: User;
}

interface IntegrationCardProps {
    icon: string;
    title: string;
    description: string;
    connected: boolean;
    bgColor: string;
    onAction?: () => void;
}

/**
 * Integration Card Component
 * Displays a single integration service with connection status
 */
function IntegrationCard({
    icon,
    title,
    description,
    connected,
    bgColor,
    onAction,
}: IntegrationCardProps) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{icon}</span>
                </div>
                <div>
                    <h4 className="font-medium mb-1">{title}</h4>
                    <p className="text-sm text-slate-600">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {connected ? (
                    <>
                        <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Connected
                        </Badge>
                        <Button variant="outline" size="sm" onClick={onAction}>
                            Disconnect
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" size="sm" onClick={onAction}>
                        Connect
                    </Button>
                )}
            </div>
        </div>
    );
}

/**
 * Integrations Tab Component
 * Handles connected services and API configurations
 */
export function IntegrationsTab({ user }: IntegrationsTabProps) {
    return (
        <div className="space-y-4">
            {/* Connected Services */}
            <FormSection icon={Key} title="Connected Services">
                <div className="space-y-4">
                    <IntegrationCard
                        icon="📧"
                        title="Gmail"
                        description={`Connected to ${user.email}`}
                        connected={true}
                        bgColor="bg-red-100"
                    />

                    <IntegrationCard
                        icon="📅"
                        title="Google Calendar"
                        description="Sync interviews and deadlines"
                        connected={true}
                        bgColor="bg-blue-100"
                    />

                    <IntegrationCard
                        icon="☁️"
                        title="AWS Bedrock"
                        description="AI-powered career guidance"
                        connected={true}
                        bgColor="bg-orange-100"
                    />

                    <IntegrationCard
                        icon="💼"
                        title="LinkedIn"
                        description="Import profile and connections"
                        connected={false}
                        bgColor="bg-blue-100"
                    />
                </div>
            </FormSection>

            {/* API Configuration */}
            <Card className="p-6 bg-slate-50">
                <h3 className="font-semibold mb-4">API Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="bedrock-key">AWS Bedrock API Key</Label>
                        <Input
                            id="bedrock-key"
                            type="password"
                            placeholder="YOUR_BEDROCK_API_KEY_HERE"
                            className="bg-white"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Replace with your actual AWS Bedrock credentials
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="gmail-api-key">Gmail API Key</Label>
                        <Input
                            id="gmail-api-key"
                            type="password"
                            placeholder="YOUR_GMAIL_API_KEY_HERE"
                            className="bg-white"
                        />
                        <p className="text-xs text-slate-500 mt-1">OAuth 2.0 credentials required</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
