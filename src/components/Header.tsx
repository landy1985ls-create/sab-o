import { Leaf, Instagram, ExternalLink, HelpCircle, Laptop, LogIn, LogOut, User, Shield } from 'lucide-react';
import { IntegrationConfig, UserClient } from '../types';

interface HeaderProps {
  config: IntegrationConfig;
  onOpenSettings: () => void;
  onScrollToForm: () => void;
  onScrollToCatalog: () => void;
  onOpenGuide: () => void;
  currentUser: { type: 'client' | 'admin'; data?: UserClient } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onScrollToPortal: () => void;
}

export default function Header({ 
  config, 
  onOpenSettings, 
  onScrollToForm, 
  onScrollToCatalog, 
  onOpenGuide,
  currentUser,
  onOpenAuth,
  onLogout,
  onScrollToPortal
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer animate-fadeIn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="p-2.5 bg-[#2d5a27] rounded-full text-white transition-colors border border-white/30 shadow-md">
            <Leaf className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-tight text-[#2d5a27] flex items-center gap-1.5 leading-none">
              Saboaria <span className="font-serif italic text-[#2d5a27] font-normal">Artesanal</span>
            </h1>
            <p className="text-[10px] text-sage-600 uppercase font-bold tracking-widest leading-none mt-1">100% Natural & Sustentável</p>
          </div>
        </div>

        {/* Quick Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-gray-700 uppercase tracking-widest">
          <button onClick={onScrollToCatalog} className="hover:text-[#2d5a27] transition-colors cursor-pointer">
            Coleções
          </button>
          <button onClick={onScrollToForm} className="hover:text-[#2d5a27] transition-colors cursor-pointer">
            Diagnóstico
          </button>
          {currentUser?.type === 'client' && (
            <button onClick={onScrollToPortal} className="text-[#2d5a27] hover:underline transition-colors cursor-pointer flex items-center gap-1 font-extrabold uppercase bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <User className="h-3.5 w-3.5" />
              <span>Espaço Cliente</span>
            </button>
          )}
          {currentUser?.type === 'admin' && (
            <span className="text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 font-extrabold text-[11px]">
              <Shield className="h-3.5 w-3.5 text-amber-600" />
              <span>Painel Admin</span>
            </span>
          )}
          <button onClick={onOpenGuide} className="hover:text-[#2d5a27] transition-colors cursor-pointer flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-full border border-white/40 backdrop-blur-xs text-[11px] font-bold">
            <HelpCircle className="h-4 w-4 text-sage-600" />
            Vercel & n8n
          </button>
        </nav>

        {/* Outer Action Links: Instagram & Mercado Livre + Login + Settings */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* User Sign In Option */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-white/80 border border-white/50 p-1 rounded-full shadow-xs animate-fadeIn">
              <div 
                onClick={currentUser.type === 'client' ? onScrollToPortal : undefined}
                className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase text-gray-700 flex items-center gap-1 cursor-pointer hover:bg-gray-100/60"
              >
                {currentUser.type === 'admin' ? (
                  <>
                    <Shield className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-amber-800">Saboeira</span>
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="max-w-[80px] truncate">{currentUser.data?.name.split(' ')[0]}</span>
                  </>
                )}
              </div>
              <button 
                onClick={onLogout}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer"
                title="Sair da Conta"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-extrabold text-[#2d5a27] bg-white border border-[#2d5a27]/30 hover:bg-[#e2ebe3] rounded-full shadow-sm transition-all duration-200 transform active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Entrar / Área Cliente</span>
            </button>
          )}

          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#e1306c] hover:opacity-90 rounded-full shadow-md transition-all duration-300 transform active:scale-95"
            title="Siga no Instagram"
          >
            <Instagram className="h-4 w-4" />
            <span className="hidden lg:inline">Instagram</span>
          </a>

          <a
            href={config.mercadoLivreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#2d3277] bg-[#ffe600] hover:opacity-90 rounded-full shadow-md transition-all duration-300 transform active:scale-95"
            title="Nossa Loja do Mercado Livre (Afiliado)"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Mercado Livre</span>
          </a>

          {/* Quick Dev Config Gear Panel button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-sage-700 hover:text-sage-950 bg-white/60 hover:bg-white rounded-full border border-white/40 backdrop-blur-xs transition-all shadow-xs"
            title="Configurações de Conexão Supabase / n8n"
          >
            <Laptop className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
}

