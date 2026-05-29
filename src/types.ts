export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number; // in grams
  ingredients: string[];
  image: string;
  stock: number;
  category: string;
  benefits: string[];
  isCustomized?: boolean;
}

export interface SkincareFormInput {
  name: string;
  email: string;
  whatsapp: string;
  skinType: string;
  concern: string;
  fragrancePref: string;
  observations: string;
  agreeToTerms: boolean;
}

export interface IntegrationConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  n8nWebhookUrl: string;
  instagramUrl: string;
  mercadoLivreUrl: string;
}

export interface SavedLead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  skinType: string;
  concern: string;
  fragrancePref: string;
  observations: string;
  submittedAt: string;
  status: 'Pendente' | 'Respondido' | 'Em Produção';
  clientId?: string; // Links back to registered clients!
  agreeToTerms?: boolean; // Privacy policy consent
}

export interface UserClient {
  id: string;
  name: string;
  email: string;
  password?: string;
  whatsapp?: string;
  skinType?: string;
  concern?: string;
  fragrancePref?: string;
  observations?: string;
  createdAt?: string;
}

