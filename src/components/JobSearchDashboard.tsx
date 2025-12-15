import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Job } from '../types';
import { DataService } from '../services/dataService';
import { AWSConfigStatus } from './AWSConfigStatus';
import { DebugPanel } from './DebugPanel';
import { toast } from 'sonner';

export function JobSearchDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedJobs = await DataService.fetchJobs();
      setJobs(fetchedJobs);
      toast.success(`Loaded ${fetchedJobs.length} job opportunities`);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
      toast.error('Failed to load jobs: ' + err.message);
      // Fallback to cached jobs
      setJobs(DataService.getJobs());
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = filterSource === 'all' || job.source === filterSource;
    const matchesStatus = filterStatus === 'all' || job.applicationStatus === filterStatus;
    return matchesSearch && matchesSource && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-blue-100 text-blue-700">Applied</Badge>;
      case 'interview':
        return <Badge className="bg-purple-100 text-purple-700">Interview</Badge>;
      case 'offer':
        return <Badge className="bg-green-100 text-green-700">Offer</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Applied</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* AWS Configuration Status */}
      <AWSConfigStatus />

      {/* Debug Panel */}
      <DebugPanel />

      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">AI-Powered Job Search</h1>
        <p className="text-slate-600">
          Intelligent AI-powered job matching • {filteredJobs.length} opportunities found
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading job opportunities...</p>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error Loading Jobs</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={loadJobs}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!loading && jobs.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Matches</p>
                  <p className="text-2xl">{jobs.length}</p>
                </div>
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Applications</p>
                  <p className="text-2xl">{jobs.filter(j => j.applicationStatus === 'applied').length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Interviews</p>
                  <p className="text-2xl">{jobs.filter(j => j.applicationStatus === 'interview').length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg AI Score</p>
                  <p className="text-2xl">{Math.round(jobs.reduce((acc, j) => acc + j.aiScore, 0) / jobs.length)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search jobs by title or company..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indeed">Indeed</SelectItem>
                    <SelectItem value="Glassdoor">Glassdoor</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="not-applied">Not Applied</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Jobs Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Jobs List */}
            <div className="lg:col-span-2 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              {filteredJobs.map(job => (
                <Card
                  key={job.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl">{job.title}</h3>
                        {job.remote && <Badge variant="secondary">Remote</Badge>}
                      </div>
                      <p className="text-slate-600 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {job.company}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg ${getScoreColor(job.aiScore)}`}>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span>{job.aiScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      ${job.salary.min / 1000}k - ${job.salary.max / 1000}k
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">{job.source}</Badge>
                      {getStatusBadge(job.applicationStatus)}
                    </div>
                  </div>

                  {/* Match Breakdown */}
                  <div className="space-y-2 bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Skills Match</span>
                      <span>{job.matchAnalysis.skillsMatch}%</span>
                    </div>
                    <Progress value={job.matchAnalysis.skillsMatch} className="h-1" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-1">
              {selectedJob ? (
                <Card className="p-6 sticky top-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-2xl">{selectedJob.title}</h2>
                        <div className={`px-3 py-1 rounded-lg ${getScoreColor(selectedJob.aiScore)}`}>
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-xl">{selectedJob.aiScore}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600">{selectedJob.company}</p>
                      {getStatusBadge(selectedJob.applicationStatus)}
                    </div>

                    <Tabs defaultValue="overview">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div>
                          <h4 className="mb-2">Description</h4>
                          <p className="text-sm text-slate-600">{selectedJob.description}</p>
                        </div>

                        <div>
                          <h4 className="mb-2">Requirements</h4>
                          <ul className="space-y-1">
                            {selectedJob.requirements.map((req, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-2">Benefits</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.benefits.map((benefit, i) => (
                              <Badge key={i} variant="secondary">{benefit}</Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis" className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="text-blue-900">AI Compatibility Analysis</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                {selectedJob.matchAnalysis.overallFit}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Skills Match</span>
                              <span>{selectedJob.matchAnalysis.skillsMatch}%</span>
                            </div>
                            <Progress value={selectedJob.matchAnalysis.skillsMatch} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Experience Match</span>
                              <span>{selectedJob.matchAnalysis.experienceMatch}%</span>
                            </div>
                            <Progress value={selectedJob.matchAnalysis.experienceMatch} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Location Match</span>
                              <span>{selectedJob.matchAnalysis.locationMatch}%</span>
                            </div>
                            <Progress value={selectedJob.matchAnalysis.locationMatch} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Salary Match</span>
                              <span>{selectedJob.matchAnalysis.salaryMatch}%</span>
                            </div>
                            <Progress value={selectedJob.matchAnalysis.salaryMatch} />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline">Save</Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Select a job to view details</p>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
