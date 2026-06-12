export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Message {
  id: string;
  sender: 'client' | 'agency' | 'system';
  text: string;
  timestamp: string;
  type?: 'text' | 'image' | 'file' | 'proposal' | 'briefing';
  fileUrl?: string;
  fileName?: string;
  proposalValue?: number;
  proposalDetails?: string[];
}

export interface BriefingData {
  objective: string;
  targetAudience: string;
  services: string[];
  differentials: string[];
  cores: string[]; // Cores sugeridas
  fontes: string[]; // Fontes sugeridas
  estilo: string; // Ex: Moderno, Esportivo, Minimalista
  secoes?: string[]; // Para Sites
  features?: string[]; // Para Aplicativos
  telas?: string[]; // Para Aplicativos
  monetizacao?: string; // Para Aplicativos
  login?: string; // Para Aplicativos
  dashboard?: string; // Para Aplicativos
  notificacoes?: string; // Para Aplicativos
  integracoes?: string; // Para Aplicativos
  logoIcon: string; // Emoji ou ícone de representação
  images: string[]; // Gradientes/Cores simulando fotos
}

export interface Client {
  id: string;
  name: string; // Nome do contato
  companyName: string; // Nome da empresa
  nicho: string; // Nicho da empresa
  avatarColor: string; // Cor do avatar circular (ex: tailwind bg color)
  avatarEmoji: string; // Emoji representativo
  status: 'aguardando' | 'negociando' | 'produzindo' | 'concluido';
  phone: string;
  city: string;
  instagram: string;
  siteAtual: string;
  projectType: 'site' | 'app' | null;
  proposalSent: boolean;
  proposalPrice: number;
  step: 'greeting' | 'waiting_choice' | 'proposal_pending' | 'proposal_accepted' | 'briefing_provided' | 'in_production' | 'finalized';
  chatHistory: Message[];
  progress: number; // 0 - 100
  linkOrApk?: string;
  deliveredAt?: string;
  briefing: BriefingData;
}

export interface GameState {
  clients: Client[];
  currentClientId: string | null;
  totalXp: number;
  level: number;
  activeTab: 'simulator' | 'dashboard';
  difficulty: Difficulty;
  theme: 'light' | 'dark';
}
