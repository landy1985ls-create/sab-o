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

  // Helper functions for IDs
  const isUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Keep a small loading state for the Supabase live syncing alert
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isSyncingLeads, setIsSyncingLeads] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Load from localStorage on mount & sync configurations
  useEffect(() => {
    const savedConfig = localStorage.getItem('saboaria_config');
    let loadedConfig = INITIAL_CONFIG;
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Migração do link padrão do Mercado Livre antigo para o novo link solicitado
        if (parsed.mercadoLivreUrl === "https://lista.mercadolivre.com.br/saboaria-artesanal") {
          parsed.mercadoLivreUrl = INITIAL_CONFIG.mercadoLivreUrl;
          localStorage.setItem('saboaria_config', JSON.stringify(parsed));
        }
        setIntegrationConfig(parsed);
        setTempConfig(parsed);
        loadedConfig = parsed;
      } catch (e) {
        console.error(e);
      }
    } else {
      setIntegrationConfig(INITIAL_CONFIG);
      setTempConfig(INITIAL_CONFIG);
    }

    const savedProds = localStorage.getItem('saboaria_products');
    if (savedProds) {
      try {
        setProducts(JSON.parse(savedProds));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      // For Supabase, map the mock products to standard UUID format
      const productsWithUUIDs = INITIAL_PRODUCTS.map(p => ({
        ...p,
        id: p.id === "prod-1" ? "10a26e84-18ca-4dbb-80df-269fa5bee6a1" :
            p.id === "prod-2" ? "20b37f95-29db-4ecc-91e0-37afb6cff7b2" :
            p.id === "prod-3" ? "30c48a06-3ae0-4fdd-a2f1-48b0c7dff8c3" :
            p.id === "prod-4" ? "40d59b17-4bf1-5fee-b302-59c1d8eff9d4" : p.id
      }));
      setProducts(productsWithUUIDs);
      localStorage.setItem('saboaria_products', JSON.stringify(productsWithUUIDs));
    }

    const savedLeads = localStorage.getItem('saboaria_leads');
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        setLeads(INITIAL_LEADS);
      }
    } else {
      setLeads(INITIAL_LEADS);
      localStorage.setItem('saboaria_leads', JSON.stringify(INITIAL_LEADS));
    }

    const savedUser = localStorage.getItem('saboaria_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const supabaseUrlCleaned = integrationConfig.supabaseUrl ? integrationConfig.supabaseUrl.trim().replace(/\/$/, "") : "";

  // Fetch live products & leads from Supabase when configuration is active
  useEffect(() => {
    if (!supabaseUrlCleaned || !integrationConfig.supabaseAnonKey) return;

    const fetchSupabaseData = async () => {
      setIsSupabaseLoading(true);
      setSupabaseError(null);
      try {
        // 1. Fetch Products
        const prodRes = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos?select=*`, {
          method: 'GET',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (prodRes.ok) {
          const supabaseProds = await prodRes.json();
          if (supabaseProds && supabaseProds.length > 0) {
            // Map keys back from database rows to product type
            const mappedProds: Product[] = supabaseProds.map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description || '',
              price: Number(p.price) || 0,
              weight: Number(p.weight) || 110,
              category: p.category || 'Todos',
              ingredients: p.ingredients || [],
              benefits: p.benefits || [],
              image: p.image || '',
              stock: Number(p.stock) ?? 10
            }));
            setProducts(mappedProds);
            localStorage.setItem('saboaria_products', JSON.stringify(mappedProds));
          } else {
            // If Supabase table works but is completely empty, let's seed it automatically with the 4 default products!
            const productsWithUUIDs = INITIAL_PRODUCTS.map(p => ({
              ...p,
              id: p.id === "prod-1" ? "10a26e84-18ca-4dbb-80df-269fa5bee6a1" :
                  p.id === "prod-2" ? "20b37f95-29db-4ecc-91e0-37afb6cff7b2" :
                  p.id === "prod-3" ? "30c48a06-3ae0-4fdd-a2f1-48b0c7dff8c3" :
                  p.id === "prod-4" ? "40d59b17-4bf1-5fee-b302-59c1d8eff9d4" : p.id
            }));

            const initialDbPayload = productsWithUUIDs.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              weight: Number(p.weight),
              category: p.category,
              ingredients: p.ingredients,
              benefits: p.benefits,
              image: p.image,
              stock: Number(p.stock)
            }));

            const seedRes = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos`, {
              method: 'POST',
              headers: {
                'apikey': integrationConfig.supabaseAnonKey,
                'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(initialDbPayload)
            });

            if (!seedRes.ok) {
              const errMsg = await seedRes.text();
              console.error("Erro ao semear banco Supabase:", errMsg);
              setSupabaseError(`Erro ao semear produtos: ${errMsg}`);
            }
          }
        } else {
          const errMsg = await prodRes.text();
          console.error("Erro de leitura de produtos no Supabase:", errMsg);
          setSupabaseError(`Erro de leitura dos produtos: ${prodRes.status} (${errMsg})`);
        }

        // 2. Fetch Leads (skin consultations)
        const leadRes = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas?select=*&order=submitted_at.desc`, {
          method: 'GET',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (leadRes.ok) {
          const supabaseLeads = await leadRes.json();
          if (supabaseLeads) {
            const mappedLeads: SavedLead[] = supabaseLeads.map((l: any) => ({
              id: l.id,
              name: l.name,
              email: l.email,
              whatsapp: l.whatsapp,
              skinType: l.skin_type || 'normal',
              concern: l.concern || 'geral',
              fragrancePref: l.fragrance_pref || 'herbal',
              observations: l.observations || '',
              submittedAt: l.submitted_at || new Date().toISOString(),
              status: l.status || 'Pendente',
              clientId: l.client_id,
              agreeToTerms: l.agree_to_terms !== false
            }));
            setLeads(mappedLeads);
            localStorage.setItem('saboaria_leads', JSON.stringify(mappedLeads));
          }
        } else {
          const errMsg = await leadRes.text();
          console.error("Erro de leitura de consultas no Supabase:", errMsg);
          setSupabaseError(prev => prev || `Erro ao ler consultas: ${leadRes.status} (${errMsg})`);
        }
      } catch (err: any) {
        console.error("Erro na leitura ao vivo do Supabase:", err);
        setSupabaseError(`Falha de conexão com Supabase: ${err.message || err}`);
      } finally {
        setIsSupabaseLoading(false);
      }
    };

    fetchSupabaseData();
  }, [supabaseUrlCleaned, integrationConfig.supabaseAnonKey]);

  // Sync helpers with live Supabase writes
  const handleAddProduct = async (newProd: Product) => {
    // Force UUID format to prevent database syntax errors in Postgres UUID key
    const cleanProd = {
      ...newProd,
      id: isUUID(newProd.id) ? newProd.id : generateUUID()
    };
    
    const updated = [cleanProd, ...products];
    setProducts(updated);
    localStorage.setItem('saboaria_products', JSON.stringify(updated));

    if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey) {
      try {
        setSupabaseError(null);
        // Exclude frontend-only fields like 'isCustomized' to prevent PostgREST errors on missing columns
        const dbPayload = {
          id: cleanProd.id,
          name: cleanProd.name,
          description: cleanProd.description,
          price: Number(cleanProd.price),
          weight: Number(cleanProd.weight),
          category: cleanProd.category,
          ingredients: cleanProd.ingredients,
          benefits: cleanProd.benefits,
          image: cleanProd.image,
          stock: Number(cleanProd.stock)
        };

        const response = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos`, {
          method: 'POST',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(dbPayload)
        });

        if (!response.ok) {
          const errMsg = await response.text();
          console.error("Erro de persistência no Supabase:", errMsg);
          setSupabaseError(`Erro ao cadastrar produto no banco: ${errMsg}`);
        }
      } catch (err: any) {
        console.error("Erro de persistência no Supabase:", err);
        setSupabaseError(`Falha de conexão ao salvar: ${err.message || err}`);
      }
    }
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    localStorage.setItem('saboaria_products', JSON.stringify(updated));

    if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey) {
      try {
        setSupabaseError(null);
        const response = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos?id=eq.${updatedProd.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: updatedProd.name,
            description: updatedProd.description,
            price: Number(updatedProd.price),
            weight: Number(updatedProd.weight),
            category: updatedProd.category,
            ingredients: updatedProd.ingredients,
            benefits: updatedProd.benefits,
            image: updatedProd.image,
            stock: Number(updatedProd.stock)
          })
        });

        if (!response.ok) {
          const errMsg = await response.text();
          console.error("Erro ao atualizar no Supabase:", errMsg);
          setSupabaseError(`Erro ao atualizar no banco: ${errMsg}`);
        }
      } catch (err: any) {
        console.error("Erro ao atualizar no Supabase:", err);
        setSupabaseError(`Falha de conexão ao atualizar: ${err.message || err}`);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('saboaria_products', JSON.stringify(updated));

    if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey) {
      try {
        setSupabaseError(null);
        const response = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`
          }
        });

        if (!response.ok) {
          const errMsg = await response.text();
          console.error("Erro ao deletar no Supabase:", errMsg);
          setSupabaseError(`Erro ao deletar no banco: ${errMsg}`);
        }
      } catch (err: any) {
        console.error("Erro ao deletar no Supabase:", err);
        setSupabaseError(`Falha de conexão ao remover: ${err.message || err}`);
      }
    }
  };

  const handleResetProducts = async () => {
    if (window.confirm("Restaurar o catálogo de produtos original de exemplo?")) {
      const productsWithUUIDs = INITIAL_PRODUCTS.map(p => ({
        ...p,
        id: p.id === "prod-1" ? "10a26e84-18ca-4dbb-80df-269fa5bee6a1" :
            p.id === "prod-2" ? "20b37f95-29db-4ecc-91e0-37afb6cff7b2" :
            p.id === "prod-3" ? "30c48a06-3ae0-4fdd-a2f1-48b0c7dff8c3" :
            p.id === "prod-4" ? "40d59b17-4bf1-5fee-b302-59c1d8eff9d4" : p.id
      }));

      setProducts(productsWithUUIDs);
      localStorage.setItem('saboaria_products', JSON.stringify(productsWithUUIDs));

      if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey) {
        try {
          setSupabaseError(null);
          // Clear current products
          const deleteResponse = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos?id=not.is.null`, {
            method: 'DELETE',
            headers: {
              'apikey': integrationConfig.supabaseAnonKey,
              'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`
            }
          });

          if (!deleteResponse.ok) {
            const errMsg = await deleteResponse.text();
            console.error("Erro ao limpar produtos no Supabase:", errMsg);
            setSupabaseError(`Erro ao limpar tabela: ${errMsg}`);
            return;
          }

          // Map for database payload
          const dbProducts = productsWithUUIDs.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            weight: Number(p.weight),
            category: p.category,
            ingredients: p.ingredients,
            benefits: p.benefits,
            image: p.image,
            stock: Number(p.stock)
          }));

          // Seed defaults with UUID values
          const seedResponse = await fetch(`${supabaseUrlCleaned}/rest/v1/produtos`, {
            method: 'POST',
            headers: {
              'apikey': integrationConfig.supabaseAnonKey,
              'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(dbProducts)
          });

          if (!seedResponse.ok) {
            const errMsg = await seedResponse.text();
            console.error("Erro ao resetar no Supabase:", errMsg);
            setSupabaseError(`Erro ao repopular produtos: ${errMsg}`);
          }
        } catch (err: any) {
          console.error("Erro ao resetar no Supabase:", err);
          setSupabaseError(`Falha de conexão ao resetar: ${err.message || err}`);
        }
      }
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedConfig = {
      supabaseUrl: tempConfig.supabaseUrl ? tempConfig.supabaseUrl.trim().replace(/\/$/, "") : "",
      supabaseAnonKey: tempConfig.supabaseAnonKey ? tempConfig.supabaseAnonKey.trim() : "",
      n8nWebhookUrl: tempConfig.n8nWebhookUrl ? tempConfig.n8nWebhookUrl.trim().replace(/\/$/, "") : "",
      instagramUrl: tempConfig.instagramUrl ? tempConfig.instagramUrl.trim() : "",
      mercadoLivreUrl: tempConfig.mercadoLivreUrl ? tempConfig.mercadoLivreUrl.trim() : ""
    };
    setIntegrationConfig(cleanedConfig);
    setTempConfig(cleanedConfig);
    localStorage.setItem('saboaria_config', JSON.stringify(cleanedConfig));
    setIsSettingsOpen(false);
    alert("Configurações salvas localmente! Se a URL e chave do Supabase estiverem corretas, a sincronização acontecerá imediatamente.");
  };

  const handleAddNewLead = async (newLead: any) => {
    const cleanLeadId = isUUID(newLead.id) ? newLead.id : generateUUID();
    const leadObj: SavedLead = {
      id: cleanLeadId,
      name: newLead.name,
      email: newLead.email,
      whatsapp: newLead.whatsapp,
      skinType: newLead.skinType,
      concern: newLead.concern,
      fragrancePref: newLead.fragrancePref,
      observations: newLead.observations,
      submittedAt: newLead.submittedAt,
      status: 'Pendente',
      clientId: currentUser?.type === 'client' ? currentUser.data?.id : undefined,
      agreeToTerms: newLead.agreeToTerms !== false
    };
    const updated = [leadObj, ...leads];
    setLeads(updated);
    localStorage.setItem('saboaria_leads', JSON.stringify(updated));

    // Send also to Supabase
    if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey) {
      try {
        setSupabaseError(null);

        // Try inserting with extended schema (including status, client_id and agree_to_terms)
        const primaryBody = {
          id: cleanLeadId,
          name: leadObj.name,
          email: leadObj.email,
          whatsapp: leadObj.whatsapp,
          skin_type: leadObj.skinType,
          concern: leadObj.concern,
          fragrance_pref: leadObj.fragrancePref,
          observations: leadObj.observations,
          status: leadObj.status,
          client_id: leadObj.clientId || null,
          agree_to_terms: leadObj.agreeToTerms,
          submitted_at: leadObj.submittedAt
        };

        let response = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas`, {
          method: 'POST',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(primaryBody)
        });

        // If it fails with a 400 Bad Request, table may not have status, client_id or agree_to_terms columns yet.
        // Fallback to sending only the original columns.
        if (!response.ok && response.status === 400) {
          console.warn("Extended insert failed. Retrying with original fallback schema...");
          const fallbackBody = {
            id: cleanLeadId,
            name: leadObj.name,
            email: leadObj.email,
            whatsapp: leadObj.whatsapp,
            skin_type: leadObj.skinType,
            concern: leadObj.concern,
            fragrance_pref: leadObj.fragrancePref,
            observations: leadObj.observations,
            submitted_at: leadObj.submittedAt
          };

          response = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas`, {
            method: 'POST',
            headers: {
              'apikey': integrationConfig.supabaseAnonKey,
              'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(fallbackBody)
          });
        }

        if (!response.ok) {
          const errMsg = await response.text();
          console.error("Erro ao sincronizar consulta/lead no Supabase:", errMsg);
          setSupabaseError(`Erro ao salvar diagnóstico no banco: ${errMsg}`);
        }
      } catch (err: any) {
        console.error("Erro ao sincronizar consulta/lead no Supabase:", err);
        setSupabaseError(`Falha de conexão ao enviar consulta: ${err.message || err}`);
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm("Apagar consulta deste lead?")) {
      const updated = leads.filter(l => l.id !== id);
      setLeads(updated);
      localStorage.setItem('saboaria_leads', JSON.stringify(updated));

      // Synchronize deletion with Supabase
      if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey && isUUID(id)) {
        try {
          const response = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
              'apikey': integrationConfig.supabaseAnonKey,
              'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`
            }
          });
          if (!response.ok) {
            const errMsg = await response.text();
            console.error("Erro ao deletar lead no Supabase:", errMsg);
          }
        } catch (err) {
          console.error("Falha ao comunicar exclusão com Supabase:", err);
        }
      }
    }
  };

  const handleToggleLeadStatus = async (id: string) => {
    const statuses: Array<'Pendente' | 'Respondido' | 'Em Produção'> = ['Pendente', 'Respondido', 'Em Produção'];
    let nextStatus: 'Pendente' | 'Respondido' | 'Em Produção' = 'Pendente';
    const updated = leads.map(l => {
      if (l.id === id) {
        const nextIndex = (statuses.indexOf(l.status) + 1) % statuses.length;
        nextStatus = statuses[nextIndex];
        return { ...l, status: nextStatus };
      }
      return l;
    });
    setLeads(updated);
    localStorage.setItem('saboaria_leads', JSON.stringify(updated));

    // Synchronize status change with Supabase
    if (supabaseUrlCleaned && integrationConfig.supabaseAnonKey && isUUID(id)) {
      try {
        // Try PATCHing status first
        const response = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            'apikey': integrationConfig.supabaseAnonKey,
            'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            status: nextStatus
          })
        });
        if (!response.ok) {
          const errMsg = await response.text();
          console.warn("Erro ao atualizar status do lead no Supabase. Isso pode indicar falta da coluna 'status' no seu banco de dados:", errMsg);
        }
      } catch (err) {
        console.error("Falha ao atualizar status do lead no Supabase:", err);
      }
    }
  };

  const handleSyncLeadsToSupabase = async () => {
    if (!supabaseUrlCleaned || !integrationConfig.supabaseAnonKey) {
      alert("Por favor, configure primeiro a URL e a Chave do Supabase no painel lateral de Conexão.");
      return;
    }
    
    setIsSyncingLeads(true);
    setSyncStatusMsg("Sincronizando todas as consultas locais com o Supabase...");
    setSupabaseError(null);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const leadObj of leads) {
        // Prepare lead data matching Supabase structure
        const primaryBody = {
          id: leadObj.id,
          name: leadObj.name,
          email: leadObj.email,
          whatsapp: leadObj.whatsapp,
          skin_type: leadObj.skinType,
          concern: leadObj.concern,
          fragrance_pref: leadObj.fragrancePref,
          observations: leadObj.observations,
          status: leadObj.status,
          client_id: leadObj.clientId || null,
          agree_to_terms: leadObj.agreeToTerms !== false,
          submitted_at: leadObj.submittedAt
        };

        try {
          let response = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas`, {
            method: 'POST',
            headers: {
              'apikey': integrationConfig.supabaseAnonKey,
              'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates' // UPSERT implícito no PostgREST
            },
            body: JSON.stringify(primaryBody)
          });

          // Fallback if schema doesn't fit standard POST perfectly
          if (!response.ok && response.status === 400) {
            const fallbackBody = {
              id: leadObj.id,
              name: leadObj.name,
              email: leadObj.email,
              whatsapp: leadObj.whatsapp,
              skin_type: leadObj.skinType,
              concern: leadObj.concern,
              fragrance_pref: leadObj.fragrancePref,
              observations: leadObj.observations,
              submitted_at: leadObj.submittedAt
            };

            response = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas`, {
              method: 'POST',
              headers: {
                'apikey': integrationConfig.supabaseAnonKey,
                'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify(fallbackBody)
            });
          }

          if (response.ok) {
            successCount++;
          } else {
            const errText = await response.text();
            console.error(`Erro ao sincronizar consulta individual: ${errText}`);
            failCount++;
          }
        } catch (individualErr) {
          console.error("Falha ao se conectar para sincronizar consulta:", individualErr);
          failCount++;
        }
      }

      // Fetch fresh data from Supabase to merge
      const leadRes = await fetch(`${supabaseUrlCleaned}/rest/v1/clientes_consultas?select=*&order=submitted_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': integrationConfig.supabaseAnonKey,
          'Authorization': `Bearer ${integrationConfig.supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (leadRes.ok) {
        const supabaseLeads = await leadRes.json();
        if (supabaseLeads) {
          const mappedLeads: SavedLead[] = supabaseLeads.map((l: any) => ({
            id: l.id,
            name: l.name,
            email: l.email,
            whatsapp: l.whatsapp,
            skinType: l.skin_type || 'normal',
            concern: l.concern || 'geral',
            fragrancePref: l.fragrance_pref || 'herbal',
            observations: l.observations || '',
            submittedAt: l.submitted_at || new Date().toISOString(),
            status: l.status || 'Pendente',
            clientId: l.client_id,
            agreeToTerms: l.agree_to_terms !== false
          }));
          setLeads(mappedLeads);
          localStorage.setItem('saboaria_leads', JSON.stringify(mappedLeads));
        }
      }

      if (failCount === 0) {
        setSyncStatusMsg(`Sincronização completa realizada! ${successCount} diagnósticos integrados com o Supabase.`);
      } else {
        setSyncStatusMsg(`Sincronização parcial realizada: ${successCount} integrados, ${failCount} falhas. Rode o script SQL do guia no seu Supabase para criar as novas colunas.`);
      }
      setTimeout(() => setSyncStatusMsg(null), 6000);
    } catch (generalErr: any) {
      console.error("Erro geral na sincronização manual com o Supabase:", generalErr);
      setSupabaseError(`Erro ao migrar dados: ${generalErr.message || generalErr}`);
    } finally {
      setIsSyncingLeads(false);
    }
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
          <div className={`text-white text-xs py-2.5 px-4 text-center font-semibold flex flex-col md:flex-row items-center justify-center gap-2 shadow-sm transition-all ${supabaseError ? 'bg-amber-600 border-b border-amber-500 animate-pulse' : 'bg-[#2d5a27]'}`}>
            <div className="flex items-center gap-1.5 justify-center flex-wrap">
              <Database className="h-4 w-4 shrink-0" />
              <span>
                {supabaseError ? (
                  <span className="font-bold">Aviso de Sincronização Supabase: </span>
                ) : isSupabaseLoading ? (
                  <span>Sincronizando com o Supabase...</span>
                ) : (
                  <span>Integração Ativa! Catálogo e Clientes sincronizados ao vivo no seu Banco de Dados.</span>
                )}
              </span>
              {supabaseError && (
                <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded font-mono max-w-sm sm:max-w-md md:max-w-xl truncate inline-block">
                  {supabaseError}
                </span>
              )}
            </div>
            {supabaseError && (
              <button 
                onClick={() => {
                  setSupabaseError(null);
                  setShowGuide(true);
                  setTimeout(() => {
                    document.getElementById('guia')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
                className="text-[10px] bg-white text-amber-950 px-2.5 py-1 rounded-full font-bold hover:bg-amber-50 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1 shrink-0"
              >
                Como configurar tabelas/schema?
              </button>
            )}
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
          mercadoLivreUrl={integrationConfig.mercadoLivreUrl}
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
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-sage-100 pb-4 gap-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-sage-950 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-sage-600" />
                  <span>Painel do Administrador: Consultas Recebidas</span>
                </h3>
                <p className="text-xs text-sage-500 font-light">Gerencie e sincronize diagnósticos em tempo real integrados com o seu banco de dados Supabase e n8n automações.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Supabase connection status indicator */}
                <div className={`text-[10px] px-3 py-1 rounded-md border font-sans font-semibold flex items-center gap-1.5 ${
                  supabaseUrlCleaned && integrationConfig.supabaseAnonKey
                    ? supabaseError
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    supabaseUrlCleaned && integrationConfig.supabaseAnonKey
                      ? supabaseError
                        ? 'bg-rose-500'
                        : 'bg-emerald-500 animate-pulse'
                      : 'bg-amber-500'
                  }`} />
                  <span>
                    {supabaseUrlCleaned && integrationConfig.supabaseAnonKey
                      ? supabaseError
                        ? 'Erro no Supabase'
                        : 'Conectado no Supabase'
                      : 'Modo Local (Banco Desconectado)'}
                  </span>
                </div>

                {/* Database Sync action button */}
                <button
                  type="button"
                  onClick={handleSyncLeadsToSupabase}
                  disabled={isSyncingLeads}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border shadow-xs flex items-center gap-1.5 cursor-pointer select-none transition-all ${
                    isSyncingLeads 
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                      : 'bg-[#2d5a27]/10 hover:bg-[#2d5a27]/20 text-[#2d5a27] border-[#2d5a27]/30'
                  }`}
                  title="Sincronizar formulários locais não enviados com o Supabase"
                >
                  <Database className={`h-3.5 w-3.5 ${isSyncingLeads ? 'animate-spin' : ''}`} />
                  <span>{isSyncingLeads ? "Sincronizando..." : "Sincronizar Banco de Dados 🔄"}</span>
                </button>

                <div className="text-[10px] bg-sage-50 text-sage-600 px-3 py-1.5 rounded-lg border border-sage-100 font-mono">
                  Total: {leads.length} leads
                </div>
              </div>
            </div>

            {/* Sync feedback panel */}
            {(syncStatusMsg || supabaseError) && (
              <div className={`mt-4 p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-2 border ${
                supabaseError 
                  ? 'bg-rose-50 text-rose-800 border-rose-200' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-250'
              }`}>
                <span className="font-bold shrink-0">{supabaseError ? "⚠️ Erro de Conexão:" : "✓ Informação:"}</span>
                <span className="font-light">{supabaseError || syncStatusMsg}</span>
              </div>
            )}

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
