import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Plus, 
  Check, 
  Clock, 
  AlertCircle, 
  FileText,
  Send,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Building2,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Decision {
  id: string;
  title: string;
  rationale: string;
  client: string;
  status: 'draft' | 'pending' | 'aligned' | 'review';
  category: string;
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
  clientResponse?: string;
}

const mockDecisions: Decision[] = [
  {
    id: '1',
    title: 'Sustainability Messaging Framework',
    rationale: 'We recommend adopting a "heritage meets future" positioning for sustainability communications. This approach honors the brand\'s 50-year legacy while demonstrating forward-thinking environmental stewardship. Key pillars include: carbon neutrality by 2030, sustainable sourcing transparency, and community reinvestment programs.',
    client: 'Fungisteel',
    status: 'pending',
    category: 'Brand Positioning',
    createdAt: '2024-01-15',
    sentAt: '2024-01-16'
  },
  {
    id: '2',
    title: 'Asia Market Entry Strategy',
    rationale: 'Initial market entry should focus on Singapore and Hong Kong as gateway cities. We recommend a phased approach: Phase 1 - Strategic partnerships with established luxury distributors. Phase 2 - Flagship experience center in Singapore. Phase 3 - Digital-first expansion to secondary markets.',
    client: 'Meridian Capital',
    status: 'aligned',
    category: 'Growth Strategy',
    createdAt: '2024-01-10',
    sentAt: '2024-01-11',
    respondedAt: '2024-01-14',
    clientResponse: 'Fully aligned. Ready to proceed with Phase 1 planning.'
  },
  {
    id: '3',
    title: 'Brand Voice Refinement',
    rationale: 'The current brand voice reads as overly corporate. We propose shifting to a more intimate, curator-like tone that positions Aetheris as a knowledgeable guide rather than a service provider. This aligns with the luxury hospitality expectation of personalized expertise.',
    client: 'Aetheris',
    status: 'review',
    category: 'Brand Voice',
    createdAt: '2024-01-12',
    sentAt: '2024-01-13',
    respondedAt: '2024-01-15',
    clientResponse: 'Agree with direction but need to discuss implementation timeline.'
  },
  {
    id: '4',
    title: 'Visual Identity Evolution',
    rationale: 'Recommend subtle evolution of visual identity to include more organic, nature-inspired elements while maintaining the geometric precision of the current mark. This positions the brand for the sustainability narrative without losing recognition.',
    client: 'Verdant Holdings',
    status: 'draft',
    category: 'Visual Identity',
    createdAt: '2024-01-18'
  },
  {
    id: '5',
    title: 'Executive Thought Leadership Program',
    rationale: 'Develop a structured thought leadership platform for the CEO, focusing on sustainable investing and long-term value creation. Recommended channels: Harvard Business Review contributions, Davos-adjacent events, and curated podcast appearances.',
    client: 'Meridian Capital',
    status: 'pending',
    category: 'Executive Positioning',
    createdAt: '2024-01-17',
    sentAt: '2024-01-18'
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'draft':
      return { 
        label: 'Draft', 
        icon: FileText, 
        className: 'bg-muted text-muted-foreground',
        dotColor: 'bg-muted-foreground/50'
      };
    case 'pending':
      return { 
        label: 'Awaiting Response', 
        icon: Clock, 
        className: 'bg-foreground/10 text-foreground',
        dotColor: 'bg-foreground/50'
      };
    case 'aligned':
      return { 
        label: 'Aligned', 
        icon: Check, 
        className: 'bg-foreground/10 text-foreground',
        dotColor: 'bg-foreground'
      };
    case 'review':
      return { 
        label: 'Needs Review', 
        icon: AlertCircle, 
        className: 'bg-muted text-muted-foreground',
        dotColor: 'bg-muted-foreground'
      };
    default:
      return { 
        label: 'Unknown', 
        icon: FileText, 
        className: 'bg-muted text-muted-foreground',
        dotColor: 'bg-muted-foreground'
      };
  }
};

const clients = ['Fungisteel', 'Aetheris', 'Meridian Capital', 'Verdant Holdings', 'Obsidian Labs'];
const categories = ['Brand Positioning', 'Growth Strategy', 'Brand Voice', 'Visual Identity', 'Executive Positioning', 'Digital Strategy'];

export default function StrategicPipeline() {
  const [decisions, setDecisions] = useState(mockDecisions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewDecision, setShowNewDecision] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [newDecision, setNewDecision] = useState({
    title: '',
    rationale: '',
    client: '',
    category: ''
  });

  const filteredDecisions = filterStatus
    ? decisions.filter(d => d.status === filterStatus)
    : decisions;

  const statusCounts = {
    draft: decisions.filter(d => d.status === 'draft').length,
    pending: decisions.filter(d => d.status === 'pending').length,
    aligned: decisions.filter(d => d.status === 'aligned').length,
    review: decisions.filter(d => d.status === 'review').length,
  };

  const handleCreateDecision = () => {
    const decision: Decision = {
      id: Date.now().toString(),
      ...newDecision,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDecisions([decision, ...decisions]);
    setNewDecision({ title: '', rationale: '', client: '', category: '' });
    setShowNewDecision(false);
  };

  const handleSendDecision = (id: string) => {
    setDecisions(decisions.map(d => 
      d.id === id 
        ? { ...d, status: 'pending' as const, sentAt: new Date().toISOString().split('T')[0] }
        : d
    ));
  };

  return (
   <AdminLayout>
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight mb-2">
            Strategic Pipeline
          </h1>
          <p className="text-muted-foreground text-sm">
            Draft and manage strategic decisions for client approval
          </p>
        </div>
        <Button
          onClick={() => setShowNewDecision(true)}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Decision
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant={filterStatus === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus(null)}
          className={filterStatus === null ? 'bg-foreground text-background' : ''}
        >
          All ({decisions.length})
        </Button>
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = getStatusConfig(status);
          return (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-foreground text-background' : ''}
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {filteredDecisions.map((decision, index) => {
            const statusConfig = getStatusConfig(decision.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedId === decision.id;

            return (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-12"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-3 top-6 w-3 h-3 rounded-full ${statusConfig.dotColor} ring-4 ring-background`} />

                <div className="bg-card border border-border rounded-sm overflow-hidden">
                  {/* Decision Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : decision.id)}
                    className="w-full p-6 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 text-2xs uppercase tracking-widest rounded-sm ${statusConfig.className}`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-2xs text-muted-foreground">
                            {decision.category}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-light mb-2">{decision.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {decision.client}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Created {new Date(decision.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 space-y-6 border-t border-border pt-6">
                          {/* Rationale */}
                          <div>
                            <h4 className="text-2xs uppercase tracking-widest text-muted-foreground mb-3">
                              Strategic Rationale
                            </h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {decision.rationale}
                            </p>
                          </div>

                          {/* Client Response (if any) */}
                          {decision.clientResponse && (
                            <div className="bg-muted/30 border border-border rounded-sm p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-2xs uppercase tracking-widest text-muted-foreground">
                                  Client Response
                                </span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {decision.respondedAt && new Date(decision.respondedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <p className="text-sm">{decision.clientResponse}</p>
                            </div>
                          )}

                          {/* Timeline */}
                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span>Created: {new Date(decision.createdAt).toLocaleDateString()}</span>
                            {decision.sentAt && (
                              <span>Sent: {new Date(decision.sentAt).toLocaleDateString()}</span>
                            )}
                            {decision.respondedAt && (
                              <span>Response: {new Date(decision.respondedAt).toLocaleDateString()}</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-4 border-t border-border">
                            {decision.status === 'draft' && (
                              <>
                                <Button
                                  onClick={() => handleSendDecision(decision.id)}
                                  className="bg-foreground text-background hover:bg-foreground/90"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send for Approval
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="text-muted-foreground">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {decision.status === 'pending' && (
                              <p className="text-sm text-muted-foreground">
                                Awaiting client response...
                              </p>
                            )}
                            {decision.status === 'review' && (
                              <Button className="bg-foreground text-background hover:bg-foreground/90">
                                Schedule Discussion
                              </Button>
                            )}
                            {decision.status === 'aligned' && (
                              <Button variant="outline">
                                Proceed to Implementation
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* New Decision Modal */}
      <AnimatePresence>
        {showNewDecision && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowNewDecision(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 m-auto w-full max-w-xl h-fit max-h-[85vh] overflow-y-auto bg-background border border-border rounded-sm shadow-2xl z-50"
            >
              <div className="p-8">
                <h2 className="font-serif text-2xl font-light mb-2">Draft New Decision</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Prepare a strategic recommendation for client approval
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Decision Title
                    </label>
                    <Input
                      placeholder="e.g., Brand Positioning Strategy"
                      value={newDecision.title}
                      onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        Client
                      </label>
                      <Select
                        value={newDecision.client}
                        onValueChange={(value) => setNewDecision({ ...newDecision, client: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client} value={client}>
                              {client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        Category
                      </label>
                      <Select
                        value={newDecision.category}
                        onValueChange={(value) => setNewDecision({ ...newDecision, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Strategic Rationale
                    </label>
                    <Textarea
                      placeholder="Explain your recommendation and the reasoning behind it..."
                      value={newDecision.rationale}
                      onChange={(e) => setNewDecision({ ...newDecision, rationale: e.target.value })}
                      className="min-h-[160px]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewDecision(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                    onClick={handleCreateDecision}
                    disabled={!newDecision.title || !newDecision.client || !newDecision.rationale}
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
   </AdminLayout>
  );
}
