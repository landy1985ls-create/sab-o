import { Product, IntegrationConfig, SavedLead } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Lavanda Francesa & Manteiga de Karité",
    description: "Toque extremamente macio e relaxante, ideal para peles sensíveis e secas. Acalma irritações e relaxa corpo e mente para um banho restaurador.",
    price: 24.90,
    weight: 110,
    ingredients: ["Flores de Lavanda desidratadas", "Óleo Essencial de Lavanda", "Manteiga de Karité pura", "Óleo de Coco saponificado", "Azeite de Oliva"],
    image: "https://images.unsplash.com/photo-1607006342461-9010df2327cf?auto=format&fit=crop&q=80&w=600",
    stock: 14,
    category: "Pele Sensível",
    benefits: ["Calma irritações e vermelhidões", "Altamente hidratante", "Relaxamento aromaterapêutico"]
  },
  {
    id: "prod-2",
    name: "Argila Verde & Alecrim",
    description: "Ideal para peles oleosas e acneicas. A argila verde absorve toxinas e equilibra o sebo facial, enquanto o alecrim tonifica e combate bactérias.",
    price: 22.90,
    weight: 115,
    ingredients: ["Argila Verde mineral", "Óleo Essencial de Alecrim", "Extrato de Aloe Vera orgânico", "Argila Branca", "Óleo de Palma sustentável"],
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600",
    stock: 18,
    category: "Pele Oleosa",
    benefits: ["Regulação do sebo e oleosidade", "Ação cicatrizante e bactericida", "Refrescância duradoura"]
  },
  {
    id: "prod-3",
    name: "Aveia Coloidal & Mel de Amêndoas",
    description: "Esfoliação extremamente suave com textura cremosa. Restaura a barreira protetora da pele estimulando a maciez e renovação celular natural.",
    price: 21.95,
    weight: 105,
    ingredients: ["Aveia Coloidal fina", "Mel Silvestre puro", "Óleo de Amêndoas Doces", "Manteiga de Cacau", "Glicerina Vegetal"],
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600",
    stock: 8,
    category: "Esfoliante Suave",
    benefits: ["Remoção gentil de células mortas", "Restauração da barreira cutânea", "Propriedades anti-inflamatórias"]
  },
  {
    id: "prod-4",
    name: "Copaíba & Capim-Limão Revigorante",
    description: "A sinergia perfeita entre o poderoso bálsamo curativo de Copaíba da Amazônia e a energia herbal terapêutica do Capim-Limão.",
    price: 23.50,
    weight: 110,
    ingredients: ["Óleo-resina de Copaíba Orgânica", "Óleo Essencial de Capim-Limão (Lemongrass)", "Argila Amarela", "Azeite de Oliva Extra Virgem"],
    image: "https://images.unsplash.com/photo-1628143431362-79366624a0d9?auto=format&fit=crop&q=80&w=600",
    stock: 5,
    category: "Pele Mista",
    benefits: ["Poderoso regenerador celular", "Auxilia no clareamento de manchas", "Mantém a pele firme e elástica"]
  }
];

export const INITIAL_CONFIG: IntegrationConfig = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  n8nWebhookUrl: "",
  instagramUrl: "https://instagram.com/saboaria.artesanal", // Default place
  mercadoLivreUrl: "https://lista.mercadolivre.com.br/saboaria-artesanal" // Affiliate list
};

export const INITIAL_LEADS: SavedLead[] = [
  {
    id: "lead-1",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    whatsapp: "+55 (11) 98765-4321",
    skinType: "sensivel",
    concern: "sensibilidade",
    fragrancePref: "floral",
    observations: "Sinto muita coceira no braço com sabonetes comerciais comuns.",
    submittedAt: "2026-05-28T10:15:00Z",
    status: 'Pendente'
  },
  {
    id: "lead-2",
    name: "Lucas Pereira",
    email: "lucas.p@email.com",
    whatsapp: "+55 (21) 99888-7766",
    skinType: "oleosa",
    concern: "acne",
    fragrancePref: "citrico",
    observations: "Buscando algo para regular a oleosidade do rosto.",
    submittedAt: "2026-05-27T16:45:00Z",
    status: 'Respondido'
  }
];

export const SKIN_TYPES = [
  { value: "oleosa", label: "Pele Oleosa / Com Acne", desc: "Brilho excessivo, poros abertos e propensão a cravos" },
  { value: "seca", label: "Pele Seca / Áspera", desc: "Repuxamento excessivo, descamação e falta de viço natural" },
  { value: "sensivel", label: "Pele Sensível / Com Rosácea", desc: "Fácil irritabilidade, coceira ou vermelhidão sob estímulo" },
  { value: "mista", label: "Pele Mista", desc: "Zona T oleosa (testa/nariz) e bochechas normais ou secas" },
  { value: "normal", label: "Pele Normal / Equilibrada", desc: "Textura lisa, nível de hidratação estável e poros finos" }
];

export const SKIN_CONCERNS = [
  { value: "acne", label: "Acnes, Cravos e Inflamações" },
  { value: "hidratacao", label: "Ressecamento e Coceira" },
  { value: "sensibilidade", label: "Sensibilidade e Alergias" },
  { value: "manchas", label: "Manchas e Tom Desigual" },
  { value: "linhas", label: "Sinais do tempo e Flacidez" }
];

export const FRAGRANCE_PREFS = [
  { value: "herbal", label: "Herbal (Refrescante como Alecrim e Capim-Limão)" },
  { value: "floral", label: "Floral (Calmante e Doce como Lavanda)" },
  { value: "citrico", label: "Cítrico (Revigorante como Laranja Doce e Bergamota)" },
  { value: "amadeirado", label: "Amadeirado & Especiarias (Aterrador como Cedro)" },
  { value: "sem-fragranca", label: "Sem Fragrância (Hipoalergênico puro)" }
];
