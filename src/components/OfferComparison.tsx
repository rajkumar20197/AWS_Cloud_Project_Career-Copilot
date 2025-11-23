import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { motion } from 'motion/react';
import { 
  Scale, 
  Plus, 
  DollarSign, 
  MapPin, 
  TrendingUp,
  Home,
  Heart,
  Briefcase,
  Award,
  Clock,
  Users,
  Trash2,
  Crown,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { ProfileService } from '../services/profileService';

interface Offer {
  id: string;
  company: string;
  position: string;
  baseSalary: number;
  bonus: number;
  equity: number;
  location: string;
  benefits: string[];
  workLifeBalance: number;
  careerGrowth: number;
  companyRating: number;
  remoteFlexibility: number;
}

export function OfferComparison() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIOffers();
  }, []);

  const loadAIOffers = async () => {
    try {
      setLoading(true);
      const userId = ProfileService.getUserId();
      const userProfile = await ProfileService.getProfile(userId);
      
      if (!userProfile) {
        toast.error('Please complete your profile first');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/ai-jobs/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            targetRole: userProfile.profile?.targetRole,
            experience: userProfile.profile?.experience,
            location: userProfile.profile?.location,
          },
          count: 3,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate offers');

      const data = await response.json();
      setOffers(data.offers);
      toast.success(`🤖 Generated ${data.offers.length} AI offers!`);
    } catch (error: any) {
      console.error('Error loading AI offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    workLifeBalance: 5,
    careerGrowth: 5,
    companyRating: 5,
    remoteFlexibility: 5,
    benefits: []
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [weights, setWeights] = useState({
    salary: 40,
    workLife: 25,
    growth: 20,
    culture: 15
  });
  const [costOfLiving, setCostOfLiving] = useState<{ [key: string]: number }>({
    'Seattle, WA': 165,
    'Mountain View, CA': 190
  });

  const addOffer = () => {
    if (!newOffer.company || !newOffer.position) {
      toast.error('Please fill in company and position');
      return;
    }

    const offer: Offer = {
      id: Date.now().toString(),
      company: newOffer.company,
      position: newOffer.position,
      baseSalary: newOffer.baseSalary || 0,
      bonus: newOffer.bonus || 0,
      equity: newOffer.equity || 0,
      location: newOffer.location || 'Remote',
      benefits: newOffer.benefits || [],
      workLifeBalance: newOffer.workLifeBalance || 5,
      careerGrowth: newOffer.careerGrowth || 5,
      companyRating: newOffer.companyRating || 5,
      remoteFlexibility: newOffer.remoteFlexibility || 5
    };

    setOffers([...offers, offer]);
    setNewOffer({
      workLifeBalance: 5,
      careerGrowth: 5,
      companyRating: 5,
      remoteFlexibility: 5,
      benefits: []
    });
    setIsAddDialogOpen(false);
    toast.success('Offer added!');
  };

  const deleteOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
    toast.success('Offer deleted');
  };

  const calculateTotalComp = (offer: Offer) => {
    return offer.baseSalary + offer.bonus + (offer.equity / 4); // 4-year equity vest
  };

  const calculateAdjustedComp = (offer: Offer) => {
    const colIndex = costOfLiving[offer.location] || 100;
    const totalComp = calculateTotalComp(offer);
    return Math.round((totalComp / colIndex) * 100);
  };

  const calculateScore = (offer: Offer) => {
    const maxComp = Math.max(...offers.map(o => calculateTotalComp(o)));
    const compScore = (calculateTotalComp(offer) / maxComp) * 100;
    const workLifeScore = (offer.workLifeBalance / 10) * 100;
    const growthScore = (offer.careerGrowth / 10) * 100;
    const cultureScore = ((offer.companyRating + offer.remoteFlexibility) / 20) * 100;

    return Math.round(
      (compScore * weights.salary / 100) +
      (workLifeScore * weights.workLife / 100) +
      (growthScore * weights.growth / 100) +
      (cultureScore * weights.culture / 100)
    );
  };

  const getBestOffer = () => {
    if (offers.length === 0) return null;
    return offers.reduce((best, current) => 
      calculateScore(current) > calculateScore(best) ? current : best
    );
  };

  const bestOffer = getBestOffer();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl">Offer Comparison</h1>
                <p className="text-slate-600">Compare and evaluate your job offers</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Offer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company *</Label>
                      <Input
                        value={newOffer.company || ''}
                        onChange={(e) => setNewOffer({ ...newOffer, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Position *</Label>
                      <Input
                        value={newOffer.position || ''}
                        onChange={(e) => setNewOffer({ ...newOffer, position: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={newOffer.location || ''}
                      onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Base Salary</Label>
                      <Input
                        type="number"
                        value={newOffer.baseSalary || ''}
                        onChange={(e) => setNewOffer({ ...newOffer, baseSalary: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Annual Bonus</Label>
                      <Input
                        type="number"
                        value={newOffer.bonus || ''}
                        onChange={(e) => setNewOffer({ ...newOffer, bonus: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Total Equity (4yr)</Label>
                      <Input
                        type="number"
                        value={newOffer.equity || ''}
                        onChange={(e) => setNewOffer({ ...newOffer, equity: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={addOffer} className="w-full">Add Offer</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Weights Configuration */}
          <Card className="p-6">
            <h3 className="mb-4">Customize Weights (What matters to you?)</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <span>{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([val]) => setWeights({ ...weights, [key]: val })}
                    max={100}
                    step={5}
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Offers Comparison Grid */}
        {offers.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const score = calculateScore(offer);
              const isBest = bestOffer?.id === offer.id;
              
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 relative ${isBest ? 'ring-2 ring-green-500' : ''}`}>
                    {isBest && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                          <Crown className="w-3 h-3 mr-1" />
                          Best Match
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl mb-1">{offer.company}</h3>
                        <p className="text-sm text-slate-600">{offer.position}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteOffer(offer.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>

                    {/* Score */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4 mb-4">
                      <div className="text-sm opacity-90">Overall Score</div>
                      <div className="text-4xl">{score}</div>
                    </div>

                    {/* Compensation */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">Total Compensation</span>
                          <span>${calculateTotalComp(offer).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Adjusted (COL)</span>
                          <span>${calculateAdjustedComp(offer).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {offer.location}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Base Salary</span>
                        <span>${offer.baseSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bonus</span>
                        <span>${offer.bonus.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Equity/year</span>
                        <span>${(offer.equity / 4).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="space-y-3 pb-4 border-b">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-pink-500" />
                          Work-Life Balance
                        </span>
                        <span>{offer.workLifeBalance}/10</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          Career Growth
                        </span>
                        <span>{offer.careerGrowth}/10</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-500" />
                          Company Rating
                        </span>
                        <span>{offer.companyRating}/10</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-blue-500" />
                          Remote Flexibility
                        </span>
                        <span>{offer.remoteFlexibility}/10</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mt-4">
                      <div className="text-sm text-slate-600 mb-2">Benefits</div>
                      <div className="flex flex-wrap gap-1">
                        {offer.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Scale className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl mb-2">No offers to compare yet</h3>
            <p className="text-slate-600 mb-4">Add your job offers to get started</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Offer
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
