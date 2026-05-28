import React, { useState, useEffect } from 'react';
import { Product, IntegrationConfig, SavedLead, UserClient } from './types';
import { INITIAL_PRODUCTS, INITIAL_CONFIG, INITIAL_LEADS } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import CustomForm from './components/CustomForm';
import SupabaseGuide from './components/SupabaseGuide';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ClientPortal from './components/ClientPortal';
import { Laptop, Database, Share2, Eye, Key, X, Check, Save, Shield } from 'lucide-react';

export default function App() {
  // Store products (allows adding manually and managing stock)
  const [products, setProducts] = useState<Product[]>([]);
  
  // Store connection settings
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfig>(INITIAL_CONFIG);

  // Store leads registered locally as simulator
  const [leads, setLeads] = useState<SavedLead[]>([]);

  // Toggles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Authentication states
  const [currentUser, setCurrentUser] = useState<{ type: 'client' | 'admin'; data?: UserClient } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'client_login' | 'client_register' | 'admin_login'>('client_login');

  // Settings form values
  const [tempConfig, setTempConfig] = useState<IntegrationConfig>(INITIAL_CONFIG);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProds = localStorage.getItem('saboaria_products');
    if (savedProds) {
      setProducts(JSON.parse(savedProds));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('saboaria_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const savedConfig = localStorage.getItem('saboaria_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setIntegrationConfig(parsed);
      setTempConfig(parsed);
    } else {
      setIntegrationConfig(INITIAL_CONFIG);
      setTempConfig(INITIAL_CONFIG);
    }

    const savedLeads = localStorage.getItem('saboaria_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      setLeads(INITIAL_LEADS);
      localStorage.setItem('saboaria_leads', JSON.stringify(INITIAL_LEADS));
    }

    const savedUser = localStorage.getItem('saboaria_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Sync helpers
  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('saboaria_products', JSON.stringify(updated));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    localStorage.setItem('saboaria_products', JSON.stringify(updated));
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('saboaria_products', JSON.stringify(updated));
  };

  const handleResetProducts = () => {
    if (window.confirm("Restaurar o catálogo de produtos original de exemplo?")) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('saboaria_products', JSON.stringify(INITIAL_PRODUCTS));
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIntegrationConfig(tempConfig);
    localStorage.setItem('saboaria_config', JSON.stringify(tempConfig));
    setIsSettingsOpen(false);
    alert("Configurações salvas localmente com sucesso! Sua landing page está atualizada.");
  };

  const handleAddNewLead = (newLead: any) => {
    const leadObj: SavedLead = {
      id: newLead.id,
      name: newLead.name,
      email: newLead.email,
      whatsapp: newLead.whatsapp,
      skinType: newLead.skinType,
      concern: newLead.concern,
      fragrancePref: newLead.fragrancePref,
      observations: newLead.observations,
      submittedAt: newLead.submittedAt,
      status: 'Pendente',
      clientId: currentUser?.type === 'client' ? currentUser.data?.id : undefined
    };
    const updated = [leadObj, ...leads];
    setLeads(updated);
    localStorage.setItem('saboaria_leads', JSON.stringify(updated));
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm("Apagar consulta deste lead?")) {
      const updated = leads.filter(l => l.id !== id);
      setLeads(updated);
      localStorage.setItem('saboaria_leads', JSON.stringify(updated));
    }
  };

  const handleToggleLeadStatus = (id: string) => {
    const statuses: Array<'Pendente' | 'Respondido' | 'Em Produção'> = ['Pendente', 'Respondido', 'Em Produção'];
    const updated = leads.map(l => {
      if (l.id === id) {
        const nextIndex = (statuses.indexOf(l.status) + 1) % statuses.length;
        return { ...l, status: statuses[nextIndex] };
      }
      return l;
    });
    setLeads(updated);
    localStorage.setItem('saboaria_leads', JSON.stringify(updated));
  };

  const handleLoginSuccess = (user: { type: 'client' | 'admin'; data?: UserClient }) => {
    setCurrentUser(user);
    localStorage.setItem('saboaria_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('saboaria_user');
  };

  // Scroll utilities
  const scrollToForm = () => {
    document.getElementById('consultoria')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortal = () => {
    setTimeout(() => {
      document.getElementById('portal-cliente')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-sage-300 selection:text-sage-900 bg-sage-50">
      
      {/* Page Header */}
      <Header 
        config={integrationConfig} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onScrollToForm={scrollToForm}
        onScrollToCatalog={scrollToCatalog}
        onOpenGuide={() => setShowGuide(!showGuide)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onScrollToPortal={scrollToPortal}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Banner with Integration info when configured */}
        {(integrationConfig.supabaseUrl || integrationConfig.n8nWebhookUrl) && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-1.5 shadow-sm animate-pulse">
            <Database className="h-3.5 w-3.5" />
            <span>
              Integração ativa! Enviando dados para {integrationConfig.supabaseUrl ? 'Supabase' : ''} 
              {integrationConfig.supabaseUrl && integrationConfig.n8nWebhookUrl ? ' e ' : ''} 
              {integrationConfig.n8nWebhookUrl ? 'Webhook n8n' : ''}
            </span>
          </div>
        )}

        {/* Hero Section */}
        <Hero onScrollToForm={scrollToForm} onScrollToCatalog={scrollToCatalog} />

        {/* Client Portal Card if customer logs in */}
        {currentUser?.type === 'client' && currentUser.data && (
          <ClientPortal 
            client={currentUser.data} 
            leads={leads}
            products={products}
            onLogout={handleLogout}
            onScrollToForm={scrollToForm}
          />
        )}

        {/* Product Catalog list with Stock manager */}
        <ProductCatalog 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetProducts={handleResetProducts}
          isAdmin={currentUser?.type === 'admin'}
          onOpenAuth={(tab) => {
            setAuthModalTab(tab);
            setIsAuthModalOpen(true);
          }}
        />

        {/* Custom Skincare consultative Form */}
        <CustomForm 
          products={products} 
          n8nWebhookUrl={integrationConfig.n8nWebhookUrl}
          onNewLead={handleAddNewLead}
          currentUser={currentUser}
        />

        {/* Dynamic Technical Guide - collapsible as requested */}
        {showGuide && (
          <div className="px-4 sm:px-6 lg:px-8 bg-white/50 py-4">
            <SupabaseGuide />
          </div>
        )}

        {/* Lead Management Grid (Simulating she checks client database inside the landing page) */}
        {currentUser?.type === 'admin' && (
          <section className="py-12 bg-white border-t border-sage-100 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sage-100 pb-4 gap-2">
              <div>
                <h3 className="font-display font-extrabold text-lg text-sage-950 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-sage-600" />
                  <span>Painel do Administrador: Consultas Recebidas</span>
                </h3>
                <p className="text-xs text-sage-500">Acompanhe as respostas de formulários cadastradas por clientes localmente no navegador.</p>
              </div>
              
              <div className="text-[10px] bg-sage-50 text-sage-600 px-3 py-1 rounded-md border border-sage-100 font-mono">
                Total registrado: {leads.length} leads
              </div>
            </div>

            {leads.length > 0 ? (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-sage-100 shadow-xs">
                <table className="min-w-full divide-y divide-sage-100 text-left text-xs text-sage-800">
                  <thead className="bg-sage-50 text-[10px] uppercase font-bold text-sage-700">
                    <tr>
                      <th className="px-4 py-3">Cliente / Contato</th>
                      <th className="px-4 py-3">Pele / Incômodo</th>
                      <th className="px-4 py-3">Essência fav.</th>
                      <th className="px-4 py-3">Observação coletada</th>
                      <th className="px-4 py-3">Data Envio</th>
                      <th className="px-4 py-3 text-center">Status n8n</th>
                      <th className="px-4 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100 bg-white">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-sage-50/40 transition-colors">
                        <td className="px-4 py-4 space-y-0.5">
                          <strong className="block text-sage-900 font-bold">{l.name}</strong>
                          <span className="block text-sage-400 font-mono font-medium">{l.whatsapp}</span>
                          <span className="block text-sage-400 font-light">{l.email}</span>
                        </td>
                        <td className="px-4 py-4 space-y-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sage-100 text-sage-800 uppercase">
                            {l.skinType}
                          </span>
                          <span className="block text-sage-500 mt-0.5">
                            Problema: {l.concern}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sage-600 font-light italic">
                          {l.fragrancePref}
                        </td>
                        <td className="px-4 py-4 text-sage-600 max-w-[200px] truncate" title={l.observations || "Sem observações"}>
                          {l.observations || <span className="text-sage-400 italic">Nenhuma</span>}
                        </td>
                        <td className="px-4 py-4 font-mono text-sage-400">
                          {new Date(l.submittedAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleToggleLeadStatus(l.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer uppercase transition-all ${
                              l.status === 'Pendente' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : l.status === 'Respondido' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            }`}
                            title="Clique para alternar status da notificação"
                          >
                            {l.status}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleDeleteLead(l.id)}
                            className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 text-center py-12 bg-sage-50 rounded-2xl border border-dashed border-sage-200">
                <p className="text-sage-500 text-xs italic">Nenhum lead preencheu a consultoria de pele ainda.</p>
              </div>
            )}
          </div>
        </section>
        )}

      </main>

      {/* Footer component */}
      <Footer config={integrationConfig} onScrollToForm={scrollToForm} onScrollToCatalog={scrollToCatalog} />

      {/* Connection & Setup Config Modal Panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-sage-100 shadow-2xl relative">
            
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 text-sage-400 hover:text-sage-700 p-1.5 hover:bg-sage-50 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-sage-100 text-sage-700 rounded-2xl">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-sage-950">Conexão Supabase / n8n</h3>
                <p className="text-xs text-sage-500">Configure no mesmo painel seus canais de vendas e webhooks reais.</p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              
              <div className="bg-sage-50 p-4 rounded-xl space-y-3.5 border border-sage-200/60">
                <span className="text-[10px] font-black text-sage-800 uppercase tracking-widest block">INTEGRAÇÃO DE BANCO E WEBHOOKS</span>
                
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-sage-700">Supabase Project URL</label>
                  <input
                    type="url"
                    placeholder="Ex: https://xyz.supabase.co"
                    value={tempConfig.supabaseUrl}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                    className="w-full text-xs p-2.5 bg-white border border-sage-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-sage-700">Supabase Service Key (Anon/Service)</label>
                  <input
                    type="password"
                    placeholder="Insira a chave Anon Key para conexão..."
                    value={tempConfig.supabaseAnonKey}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, supabaseAnonKey: e.target.value }))}
                    className="w-full text-xs p-2.5 bg-white border border-sage-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1 bg-white p-3 rounded-lg border border-sage-200">
                  <label className="block text-xs font-bold text-sage-800 flex justify-between">
                    <span>Webhook de Produção n8n *</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Altamente recomendado</span>
                  </label>
                  <input
                    type="url"
                    placeholder="Ex: https://n8n.seu-dominio.com/webhook/..."
                    value={tempConfig.n8nWebhookUrl}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, n8nWebhookUrl: e.target.value }))}
                    className="w-full text-xs p-2.5 bg-sage-50/50 border border-sage-300 rounded-lg focus:outline-none mt-1"
                  />
                  <p className="text-[10px] text-sage-500 mt-1">Ao inserir este URL, as conexões da landing page enviarão dados do formulário de pele do cliente ao vivo para o nó do seu n8n.</p>
                </div>
              </div>

              <div className="bg-sage-50 p-4 rounded-xl space-y-3 border border-sage-200/60">
                <span className="text-[10px] font-black text-sage-800 uppercase tracking-widest block font-display">CANAIS DE VENDAS E AFILIADO</span>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-sage-700">Link da sua Página do Instagram</label>
                  <input
                    type="url"
                    value={tempConfig.instagramUrl}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    className="w-full text-xs p-2.5 bg-white border border-sage-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-sage-700">Link da Loja de Afiliado (Mercado Livre)</label>
                  <input
                    type="url"
                    value={tempConfig.mercadoLivreUrl}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, mercadoLivreUrl: e.target.value }))}
                    className="w-full text-xs p-2.5 bg-white border border-sage-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 bg-sage-100 hover:bg-sage-200 rounded-lg text-sage-700 font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 hover:bg-sage-800 bg-sage-700 text-white rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar Dados</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Auth Modal Overlay */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultTab={authModalTab}
      />

    </div>
  );
}
