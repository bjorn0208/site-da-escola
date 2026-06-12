import { Client, Message, BriefingData, Difficulty } from '../types';

const CONTACT_NAMES = [
  'Carlos Eduardo', 'Mariana Rocha', 'Rodrigo Silva', 'Juliana Lima', 
  'Thiago Souza', 'Patrícia Neves', 'Felipe Santos', 'Amanda Costa', 
  'Gustavo Borges', 'Beatriz Castilho', 'Leonardo Almeida', 'Gabriela Ferraz',
  'Bruno Nogueira', 'Sabrina Machado', 'Matheus Oliveira', 'Larissa Mendes'
];

const NICHES_TEMPLATES = [
  {
    nicho: 'Barbearia',
    companies: ['Confraria do Bigode', 'Navalha de Ouro', 'Dom Pedro Barbearia', 'Corte & Pro'],
    avatarEmoji: '💈',
    avatarColor: 'bg-amber-700 text-amber-50',
    colors: ['#78350F', '#1C1917', '#F5E0C3'],
    fontes: ['Playfair Display', 'Inter'],
    estilo: 'Vintage, Clássico e Elegante',
    secoes: ['Início', 'História', 'Nossos Barbeiros', 'Tabela de Preços', 'Localização'],
    features: ['Agendamento Online de Corte', 'Cartão Fidelidade Digital', 'Lembrete automático p/ WhatsApp', 'Galeria de Cortes / Estilos'],
    telas: ['Home Clássica', 'Escolha de Serviço e Barbeiro', 'Calendário de Reservas', 'Código de Fidelidade', 'Perfil do Usuário'],
    objective: 'Captar clientes residenciais e facilitar o agendamento de horários sem telefonemas.',
    targetAudience: 'Homens de 18 a 55 anos que prezam por atendimento de alta qualidade e rapidez.',
    services: ['Corte de Cabelo', 'Barba Completa', 'Tratamento Hot-Towel', 'Dia do Noivo'],
    differentials: ['Cerveja artesanal grátis', 'Toalha quente com óleos essenciais', 'Barbeiros premiados internacionalmente']
  },
  {
    nicho: 'Academia',
    companies: ['Titan Fitness', 'Iron Club', 'Aço & Força', 'Vibe Ritmo Gym'],
    avatarEmoji: '🏋️‍♂️',
    avatarColor: 'bg-red-600 text-red-50',
    colors: ['#DC2626', '#09090B', '#E5E7EB'],
    fontes: ['Montserrat', 'Poppins'],
    estilo: 'Moderno, Esportivo e Motivador',
    secoes: ['Início', 'Modalidades', 'Preços e Planos', 'Nossos Professores', 'Diferenciais'],
    features: ['Ficha de Treino Interativa', 'Leitor QR Code de Presença', 'Acompanhamento de Cargas', 'Vídeos de Demonstração de Exercícios'],
    telas: ['Login Integrado', 'Ficha do Dia (Foco)', 'Estatísticas de Evolução', 'Aulas de Grupo e Agenda', 'Minha Conta / Mensalidade'],
    objective: 'Atrair interessados em planos anuais e reter alunos com fichas digitais de fácil acesso.',
    targetAudience: 'Estudantes, trabalhadores locais e atletas que buscam saúde e alta performance.',
    services: ['Musculação', 'Spinning', 'Crossfit', 'Funcional', 'Nutrição Esportiva'],
    differentials: ['Aberto 24 Horas', 'Personal trainer incluso no plano premium', 'Avaliação de bioimpedância gratuita']
  },
  {
    nicho: 'Restaurante',
    companies: ['Bistrô Veneza', 'Sabor & Brasa', 'Mangiare Pasta', 'Manjericão Pizza'],
    avatarEmoji: '🍕',
    avatarColor: 'bg-orange-600 text-orange-50',
    colors: ['#EA580C', '#0F172A', '#F97316'],
    fontes: ['Lora', 'Inter'],
    estilo: 'Acolhedor, Rústico e Sofisticado',
    secoes: ['Início', 'Nosso Cardápio', 'Por trás do Fogão', 'Reservas de Mesa', 'Fale Conosco'],
    features: ['Cardápio Interativo com Fotos', 'Sistema de Delivery Sem Taxas', 'Acúmulo de Pontos Cashback', 'Reserva Automática de Mesas'],
    telas: ['Home / Banner rotativo', 'Cardápio Detalhado por Categorias', 'Carrinho de Compras', 'Status da Cozinha / Entrega', 'Módulo de Reservas'],
    objective: 'Aumentar o volume de pedidos diretos para contornar altas taxas de aplicativos terceiros.',
    targetAudience: 'Casais, famílias e amantes da boa gastronomia na região metropolitana.',
    services: ['Jantares Especiais', 'Eventos Corporativos', 'Delivery Rápido', 'Carta de Vinhos Autêntica'],
    differentials: ['Ingredientes 100% orgânicos', 'Chef graduado na Itália', 'Massa de fermentação natural (48 horas)']
  },
  {
    nicho: 'Dentista',
    companies: ['Clínica Sorriso Clean', 'Arte & Odonto', 'PrevDent Pró', 'Dental Infinity'],
    avatarEmoji: '🦷',
    avatarColor: 'bg-cyan-600 text-cyan-50',
    colors: ['#0891B2', '#F0F9FF', '#1E40AF'],
    fontes: ['Outfit', 'Inter'],
    estilo: 'Clean, Tecnológico e Humanizado',
    secoes: ['Home', 'Procedimentos', 'Tecnologias Utilizadas', 'Equipe Médica', 'Agende seu Sorriso'],
    features: ['Agendamento de Avaliação', 'Prontuário com imagens do tratamento', 'Central de Dúvidas Pós-Procedimento', 'Lembretes de Revisão anual'],
    telas: ['Painel do Paciente', 'Agendador de Consultas', 'Histórico Clínico e Radiografias', 'Cuidados Pós-Operatório', 'Fale com a Recepção'],
    objective: 'Transmitir segurança técnica e clínica para aumentar a captação de implantes e lentes.',
    targetAudience: 'Famílias locais e profissionais interessados em estética dental premium.',
    services: ['Lentes de Contato Dental', 'Implantes Guiados por Computador', 'Harmonização Orofacial', 'Odontopediatria'],
    differentials: ['Equipamento de anestesia sem agulha', 'Scanner 3D para menor tempo de espera', 'Ambiente com Musicoterapia relaxante']
  },
  {
    nicho: 'Advogado',
    companies: ['Borges & Associados', 'Vieira & Santos Advocacia', 'Direito Contemporâneo', 'Advocacia de Elite'],
    avatarEmoji: '⚖️',
    avatarColor: 'bg-slate-800 text-slate-100',
    colors: ['#1E3A8A', '#B45309', '#0F172A'],
    fontes: ['Cinzel', 'Montserrat'],
    estilo: 'Corporativo, Solene e Rigoroso',
    secoes: ['Início', 'Áreas de Prática', 'Nosso Histórico', 'Artigos de Opinião', 'Agendar Reunião'],
    features: ['Área do Cliente com Processos', 'Envio Seguro de Documentos em PDF', 'Calculadora de Tempo de Aposentadoria', 'Chat Privativo Criptografado'],
    telas: ['Home Notarial', 'Consulta de Processos', 'Repositório de Arquivos', 'Faturamento / Honorários', 'Agendador de Chamadas'],
    objective: 'Posicionamento de autoridade no nicho imobiliário, corporativo e sucessório para prospectar empresas.',
    targetAudience: 'Proprietários de empresas, gestores hospitalares e herdeiros em partilhas.',
    services: ['Assessoria Tributária Preventiva', 'Defesa em Litígios Concorrenciais', 'Blindagem Patrimonial', 'Planejamento Sucessório'],
    differentials: ['Atuação nacional com alta disponibilidade', 'Metodologia preventiva para fugir de tribunais', 'Segurança total de dados LGPD']
  },
  {
    nicho: 'Imobiliária',
    companies: ['Vanguard Imóveis', 'Metrópole Brokers', 'Golden Gate Lar', 'Prime Select Houses'],
    avatarEmoji: '🏢',
    avatarColor: 'bg-emerald-700 text-emerald-50',
    colors: ['#047857', '#064E3B', '#F0FDF4'],
    fontes: ['Outfit', 'Poppins'],
    estilo: 'Premium, Elegante e Intuitivo',
    secoes: ['Destaques', 'Comprar Imóvel', 'Anunciar Imóvel', 'Sobre os Corretores', 'Fale Conosco'],
    features: ['Busca em Mapa Integrada', 'Filtro por Atributos Avançados', 'Agendamento de Visitas Direto', 'Tour Virtual 360 Graus'],
    telas: ['Home com Busca', 'Catálogo de Imóveis', 'Página do Imóvel Detalhada', 'Visitas Agendadas', 'Simulador de Crédito Bancário'],
    objective: 'Gerar leads qualificados de compradores focados em alto padrão e diminuir tempo de vacância de imóveis.',
    targetAudience: 'Famílias com renda superior, investidores imobiliários e estrangeiros.',
    services: ['Intermediação de Compra e Venda', 'Administração de Aluguel Garantido', 'Avaliação Profissional de Imóveis', 'Lançamentos Exclusivos'],
    differentials: ['Fotos e vídeos de drone em alta definição', 'Assessoria jurídica própria inclusa', 'Garantia total de pagamento de aluguel']
  },
  {
    nicho: 'Oficina Mecânica',
    companies: ['Performance Auto-Stop', 'Motor Express Prime', 'Oficina Premium BH', 'Full-Throttle Garage'],
    avatarEmoji: '🚗',
    avatarColor: 'bg-zinc-800 text-yellow-400',
    colors: ['#EA580C', '#1E293B', '#F1F5F9'],
    fontes: ['Space Grotesk', 'Fira Code'],
    estilo: 'Industrial, Rápido e Técnico',
    secoes: ['Home', 'Nossos Serviços', 'Tecnologia de Diagnóstico', 'Agendamento Rápido', 'Contato'],
    features: ['Prontuário Digital do Veículo', 'Orçamento Pré-Aprovado por Foto', 'Linha do Tempo do Reparo', 'Lembrete automático de pastilha/óleo'],
    telas: ['Meus Carros cadastrados', 'Linha de Produção do Reparo', 'Aba de Orçamentos detalhada', 'Solicitar Guincho 24h', 'Histórico de Peças'],
    objective: 'Eliminar a desconfiança de clientes oferecendo total transparência através de fotos do motor no app/site.',
    targetAudience: 'Proprietários de veículos alemães e importados de média e alta gama.',
    services: ['Injeção Eletrônica Avançada', 'Manutenção Preventiva de Câmbio', 'Alinhamento 3D Rígido', 'Troca Assistida de Fluidos'],
    differentials: ['Visualização em tempo real do mecânico via câmera', 'Garantia de 1 ano em todas as peças', 'Carro reserva gratuito para reparos longos']
  },
  {
    nicho: 'Clínica Estética',
    companies: ['Pelle & Harmony Estética', 'Silhueta Clinic', 'Bella Face Studio', 'Estética Renew'],
    avatarEmoji: '✨',
    avatarColor: 'bg-pink-700 text-pink-50',
    colors: ['#BE185D', '#9D174D', '#FFF1F2'],
    fontes: ['Cormorant Garamond', 'Inter'],
    estilo: 'Luxuoso, Limpo, Aromático e Calmo',
    secoes: ['Home', 'Tratamentos Corporais', 'Tratamentos Faciais', 'Antes e Depois', 'Agendar Avaliação'],
    features: ['Histórico de Sessões Realizadas', 'Simulador de Resultados por IA', 'Assinatura Mensal de Procedimentos', 'Dicas Personalizadas de SkinCare'],
    telas: ['Home Luxo', 'Catálogo de Fichas e Cuidados', 'Minhas Compras / Sessões', 'Falar com Especialistas', 'Configurações de Perfil'],
    objective: 'Aumentar a venda recorrente de pacotes e fidelizar pacientes para peelings e botox.',
    targetAudience: 'Mulheres e homens de 25 a 60 anos com foco em rejuvenescimento e autocuidado.',
    services: ['Botox e Preenchimento', 'Harmonização Glútea', 'Lipo de Papada', 'Tratamento de Melasma'],
    differentials: ['Especialistas certificados em Harvard', 'Injeções com anestesia local premium', 'Cabines de atendimento privativas e silenciosas']
  },
  {
    nicho: 'Hotel',
    companies: ['Bella Vista Resort', 'Solar da Lagoa Eco-Hotel', 'Vila Suíça Boutique', 'Grand Palace Hotel'],
    avatarEmoji: '🏨',
    avatarColor: 'bg-teal-700 text-teal-50',
    colors: ['#0F766E', '#115E59', '#F0FDFA'],
    fontes: ['Playfair Display', 'Poppins'],
    estilo: 'Confortável, Aconchegante e Grandioso',
    secoes: ['Acomodações', 'Lazer & Piscinas', 'Alta Gastronomia', 'Vantagens Exclusivas', 'Reservar Agora'],
    features: ['Check-in 100% Digital', 'Chave Digital (Abertura Bluetooth)', 'Serviço de Quarto com Pedidos direct', 'Chat direto com Concierge de Turismo'],
    telas: ['Status da Minha Estadia', 'Cardápio / Pedir no Quarto', 'Reservar Massagens ou Spa', 'Guia de Atrações Próximas', 'Check-out Express'],
    objective: 'Aumentar as reservas diretas, diminuindo a dependência de plataformas como Booking.com (comissões de 20%).',
    targetAudience: 'Famílias de férias e executivos que viajam frequentemente.',
    services: ['Experiência Gastronômica Completa', 'Translados Executivos', 'Spa Terapêutico e Massagem', 'Salões para Convenções'],
    differentials: ['Quartos automatizados por voz', 'Vista panorâmica infinita de tirar o fôlego', 'Frigobar gourmet totalmente livre na chegada']
  },
  {
    nicho: 'Loja de Roupas',
    companies: ['Zarah & Co', 'Hype Wear Street', 'Boutique Maria Flor', 'Inova Outlet'],
    avatarEmoji: '🛍️',
    avatarColor: 'bg-zinc-900 text-white',
    colors: ['#000000', '#27272A', '#F4F4F5'],
    fontes: ['Space Grotesk', 'Inter'],
    estilo: 'Fashion, Urbano e Minimalista',
    secoes: ['Coleção Atemporal', 'Mais Vendidas', 'Lookbook Outono', 'Sobre a Marca', 'Suporte Compre Já'],
    features: ['Carrinho de Compras Integrado', 'Provador de Medidas Vitais', 'Notificação de Drops Exclusivos', 'Histórico Exclusivo de Points'],
    telas: ['Home Vitrine', 'Categorias Inteligentes', 'Visualizar Produto no Corpo', 'Carrinho de Roupas e Checkout', 'Perfil do Cliente Vip'],
    objective: 'Criar uma experiência fluida de checkout para triplicar a conversão de vendas online vindas do Instagram.',
    targetAudience: 'Jovens adultos conectados que compram moda casual e acessórios premium.',
    services: ['Curadoria de Looks', 'Drops Semanais de Novos Modelos', 'Envio com Entrega expressa (até 2h)', 'Apoio de Personal Stylist'],
    differentials: ['Troca sem perguntas em até 30 dias', 'Embalagens 100% recicláveis e perfumadas', 'Looks exclusivos que não repetem lotes']
  },
  {
    nicho: 'Mercado',
    companies: ['Mercado Bom Preço', 'Hortifruti do Campo', 'Super Natural Market', 'Express Conveniência'],
    avatarEmoji: '🍏',
    avatarColor: 'bg-emerald-600 text-yellow-100',
    colors: ['#10B981', '#14532D', '#FEF08A'],
    fontes: ['Inter', 'Outfit'],
    estilo: 'Moderno, Vibrante e Funcional',
    secoes: ['Ofertas da Semana', 'Nossos Corredores', 'Assinatura Hortifruti', 'Receitas Práticas', 'Fale Conosco'],
    features: ['Lista de Compras Inteligente', 'Scanner de Código de Barras p/ Preços', 'Pagamento Rápido no App', 'Entrega Programada Flash'],
    telas: ['Início Ofertas', 'Carrinho de Mantimentos', 'Guia de Prateleiras (Mapa)', 'Meus Cupons de Desconto', 'Finalizar / Agendar Entrega'],
    objective: 'Atender pedidos locais de compras mensais e semanais com entregas organizadas no mesmo dia.',
    targetAudience: 'Donos de casa ocupados e moradores de condomínios residenciais.',
    services: ['Entrega em Domicílio', 'Seleção de Hortifruti Orgânico', 'Assinatura Mensal de Carnes', 'Padaria com hora marcada'],
    differentials: ['Hortifruti reposto 2 vezes ao dia', 'Entregas em caixas térmicas rígidas', 'Garantia de frescor dos vegetais ou dinheiro de volta']
  },
  {
    nicho: 'Construtora',
    companies: ['Concrete Engenharia', 'Aliança Construtora', 'MDF Incorporadora', 'Nexus Edificações'],
    avatarEmoji: '🏗️',
    avatarColor: 'bg-blue-800 text-blue-50',
    colors: ['#1E40AF', '#111827', '#F3F4F6'],
    fontes: ['Montserrat', 'Space Grotesk'],
    estilo: 'Sólido, Tecnológico e Seguro',
    secoes: ['Tradição Sólida', 'Empreendimentos Ativos', 'Portfólio Entregue', 'Sustentabilidade', 'Investidores'],
    features: ['Diário de Obra Ilustrado', 'Portal de Parcelas e Boletos', 'Chat direto com Engenheiro Chefe', 'Solicitação de Visita à Obra'],
    telas: ['Painel do Comprador', 'Evolução da Obra (Graficos %)', 'Central Financeira / Boletos', 'Fotos Detalhadas da Sua Unidade', 'Contratos Assinados'],
    objective: 'Dar maior visibilidade sobre o andamento das obras e reduzir chamados de suporte telefônico de clientes ansiosos.',
    targetAudience: 'Pessoas de classe média/alta comprando apartamento na planta ou investidores de ativos reais.',
    services: ['Construção Civil Residencial', 'Retrofitting de Casas de Época', 'Projetos Arquitetônicos de Engenharia', 'Consultoria de Loteamento Urbano'],
    differentials: ['Entrega antecipada contratual garantida', 'Acabamento executivo de altíssima qualidade', 'Estudo acústico de laje em todas as unidades']
  },
  {
    nicho: 'Transportadora',
    companies: ['Eixo Express Logística', 'Trans-Cargo Rápido', 'Rota Segura Brasil', 'Frete Certo Brasil'],
    avatarEmoji: '🚛',
    avatarColor: 'bg-cyan-800 text-slate-100',
    colors: ['#0369A1', '#0F172A', '#D1D5DB'],
    fontes: ['JetBrains Mono', 'Outfit'],
    estilo: 'Robusto, Preciso e Tecnológico',
    secoes: ['Início', 'Área de Cobertura', 'Nossa Frota', 'Cotação de frete veloz', 'Rastrear Mercadoria'],
    features: ['Rastreamento de Carga GPS em Tempo Real', 'Calculadora de Frete Rápido com Peso', 'Assinatura Digital de Entrega', 'Faturamento Agrupado Empresas'],
    telas: ['Home Rastrear', 'Nova Cotação Express', 'Meus Envios Ativos', 'Histórico de Notas Fiscais', 'Comprovantes de Recebimento'],
    objective: 'Simplificar a contratação de fretes fracionados para indústrias e distribuidoras locais.',
    targetAudience: 'Gestores de supply chain, donos de e-commerce e diretores de compras de indústrias.',
    services: ['Transporte de Carga Fracionada', 'Logística Reversa Integrada', 'Armazenagem Climatizada', 'Distribuição B2B Urbana'],
    differentials: ['Seguro contra roubo de carga total 100%', 'Frota equipada com telemetria avançada', 'Previsão de entrega cumprida em 99,6% das vezes']
  },
  {
    nicho: 'Escola',
    companies: ['Colégio Novo Horizonte', 'Escola Criativa Integração', 'Instituto Anglo-Ideal', 'Colégio Kids Evolution'],
    avatarEmoji: '🏫',
    avatarColor: 'bg-indigo-700 text-indigo-50',
    colors: ['#4338CA', '#EA580C', '#EFF6FF'],
    fontes: ['Quicksand', 'Inter'],
    estilo: 'Lúdico, Educativo, Amigável e Moderno',
    secoes: ['Nossa Filosofia', 'Níveis de Ensino', 'Infraestrutura Viva', 'Período Integral', 'Matrículas Abertas'],
    features: ['Agenda de Tarefas Diária', 'Boletim de Faltas e Notas Automatizado', 'Avisos da Direção Instantâneos', 'Cardápio Semanal da Cantina'],
    telas: ['Painel dos Pais', 'Módulo de Notas e Faltas', 'Atividades e Tarefas de Casa', 'Controle Financeiro / Mensalidade', 'Chat Direto com Tutor'],
    objective: 'Digitalizar a comunicação e aproximar pais e mães das atividades educativas da escola.',
    targetAudience: 'Pais e mães ocupados com filhos em idade escolar (2 a 15 anos).',
    services: ['Ensino Fundamental e Infantil', 'Atividades Extracurriculares (Robótica/Arte)', 'Tutoria Pedagógica', 'Oficinas Esportivas'],
    differentials: ['Abordagem integrada STEAM (Science/Tech/Eng/Art/Math)', 'Ensino bilíngue nativo diário', 'Monitoramento por portaria blindada']
  },
  {
    nicho: 'Pet Shop',
    companies: ['Pet & Carinho', 'Amigo Bicho Studio', 'Pet Palace Resort', 'Cão & Gato Boutique'],
    avatarEmoji: '🐱',
    avatarColor: 'bg-fuchsia-600 text-fuchsia-50',
    colors: ['#D946EF', '#1E293B', '#FDF2F8'],
    fontes: ['Quicksand', 'Poppins'],
    estilo: 'Alegre, Colorido, Carinhoso e Macio',
    secoes: ['Pet Shop Virtual', 'Estética (Banho & Tosa)', 'Veterinária Preventiva', 'Hospedagem & Creche', 'Depoimentos de Cães'],
    features: ['Agendamento Fácil Banho/Tosa/Vet', 'Histórico Médico Prontuário Vet', 'Webcam ao Vivo da Área de Tosa', 'Clube de Rações de Assinatura'],
    telas: ['Tela Inicial Pet', 'Meus Animais Cadastrados', 'Historico Vacinas e Doses', 'Agendar Banho e Tosa', 'Câmera ao vivo (Transmissão)'],
    objective: 'Facilitar a contratação e coleta de planos de banho e tosa recorrentes na semana.',
    targetAudience: 'Pais e mães de pets de todas as raças que residem em condomínios vizinhos.',
    services: ['Banho com Hidratação de Coco', 'Tosa Higiênica e de Raça', 'Consultas Veterinárias Especializadas', 'Táxi Pet Buscar/Levar'],
    differentials: ['Utilização de shampoos hipoalergênicos importados', 'Câmeras em todas as banheiras para checar o trato', 'Atendimento de emergência 24 horas']
  },
  {
    nicho: 'Influenciador',
    companies: ['Mendes Vlogs Tech', 'Julia Beauty Creative', 'Canal Gamer Máximo', 'Chef na Tela Oficial'],
    avatarEmoji: '🤳',
    avatarColor: 'bg-violet-600 text-violet-50',
    colors: ['#7C3AED', '#000000', '#F5F3FF'],
    fontes: ['Space Grotesk', 'Inter'],
    estilo: 'Moderno, Futurista, Cyberpunk e Influente',
    secoes: ['Quem Fala', 'Minhas Redes', 'Cupom de Marcas Parceiras', 'Nosso Mídia Kit', 'Contato Comercial'],
    features: ['Espaço Premium Membros VIP', 'Lançamento Antecipado de Vídeos', 'Sorteios e Prêmios semanais', 'Mentoria Coletiva por Zoom'],
    telas: ['Painel do Seguidor', 'Vídeos Exclusivos / Aulas', 'Meus Cupons de Desconto', 'Sorteios Ativos', 'Configurações de Conta'],
    objective: 'Centralizar parcerias comerciais mundiais e monetizar base de fãs fiéis com área fechada para assinantes.',
    targetAudience: 'Seguidores dedicados, marcas de consumo rápido e organizadores de eventos de tecnologia.',
    services: ['Publiposts e Campanhas Integradas', 'Presença Vip em Feiras e Desfiles', 'Lançamento de Infoprodutos', 'Mídia Kit Interativo'],
    differentials: ['Engajamento real superior à média do mercado', 'Produção audiovisual em cinema 4K', 'Público extremamente fiel e engajado']
  },
  {
    nicho: 'Corretor de Imóveis',
    companies: ['Ana Santos Imóveis Premium', 'Silva Consultoria Lar', 'Bruno Corretores Especialistas', 'Oliveira Private Broker'],
    avatarEmoji: '💼',
    avatarColor: 'bg-emerald-800 text-stone-50',
    colors: ['#065F46', '#1C1917', '#F0FDFA'],
    fontes: ['Montserrat', 'Inter'],
    estilo: 'Corporativo, Confiável e Altamente Focado',
    secoes: ['Tradição Imobiliária', 'Imóveis do Portfólio', 'Minhas Recomendações', 'Análises de Investimento', 'Fale Comigo no Whats'],
    features: ['Busca Rápida de Opções', 'Formulário Envie Seus Requisitos', 'Estudos de Viabilidade de Aluguel', 'Calculadora Juros de Financiamento'],
    telas: ['Home Portfólio', 'Imóvel Detalhado Premium', 'Agendar Visita Integrada', 'Minha Proposta de Financiamento', 'Dicas de Bairro'],
    objective: 'Apresentar lançamentos de altíssimo luxo corporativo e facilitar a captação direta sem taxas de imobiliárias tradicionais.',
    targetAudience: 'Investidores de imóveis de luxo e casais buscando a primeira moradia própria.',
    services: ['Compra e Venda de Imóveis Private', 'Regularização Notarial e Jurídica', 'Avaliação Técnica de Imóveis', 'Análise de Viabilidade Econômica'],
    differentials: ['Consultor exclusivo com 15 anos de mercado', 'Acesso a leilões fechados antes de irem a público', 'Fechamento de negócios em cartório digital']
  },
  {
    nicho: 'Empresa de Energia Solar',
    companies: ['Solaris Green Energy', 'EcoVolt Painéis Solares', 'Luz do Sol Energias', 'GigaVolt Solar'],
    avatarEmoji: '☀️',
    avatarColor: 'bg-yellow-600 text-yellow-950',
    colors: ['#EAB308', '#0F172A', '#FEF08A'],
    fontes: ['Outfit', 'Space Grotesk'],
    estilo: 'Sustentável, Tecnológico e Econômico',
    secoes: ['Por que Energia Solar?', 'Simulador de Economia', 'Nossos Projetos Instalados', 'Garantias e Placas', 'Fazer Orçamento Grátis'],
    features: ['Monitoramento de Geração Diária (kWh)', 'Painel Financeiro de Economia R$', 'Comparador Dinâmico de Contas', 'Abertura Online de Chamados Técnicos'],
    telas: ['Painel de Geração', 'Histórico de Contas e Geração', 'Simulador Solar Dinâmico', 'Configurar Inversor Rápido', 'Minhas Instalações'],
    objective: 'Aumentar a venda consultiva de painéis solares para empresas industriais, mostrando com números o Retorno sobre Investimento (ROI).',
    targetAudience: 'Empresários industriais, comércios de refrigeração e produtores agrícolas.',
    services: ['Desenho do Projeto Solar 3D', 'Instalação Ágil e Homologação na Concessionária', 'Monitoramento e Manutenção Preventiva Corretiva', 'Limpeza de Placas Periódica'],
    differentials: ['Garantia de eficiência das placas por 25 anos', 'Engenheiros próprios homologados e rápidos', 'Facilidade de financiamento em até 60x sem entrada']
  }
];

// Helper to generate Brazilian random phone format
const generatePhone = () => {
  const ddd = [11, 19, 21, 31, 51, 81][Math.floor(Math.random() * 6)];
  const body = Math.floor(100000000 + Math.random() * 900000000);
  return `(${ddd}) 9${body.toString().slice(0, 4)}-${body.toString().slice(4)}`;
};

// Helper to estimate random Instagram matching company
const generateInstagram = (companyName: string) => {
  const cleanName = companyName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]/g, '');
  return `@${cleanName}`;
};

const CITIES = [
  'Campinas/SP', 'São Paulo/SP', 'Rio de Janeiro/RJ', 'Belo Horizonte/MG',
  'Curitiba/PR', 'Florianópolis/SC', 'Salvador/BA', 'Recife/PE',
  'Fortaleza/CE', 'Brasília/DF', 'Porto Alegre/RS', 'Goiânia/GO'
];

export const generateWeeklyClients = (difficulty: Difficulty = 'medium'): Client[] => {
  // Shuffle niche templates
  const shuffledTemplates = [...NICHES_TEMPLATES].sort(() => 0.5 - Math.random());
  // Pick 10
  const selectedTemplates = shuffledTemplates.slice(0, 10);
  
  // Contacts
  const shuffledNames = [...CONTACT_NAMES].sort(() => 0.5 - Math.random());
  
  // Every client starts fresh as 'aguardando' (not started/waiting for budget)
  const statuses = selectedTemplates.map(() => 'aguardando' as Client['status']);

  return selectedTemplates.map((template, idx) => {
    const contactName = shuffledNames[idx % shuffledNames.length];
    const companyName = template.companies[Math.floor(Math.random() * template.companies.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const phone = generatePhone();
    const instagram = generateInstagram(companyName);
    const siteAtual = Math.random() > 0.5 ? `www.${instagram.slice(1)}.com.br (Desatualizado)` : 'Não possui site';
    const status = statuses[idx];

    let projectType: 'site' | 'app' | null = null;
    let proposalSent = false;
    let proposalPrice = 0;
    
    // Price adjustment based on difficulty
    const getPrice = (type: 'site' | 'app') => {
      if (type === 'site') return difficulty === 'easy' ? 400 : difficulty === 'medium' ? 500 : 700;
      return difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 1200 : 1600;
    };

    let step: Client['step'] = 'greeting';
    let progress = 0;
    let linkOrApk = '';
    let deliveredAt = '';

    if (status === 'negociando') {
      projectType = Math.random() > 0.5 ? 'site' : 'app';
      proposalSent = Math.random() > 0.4;
      proposalPrice = getPrice(projectType);
      step = proposalSent ? 'proposal_pending' : 'waiting_choice';
    } else if (status === 'produzindo') {
      projectType = Math.random() > 0.5 ? 'site' : 'app';
      proposalSent = true;
      proposalPrice = getPrice(projectType);
      step = 'in_production';
      progress = Math.floor(10 + Math.random() * 70); // 10% a 80%
    } else if (status === 'concluido') {
      projectType = Math.random() > 0.5 ? 'site' : 'app';
      proposalSent = true;
      proposalPrice = getPrice(projectType);
      step = 'finalized';
      progress = 100;
      linkOrApk = projectType === 'site' 
        ? `https://${instagram.slice(1)}.site`
        : `${instagram.slice(1)}_app.apk`;
      deliveredAt = 'Ontem';
    }

    // Build chat history matching status
    const chatHistory: Message[] = [];
    
    // Greeting is general
    chatHistory.push({
      id: `${idx}-msg1`,
      sender: 'client',
      text: 'Oi, gostaria de fazer um orçamento.',
      timestamp: '09:00',
      type: 'text'
    });

    if (status !== 'aguardando') {
      // Hello! What project do you need?
      chatHistory.push({
        id: `${idx}-msg2`,
        sender: 'agency',
        text: 'Olá! Qual serviço você precisa?',
        timestamp: '09:01',
        type: 'text'
      });

      // Chosen service response
      if (projectType === 'site') {
        chatHistory.push({
          id: `${idx}-msg3`,
          sender: 'client',
          text: `Preciso de um site para minha empresa de ${template.nicho}.`,
          timestamp: '09:02',
          type: 'text'
        });
      } else {
        chatHistory.push({
          id: `${idx}-msg3`,
          sender: 'client',
          text: 'Preciso de um aplicativo.',
          timestamp: '09:02',
          type: 'text'
        });
        chatHistory.push({
          id: `${idx}-msg3-q`,
          sender: 'agency',
          text: 'Entendi! E qual será a finalidade principal do seu aplicativo?',
          timestamp: '09:03',
          type: 'text'
        });
        chatHistory.push({
          id: `${idx}-msg3-a`,
          sender: 'client',
          text: `Será um aplicativo focado em ${template.features[0]}. Queremos facilitar a vida do cliente.`,
          timestamp: '09:04',
          type: 'text'
        });
      }

      if (proposalSent) {
        // Agency proposed
        chatHistory.push({
          id: `${idx}-msg4`,
          sender: 'agency',
          text: `Perfeito! Consigo desenvolver esse projeto em até 24 horas.\n\nInclui:\n✓ ${projectType === 'site' ? 'Site completo' : 'Aplicativo completo'}\n✓ ${projectType === 'site' ? 'Domínio incluso' : 'Código-fonte limpo'}\n✓ Hospedagem inicial inclusa\n✓ Versão responsiva de alta performance\n✓ Otimização de busca integrada\n\nValor: R$ ${proposalPrice}`,
          timestamp: '09:05',
          type: 'proposal',
          proposalValue: proposalPrice
        });

        if (status === 'produzindo' || status === 'concluido') {
          // Client accepted
          chatHistory.push({
            id: `${idx}-msg5`,
            sender: 'client',
            text: 'Perfeito, vamos fechar. Qual o próximo passo?',
            timestamp: '09:06',
            type: 'text'
          });

          // Briefing provisioned
          chatHistory.push({
            id: `${idx}-msg6`,
            sender: 'system',
            text: '💼 Briefing fornecido pelo cliente! Dados de produção atualizados no painel lateral.',
            timestamp: '09:07',
            type: 'text'
          });
        }
      }
    }

    const briefing: BriefingData = {
      objective: template.objective,
      targetAudience: template.targetAudience,
      services: template.services,
      differentials: template.differentials,
      cores: template.colors,
      fontes: template.fontes,
      estilo: template.estilo,
      secoes: projectType === 'app' ? undefined : template.secoes,
      features: projectType === 'site' ? undefined : template.features,
      telas: projectType === 'site' ? undefined : template.telas,
      monetizacao: projectType === 'app' ? 'Mensalidade recorrente e vendas diretas' : undefined,
      login: projectType === 'app' ? 'E-mail, Google e Apple ID' : undefined,
      dashboard: projectType === 'app' ? 'Painel de controle com faturamento e status em tempo real' : undefined,
      notificacoes: projectType === 'app' ? 'Push notifications semanais de status' : undefined,
      integracoes: projectType === 'app' ? 'Gateway de Pagamentos, API Correios e Maps' : undefined,
      logoIcon: template.avatarEmoji,
      // Create interesting dynamic mockup palettes to display
      images: [
        `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1] || '#000000'})`,
        `linear-gradient(135deg, #1f2937, ${template.colors[0]})`,
        `linear-gradient(135deg, ${template.colors[1] || '#0f172a'}, #111827)`,
        `linear-gradient(135deg, #020617, ${template.colors[0]}88)`,
        `linear-gradient(135deg, #3f3f46, #18181b)`
      ]
    };

    return {
      id: `client-${idx + 1}`,
      name: contactName,
      companyName,
      nicho: template.nicho,
      avatarColor: template.avatarColor,
      avatarEmoji: template.avatarEmoji,
      status,
      phone,
      city,
      instagram,
      siteAtual,
      projectType,
      proposalSent,
      proposalPrice,
      step,
      chatHistory,
      progress,
      linkOrApk,
      deliveredAt,
      briefing
    };
  });
};
