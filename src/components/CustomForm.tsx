import React, { useState, useEffect } from 'react';
import { SkincareFormInput, Product } from '../types';
import { SKIN_TYPES, SKIN_CONCERNS, FRAGRANCE_PREFS } from '../data';
import { Sparkles, MessageSquare, Send, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, X } from 'lucide-react';

interface CustomFormProps {
  products: Product[];
  n8nWebhookUrl: string;
  onNewLead: (lead: any) => void;
  currentUser?: { type: 'client' | 'admin'; data?: any } | null;
}

export default function CustomForm({ products, n8nWebhookUrl, onNewLead, currentUser }: CustomFormProps) {
  // Input states
  const [formData, setFormData] = useState<SkincareFormInput>({
    name: '',
    email: '',
    whatsapp: '',
    skinType: 'sensivel',
    concern: 'sensibilidade',
    fragrancePref: 'floral',
    observations: '',
    agreeToTerms: false
  });

  // Real-time validations status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<any | null>(null);

  // Custom warning banner state to avoid window.alert
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Suggested product details determined in real-time based on choices
  const [recommendedSoap, setRecommendedSoap] = useState<Product | null>(null);

  // Handle live recommendation logic
  useEffect(() => {
    // Basic rules matching skinType / concern to our catalog Categories
    let categoryTarget = "Pele Sensível";
    if (formData.skinType === "oleosa") {
      categoryTarget = "Pele Oleosa";
    } else if (formData.skinType === "seca") {
      categoryTarget = "Pele Sensível"; // high hydration
    } else if (formData.skinType === "mista") {
      categoryTarget = "Pele Mista";
    }

    if (formData.concern === "acne") {
      categoryTarget = "Pele Oleosa";
    }

    const matched = products.find(p => p.category === categoryTarget) || products[0];
    setRecommendedSoap(matched || null);
  }, [formData.skinType, formData.concern, products]);

  // Load client values when they log in to CustomForm
  useEffect(() => {
    if (currentUser?.type === 'client' && currentUser.data) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.data.name || '',
        email: currentUser.data.email || '',
        whatsapp: currentUser.data.whatsapp || '',
        agreeToTerms: true
      }));
    }
  }, [currentUser]);

  // Form field live validation helper
  const validateField = (name: string, value: any) => {
    let errorMsg = '';
    
    if (name === 'name') {
      if (!value || value.trim().length < 3) {
        errorMsg = 'O nome precisa ter pelo menos 3 caracteres.';
      }
    }
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        errorMsg = 'Introduza um e-mail válido.';
      }
    }

    if (name === 'whatsapp') {
      // Basic WhatsApp with area code validation (Brazilian format)
      const cleanPhone = value.replace(/\D/g, '');
      if (!value) {
        errorMsg = 'O número de WhatsApp é obrigatório para notificações.';
      } else if (cleanPhone.length < 10) {
        errorMsg = 'Número incompleto. Digite com DDD (Ex: 11987654321).';
      }
    }

    if (name === 'agreeToTerms') {
      if (!value) {
        errorMsg = 'Você deve concordar em armazenar os dados para nossa consultoria.';
      }
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // OnChange handles
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const val = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    if (touched[name]) {
      validateField(name, val);
    }
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const val = isCheckbox ? e.target.checked : value;

    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, val);
  };

  // Form submit trigger
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger touched & validate all
    const newTouched = {
      name: true,
      email: true,
      whatsapp: true,
      agreeToTerms: true
    };
    setTouched(newTouched);

    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('whatsapp', formData.whatsapp);
    validateField('agreeToTerms', formData.agreeToTerms);

    // Check if any errors exist
    const hasErrors = Object.values(errors).some(err => err !== '') || 
                      !formData.name || !formData.email || !formData.whatsapp || !formData.agreeToTerms;

    if (hasErrors) {
      setValidationWarning('Por favor, verifique todos os campos destacados em vermelho antes de submeter.');
      return;
    }

    setSubmitting(true);

    // Build lead payload
    const leadPayload = {
      id: `lead-${Date.now()}`,
      ...formData,
      recommendedProduct: recommendedSoap?.name || "Sabonete Personalizado",
      submittedAt: new Date().toISOString(),
      status: 'Pendente'
    };

    // Simulate sending to n8n Webhook & Supabase
    try {
      if (n8nWebhookUrl) {
        // Real HTTP POST to user's n8n webhook!
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
          mode: 'no-cors' // avoid CORS blockers on development
        });
      }

      // Add small timeout for premium user feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onNewLead(leadPayload);
      setLastSubmittedLead(leadPayload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      skinType: 'sensivel',
      concern: 'sensibilidade',
      fragrancePref: 'floral',
      observations: '',
      agreeToTerms: false
    });
    setTouched({});
    setErrors({});
  };

  return (
    <section id="consultoria" className="py-24 relative overflow-hidden bg-[#e2ebe3]/25 border-y border-white/40">
      
      {/* Soft Blurred Ambient Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-sage-200 rounded-full blur-[110px] opacity-35" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sage-300 rounded-full blur-[140px] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header summary of skin custom care */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/40 border border-white/50 backdrop-blur-md rounded-full text-xs font-semibold text-sage-800">
            <Sparkles className="h-3.5 w-3.5 text-[#2d5a27] fill-sage-100" />
            <span>Consultoria de Pele Personalizada & Leads Integrados</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#1a3317] tracking-tight">
            Descubra o Sabonete Ideal para <span className="italic font-normal text-[#2d5a27]">Sua Pele</span>
          </h2>
          <p className="text-sm text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Preencha nosso diagnóstico inteligente de cuidados em tempo real. Os dados preenchidos serão salvos no Supabase e encaminhados ao n8n para disparo automático no WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Card */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white/45 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/60 shadow-2xl transition-all">
            
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <h3 className="font-display font-black text-lg text-sage-950 border-b border-white/40 pb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#2d5a27]" />
                  <span>Seu Perfil de Pele</span>
                </h3>

                {/* Personal Information Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Seu Nome Completo *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        placeholder="Ex: Maria Carolina"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full text-xs p-3.5 bg-white/60 border rounded-2xl focus:outline-none focus:bg-white/90 focus:ring-1 focus:ring-[#2d5a27] transition-all duration-200 ${
                          touched.name && errors.name 
                            ? 'border-red-400 bg-red-50/20' 
                            : touched.name && !errors.name 
                              ? 'border-emerald-300 bg-emerald-50/10'
                              : 'border-white/60 focus:border-[#2d5a27]'
                        }`}
                      />
                      {touched.name && !errors.name && formData.name.length >= 3 && (
                        <CheckCircle2 className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-emerald-500" />
                      )}
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* WhatsApp field */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Seu WhatsApp *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="whatsapp"
                        placeholder="Ex: 11987654321"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full text-xs p-3.5 bg-white/60 border rounded-2xl focus:outline-none focus:bg-white/90 focus:ring-1 focus:ring-[#2d5a27] transition-all duration-200 ${
                          touched.whatsapp && errors.whatsapp 
                            ? 'border-red-400 bg-red-50/20' 
                            : touched.whatsapp && !errors.whatsapp && formData.whatsapp
                              ? 'border-emerald-300 bg-emerald-50/10'
                              : 'border-white/60 focus:border-[#2d5a27]'
                        }`}
                      />
                      {touched.whatsapp && !errors.whatsapp && (
                        <CheckCircle2 className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-emerald-500" />
                      )}
                    </div>
                    {touched.whatsapp && errors.whatsapp ? (
                      <p className="text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{errors.whatsapp}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-500 leading-tight">Integrado ao n8n para enviar confirmação automática.</p>
                    )}
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">E-mail para Recebimento de Promoções *</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Ex: maria.oliveira@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full text-xs p-3.5 bg-white/60 border rounded-2xl focus:outline-none focus:bg-white/90 focus:ring-1 focus:ring-[#2d5a27] transition-all duration-200 ${
                        touched.email && errors.email 
                          ? 'border-red-400 bg-red-50/20' 
                          : touched.email && !errors.email && formData.email
                            ? 'border-emerald-300 bg-emerald-50/10'
                            : 'border-white/60 focus:border-[#2d5a27]'
                      }`}
                    />
                    {touched.email && !errors.email && (
                      <CheckCircle2 className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-emerald-500" />
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-[10px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Dropdowns selectors with beautiful layouts grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Skin Type selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Qual o seu Tipo de Pele?</label>
                    <select
                      name="skinType"
                      value={formData.skinType}
                      onChange={handleChange}
                      className="w-full text-xs p-3.5 bg-white/60 border border-white/60 rounded-2xl focus:outline-none focus:bg-white/95"
                    >
                      {SKIN_TYPES.map(st => (
                        <option key={st.value} value={st.value}>{st.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Skin Concern selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Qual o seu maior incômodo?</label>
                    <select
                      name="concern"
                      value={formData.concern}
                      onChange={handleChange}
                      className="w-full text-xs p-3.5 bg-white/60 border border-white/60 rounded-2xl focus:outline-none focus:bg-white/95"
                    >
                      {SKIN_CONCERNS.map(sc => (
                        <option key={sc.value} value={sc.value}>{sc.label}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Fragrance options */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Preferência Olfativa (Terapia)</label>
                  <select
                    name="fragrancePref"
                    value={formData.fragrancePref}
                    onChange={handleChange}
                    className="w-full text-xs p-3.5 bg-white/60 border border-white/60 rounded-2xl focus:outline-none focus:bg-white/95"
                  >
                    {FRAGRANCE_PREFS.map(fp => (
                      <option key={fp.value} value={fp.value}>{fp.label}</option>
                    ))}
                  </select>
                </div>

                {/* Observations */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Observações Importantes ou Alergias (Opcional)</label>
                  <textarea
                    name="observations"
                    placeholder="Nos conte se possuir alguma sensibilidade extrema ou preferência..."
                    value={formData.observations}
                    onChange={handleChange}
                    rows={2}
                    className="w-full text-xs p-3.5 bg-white/60 border border-white/60 rounded-2xl focus:outline-none focus:bg-white/95"
                  />
                </div>

                {/* Agreement Checkbox */}
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 h-4 w-4 text-[#2d5a27] border-white/60 rounded focus:ring-[#2d5a27]"
                    />
                    <label htmlFor="agreeToTerms" className="text-[11px] text-gray-600 leading-tight">
                      Aceito que os dados do meu formulário sejam integrados com segurança ao Supabase e n8n para envio automático da confirmação através de notificações do WhatsApp. *
                    </label>
                  </div>
                  {touched.agreeToTerms && errors.agreeToTerms && (
                    <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errors.agreeToTerms}</span>
                    </p>
                  )}
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full cursor-pointer bg-[#2d5a27] hover:bg-[#1a3317] disabled:bg-gray-300 text-white font-bold p-4.5 rounded-full text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processando e Integrando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Salvar Perfil & Solicitar Consultoria</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              // Success details visualization
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className="p-4 bg-emerald-50 text-[#2d5a27] rounded-full inline-block border border-emerald-100 shadow-sm animate-pulse">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl text-[#1a3317]">Diagnóstico Enviado!</h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Os dados do lead <span className="font-bold text-gray-950">{lastSubmittedLead?.name}</span> foram adicionados com sucesso na sua base de dados do Supabase.
                  </p>
                </div>

                {/* Submited payload simulator display for user */}
                <div className="p-4 bg-slate-900/95 text-left rounded-3xl text-[10px] text-emerald-400 font-mono space-y-2 border border-slate-950 shadow-inner">
                  <div className="flex justify-between border-b border-white/10 pb-1.5 text-slate-400">
                    <span>WEBHOOK PAYLOAD (n8n & Supabase)</span>
                    <span className="text-emerald-500">✓ ENVIADO À FILA</span>
                  </div>
                  <pre className="overflow-x-auto select-all max-h-40">{JSON.stringify(lastSubmittedLead, null, 2)}</pre>
                </div>

                {/* Simulated WhatsApp notification preview details */}
                <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-200/50 text-left space-y-3">
                  <p className="text-xs text-[#2d5a27] font-black flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>Whatsapp Notificação (n8n Simulador):</span>
                  </p>
                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs relative">
                    <span className="absolute -left-1.5 top-3 w-3 h-3 bg-white rotate-45 border-l border-b border-emerald-100" />
                    <p className="text-[11px] text-gray-700 leading-relaxed font-sans">
                      &quot;Olá <strong className="text-emerald-800">{lastSubmittedLead?.name}</strong>! 🌱 Recebemos seu perfil de pele <strong>({lastSubmittedLead?.skinType})</strong> na <strong>Saboaria Artesanal</strong>. Descobrimos que o sabonete <strong>{lastSubmittedLead?.recommendedProduct}</strong> é o seu par perfeito! Entraremos em contato com um cupom de desconto em breve.&quot;
                    </p>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold text-center">Auto-confirmação enviada com sucesso para {lastSubmittedLead?.whatsapp}!</p>
                </div>

                <button
                  onClick={handleResetForm}
                  className="px-6 py-2.5 bg-white/70 hover:bg-white text-sage-800 border border-white/60 rounded-full text-xs font-bold cursor-pointer transition-colors"
                >
                  Preencher Nova Consulta
                </button>

              </div>
            )}

          </div>

          {/* Matches & Diagnostics Side Board with Real-time suggestions! */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            <div className="bg-[#2d5a27]/95 backdrop-blur-md text-white rounded-[32px] p-6 border border-[#2d5a27]/20 shadow-2xl space-y-6">
              
              <div className="border-b border-white/10 pb-3">
                <span className="text-[9px] text-[#ffe600] uppercase tracking-widest font-extrabold block">Atendimento Individualizado</span>
                <h3 className="font-display font-black text-xl text-white flex items-center gap-1.5 mt-1">
                  <Sparkles className="h-4 w-4 text-[#ffe600] fill-[#ffe600]" />
                  Seu Par Botânico
                </h3>
              </div>

              {/* Real-time description update board */}
              {recommendedSoap ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="relative rounded-2xl overflow-hidden h-36 bg-sage-950/20">
                    <img 
                      src={recommendedSoap.image} 
                      alt="Recommended soap showcase" 
                      className="w-full h-full object-cover opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sage-950 via-sage-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] bg-[#ffe600] text-[#2d3277] font-black uppercase px-2.5 py-1 rounded-md">
                        {formData.skinType ? `Cuide da Pele: ${formData.skinType}` : 'Recomendado'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] text-emerald-300 uppercase font-black tracking-widest leading-none">Indicação personalizada</p>
                    <h4 className="font-display font-bold text-base text-white">{recommendedSoap.name}</h4>
                    <p className="text-xs text-sage-100 font-light leading-relaxed">{recommendedSoap.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-[9px] text-emerald-300 uppercase font-bold tracking-wider">Por que funciona para você?</p>
                    <ul className="space-y-1.5 text-xs text-sage-200 font-light">
                      {recommendedSoap.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Immediate purchase routing trigger */}
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-sage-300 block text-[9px] uppercase font-bold">Valor do Item</span>
                      <strong className="text-white text-md">R$ {recommendedSoap.price.toFixed(2).replace('.', ',')}</strong>
                    </div>

                    <a
                      href="#catalogo"
                      className="text-xs font-bold text-[#ffe600] hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>Ver Estoque</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-sage-400 text-xs">
                  Aguardando seleção de dados...
                </div>
              )}

            </div>

            {/* Quick social sharing and Trust board */}
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 space-y-4 text-center">
              <h4 className="font-display font-black text-xs text-[#2d5a27] uppercase tracking-wider">Cuidado Livre e Natural</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Nossos produtos não contêm parabenos, corantes artificiais ou essências sintéticas que causem alergia ou danifiquem o pH natural.
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="bg-white/70 p-3 rounded-2xl border border-white/40 shadow-3xs">
                  <span className="block text-sage-900 font-black text-md">Sustentável</span>
                  <span className="text-[10px] text-gray-500 font-normal">Eco Embalagens</span>
                </div>
                <div className="bg-white/70 p-3 rounded-2xl border border-white/40 shadow-3xs">
                  <span className="block text-sage-900 font-black text-md">Artesanal</span>
                  <span className="text-[10px] text-gray-500 font-normal">Lotes Pequenos</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Embedded dialog warning banner instead of alert(...) for full iframe safety */}
      {validationWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sage-950/40 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl max-w-sm w-full border border-white/60 shadow-2xl relative text-center space-y-4">
            <button onClick={() => setValidationWarning(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h4 className="font-display font-black text-md text-sage-950">Pendência de Preenchimento</h4>
            <p className="text-xs text-gray-600 leading-normal">{validationWarning}</p>
            <button 
              onClick={() => setValidationWarning(null)}
              className="w-full py-3 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-md"
            >
              Entendido, vou corrigir
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
