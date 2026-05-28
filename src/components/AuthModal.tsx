import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Sparkles, Check, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserClient } from '../types';
import { SKIN_TYPES, SKIN_CONCERNS, FRAGRANCE_PREFS } from '../data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { type: 'client' | 'admin'; data?: UserClient }) => void;
  defaultTab?: 'client_login' | 'client_register' | 'admin_login';
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, defaultTab }: AuthModalProps) {
  const [tab, setTab] = useState<'client_login' | 'client_register' | 'admin_login'>(defaultTab || 'client_login');

  React.useEffect(() => {
    if (isOpen && defaultTab) {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);
  
  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  // Registration optional skin settings
  const [skinType, setSkinType] = useState('normal');
  const [concern, setConcern] = useState('hidratacao');
  const [fragrancePref, setFragrancePref] = useState('herbal');

  // UI States
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    // Read clients from localStorage
    const saved = localStorage.getItem('saboaria_clients');
    let clients: UserClient[] = [];
    if (saved) {
      clients = JSON.parse(saved);
    }

    // Verify
    const clientFound = clients.find(c => c.email.toLowerCase().trim() === email.toLowerCase().trim());
    
    // Fallback default test client
    if (email.toLowerCase().trim() === 'cliente@email.com' && password === 'cliente123') {
      const defaultClient: UserClient = {
        id: 'client-default-1',
        name: 'Mariana Souza',
        email: 'cliente@email.com',
        whatsapp: '+55 (11) 98888-1122',
        skinType: 'sensivel',
        concern: 'sensibilidade',
        fragrancePref: 'floral',
        createdAt: new Date().toISOString()
      };
      
      onLoginSuccess({ type: 'client', data: defaultClient });
      onClose();
      return;
    }

    if (!clientFound) {
      setErrorMsg('E-mail informado não encontrado. Cadastre-se na aba ao lado!');
      return;
    }

    if (clientFound.password !== password) {
      setErrorMsg('Senha incorreta. Verifique suas credenciais!');
      return;
    }

    onLoginSuccess({ type: 'client', data: clientFound });
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha de administradora.');
      return;
    }

    // Check admin credentials (she says "eu mesma quero cadastrar")
    // Let's set the admin credentials - pre-populated for easier demo checking
    if (
      (email.toLowerCase().trim() === 'admin@email.com' && password === 'admin123') ||
      (email.toLowerCase().trim() === 'saboaria@email.com' && password === 'saboaria321')
    ) {
      onLoginSuccess({ type: 'admin' });
      onClose();
    } else {
      setErrorMsg('E-mail ou Senha de administradora inválido!');
    }
  };

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !password || !whatsapp) {
      setErrorMsg('Campos com * são de preenchimento obrigatório para sua ficha.');
      return;
    }

    // Read existing clients
    const saved = localStorage.getItem('saboaria_clients');
    let clients: UserClient[] = [];
    if (saved) {
      clients = JSON.parse(saved);
    }

    // Check duplicate
    if (clients.some(c => c.email.toLowerCase().trim() === email.toLowerCase().trim())) {
      setErrorMsg('Já existe uma conta registrada com este endereço de e-mail.');
      return;
    }

    const newClientObj: UserClient = {
      id: `client-usr-${Date.now()}`,
      name,
      email,
      password,
      whatsapp,
      skinType,
      concern,
      fragrancePref,
      createdAt: new Date().toISOString()
    };

    clients.push(newClientObj);
    localStorage.setItem('saboaria_clients', JSON.stringify(clients));

    setSuccessMsg('Conta criada com absoluto sucesso! Você já pode entrar.');
    
    // Automatically switch to login tab and populate fields
    setTimeout(() => {
      setTab('client_login');
      setSuccessMsg(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 border border-white/60 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin">
        
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[180px] h-[180px] bg-emerald-100 rounded-full blur-[60px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-[#2d5a27]/10 rounded-full blur-[80px] opacity-40 pointer-events-none" />

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand identity */}
        <div className="text-center space-y-1 relative z-10">
          <div className="h-10 w-10 bg-[#2d5a27] rounded-full mx-auto flex items-center justify-center text-white border border-white/30 shadow-md">
            <Sparkles className="h-5 w-5 fill-sage-100" />
          </div>
          <h3 className="font-serif text-2xl text-[#1a3317] tracking-tight">Portal de Acesso</h3>
          <p className="text-xs text-gray-500">Cadastre-se para ver seus diagnósticos ou faça login administrativo.</p>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-1 p-1.5 bg-[#e2ebe3]/50 rounded-2xl relative z-10">
          <button
            onClick={() => { setTab('client_login'); setErrorMsg(null); }}
            className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'client_login' ? 'bg-white text-[#2d5a27] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Entrar Cliente
          </button>
          
          <button
            onClick={() => { setTab('client_register'); setErrorMsg(null); }}
            className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'client_register' ? 'bg-white text-[#2d5a27] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Criar Conta (Cliente)
          </button>

          <button
            onClick={() => { setTab('admin_login'); setErrorMsg(null); }}
            className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              tab === 'admin_login' ? 'bg-white text-amber-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="h-3 w-3 inline text-amber-600" />
            <span>Sou Saboeira</span>
          </button>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Success confirmation banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 bg-emerald-100 rounded-full p-0.5" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* FORMS */}
        <div className="relative z-10 transition-all">
          
          {/* 1. Client Login */}
          {tab === 'client_login' && (
            <form onSubmit={handleClientLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Seu E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Ex: seu-nome@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3.5 pl-11 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2d5a27] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Sua Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Insira sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs p-3.5 pl-11 pr-11 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#2d5a27] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-3.5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-sage-50/50 p-3 rounded-xl border border-sage-100 text-[10px] text-gray-500">
                💡 <strong>Dica de teste:</strong> Use o e-mail <code>cliente@email.com</code> e a senha <code>cliente123</code> para testar a conta pré-configurada!
              </div>

              <button
                type="submit"
                className="w-full py-3.5 cursor-pointer bg-[#2d5a27] hover:bg-[#1a3317] text-white font-bold rounded-full text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Acessar Minha Área do Cliente</span>
              </button>
            </form>
          )}

          {/* 2. Client Register */}
          {tab === 'client_register' && (
            <form onSubmit={handleClientRegister} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Seu Nome *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ex: Mariana Souza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-3 pl-9.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Seu WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Ex: (11) 98888-1122"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full text-xs p-3 pl-9.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Seu Melhor E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Ex: mariana@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 pl-9.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Escolha uma Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Senha de acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs p-3 pl-9.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Preferences inside signup to prepropulate */}
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2d5a27] block">Pré-Cadastro de Perfil Cutâneo (Opcional)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-gray-600">Tipo de Pele</label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-xl"
                    >
                      {SKIN_TYPES.map(st => (
                        <option key={st.value} value={st.value}>{st.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-gray-600">Preferência Olfativa</label>
                    <select
                      value={fragrancePref}
                      onChange={(e) => setFragrancePref(e.target.value)}
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-xl"
                    >
                      {FRAGRANCE_PREFS.map(fp => (
                        <option key={fp.value} value={fp.value}>{fp.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 cursor-pointer bg-[#2d5a27] hover:bg-[#1a3317] text-white font-bold rounded-full text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Registrar Minha Conta de Cliente</span>
              </button>
            </form>
          )}

          {/* 3. Admin Login ("Sou Saboeira") */}
          {tab === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              
              <div className="p-3.5 bg-amber-500/10 border border-amber-300/30 text-[11px] text-amber-900 rounded-2xl space-y-1 leading-relaxed">
                <span className="font-bold flex items-center gap-1.5 uppercase">
                  <Shield className="h-3.5 w-3.5 text-amber-700" />
                  Painel de Controle da Fabricante
                </span>
                <p className="font-light">Faça login com sua senha de administrador para gerenciar o estoque, cadastrar novos sabonetes e ler os formulários/receitas preenchidos por clientes.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">E-mail Administrativo</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3.5 pl-11 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Chave/Senha de Gestão</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Insira sua senha de gestora"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs p-3.5 pl-11 pr-11 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-3.5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100 text-[10px] text-gray-500">
                ⭐ <strong>Senha de Fábrica:</strong> Faça login com o e-mail: <code>admin@email.com</code> e a senha: <code>admin123</code> para habilitar o painel completo.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 cursor-pointer bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-full text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Efetuar Login Administrativo</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
