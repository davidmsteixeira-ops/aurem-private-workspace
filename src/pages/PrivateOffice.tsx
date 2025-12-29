import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Archive, Sparkles, ListChecks, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getAuthInfo } from '@/hooks/UserInfo';


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const officeCards = [
  {
    title: 'Brand Vault',
    description: 'Access your complete brand documentation, strategy, and visual identity guidelines.',
    icon: Archive,
    href: '/brand-vault',
  },
  {
    title: 'Brand Intelligence',
    description: 'Strategic insights and guidance powered by your brand foundation.',
    icon: Sparkles,
    href: '/brand-intelligence',
  },
  {
    title: 'Decisions & Rationale',
    description: 'Review strategic decisions and their alignment with brand principles.',
    icon: ListChecks,
    href: '/decisions',
  },
];

export default function PrivateOffice() {
  const {userInfo, loading} = getAuthInfo();

  if (loading) return null;

  return (
    <MainLayout>
      <div className="p-12 max-w-5xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight mb-4">
            {userInfo?.client_name}
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-xl">
            Private Brand Office
          </p>
          <div className="divider-subtle my-8 max-w-xs" />
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            A protected space for brand clarity, consistency, and strategic decisions.
          </p>
        </motion.div>

        {/* Office Cards */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid gap-6"
        >
          {officeCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={card.href}
                  className="group block bg-card border border-border rounded-sm p-8 card-luxury"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <div className="p-3 bg-accent rounded-sm">
                        <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                          {card.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed max-w-lg">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight 
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" 
                      strokeWidth={1.5} 
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
            Last accessed: December 27, 2024
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
