import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function LogoMockups() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">AI Career Agent - Logo Concepts</h1>
          <p className="text-xl text-slate-600">Choose your favorite viral-worthy logo</p>
        </div>

        {/* Logo Concepts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Concept 1: Growth Circuit */}
          <Card className="p-8 space-y-6 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-700">⭐ RECOMMENDED</Badge>
              <span className="text-sm text-slate-500">Viral Factor: 10/10</span>
            </div>
            
            <div className="bg-white rounded-2xl p-8 flex items-center justify-center h-64">
              <GrowthCircuitLogo size={200} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">The Growth Circuit</h3>
              <p className="text-slate-600">
                Upward trending chart transforming into AI circuit pathways
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Most unique concept</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Tells complete story</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Modern & scalable</span>
                </div>
              </div>
            </div>

            {/* Size Variations */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Size Variations:</p>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                <GrowthCircuitLogo size={64} />
                <GrowthCircuitLogo size={48} />
                <GrowthCircuitLogo size={32} />
                <GrowthCircuitLogo size={24} />
                <GrowthCircuitLogo size={16} />
              </div>
            </div>
          </Card>

          {/* Concept 2: Rocket Brain */}
          <Card className="p-8 space-y-6 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-100 text-blue-700">🚀 ENERGETIC</Badge>
              <span className="text-sm text-slate-500">Viral Factor: 9/10</span>
            </div>
            
            <div className="bg-white rounded-2xl p-8 flex items-center justify-center h-64">
              <RocketBrainLogo size={200} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">The Rocket Brain</h3>
              <p className="text-slate-600">
                Rocket ship with neural network pattern inside
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Instantly recognizable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Fun & memorable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Great for app icon</span>
                </div>
              </div>
            </div>

            {/* Size Variations */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Size Variations:</p>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                <RocketBrainLogo size={64} />
                <RocketBrainLogo size={48} />
                <RocketBrainLogo size={32} />
                <RocketBrainLogo size={24} />
                <RocketBrainLogo size={16} />
              </div>
            </div>
          </Card>

          {/* Concept 3: Infinity Career Loop */}
          <Card className="p-8 space-y-6 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-100 text-purple-700">∞ UNIQUE</Badge>
              <span className="text-sm text-slate-500">Viral Factor: 9/10</span>
            </div>
            
            <div className="bg-white rounded-2xl p-8 flex items-center justify-center h-64">
              <InfinityCareerLogo size={200} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">The Infinity Career Loop</h3>
              <p className="text-slate-600">
                Infinity symbol: brain meets briefcase
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Philosophical depth</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Never seen before</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Premium branding</span>
                </div>
              </div>
            </div>

            {/* Size Variations */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Size Variations:</p>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                <InfinityCareerLogo size={64} />
                <InfinityCareerLogo size={48} />
                <InfinityCareerLogo size={32} />
                <InfinityCareerLogo size={24} />
                <InfinityCareerLogo size={16} />
              </div>
            </div>
          </Card>
        </div>

        {/* Comparison Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Side-by-Side Comparison</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                <GrowthCircuitLogo size={120} />
              </div>
              <p className="font-medium">Growth Circuit</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                <RocketBrainLogo size={120} />
              </div>
              <p className="font-medium">Rocket Brain</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                <InfinityCareerLogo size={120} />
              </div>
              <p className="font-medium">Infinity Career Loop</p>
            </div>
          </div>
        </Card>

        {/* Dark Mode Preview */}
        <Card className="p-8 bg-slate-900">
          <h2 className="text-2xl font-bold mb-6 text-white">Dark Mode Preview</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-slate-800 rounded-xl p-8 flex items-center justify-center">
                <GrowthCircuitLogo size={120} />
              </div>
              <p className="font-medium text-white">Growth Circuit</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-slate-800 rounded-xl p-8 flex items-center justify-center">
                <RocketBrainLogo size={120} />
              </div>
              <p className="font-medium text-white">Rocket Brain</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-slate-800 rounded-xl p-8 flex items-center justify-center">
                <InfinityCareerLogo size={120} />
              </div>
              <p className="font-medium text-white">Infinity Career Loop</p>
            </div>
          </div>
        </Card>

        {/* App Icon Preview */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">App Icon Preview (iOS/Android)</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <GrowthCircuitLogo size={80} />
              </div>
              <p className="font-medium">Growth Circuit</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <RocketBrainLogo size={80} />
              </div>
              <p className="font-medium">Rocket Brain</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <InfinityCareerLogo size={80} />
              </div>
              <p className="font-medium">Infinity Career Loop</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Logo Component 1: Growth Circuit
function GrowthCircuitLogo({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="50%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#10b981"/>
        </linearGradient>
      </defs>
      
      {/* Growth Line */}
      <path 
        d="M 15 85 L 30 70 L 45 55 L 60 35 L 75 15 L 85 10" 
        stroke="url(#growthGrad)" 
        strokeWidth="5" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Circuit Nodes */}
      <circle cx="15" cy="85" r="5" fill="#3b82f6"/>
      <circle cx="30" cy="70" r="5" fill="#3b82f6"/>
      <circle cx="45" cy="55" r="5" fill="#8b5cf6"/>
      <circle cx="60" cy="35" r="5" fill="#10b981"/>
      <circle cx="75" cy="15" r="6" fill="#10b981"/>
      <circle cx="85" cy="10" r="7" fill="#10b981">
        <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite"/>
      </circle>
      
      {/* Circuit Connections */}
      <line x1="30" y1="70" x2="25" y2="75" stroke="#3b82f6" strokeWidth="2" opacity="0.5"/>
      <line x1="30" y1="70" x2="35" y2="75" stroke="#3b82f6" strokeWidth="2" opacity="0.5"/>
      <line x1="45" y1="55" x2="40" y2="60" stroke="#8b5cf6" strokeWidth="2" opacity="0.5"/>
      <line x1="45" y1="55" x2="50" y2="60" stroke="#8b5cf6" strokeWidth="2" opacity="0.5"/>
      <line x1="60" y1="35" x2="55" y2="40" stroke="#10b981" strokeWidth="2" opacity="0.5"/>
      <line x1="60" y1="35" x2="65" y2="40" stroke="#10b981" strokeWidth="2" opacity="0.5"/>
      
      {/* Arrow at top */}
      <path d="M 85 10 L 80 15 M 85 10 L 90 15" stroke="#10b981" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

// Logo Component 2: Rocket Brain
function RocketBrainLogo({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="50%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      
      {/* Rocket Body */}
      <path 
        d="M 50 10 L 65 35 L 65 65 L 50 75 L 35 65 L 35 35 Z" 
        fill="url(#rocketGrad)"
      />
      
      {/* Window/Brain Area */}
      <ellipse cx="50" cy="40" rx="12" ry="15" fill="white" opacity="0.3"/>
      
      {/* Neural Network Inside */}
      <circle cx="50" cy="30" r="2" fill="white"/>
      <circle cx="45" cy="40" r="2" fill="white"/>
      <circle cx="55" cy="40" r="2" fill="white"/>
      <circle cx="50" cy="50" r="2" fill="white"/>
      <line x1="50" y1="30" x2="45" y2="40" stroke="white" strokeWidth="1.5"/>
      <line x1="50" y1="30" x2="55" y2="40" stroke="white" strokeWidth="1.5"/>
      <line x1="45" y1="40" x2="50" y2="50" stroke="white" strokeWidth="1.5"/>
      <line x1="55" y1="40" x2="50" y2="50" stroke="white" strokeWidth="1.5"/>
      
      {/* Rocket Fins */}
      <path d="M 35 55 L 25 70 L 35 65 Z" fill="url(#rocketGrad)" opacity="0.8"/>
      <path d="M 65 55 L 75 70 L 65 65 Z" fill="url(#rocketGrad)" opacity="0.8"/>
      
      {/* Rocket Flames */}
      <path d="M 40 75 Q 45 85 50 80 Q 55 85 60 75" fill="#f59e0b" opacity="0.8">
        <animate attributeName="d" 
          values="M 40 75 Q 45 85 50 80 Q 55 85 60 75;M 40 75 Q 45 90 50 85 Q 55 90 60 75;M 40 75 Q 45 85 50 80 Q 55 85 60 75" 
          dur="1s" 
          repeatCount="indefinite"/>
      </path>
      <path d="M 43 75 Q 47 82 50 78 Q 53 82 57 75" fill="#fbbf24" opacity="0.6">
        <animate attributeName="d" 
          values="M 43 75 Q 47 82 50 78 Q 53 82 57 75;M 43 75 Q 47 87 50 83 Q 53 87 57 75;M 43 75 Q 47 82 50 78 Q 53 82 57 75" 
          dur="1s" 
          repeatCount="indefinite"/>
      </path>
    </svg>
  );
}

// Logo Component 3: Infinity Career Loop
function InfinityCareerLogo({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="50%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      
      {/* Infinity Symbol */}
      <path 
        d="M 20 50 Q 20 30 30 30 Q 40 30 50 50 Q 60 30 70 30 Q 80 30 80 50 Q 80 70 70 70 Q 60 70 50 50 Q 40 70 30 70 Q 20 70 20 50" 
        stroke="url(#infinityGrad)" 
        strokeWidth="6" 
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Brain Pattern (Left Loop) */}
      <g opacity="0.9">
        <circle cx="25" cy="45" r="2" fill="#3b82f6"/>
        <circle cx="30" cy="50" r="2" fill="#3b82f6"/>
        <circle cx="25" cy="55" r="2" fill="#3b82f6"/>
        <circle cx="35" cy="48" r="2" fill="#3b82f6"/>
        <line x1="25" y1="45" x2="30" y2="50" stroke="#3b82f6" strokeWidth="1"/>
        <line x1="30" y1="50" x2="25" y2="55" stroke="#3b82f6" strokeWidth="1"/>
        <line x1="30" y1="50" x2="35" y2="48" stroke="#3b82f6" strokeWidth="1"/>
      </g>
      
      {/* Briefcase Icon (Right Loop) */}
      <g opacity="0.9">
        <rect x="68" y="45" width="10" height="12" fill="#ec4899" rx="1"/>
        <rect x="70" y="42" width="6" height="3" fill="#ec4899"/>
        <line x1="68" y1="51" x2="78" y2="51" stroke="white" strokeWidth="1"/>
      </g>
      
      {/* Center Connection Point */}
      <circle cx="50" cy="50" r="3" fill="url(#infinityGrad)">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}
