import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// health route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Gemini powered client response API
app.post("/api/chat", async (req, res) => {
  try {
    const { client, history, userMsg } = req.body;

    if (!client) {
      return res.status(400).json({ error: "Client data is required." });
    }

    // Format chat history for context
    const formattedHistory = history
      .map((msg: any) => `${msg.sender === 'agency' ? 'Agência' : 'Cliente'}: ${msg.text}`)
      .join("\n");

    const systemInstruction = `Você é o cliente humano real ${client.name}, fundador/proprietário da empresa "${client.companyName}" que atua no nicho de "${client.nicho}".
Você está simulando uma conversa via WhatsApp com uma agência de produtos digitais (Agência).

O objetivo é simular as decisões profissionais reais que você tomaria ao contratar um serviço de ponta.
Seu perfil psicológico: realista, focado na sua empresa, quer algo bem polido e de excelente qualidade. Dependendo do seu nicho, seu nível de exigência pode variar.

INFORMAÇÕES DA SUA EMPRESA:
- Nicho: ${client.nicho}
- Nome da Empresa: ${client.companyName}
- Status da Negociação Atual (Funil): ${client.step}
- Tipo de Projeto Decidido: ${client.projectType || 'Ainda não decidi (Site ou App)'}
- Preço de Orçamento Atual: R$ ${client.proposalPrice || 0}

INSTRUÇÕES DO FUNIL E DECISÃO DE COMPRA:
- GREETING: Você acabou de manifestar interesse. Se a agência te propôsSite ou App, escolha um que faça sentido para sua empresa. Se quiser Site, marque a decisão como 'escolheu_site'. Se preferir App, marque como 'escolheu_app'.
- WAITING_CHOICE: Se eles sugeriram algo, você expressa o que gostaria de ver no projeto e pergunta o preço ou os próximos passos. Se pediram finalidade de uso, conte rápido e espere o orçamento.
- PROPOSAL_PENDING: A agência lhe enviou uma proposta no valor de R$ ${client.proposalPrice}. Você pode:
  a) Negociar o valor pedindo para parcelar (Marque decisão como 'pedido_parcelamento' e sugira pagar em prestações).
  b) Pedir desconto para pagamento em Pix à vista (Marque decisão como 'pedido_desconto' e diga algo como "Consigo um desconto para fechar agora no Pix?").
  c) Aceitar a proposta integralmente por achar justa (Marque decisão como 'proposta_aceita').
- PROPOSAL_ACCEPTED: O contrato foi fechado! Você está contente. Marque decisão como 'briefing_enviado' assim que passar as preferências do seu briefing ou se eles oferecerem importar o briefing automatico. 
- BRIEFING_PROVIDED / IN_PRODUCTION: Você está acompanhando a entrega. Dê respostas de incentivo e fique entusiasmado.
- FINALIZED: A entrega foi feita! Diga o quanto amou e dê os parabéns pelo trabalho excelente.

ESTILO DO CHAT:
- Escreva em português brasileiro nativo.
- Use tom realista e informal de chat de trabalho (WhatsApp). Pode abreviar algumas coisas ocasionalmente (como "tá", "vc", "tb", "obrigado", etc.), mas mantenha profissionalismo básico.
- Escreva respostas curtas de 1 a 3 frases. Nunca faça parágrafos longos ou robóticos. Nunca pareça uma IA generativa. No máximo escreva 4 frases para dar dados de briefing.

O desenvolvedor acabou de lhe enviar/fazer isso: "${userMsg}"`;

    const prompt = `HISTÓRICO DA CONVERSA ANTERIOR:
${formattedHistory}

AGORA RESPONDA COMO CLIENTE REAL. Determine a resposta de texto de WhatsApp e tome uma decisão de transição de status de negócio (se aplicável para avançar o jogo).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "O texto da mensagem curta que você envia no WhatsApp para a agência."
            },
            decision: {
              type: Type.STRING,
              description: "Seu status de progresso baseado no fluxo de conversas. Escolha uma das seguintes opções: 'escolheu_site', 'escolheu_app', 'pedido_parcelamento', 'pedido_desconto', 'proposta_aceita', 'briefing_enviado', atau 'nenhuma'. Use apenas essas exatas strings."
            },
            suggestedBriefing: {
              type: Type.OBJECT,
              description: "Se você estiver fornecendo os dados para briefing (decisão='briefing_enviado'), de forma inteligente e condizente com seu nicho preencha estes dados fictícios realistas do site/app.",
              properties: {
                objective: { type: Type.STRING, description: "Objetivo do app/site" },
                targetAudience: { type: Type.STRING, description: "Público alvo" },
                services: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Serviços em destaque" },
                differentials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Diferenciais competitivos" },
                cores: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cores recomendadas em hexadecimal" },
                fontes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nomes de fontes recomendadas" },
                estilo: { type: Type.STRING, description: "Estilo estético ex: Esportivo, Minimalista, Dark" }
              }
            }
          },
          required: ["reply", "decision"]
        }
      }
    });

    const contentText = response.text;
    const parsed = JSON.parse(contentText || "{}");

    res.json(parsed);

  } catch (error: any) {
    console.error("Gemini completion error:", error);
    res.status(500).json({ 
      error: "Ocorreu um erro ao processar o cliente Gemini.",
      details: error.message || error,
      reply: "Desculpe, tive uma oscilação na minha internet aqui. Pode repetir?",
      decision: "nenhuma"
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
