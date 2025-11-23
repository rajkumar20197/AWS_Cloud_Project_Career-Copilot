import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, ExternalLink, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface Resource {
  name: string;
  url: string;
  type: string;
  description: string;
}

interface Material {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  topics: string[];
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface StudyMaterialsCardProps {
  major: string;
}

export function StudyMaterialsCard({ major }: StudyMaterialsCardProps) {
  const [materials, setMaterials] = useState([] as Material[]);
  const [expandedId, setExpandedId] = useState(null as string | null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (major) {
      fetchMaterials();
    }
  }, [major]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/student/study-materials/${encodeURIComponent(major)}`);
      const data = await response.json();
      if (data.success) {
        setMaterials(data.materials);
      }
    } catch (error) {
      console.error('Error fetching study materials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (materials.length === 0) {
    return null;
  }

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  const resourceTypeIcons: Record<string, string> = {
    Practice: '💻',
    Tutorial: '📖',
    Course: '🎓',
    Documentation: '📚',
    Book: '📕',
    Guide: '📝',
    Visualization: '🎨',
    Platform: '☁️',
    Interactive: '🎮'
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Study Materials</h2>
          <p className="text-sm text-slate-600">Curated resources for {major}</p>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setExpandedId(expandedId === material.id ? null : material.id)}
          >
            {/* Material Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{material.title}</h3>
                  <Badge className={`${difficultyColors[material.difficulty]} border text-xs`}>
                    {material.difficulty}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm mb-3">{material.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
              >
                {expandedId === material.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-3">
              {material.topics.slice(0, 5).map((topic, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {material.topics.length > 5 && (
                <Badge variant="outline" className="text-xs text-slate-500">
                  +{material.topics.length - 5} more
                </Badge>
              )}
            </div>

            {/* Time Estimate */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Estimated: {material.estimatedHours} hours</span>
            </div>

            {/* Expanded Resources */}
            {expandedId === material.id && (
              <div className="mt-4 pt-4 border-t animate-in slide-in-from-top">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Resources
                </h4>
                <div className="space-y-2">
                  {material.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{resourceTypeIcons[resource.type] || '📄'}</span>
                        <div>
                          <div className="font-medium group-hover:text-blue-600 transition-colors">
                            {resource.name}
                          </div>
                          <div className="text-xs text-slate-600">{resource.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
