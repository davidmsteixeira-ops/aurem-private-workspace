import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';

type DecisionStatus = 'aligned' | 'partial' | 'not-aligned';

interface Decision {
  id: string;
  title: string;
  status: DecisionStatus;
  rationale: string;
  date: string;
  category: string;
}

const decisions: Decision[] = [
  {
    id: '1',
    title: 'Website Redesign: Prioritize Material Storytelling',
    status: 'aligned',
    rationale: 'Research indicated that 78% of architectural decision-makers are influenced more by material narrative than technical specifications alone. The new approach leads with transformation stories.',
    date: 'December 22, 2024',
    category: 'Digital Presence',
  },
  {
    id: '2',
    title: 'Trade Show Strategy: Focus on Design-Led Events',
    status: 'aligned',
    rationale: 'Exiting general construction trade shows aligns with premium positioning. Milan Design Week and Venice Biennale attendance reinforces exclusivity.',
    date: 'December 18, 2024',
    category: 'Brand Activation',
  },
  {
    id: '3',
    title: 'Social Media Presence: Instagram-Only Strategy',
    status: 'partial',
    rationale: 'While visual platform aligns with brand, LinkedIn presence for B2B architects may still be valuable. Recommend minimal, high-quality LinkedIn content.',
    date: 'December 15, 2024',
    category: 'Digital Presence',
  },
  {
    id: '4',
    title: 'Pricing: Remove from Comparison Platforms',
    status: 'aligned',
    rationale: 'Fungisteel is not competing on price. Value proposition requires direct consultation. This decision reinforces premium positioning.',
    date: 'December 10, 2024',
    category: 'Commercial Strategy',
  },
  {
    id: '5',
    title: 'Sustainability Messaging: Lead with Innovation',
    status: 'aligned',
    rationale: 'Brand voice emphasizes quiet confidence. Environmental benefits are demonstrated through excellence rather than stated as primary value proposition.',
    date: 'December 5, 2024',
    category: 'Communications',
  },
  {
    id: '6',
    title: 'Partnership with Mass-Market Retailer',
    status: 'not-aligned',
    rationale: 'Proposed partnership would dilute premium positioning. Recommendation: Decline opportunity despite revenue potential to maintain brand integrity.',
    date: 'November 28, 2024',
    category: 'Commercial Strategy',
  },
];

const statusConfig = {
  aligned: {
    label: 'Aligned',
    className: 'badge-aligned',
  },
  partial: {
    label: 'Partially Aligned',
    className: 'badge-partial',
  },
  'not-aligned': {
    label: 'Not Aligned',
    className: 'badge-not-aligned',
  },
};

export default function Decisions() {
  return (
    <MainLayout>
      <div className="p-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl text-foreground tracking-tight mb-3">
            Decisions
          </h1>
          <p className="text-muted-foreground">
            Strategic decisions and their alignment with brand principles
          </p>
        </motion.div>

        {/* Decisions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {decisions.map((decision, index) => {
            const status = statusConfig[decision.status];
            return (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-sm p-6 hover:shadow-luxury-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {decision.category}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {decision.date}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl text-foreground">
                      {decision.title}
                    </h2>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-xs font-medium rounded-sm whitespace-nowrap",
                    status.className
                  )}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {decision.rationale}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground mb-4">
            Alignment Status
          </p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success/20 border border-success/30" />
              <span className="text-xs text-muted-foreground">Aligned with brand strategy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning/20 border border-warning/30" />
              <span className="text-xs text-muted-foreground">Partially aligned, review recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/30" />
              <span className="text-xs text-muted-foreground">Not aligned, action required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
