import { useState, type ReactNode, type ComponentType } from 'react';
import { 
  ChevronDown, Sparkles, ShieldCheck, Truck, RotateCcw, 
  CheckCircle2, Info, Gift, Droplets 
} from 'lucide-react';
import { Product } from '../data';

interface ProductAccordionsProps {
  product: Product;
}

interface AccordionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  content: ReactNode;
}

export default function ProductAccordions({ product }: ProductAccordionsProps) {
  // Default first accordion open for immediate value perception
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    details: true,
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const accordionSections: AccordionItem[] = [
    {
      id: 'details',
      title: 'Product Details & Materials',
      subtitle: '18K PVD Gold & 316L Stainless Steel',
      icon: Sparkles,
      content: (
        <div className="space-y-3.5 text-xs text-on-surface-variant leading-relaxed">
          <p>
            Every Raya Jewels piece is engineered with supreme craftsmanship to blend modern minimalism with lifelong durability.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-start gap-2 bg-surface p-2.5 rounded-lg border border-outline-variant/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Core Material</span>
                <span className="text-[11px] text-on-surface-variant">Surgical 316L Stainless Steel</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-surface p-2.5 rounded-lg border border-outline-variant/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Luxury Plating</span>
                <span className="text-[11px] text-on-surface-variant">18K Real Gold PVD Coating</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-surface p-2.5 rounded-lg border border-outline-variant/30">
              <Droplets className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Durability</span>
                <span className="text-[11px] text-on-surface-variant">100% Waterproof & Anti-Tarnish</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-surface p-2.5 rounded-lg border border-outline-variant/30">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Hypoallergenic</span>
                <span className="text-[11px] text-on-surface-variant">Zero Nickel, Zero Green Skin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-outline">
            <Gift className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>Includes signature Raya velvet storage pouch & luxury packaging.</span>
          </div>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Jewelry Care & Daily Wear',
      subtitle: 'Waterproof, sweatproof, and life-proof',
      icon: ShieldCheck,
      content: (
        <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
          <p>
            Crafted for effortless daily life. You never have to take off your Raya jewelry when stepping out or winding down.
          </p>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">•</span>
              <span><strong className="text-primary">Wear Anywhere:</strong> Completely safe for showers, pool dips, workout sessions, and hot humid weather without discoloration.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">•</span>
              <span><strong className="text-primary">Cleaning:</strong> Gently wipe down with a soft microfibre cloth after swimming or sweating to revive its golden mirror gleam.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">•</span>
              <span><strong className="text-primary">Fragrance Tip:</strong> Mist perfumes and apply body lotions prior to accessorizing for maximum long-term brilliance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold">•</span>
              <span><strong className="text-primary">Storage:</strong> Keep enclosed in your Raya velvet pouch when traveling to protect against scratching from other metal items.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Packaging & Shipping',
      subtitle: 'Packed with care in our signature box',
      icon: Truck,
      content: (
        <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
          <p>
            Every jewelry piece is carefully inspected by hand and packed in our signature Raya box with protective cushioning to ensure it reaches you in immaculate condition.
          </p>
          <ul className="space-y-1.5 text-[11px] pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Shipped with care in our custom Raya jewelry box.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Courier tracking updates sent directly to your phone upon dispatch.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'policy',
      title: 'Anti-Tarnish Assurance & Policy',
      subtitle: 'Premium durability • Final sale policy',
      icon: RotateCcw,
      content: (
        <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
          <div className="p-3 bg-surface rounded-lg border border-outline-variant/30 space-y-1.5">
            <span className="font-bold text-primary block text-xs">Raya Anti-Tarnish Promise</span>
            <p className="text-[11px] text-on-surface-variant">
              Engineered with advanced vacuum PVD plating technology to resist water, sweat, and fading for effortless daily wear.
            </p>
          </div>
          <div className="flex items-start gap-2 pt-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
            <span>
              <strong>Final Sale Notice:</strong> To maintain strict hygiene and pristine quality for all clients, all sales are final with no returns or exchanges once dispatched. In the rare event an item arrives damaged in transit, please share an unboxing video with our WhatsApp team.
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-2.5 pt-2 border-t border-outline-variant/30">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
          Product Information & Guarantees
        </h3>
        <span className="text-[10px] text-outline font-medium">Click to expand</span>
      </div>

      <div className="space-y-2">
        {accordionSections.map((item) => {
          const isOpen = Boolean(openItems[item.id]);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="border border-outline-variant/40 rounded-xl overflow-hidden bg-surface-container/40 transition-all duration-200 hover:border-outline-variant"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full py-3.5 px-4 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-surface-container"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-xs shrink-0 border border-outline-variant/30">
                    <Icon className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-primary leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-outline">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className={`p-1 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180 text-secondary' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-outline-variant/20 bg-surface/50 animate-in fade-in-50 duration-150">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
