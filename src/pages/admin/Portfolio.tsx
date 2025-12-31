import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Building2, 
  Calendar, 
  Activity, 
  Eye, 
  Plus, 
  Search,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientOffice {
  id: string;
  name: string;
  logo: string;
  foundedDate: string;
  activityLevel: 'high' | 'moderate' | 'low';
  lastDecision: string;
  totalDecisions: number;
  activeProjects: number;
  contactPerson: string;
  industry: string;
}

const mockClients: ClientOffice[] = [
  {
    id: '1',
    name: 'Fungisteel',
    logo: 'F',
    foundedDate: '2024-01-15',
    activityLevel: 'high',
    lastDecision: '2h ago',
    totalDecisions: 47,
    activeProjects: 3,
    contactPerson: 'Marcus Chen',
    industry: 'Industrial Manufacturing'
  },
  {
    id: '2',
    name: 'Aetheris',
    logo: 'A',
    foundedDate: '2023-09-22',
    activityLevel: 'moderate',
    lastDecision: '1d ago',
    totalDecisions: 23,
    activeProjects: 2,
    contactPerson: 'Elena Vasquez',
    industry: 'Luxury Hospitality'
  },
  {
    id: '3',
    name: 'Meridian Capital',
    logo: 'M',
    foundedDate: '2024-03-08',
    activityLevel: 'high',
    lastDecision: '4h ago',
    totalDecisions: 31,
    activeProjects: 4,
    contactPerson: 'James Wright',
    industry: 'Private Equity'
  },
  {
    id: '4',
    name: 'Verdant Holdings',
    logo: 'V',
    foundedDate: '2023-11-30',
    activityLevel: 'low',
    lastDecision: '5d ago',
    totalDecisions: 12,
    activeProjects: 1,
    contactPerson: 'Sarah Mitchell',
    industry: 'Sustainable Agriculture'
  },
  {
    id: '5',
    name: 'Obsidian Labs',
    logo: 'O',
    foundedDate: '2024-02-14',
    activityLevel: 'moderate',
    lastDecision: '12h ago',
    totalDecisions: 19,
    activeProjects: 2,
    contactPerson: 'David Park',
    industry: 'Biotechnology'
  },
];

const getActivityIndicator = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-foreground/80';
    case 'moderate':
      return 'bg-foreground/40';
    case 'low':
      return 'bg-foreground/20';
    default:
      return 'bg-foreground/20';
  }
};

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalClients: mockClients.length,
    activeOffices: mockClients.filter(c => c.activityLevel === 'high').length,
    pendingDecisions: 12,
    thisWeekActivity: 34
  };

  return (
    <AdminLayout>
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-3xl font-light tracking-tight mb-2">
          Client Portfolio
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage and oversee all private offices under your stewardship
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Offices', value: stats.totalClients, icon: Building2 },
          { label: 'High Activity', value: stats.activeOffices, icon: Activity },
          { label: 'Pending Decisions', value: stats.pendingDecisions, icon: Clock },
          { label: 'This Week', value: stats.thisWeekActivity, icon: TrendingUp },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-2xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <p className="font-serif text-3xl font-light">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search offices or industries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        <Button
          onClick={() => setShowNewClientModal(true)}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Office
        </Button>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredClient(client.id)}
              onMouseLeave={() => setHoveredClient(null)}
              className="group relative bg-card border border-border rounded-sm overflow-hidden transition-all duration-500"
              style={{
                transform: hoveredClient === client.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Activity Indicator Bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${getActivityIndicator(client.activityLevel)}`} />
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-sm flex items-center justify-center">
                      <span className="font-serif text-xl font-light">{client.logo}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-light tracking-tight">
                        {client.name}
                      </h3>
                      <p className="text-2xs uppercase tracking-widest text-muted-foreground mt-0.5">
                        {client.industry}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Office</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">
                      Since {new Date(client.foundedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">
                      {client.contactPerson}
                    </span>
                  </div>
                </div>

                {/* Expanded Info (on hover) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: hoveredClient === client.id ? 'auto' : 0,
                    opacity: hoveredClient === client.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last decision</span>
                      <span>{client.lastDecision}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Total decisions</span>
                      <span>{client.totalDecisions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Active projects</span>
                      <span>{client.activeProjects}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Enter Office Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredClient === client.id ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  <Button
                    variant="outline"
                    className="w-full border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Enter Office
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Client Modal */}
      <AnimatePresence>
        {showNewClientModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowNewClientModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-background border border-border rounded-sm shadow-2xl z-50"
            >
              <div className="p-8">
                <h2 className="font-serif text-2xl font-light mb-2">Create New Office</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Establish a new private office for your client
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Office Name
                    </label>
                    <Input placeholder="e.g., Meridian Holdings" />
                  </div>
                  <div>
                    <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Industry
                    </label>
                    <Input placeholder="e.g., Private Equity" />
                  </div>
                  <div>
                    <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Primary Contact
                    </label>
                    <Input placeholder="Contact name" />
                  </div>
                  <div>
                    <label className="text-2xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Contact Email
                    </label>
                    <Input type="email" placeholder="email@company.com" />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewClientModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                    Create Office
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
