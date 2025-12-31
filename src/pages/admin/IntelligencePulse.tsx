import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  TrendingUp, 
  MessageSquare, 
  Globe, 
  Leaf, 
  Building, 
  DollarSign,
  Users,
  Lightbulb,
  ChevronRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StrategicInterest {
  id: string;
  topic: string;
  queryCount: number;
  trend: 'rising' | 'stable' | 'declining';
  clients: string[];
  lastQueried: string;
  category: string;
}

interface TopicCloud {
  topic: string;
  weight: number;
  category: string;
}

const strategicInterests: StrategicInterest[] = [
  {
    id: '1',
    topic: 'Sustainability Initiatives',
    queryCount: 47,
    trend: 'rising',
    clients: ['Fungisteel', 'Verdant Holdings', 'Aetheris'],
    lastQueried: '2h ago',
    category: 'Environmental'
  },
  {
    id: '2',
    topic: 'Asia Market Expansion',
    queryCount: 38,
    trend: 'rising',
    clients: ['Meridian Capital', 'Obsidian Labs'],
    lastQueried: '4h ago',
    category: 'Growth'
  },
  {
    id: '3',
    topic: 'Brand Heritage Positioning',
    queryCount: 31,
    trend: 'stable',
    clients: ['Aetheris', 'Fungisteel'],
    lastQueried: '1d ago',
    category: 'Brand Strategy'
  },
  {
    id: '4',
    topic: 'ESG Reporting Standards',
    queryCount: 28,
    trend: 'rising',
    clients: ['Verdant Holdings', 'Meridian Capital', 'Fungisteel'],
    lastQueried: '6h ago',
    category: 'Compliance'
  },
  {
    id: '5',
    topic: 'Digital Transformation',
    queryCount: 24,
    trend: 'stable',
    clients: ['Obsidian Labs', 'Aetheris'],
    lastQueried: '12h ago',
    category: 'Operations'
  },
  {
    id: '6',
    topic: 'Luxury Consumer Trends',
    queryCount: 21,
    trend: 'declining',
    clients: ['Aetheris'],
    lastQueried: '2d ago',
    category: 'Market Research'
  },
  {
    id: '7',
    topic: 'Supply Chain Resilience',
    queryCount: 19,
    trend: 'rising',
    clients: ['Fungisteel', 'Verdant Holdings'],
    lastQueried: '8h ago',
    category: 'Operations'
  },
  {
    id: '8',
    topic: 'Executive Succession Planning',
    queryCount: 15,
    trend: 'stable',
    clients: ['Meridian Capital'],
    lastQueried: '3d ago',
    category: 'Leadership'
  },
];

const topicCloud: TopicCloud[] = [
  { topic: 'Sustainability', weight: 1, category: 'Environmental' },
  { topic: 'Asia Expansion', weight: 0.85, category: 'Growth' },
  { topic: 'ESG', weight: 0.75, category: 'Compliance' },
  { topic: 'Heritage', weight: 0.7, category: 'Brand Strategy' },
  { topic: 'Digital', weight: 0.65, category: 'Operations' },
  { topic: 'Luxury', weight: 0.55, category: 'Market Research' },
  { topic: 'Supply Chain', weight: 0.5, category: 'Operations' },
  { topic: 'Leadership', weight: 0.4, category: 'Leadership' },
  { topic: 'Innovation', weight: 0.6, category: 'Growth' },
  { topic: 'Consumer Insights', weight: 0.45, category: 'Market Research' },
  { topic: 'Risk Management', weight: 0.35, category: 'Compliance' },
  { topic: 'Brand Voice', weight: 0.5, category: 'Brand Strategy' },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Environmental': return Leaf;
    case 'Growth': return TrendingUp;
    case 'Brand Strategy': return Lightbulb;
    case 'Compliance': return Building;
    case 'Operations': return BarChart3;
    case 'Market Research': return Globe;
    case 'Leadership': return Users;
    default: return MessageSquare;
  }
};

const getTrendIndicator = (trend: string) => {
  switch (trend) {
    case 'rising': return { text: '↑ Rising', className: 'text-foreground' };
    case 'stable': return { text: '→ Stable', className: 'text-muted-foreground' };
    case 'declining': return { text: '↓ Declining', className: 'text-muted-foreground/60' };
    default: return { text: '', className: '' };
  }
};

export default function IntelligencePulse() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');

  const filteredInterests = selectedCategory
    ? strategicInterests.filter(i => i.category === selectedCategory)
    : strategicInterests;

  const categories = [...new Set(strategicInterests.map(i => i.category))];

  const weeklyInsights = {
    totalQueries: 234,
    uniqueTopics: 18,
    activeClients: 5,
    avgQueriesPerClient: 47
  };

  return (
  <AdminLayout>
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-3xl font-light tracking-tight mb-2">
          Intelligence Pulse
        </h1>
        <p className="text-muted-foreground text-sm">
          Strategic interests and trends across your client portfolio
        </p>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Queries', value: weeklyInsights.totalQueries, subtitle: 'This week' },
          { label: 'Unique Topics', value: weeklyInsights.uniqueTopics, subtitle: 'Explored' },
          { label: 'Active Clients', value: weeklyInsights.activeClients, subtitle: 'Engaged' },
          { label: 'Avg. per Client', value: weeklyInsights.avgQueriesPerClient, subtitle: 'Queries' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-sm p-6"
          >
            <p className="text-2xs uppercase tracking-widest text-muted-foreground mb-4">
              {stat.label}
            </p>
            <p className="font-serif text-3xl font-light mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="interests" className="space-y-8">
        <TabsList className="bg-muted/30 p-1">
          <TabsTrigger value="interests" className="data-[state=active]:bg-background">
            Strategic Interests
          </TabsTrigger>
          <TabsTrigger value="cloud" className="data-[state=active]:bg-background">
            Topic Cloud
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-background">
            Actionable Insights
          </TabsTrigger>
        </TabsList>

        {/* Strategic Interests Tab */}
        <TabsContent value="interests" className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-foreground text-background' : ''}
            >
              All Topics
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-foreground text-background' : ''}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Interests List */}
          <div className="space-y-3">
            {filteredInterests.map((interest, index) => {
              const Icon = getCategoryIcon(interest.category);
              const trend = getTrendIndicator(interest.trend);
              
              return (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card border border-border rounded-sm p-5 hover:border-foreground/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">{interest.topic}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-2xs uppercase tracking-widest text-muted-foreground">
                            {interest.category}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className={`text-xs ${trend.className}`}>{trend.text}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-serif text-xl font-light">{interest.queryCount}</p>
                        <p className="text-2xs text-muted-foreground">queries</p>
                      </div>
                      
                      <div className="flex -space-x-2">
                        {interest.clients.slice(0, 3).map((client, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 bg-muted border-2 border-background rounded-full flex items-center justify-center"
                          >
                            <span className="text-2xs font-medium">{client[0]}</span>
                          </div>
                        ))}
                        {interest.clients.length > 3 && (
                          <div className="w-7 h-7 bg-foreground/10 border-2 border-background rounded-full flex items-center justify-center">
                            <span className="text-2xs">+{interest.clients.length - 3}</span>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Topic Cloud Tab */}
        <TabsContent value="cloud">
          <div className="bg-card border border-border rounded-sm p-12">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {topicCloud.map((topic, index) => (
                <motion.button
                  key={topic.topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-muted/50 border border-transparent hover:border-foreground/20 rounded-sm transition-all duration-300"
                  style={{
                    fontSize: `${0.75 + topic.weight * 0.75}rem`,
                    opacity: 0.4 + topic.weight * 0.6,
                  }}
                >
                  {topic.topic}
                </motion.button>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Topic size represents query frequency across all client offices
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Actionable Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: 'Sustainability Leadership Opportunity',
                description: 'Three clients are actively exploring sustainability initiatives. Consider preparing a comprehensive ESG brand positioning framework.',
                clients: ['Fungisteel', 'Verdant Holdings', 'Aetheris'],
                priority: 'high',
                action: 'Prepare Proposal'
              },
              {
                title: 'Asia Expansion Expertise',
                description: 'Rising interest in Asian market entry. Meridian Capital and Obsidian Labs may benefit from coordinated brand localization strategies.',
                clients: ['Meridian Capital', 'Obsidian Labs'],
                priority: 'high',
                action: 'Schedule Discussion'
              },
              {
                title: 'Heritage Brand Workshop',
                description: 'Multiple clients exploring heritage positioning. Group workshop opportunity to share best practices and methodologies.',
                clients: ['Aetheris', 'Fungisteel'],
                priority: 'medium',
                action: 'Plan Workshop'
              },
              {
                title: 'Digital Transformation Advisory',
                description: 'Growing inquiries about digital brand presence. Consider developing a luxury digital transformation playbook.',
                clients: ['Obsidian Labs', 'Aetheris'],
                priority: 'medium',
                action: 'Create Playbook'
              },
            ].map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-2 py-1 text-2xs uppercase tracking-widest rounded-sm ${
                    insight.priority === 'high' 
                      ? 'bg-foreground/10 text-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {insight.priority} priority
                  </div>
                  <Lightbulb className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                
                <h3 className="font-serif text-lg font-light mb-2">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  {insight.clients.map((client) => (
                    <span
                      key={client}
                      className="px-2 py-1 text-2xs bg-muted rounded-sm"
                    >
                      {client}
                    </span>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  {insight.action}
                </Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </AdminLayout>
  );
}
