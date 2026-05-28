import React from 'react';
import { UserClient, SavedLead, Product } from '../types';
import { Sparkles, Calendar, Tag, ShieldAlert, CheckCircle, Smartphone, Mail, Heart, ArrowRight } from 'lucide-react';
import { SKIN_TYPES, FRAGRANCE_PREFS } from '../data';

interface ClientPortalProps {
  client: UserClient;
  leads: SavedLead[];
  products: Product[];
  onLogout: () => void;
  onScrollToForm: () => void;
}

export default function ClientPortal({ client, leads, products, onLogout, onScrollToForm }: ClientPortalProps) {
  // Find all diagnostic history sent under this client's email
  const clientLeads = leads.filter(
    l => l.email.toLowerCase().trim() === client.email.toLowerCase().trim()
  );

  // Find recommended product based on their last submission or register value
  const skinTypeVal = clientLeads[0]?.skinType || client.skinType || 'normal';
  
  // Custom lookup matching the logic in diagnose
  const recommendedSoap = products.find(p => {
    if (skinTypeVal === 'oleosa') return p.category === 'Pele Oleosa';
    if (skinTypeVal === 'sensivel') return p.category === 'Pele Sensível';
    if (skinTypeVal === 'mista') return p.category === 'Pele Mista';
    if (skinTypeVal === 'seca') return p.category === 'Esfoliante Suave' || p.category === 'Pele Sensível';
    return p.category === 'Pele Sensível';
  }) || products[0];

  const skinTypeObj = SKIN_TYPES.find(s => s.value === skinTypeVal);
  const perfumeObj = FRAGRANCE_PREFS.find(f => f.value === (clientLeads[0]?.fragrancePref || client.fragrancePref || 'herbal'));

  return (
    <section id="portal-cliente" className="py-20 relative overflow-hidden bg-white border-y border-sage-100">
      
      {/* Blurred decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-50 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-sage-100 rounded-full blur-[95px] opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome board */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-sage-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-[#2d5a27] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#2d5a27]" />
              <span>Espaço Exclusivo de Autocuidado</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1a3317]">
              Bem-vinda, <span className="italic font-normal text-[#2d5a27]">{client.name}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">Sua conta segura de autocuidado natural na Saboaria Artesanal.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onScrollToForm}
              className="px-5 py-2.5 bg-[#2d5a27] text-white text-xs font-bold rounded-full hover:bg-[#1a3317] transition-all cursor-pointer shadow-xs"
            >
              Novo Diagnóstico de Pele
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 bg-white border border-red-100 font-bold rounded-full transition-all cursor-pointer"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        {/* Dashboard overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Profile & Custom Recommendation Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Profile Bio */}
            <div className="bg-[#e2ebe3]/30 border border-[#e2ebe3] p-5 rounded-3xl space-y-3.5">
              <span className="text-[10px] uppercase font-bold text-[#2d5a27] tracking-wider block">Suas Preferências</span>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Mail className="h-4 w-4 text-sage-500" />
                  <span className="font-medium truncate">{client.email}</span>
                </div>
                {client.whatsapp && (
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Smartphone className="h-4 w-4 text-sage-500" />
                    <span>{client.whatsapp}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-sage-200/60 grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-2.5 border border-sage-200 rounded-2xl">
                  <span className="text-[9px] text-gray-400 uppercase font-bold block">Pele Indicada</span>
                  <span className="text-xs font-black text-[#1a3317] uppercase tracking-wide mt-1 block">
                    {skinTypeObj?.label.split('/')[0] || 'Normal'}
                  </span>
                </div>
                <div className="bg-white p-2.5 border border-sage-200 rounded-2xl">
                  <span className="text-[9px] text-gray-400 uppercase font-bold block">Aroma Ideal</span>
                  <span className="text-xs font-black text-[#1a3317] capitalize mt-1 block">
                    {perfumeObj?.label.split(' ')[0] || 'Herbal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Client Discount voucher */}
            <div className="bg-[#ffe600]/8 border border-[#ffe600]/40 p-5 rounded-3xl text-center space-y-3 relative overflow-hidden backdrop-blur-md">
              <Tag className="h-6 w-6 text-[#2d3277] mx-auto animate-bounce mt-1" />
              <div>
                <span className="text-[9px] text-yellow-800 uppercase font-bold tracking-widest block leading-none">Cupom da Comunidade</span>
                <h4 className="font-display font-black text-lg text-[#2d3277] mt-1">SABONATURAL15</h4>
                <p className="text-[11px] text-[#2d3277] font-medium leading-relaxed max-w-[200px] mx-auto mt-1">Use este cupom exclusivo para obter <strong>15% de desconto</strong> em compras no Mercado Livre!</p>
              </div>
            </div>

          </div>

          {/* Column 2: Perfect botanical match details */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white border border-sage-200 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-2xl text-[#1a3317] flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-100" />
                Seu Par Botânico Perfeito
              </h3>

              {recommendedSoap ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  <div className="md:col-span-4 rounded-2xl overflow-hidden h-40 border border-sage-100">
                    <img 
                      src={recommendedSoap.image} 
                      alt="Recommended perfect match selection" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <span className="text-[10px] bg-emerald-50 text-[#2d5a27] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-100">
                      Ideal para Pele {skinTypeObj?.label.split(' ')[1] || 'Normal'}
                    </span>
                    <h4 className="font-serif text-xl text-[#1a3317] font-extrabold leading-tight">{recommendedSoap.name}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">{recommendedSoap.description}</p>
                    
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-lg font-black text-gray-950">R$ {recommendedSoap.price.toFixed(2).replace('.', ',')}</span>
                      <a 
                        href="#catalogo" 
                        className="text-xs font-semibold text-[#2d5a27] hover:underline flex items-center gap-1"
                      >
                        <span>Adquirir Esta Barra</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">Preencha um diagnóstico de pele para obtermos sua recomendação!</p>
              )}
            </div>

            {/* History of skincare diagnostic consultations */}
            <div className="space-y-3">
              <h4 className="font-display font-black text-xs text-[#2d5a27] uppercase tracking-wider">Histórico de Diagnósticos ({clientLeads.length})</h4>
              
              {clientLeads.length > 0 ? (
                <div className="space-y-3">
                  {clientLeads.map((record) => (
                    <div 
                      key={record.id} 
                      className="bg-gray-50 hover:bg-emerald-50/20 p-4 rounded-2xl border border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-gray-400 font-mono text-[10px]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(record.submittedAt).toLocaleDateString('pt-BR')}</span>
                          <span>• ID: {record.id.substring(0, 8)}</span>
                        </div>
                        <p className="font-medium text-[#1a3317]">
                          Tipo de pele avaliada: <strong className="font-extrabold uppercase">{record.skinType}</strong>
                        </p>
                        <p className="text-gray-500 font-light text-[11px]">
                          Incômodo: {record.concern} | Fragrância: {record.fragrancePref}
                        </p>
                        {record.observations && (
                          <p className="text-gray-500 text-[10px] italic leading-tight mt-1 bg-white inline-block p-1.5 rounded-lg border border-gray-100">
                            &quot;{record.observations}&quot;
                          </p>
                        )}
                      </div>

                      <div className="self-start sm:self-center">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                          record.status === 'Pendente' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : record.status === 'Respondido' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}>
                          {record.status === 'Pendente' ? 'Recebido pela Saboeira' : record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500 italic">
                  Você não enviou nenhum diagnóstico ainda. Preencha o formulário abaixo para começar!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
