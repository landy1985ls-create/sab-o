import { Leaf, Instagram, ExternalLink, ShieldAlert, Heart, Sprout } from 'lucide-react';
import { IntegrationConfig } from '../types';

interface FooterProps {
  config: IntegrationConfig;
  onScrollToForm: () => void;
  onScrollToCatalog: () => void;
}

export default function Footer({ config, onScrollToForm, onScrollToCatalog }: FooterProps) {
  return (
    <footer className="bg-[#132611] text-[#e2ebe3] border-t border-white/10 relative overflow-hidden">
      
      {/* Blurred decorative element in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2d5a27]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Visual highlights division on top */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white/10 text-[#ffe600] rounded-full border border-white/20">
              <Sprout className="h-5 w-5" />
            </div>
            <h5 className="font-display font-bold text-sm text-white">Ingredientes 100% Naturais</h5>
            <p className="text-[11px] text-[#b3c7b5] max-w-[180px] font-light leading-relaxed">Manteigas, argilas, sementes e óleos essenciais puros da terra.</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white/10 text-[#ffe600] rounded-full border border-white/20">
              <Heart className="h-5 w-5" />
            </div>
            <h5 className="font-display font-bold text-sm text-white">Dermatologia Limpa</h5>
            <p className="text-[11px] text-[#b3c7b5] max-w-[180px] font-light leading-relaxed">Livre de alumínios, parabenos, silicones e sulfatos nocivos.</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white/10 text-[#ffe600] rounded-full border border-white/20">
              <Leaf className="h-5 w-5" />
            </div>
            <h5 className="font-display font-bold text-sm text-white">Sustentabilidade Ativa</h5>
            <p className="text-[11px] text-[#b3c7b5] max-w-[180px] font-light leading-relaxed">Embalados à mão com celofane biodegradável compostável.</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white/10 text-[#ffe600] rounded-full border border-white/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h5 className="font-display font-bold text-sm text-white">Estoque sob Encomenda</h5>
            <p className="text-[11px] text-[#b3c7b5] max-w-[180px] font-light leading-relaxed">Lote controlado por lote para assegurar altíssimo frescor.</p>
          </div>

        </div>
      </div>

      {/* Main footer layout content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand layout */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#2d5a27] text-white rounded-full border border-white/20">
              <Leaf className="h-5 w-5 text-emerald-300" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-white">Saboaria Artesanal</h4>
          </div>
          <p className="text-xs text-[#b3c7b5] leading-relaxed font-light">
            Respeito à natureza, amor ao próximo e responsabilidade no trato da pele humana. Elaboramos sabonetes nobres em pequenos lotes no sul do Brasil.
          </p>
        </div>

        {/* Dynamic navigation links */}
        <div className="space-y-4">
          <h5 className="font-display font-extrabold text-[#ffe600] text-xs uppercase tracking-wider">Atalhos rápidos</h5>
          <ul className="space-y-2.5 text-xs text-[#b3c7b5]">
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">
                Início / Topo
              </button>
            </li>
            <li>
              <button onClick={onScrollToCatalog} className="hover:text-white transition-colors cursor-pointer">
                Nossos Sabonetes
              </button>
            </li>
            <li>
              <button onClick={onScrollToForm} className="hover:text-white transition-colors cursor-pointer">
                Diagnóstico de Pele
              </button>
            </li>
            <li>
              <a href="#guia" className="hover:text-white transition-colors cursor-pointer">
                Configuração Banco & n8n
              </a>
            </li>
          </ul>
        </div>

        {/* User integration actions requested */}
        <div className="space-y-4">
          <h5 className="font-display font-extrabold text-[#ffe600] text-xs uppercase tracking-wider">Canais Oficiais</h5>
          <div className="flex flex-col gap-2.5">
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#b3c7b5] hover:text-white transition-all cursor-pointer"
            >
              <Instagram className="h-4 w-4 text-pink-400" />
              <span>Siga no Instagram</span>
            </a>
            <a
              href={config.mercadoLivreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#b3c7b5] hover:text-white transition-all cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 text-yellow-300" />
              <span>Mercado Livre Afiliado</span>
            </a>
          </div>
        </div>

        {/* Safe notice / disclaimer */}
        <div className="space-y-4">
          <h5 className="font-display font-extrabold text-[#ffe600] text-xs uppercase tracking-wider">Responsabilidade</h5>
          <p className="text-[11px] text-[#869b88] leading-relaxed font-light">
            Os nossos sabonetes são artesanais para fins cosméticos e preventivos naturais. Não substituem tratamentos médicos avançados ou acompanhamento por dermatologistas profissionais.
          </p>
        </div>

      </div>

      {/* Deep baseline copyright info */}
      <div className="bg-[#0b170a] border-t border-white/5 py-6 text-center text-xs text-[#869b88] relative z-10">
        <p>© 2026 Saboaria Artesanal. Todos os direitos reservados. Feito com amor e com foco total em sustentabilidade.</p>
      </div>

    </footer>
  );
}
