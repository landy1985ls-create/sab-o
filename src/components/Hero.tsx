import { Sparkles, ArrowRight, ShieldCheck, Heart, Trash2, Sprout } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
  onScrollToCatalog: () => void;
}

export default function Hero({ onScrollToForm, onScrollToCatalog }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sage-100/60 via-[#f0f4f0]/40 to-white pt-12 pb-20 sm:pb-24 lg:pt-16">
      
      {/* Dynamic Animated Blur Background Rings (matching Frosted Glass request) */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-sage-300 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-sage-700 rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Hero text body */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2d5a27]/10 border border-[#2d5a27]/20 text-xs font-bold text-sage-800 uppercase tracking-wider shadow-xs">
              <Sprout className="h-3.5 w-3.5 text-[#2d5a27] animate-spin-slow" />
              <span>100% Natural & Vegano</span>
            </div>

            {/* Display Headings */}
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#1a3317] leading-tight font-light">
              Cuidado <span className="italic font-normal">Puro</span> <br />
              <span className="font-sans font-black text-[#2d5a27] relative leading-none text-4xl sm:text-5xl lg:text-6xl block mt-2">
                para sua pele.
                {/* Clean soft underlining */}
                <span className="absolute left-0 bottom-1 w-full h-[6px] bg-[#2d5a27]/10 -z-10 rounded-full" />
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-light">
              Sabonetes feitos à mão com ingredientes orgânicos, óleos vegetais nobres e argilas minerais, respeitando a natureza e a individualidade da sua pele.
            </p>

            {/* Feature Highlights bento-style as requested in template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-sm hover:bg-white/50 transition-colors">
                <h3 className="font-bold text-[#2d5a27] text-sm">Lixo Zero (Zero Plástico)</h3>
                <p className="text-xs text-gray-500 mt-1">Nossas embalagens são biodegradáveis em papel semente.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-sm hover:bg-white/50 transition-colors">
                <h3 className="font-bold text-[#2d5a27] text-sm font-display">Cuidado Personalizado</h3>
                <p className="text-xs text-gray-500 mt-1">Fórmulas ricas adaptadas especificamente para cada tipo de pele.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToForm}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-sm bg-[#2d5a27] hover:bg-[#1a3317] shadow-lg hover:shadow-emerald-900/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-sage-200 fill-sage-100" />
                <span>Montar Rotina de Pele</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onScrollToCatalog}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-[#2d5a27] font-semibold text-sm bg-white/60 hover:bg-white/80 border border-white/80 shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <span>Ver Catálogo Ativo</span>
              </button>
            </div>

          </div>

          {/* Hero visual layout right side (Glowy stacked card simulating premium soaps - Glassified) */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5 relative flex justify-center">
            
            {/* Background glowing rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-white/40 animate-pulse" />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-white/20" />
            </div>

            <div className="relative bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-2xl max-w-sm w-full">
              
              {/* Product Card simulation */}
              <div className="overflow-hidden rounded-2xl relative bg-white/95 shadow-md border border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1607006342461-9010df2327cf?auto=format&fit=crop&q=80&w=600" 
                  alt="Premium Organic Soap Closeup" 
                  className="w-full h-56 object-cover shadow-inner hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating stock alert badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500/95 text-white rounded-md text-[10px] uppercase font-black tracking-wider flex items-center gap-1 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  Edição Limitada 
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-sage-600 uppercase font-black tracking-widest">
                    <span>Espumar Calmante</span>
                    <span>110g</span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-sage-950 leading-snug">Lavanda Francesa Aromática</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">Com óleos vegetais de oliva prensados a frio e infusão terapêutica de óleo essencial.</p>
                  
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="text-xl font-extrabold text-[#2d5a27]">R$ 24,90</span>
                    <span className="text-[10px] text-[#2d5a27] bg-[#2d5a27]/10 px-2 py-1 rounded border border-[#2d5a27]/20 uppercase font-bold">14 barritas</span>
                  </div>
                </div>
              </div>

              {/* Decorative testimonial banner layered beneath */}
              <div className="mt-4 p-3.5 bg-sage-900/90 text-sage-100 rounded-xl flex items-center gap-3 border border-white/10 shadow-md backdrop-blur-xs">
                <div className="h-9 w-9 bg-white/10 rounded-full shrink-0 flex items-center justify-center font-serif text-emerald-300 italic font-bold text-sm">“</div>
                <p className="text-[11px] leading-relaxed italic text-sage-300">
                  &quot;Minha pele sensível finalmente encontrou paz. A vermelhidão sumiu em poucos dias!&quot; – <span className="text-white font-medium">Helena M.</span>
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
