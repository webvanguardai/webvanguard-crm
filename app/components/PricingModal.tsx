'use client';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: 'Starter',
    price: '1,500',
    features: 'Landing 1 página, WhatsApp, SEO básico, mobile',
    color: 'border-zinc-600',
  },
  {
    name: 'Launch',
    price: '2,500',
    features: 'Multi-página, formulario, WhatsApp, SEO completo, GA4',
    color: 'border-blue-500',
  },
  {
    name: 'Growth',
    price: '4,500',
    features: 'Launch + blog, 3 meses soporte, Analytics, AI SEO',
    color: 'border-yellow-500',
  },
  {
    name: 'Premium',
    price: '8,000+',
    features: 'Growth + Google Ads, estrategia contenido, reporting mensual',
    color: 'border-copper',
  },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">💰 Pricing Plans</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border-l-4 ${plan.color} bg-zinc-800 rounded-r-xl p-4`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">{plan.name}</span>
                <span className="font-bold text-copper">AED {plan.price}</span>
              </div>
              <p className="text-sm text-zinc-400">{plan.features}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
