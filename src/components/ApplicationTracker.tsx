import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  MapPin, 
  DollarSign,
  Plus,
  ExternalLink,
  Mail,
  Clock,
  TrendingUp,
  Trash2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { ProfileService } from '../services/profileService';

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  notes: string;
  jobUrl?: string;
  nextAction?: string;
  nextActionDate?: string;
}

const statusConfig = {
  applied: { label: 'Applied', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
  screening: { label: 'Screening', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
  interview: { label: 'Interview', color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
  offer: { label: 'Offer', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
  rejected: { label: 'Rejected', color: 'bg-slate-500', textColor: 'text-slate-700', bgLight: 'bg-slate-50' }
};

export function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIApplications();
  }, []);

  const loadAIApplications = async () => {
    try {
      setLoading(true);
      const userId = ProfileService.getUserId();
      const userProfile = await ProfileService.getProfile(userId);
      
      if (!userProfile) {
        toast.error('Please complete your profile first');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/ai-jobs/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            name: userProfile.name,
            currentRole: userProfile.profile?.currentRole,
            targetRole: userProfile.profile?.targetRole,
            skills: userProfile.profile?.skills,
          },
          count: 5,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate applications');

      const data = await response.json();
      setApplications(data.applications);
      toast.success(`🤖 Generated ${data.applications.length} AI applications!`);
    } catch (error: any) {
      console.error('Error loading AI applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const [newApplication, setNewApplication] = useState<Partial<Application>>({
    status: 'applied'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleDragStart = (e: React.DragEvent, application: Application) => {
    e.dataTransfer.setData('applicationId', application.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Application['status']) => {
    e.preventDefault();
    const applicationId = e.dataTransfer.getData('applicationId');
    
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    
    toast.success('Application status updated!');
  };

  const addApplication = () => {
    if (!newApplication.company || !newApplication.position) {
      toast.error('Please fill in company and position');
      return;
    }

    const application: Application = {
      id: Date.now().toString(),
      company: newApplication.company,
      position: newApplication.position,
      location: newApplication.location || 'Remote',
      salary: newApplication.salary || 'Not specified',
      appliedDate: new Date().toISOString().split('T')[0],
      status: newApplication.status as Application['status'] || 'applied',
      notes: newApplication.notes || '',
      jobUrl: newApplication.jobUrl
    };

    setApplications([...applications, application]);
    setNewApplication({ status: 'applied' });
    setIsAddDialogOpen(false);
    toast.success('Application added!');
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    toast.success('Application deleted');
  };

  const getApplicationsByStatus = (status: Application['status']) => {
    return applications.filter(app => app.status === status);
  };

  const getStatusStats = () => {
    return {
      total: applications.length,
      applied: applications.filter(a => a.status === 'applied').length,
      screening: applications.filter(a => a.status === 'screening').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offer: applications.filter(a => a.status === 'offer').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      successRate: applications.length > 0 
        ? Math.round((applications.filter(a => a.status === 'offer').length / applications.length) * 100)
        : 0
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl">Application Tracker</h1>
                <p className="text-slate-600">Manage your job applications with ease</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={newApplication.company || ''}
                        onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
                        placeholder="e.g., Amazon"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        value={newApplication.position || ''}
                        onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newApplication.location || ''}
                        onChange={(e) => setNewApplication({ ...newApplication, location: e.target.value })}
                        placeholder="e.g., Seattle, WA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={newApplication.salary || ''}
                        onChange={(e) => setNewApplication({ ...newApplication, salary: e.target.value })}
                        placeholder="e.g., $100k - $150k"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="jobUrl">Job URL</Label>
                    <Input
                      id="jobUrl"
                      value={newApplication.jobUrl || ''}
                      onChange={(e) => setNewApplication({ ...newApplication, jobUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newApplication.notes || ''}
                      onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                      placeholder="Add any notes about this application..."
                    />
                  </div>
                  <Button onClick={addApplication} className="w-full">
                    Add Application
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card className="p-4">
              <div className="text-sm text-slate-600">Total</div>
              <div className="text-2xl">{stats.total}</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-sm text-blue-600">Applied</div>
              <div className="text-2xl text-blue-700">{stats.applied}</div>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="text-sm text-yellow-600">Screening</div>
              <div className="text-2xl text-yellow-700">{stats.screening}</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-sm text-purple-600">Interview</div>
              <div className="text-2xl text-purple-700">{stats.interview}</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm text-green-600">Offers</div>
              <div className="text-2xl text-green-700">{stats.offer}</div>
            </Card>
            <Card className="p-4 bg-slate-50 border-slate-200">
              <div className="text-sm text-slate-600">Rejected</div>
              <div className="text-2xl text-slate-700">{stats.rejected}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <div className="text-sm opacity-90">Success Rate</div>
              <div className="text-2xl">{stats.successRate}%</div>
            </Card>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status as Application['status'])}
              className="min-h-[600px]"
            >
              <div className={`${config.bgLight} border-2 border-dashed rounded-xl p-4 min-h-full`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`flex items-center gap-2 ${config.textColor}`}>
                    <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                    {config.label}
                  </h3>
                  <Badge variant="secondary">
                    {getApplicationsByStatus(status as Application['status']).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {getApplicationsByStatus(status as Application['status']).map((app) => (
                    <motion.div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-move"
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="line-clamp-1">{app.position}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteApplication(app.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Building2 className="w-3 h-3" />
                              {app.company}
                            </div>
                          </div>

                          <div className="space-y-1 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {app.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-3 h-3" />
                              {app.salary}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              Applied {new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                          </div>

                          {app.nextAction && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                              <div className="text-xs text-blue-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Next: {app.nextAction}
                              </div>
                              {app.nextActionDate && (
                                <div className="text-xs text-blue-600 mt-1">
                                  {new Date(app.nextActionDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}

                          {app.notes && (
                            <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded">
                              {app.notes}
                            </p>
                          )}

                          {app.jobUrl && (
                            <Button variant="ghost" size="sm" className="w-full h-7 text-xs" asChild>
                              <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Job
                              </a>
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <Card className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl mb-2">No applications yet</h3>
            <p className="text-slate-600 mb-4">Start tracking your job applications</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Application
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
