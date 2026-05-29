import { Database, Share2, ArrowRight, ShieldAlert, Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function SupabaseGuide() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sqlCode = `-- 1. CRIAÇÃO DA TABELA DE PRODUTOS E ESTOQUE
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  weight INT DEFAULT 110,
  category VARCHAR(100),
  ingredients TEXT[],
  benefits TEXT[],
  image TEXT,
  stock INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CRIAÇÃO DA TABELA DE LEADS (CONSULTAS DE PELE)
CREATE TABLE IF NOT EXISTS clientes_consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  skin_type VARCHAR(50),
  concern VARCHAR(100),
  fragrance_pref VARCHAR(100),
  observations TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  client_id UUID,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ATIVAÇÃO DE RLS (ROW LEVEL SECURITY)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_consultas ENABLE ROW LEVEL SECURITY;

-- 4. REMOVE POLÍTICAS ANTERIORES PARA EVITAR ERROS DE DUPLICIDADE
DROP POLICY IF EXISTS "Permitir leitura pública de produtos" ON produtos;
DROP POLICY IF EXISTS "Permitir gestão total de produtos para chaves autorizadas" ON produtos;
DROP POLICY IF EXISTS "Permitir envio público de consultas de pele" ON clientes_consultas;
DROP POLICY IF EXISTS "Permitir visualização e gestão de consultas de pele" ON clientes_consultas;

-- 5. POLÍTICAS DE ACESSO (POLICIES) PARA PRODUTOS
-- Permite leitura de produtos por qualquer visitante do site
CREATE POLICY "Permitir leitura pública de produtos" 
ON produtos FOR SELECT 
USING (true);

-- Permite inserção, edição e exclusão de produtos
CREATE POLICY "Permitir gestão total de produtos para chaves autorizadas" 
ON produtos FOR ALL 
USING (true) 
WITH CHECK (true);

-- 6. POLÍTICAS DE ACESSO (POLICIES) PARA CLIENTES E CONSULTAS
-- Permite que os clientes enviem dados do formulário de diagnóstico (público)
CREATE POLICY "Permitir envio público de consultas de pele" 
ON clientes_consultas FOR INSERT 
WITH CHECK (true);

-- Permite visualizar e gerenciar os leads registrados
CREATE POLICY "Permitir visualização e gestão de consultas de pele" 
ON clientes_consultas FOR ALL 
USING (true) 
WITH CHECK (true);

-- 7. EXEMPLO DE INSERT INICIAL (OPCIONAL)
INSERT INTO produtos (id, name, description, price, weight, category, ingredients, benefits, image, stock)
VALUES (
  '10a26e84-18ca-4dbb-80df-269fa5bee6a1',
  'Canela & Amêndoas (Esfoliante)',
  'Proporciona uma esfoliação suave e revigorante para peles opacas.',
  24.90,
  115,
  'Esfoliante Suave',
  ARRAY['Óleo Essencial de Canela', 'Óleo de Amêndoas Doces', 'Sementes de Damasco'],
  ARRAY['Esfoliação suave', 'Estimulante', 'Nutrição'],
  'https://images.unsplash.com/photo-1607006342461-9010df2327cf',
  12
) ON CONFLICT (id) DO NOTHING;`;

  const n8nWorkflowDesc = `{
  "meta": { "instanceId": "random_id" },
  "nodes": [
    {
      "parameters": { "path": "webhook-saboaria", "options": {} },
      "id": "node-web", "name": "Webhook n8n", "type": "n8n-nodes-base.webhook"
    },
    {
      "parameters": {
        "operation": "upsert",
        "table": "clientes_consultas",
        "columns": ["name", "email", "whatsapp", "skin_type", "concern", "observations"]
      },
      "id": "node-supa", "name": "Supabase node", "type": "n8n-nodes-base.supabase"
    },
    {
      "parameters": {
        "spreadsheetId": "YOUR_SHEETS_SPREADSHEET_ID",
        "sheetName": "Pele_Leads",
        "columns": ["Nome", "WhatsApp", "Email", "Tipo de Pele", "Preocupação"]
      },
      "id": "node-sheet", "name": "Google Sheets node", "type": "n8n-nodes-base.googleSheets"
    },
    {
      "parameters": {
        "phoneNumber": "={{ $json.body.whatsapp }}",
        "message": "Olá {{ $json.body.name }}! 🌱 Seu diagnóstico foi recebido de forma sustentável."
      },
      "id": "node-wa", "name": "WhatsApp Sender / Twilio", "type": "n8n-nodes-base.whatsapp"
    }
  ]
}`;

  return (
    <div id="guia" className="bg-white/45 backdrop-blur-xl text-gray-800 rounded-[32px] p-6 sm:p-10 max-w-5xl mx-auto shadow-2xl border border-white/60 my-20 relative overflow-hidden">
      
      {/* Decorative Blur Background circles */}
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Block Title and subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200/60 pb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#2d5a27]/10 text-[#2d5a27] rounded-2xl border border-[#2d5a27]/20">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#1a3317] tracking-tight">Arquitetura de Conexão: Supabase & n8n</h3>
            <p className="text-xs text-gray-500">Crie seu banco de dados, estoque manual e automatize envios no WhatsApp.</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2d5a27]/10 text-[#2d5a27] rounded-full text-xs font-bold border border-[#2d5a27]/20 self-start sm:self-center">
          <Share2 className="h-3.5 w-3.5" />
          <span>Foco em Praticidade</span>
        </div>
      </div>

      {/* Grid for Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 relative z-10">
        
        {/* Step 1 Supabase */}
        <div className="space-y-3">
          <div className="h-8 w-8 bg-[#2d5a27] text-white font-bold text-xs rounded-full flex items-center justify-center shadow-sm">
            01
          </div>
          <h4 className="font-display font-bold text-sm text-[#1a3317]">Banco de Dados Supabase</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Abra seu painel gratuito no Supabase, crie uma tabela chamada <code>produtos</code> e outra <code>clientes_consultas</code>. Utilize o editor SQL ao lado para criar o schema pré-formatado instantaneamente.
          </p>
          <div className="text-xs font-semibold text-[#2d5a27] flex items-center gap-1">
            <span>Integração de tabelas</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Step 2 n8n setup */}
        <div className="space-y-3">
          <div className="h-8 w-8 bg-[#2d5a27] text-white font-bold text-xs rounded-full flex items-center justify-center shadow-sm">
            02
          </div>
          <h4 className="font-display font-bold text-sm text-[#1a3317]">Webhook n8n Automator</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Crie um nó do tipo <b>Webhook</b> no n8n. Copie o URL de webhook gerado e insira no nosso componente de teste de conexão no cabeçalho do catálogo. O n8n receberá todos os payloads em tempo real.
          </p>
          <div className="text-xs font-semibold text-[#2d5a27] flex items-center gap-1">
            <span>Fila WhatsApp Ativa</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Step 3 Sheets & Whatsapp */}
        <div className="space-y-3">
          <div className="h-8 w-8 bg-[#2d5a27] text-white font-bold text-xs rounded-full flex items-center justify-center shadow-sm">
            03
          </div>
          <h4 className="font-display font-bold text-sm text-[#1a3317]">Google Sheets & Confirmação</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Conecte o fluxo n8n ao nó do Google Sheets para registrar os leads automaticamente e utilize uma API de WhatsApp externa para enviar cupons de desconto aos clientes sempre que um diagnóstico for concluído!
          </p>
          <div className="text-xs font-semibold text-[#2d5a27] flex items-center gap-1">
            <span>Disparos Automatizados</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

      </div>

      {/* SQL Script Display */}
      <div className="mt-10 pt-10 border-t border-gray-200/60 space-y-4 relative z-10">
        
        <div className="flex items-center justify-between">
          <h4 className="font-display font-black text-xs text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            Script SQL (Rodar no SQL Editor do Supabase)
          </h4>

          <button
            onClick={() => copyToClipboard(sqlCode, 'sql')}
            className="text-[11px] text-gray-700 hover:text-gray-950 bg-white/70 hover:bg-white px-3.5 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            {copiedId === 'sql' ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#2d5a27]" />
                <span className="font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gray-500" />
                <span>Copiar SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#132611]/95 p-4.5 rounded-2xl border border-white/10 overflow-x-auto max-h-60 shadow-inner">
          <pre className="text-[11px] text-emerald-100/90 font-mono leading-relaxed bg-transparent">{sqlCode}</pre>
        </div>

      </div>

      {/* n8n config JSON overview */}
      <div className="mt-8 space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-black text-xs text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ffe600] rounded-full" />
            JSON de Importação do Workflow n8n
          </h4>

          <button
            onClick={() => copyToClipboard(n8nWorkflowDesc, 'n8n')}
            className="text-[11px] text-gray-700 hover:text-gray-950 bg-white/70 hover:bg-white px-3.5 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            {copiedId === 'n8n' ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#2d5a27]" />
                <span className="font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gray-500" />
                <span>Copiar JSON</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#132611]/95 p-4.5 rounded-2xl border border-white/10 overflow-x-auto max-h-48 shadow-inner">
          <pre className="text-[11px] text-[#b3c7b5] font-mono leading-relaxed bg-transparent">{n8nWorkflowDesc}</pre>
        </div>
      </div>

      {/* Alert Warning Notes */}
      <div className="mt-8 p-4.5 bg-[#ffe600]/10 rounded-2xl border border-[#ffe600]/30 flex items-start gap-3 relative z-10">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-700 leading-relaxed font-light">
          <strong className="text-amber-800 font-bold">Nota de Segurança:</strong> Ao realizar o deploy na <b>Vercel</b>, alimente as credenciais secretas do Supabase utilizando suas variáveis de ambiente no painel privado da Vercel. Não as deixe expostas no código público em hipótese alguma.
        </p>
      </div>

    </div>
  );
}
