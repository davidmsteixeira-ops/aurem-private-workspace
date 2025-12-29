import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { getBrandInfo } from '@/hooks/BrandVaultInfo';
import { BrandBlock } from '@/types/brand_vault_entries';

type VaultSectionUI = {
  id: string;
  title: string;
  lastUpdated: string;
  content: {
    title?: string;
    blocks: BrandBlock[];
  } | null;
};


const vaultSections = [
  {
    id: 'strategy',
    title: 'Brand Strategy',
    lastUpdated: 'December 15, 2024',
    content: `Fungisteel exists to transform the perception of sustainable materials in architectural design. Our strategic positioning centers on the intersection of innovation, craftsmanship, and environmental responsibility.

**Core Strategic Pillars:**

1. **Innovation Leadership** — We are pioneers in bio-composite material science, creating solutions that architects and designers have never imagined possible.

2. **Sustainable Excellence** — Environmental responsibility is not a compromise but a catalyst for superior design outcomes.

3. **Collaborative Partnership** — We work alongside the world's most visionary architects, understanding that great materials require great minds to reach their full potential.

**Market Position:**
Premium sustainable materials for discerning architectural practices and luxury construction projects worldwide.`,
  },
  {
    id: 'positioning',
    title: 'Positioning',
    lastUpdated: 'December 12, 2024',
    content: `**Brand Positioning Statement:**

For visionary architects and design-led construction firms who refuse to compromise between sustainability and aesthetic excellence, Fungisteel is the premium bio-composite material that enables unprecedented creative freedom while exceeding environmental standards.

Unlike traditional sustainable materials that sacrifice performance or beauty, Fungisteel combines the structural integrity of engineered steel with the environmental benefits of mycelium-based composites—representing the future of conscious construction.

**Key Differentiators:**
- Proprietary bio-bonding technology
- 73% lower carbon footprint than traditional steel
- Superior acoustic properties
- Customizable aesthetic finishes
- 50-year structural warranty`,
  },
  {
    id: 'visual-identity',
    title: 'Visual Identity',
    lastUpdated: 'December 20, 2024',
    content: `**Typography System:**

Primary: Canela Text — Reserved for headlines and brand statements
Secondary: Söhne — Applied to body text and interface elements

**Color Architecture:**

The Fungisteel palette draws from the natural world—specifically the subtle gradations found in organic materials as they transform under different light conditions.

- **Primary Charcoal** (#1A1A1A) — Authority and precision
- **Warm Stone** (#E8E4DF) — Natural warmth and approachability  
- **Oxidized Bronze** (#8B7355) — Craft and patina
- **Forest Shadow** (#2D3B36) — Environmental connection

**Photography Direction:**
Architectural photography emphasizing material texture, light interaction, and spatial context. Human presence should feel incidental rather than staged.`,
  },
  {
    id: 'brand-rules',
    title: 'Brand Rules',
    lastUpdated: 'December 18, 2024',
    content: `**Voice & Tone:**

Fungisteel speaks with quiet confidence. We do not boast about sustainability—we demonstrate it through excellence. Our communication style is:

- **Precise** — Every word carries weight
- **Warm** — Technical without being cold
- **Forward-looking** — Grounded in research, oriented toward possibility

**Language Guidelines:**

✓ "Bio-composite innovation" not "eco-friendly alternative"
✓ "Sustainable excellence" not "green solution"  
✓ "Architectural partnership" not "B2B service"

**Visual Application Rules:**

1. Logo clear space: Minimum 2x the height of the 'F' letterform
2. Never place logo on busy photography without sufficient contrast
3. Brand colors should always appear in their designated hierarchy
4. Typography pairing ratios: 1:1.618 (golden ratio) for headline to body`,
  },
  {
    id: 'decisions',
    title: 'Decisions & Rationale',
    lastUpdated: 'December 22, 2024',
    content: `**Recent Strategic Decisions:**

**Q4 2024: Website Redesign Direction**
Decision: Prioritize material storytelling over product catalog approach
Rationale: Research indicated that 78% of architectural decision-makers are influenced more by material narrative than technical specifications alone.

**Q4 2024: Trade Show Presence**
Decision: Exit general construction trade shows; focus exclusively on design-led events (Milan Design Week, Venice Biennale)
Rationale: Brand positioning requires exclusivity. General contractor audiences dilute premium perception.

**Q3 2024: Pricing Architecture**
Decision: Remove from all comparison shopping platforms
Rationale: Fungisteel is not competing on price. Value proposition requires direct consultation.`,
  },
  {
    id: 'assets',
    title: 'Assets',
    lastUpdated: 'December 24, 2024',
    content: `**Available Brand Assets:**

All assets are organized within the dedicated Assets section of this Private Office. Current inventory includes:

- Logo suite (12 formats, light/dark variations)
- Photography library (284 approved images)
- Typography license documentation
- Brand guidelines PDF (v3.2)
- Presentation templates (Keynote, PowerPoint)
- Social media templates
- Email signature specifications
- Stationery designs
- Trade show booth specifications

For asset requests or custom applications, please contact your dedicated brand liaison.`,
  },
];

function VaultSection({ section, isOpen, onToggle }: { 
  // section: typeof vaultSections[0]; 
  section: VaultSectionUI;
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-2 text-left hover:bg-accent/30 transition-colors duration-300"
      >
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-xl text-foreground">{section.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="text-xs">{section.lastUpdated}</span>
          </div>
          <ChevronDown 
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180"
            )} 
            strokeWidth={1.5} 
          />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-8">
              <div className="prose prose-neutral max-w-none">
                {section.content.split('\n\n').map((paragraph, idx) => (
                  <p 
                    key={idx} 
                    className="text-muted-foreground leading-relaxed mb-4 last:mb-0 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>')
                        .replace(/✓/g, '<span class="text-success">✓</span>')
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrandVault() {
  const [openSections, setOpenSections] = useState<string[]>(['strategy']);
  const { sections, loading } = getBrandInfo();
  



  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

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
            Brand Vault
          </h1>

          

          <p className="text-muted-foreground">
            Complete brand documentation and strategic foundation
            
          </p>
        </motion.div>

        {/* Vault Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border rounded-sm"
        >
          {/* {vaultSections.map((section) => (
            <VaultSection
              key={section.id}
              section={section}
              isOpen={openSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))} */}

          {sections.map((section) => (
            <VaultSection
              key={section.id}
              section={{
                id: section.slug,
                title: section.name,
                lastUpdated: section.updated_at
                  ? new Date(section.updated_at).toLocaleDateString()
                  : '—',
                content: section.content,
              }}
              isOpen={openSections.includes(section.slug)}
              onToggle={() => toggleSection(section.slug)}
            />
          ))}

        </motion.div>
      </div>
    </MainLayout>
  );
}
