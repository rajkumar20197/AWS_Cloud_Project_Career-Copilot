import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { jobPortalService, JobPortalConfig } from '../services/jobPortalService';

export const JobPortalStatus: React.FC = () => {
  const [portals, setPortals] = useState<JobPortalConfig[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPortals();
  }, []);

  const loadPortals = () => {
    const connectedPortals = jobPortalService.getConnectedPortals();
    setPortals(connectedPortals);
    
    // Test connections
    connectedPortals.forEach(async (portal) => {
      const isConnected = await jobPortalService.testConnection(portal.name);
      setConnectionStatus(prev => ({ ...prev, [portal.name]: isConnected }));
    });
  };

  const testConnection = async (portalName: string) => {
    setTesting(portalName);
    try {
      const isConnected = await jobPortalService.testConnection(portalName);
      setConnectionStatus(prev => ({ ...prev, [portalName]: isConnected }));
    } catch (error) {
      console.error(`Failed to test ${portalName}:`, error);
      setConnectionStatus(prev => ({ ...prev, [portalName]: false }));
    } finally {
      setTesting(null);
    }
  };

  const getPortalUrl = (portalName: string) => {
    const urls: Record<string, string> = {
      'Indeed': 'https://indeed.com',
      'LinkedIn': 'https://linkedin.com/jobs',
      'Glassdoor': 'https://glassdoor.com/jobs',
      'GitHub Jobs': 'https://jobs.github.com',
      'RemoteOK': 'https://remoteok.io',
    };
    return urls[portalName] || '#';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Connected Job Portals</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadPortals}
            disabled={testing !== null}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {portals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No job portals connected yet.</p>
            <p className="text-sm mt-2">Configure API keys to connect to job portals.</p>
          </div>
        ) : (
          portals.map((portal) => {
            const isConnected = connectionStatus[portal.name];
            const isTesting = testing === portal.name;
            
            return (
              <div key={portal.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {isTesting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    ) : isConnected ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium">{portal.name}</span>
                  </div>
                  <Badge variant={isConnected ? 'default' : 'secondary'}>
                    {isTesting ? 'Testing...' : isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection(portal.name)}
                    disabled={isTesting}
                  >
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(getPortalUrl(portal.name), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Available Job Portals:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            <div>✅ Indeed (Free API)</div>
            <div>✅ GitHub Jobs (Free)</div>
            <div>✅ RemoteOK (Free)</div>
            <div>🔑 LinkedIn (API Key Required)</div>
            <div>🔑 Glassdoor (API Key Required)</div>
            <div>🔑 ZipRecruiter (Premium)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};