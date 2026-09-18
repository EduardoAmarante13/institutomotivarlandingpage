# PRD — Instituto Motivar (Landing Page + Painel CMS)

## Problem Statement (original)
"Crie uma landing page: Do Instituto Motivar. Quero que contenha as ações sociais e abas relacionadas que você achar interessante. o instagram é publico e de uma associação sem fins lucrativos, https://www.instagram.com/motivar.instituto/ logo em anexo. painel para colocar fotos e etc. Dados sobre a presidente, sobre o tipo de atendimento q é feito e etc. me surpreenda utilizando os 5 tokens q tenho."
+ Iteração: "deixar a logo do instituto com o fundo transparente e deixar bem feito, com aba sobre nós e etc."

## Escolhas do usuário
- Foco: todas as causas — patologias/condições diversas, vulnerabilidade, atendimento jurídico
- Presidente: dados públicos (Marcia Glayde do Amarante, "Gleide", Feira de Santana/BA)
- Painel admin: fotos + ações + textos das seções (CMS completo)
- Doações: PIX + contato (WhatsApp/Instagram)
- Visual: identidade do logo (ciano #00C2CB / azul #0F52BA + acentos do quebra-cabeça)

## Arquitetura
- Frontend: React + Tailwind (Cabinet Grotesk / Plus Jakarta Sans), framer-motion, shadcn/ui, sonner
- Backend: FastAPI + Motor (MongoDB), rotas /api/*
- Auth: JWT (bcrypt + pyjwt), Bearer token + cookie httpOnly, brute-force lockout (5 tentativas/15min)
- CMS: coleções site_content (chave-valor), acoes, galeria; upload de imagem como data URI (máx. 2 MB)
- Logo: processada com flood-fill (fundo transparente) — /app/scripts/makelogo.py

## Implementado
- 2026-09-10: Landing page completa (Hero bento, Sobre Nós + card da presidente, Atendimentos, Ações Sociais com filtros, Galeria com lightbox, Como Ajudar com PIX copia-e-cola, Contato, Footer)
- 2026-09-10: Painel admin protegido (/admin → /admin/painel): CRUD de ações, galeria (upload/URL), edição de todos os textos
- 2026-09-10: Logo com fundo transparente, aba "Sobre Nós", favicon, título/meta pt-BR
- 2026-09-18: WhatsApp real (75) 99222-6452; PIX REMOVIDO a pedido do usuário (doações agora via WhatsApp); card "Brechó Motivar" (@brecho.motivar) na seção Como Ajudar
- 2026-09-18: Seção Instagram com 6 posts reais embutidos (shortcodes de imginn.com/motivar.instituto: quermesse, Seleção Motivar etc.) + stats do perfil (2,3 mil seguidores, 145 posts)
- 2026-09-18: 3 fotos reais adicionadas à galeria (sede, mural da inclusão, equipe na Quermesse) em /app/frontend/public/fotos/

## Personas
- Visitante/doador: conhece o instituto, vê ações, doa via PIX, fala no WhatsApp
- Voluntário: entende como ajudar e entra em contato
- Admin (equipe do instituto): atualiza fotos, ações e textos sem código

## Backlog priorizado
- P0: Foto real da presidente e fotos reais das ações (cards de ações ainda usam banco de imagens)
- P0: Atualizar shortcodes dos posts do Instagram periodicamente (hoje fixos no código)
- P1: Chave PIX + QR Code quando o instituto cadastrar (campos removidos do painel por ora)
- P1: Formulário de voluntariado com envio por e-mail (Resend)
- P1: API oficial do Instagram para feed automático (requer conta Business + token)
- P2: Seção de transparência com relatórios em PDF
- P2: Blog/notícias

## Próximas tarefas
1. Receber dados reais (PIX, WhatsApp, fotos) e atualizar via painel
2. Adicionar QR Code PIX dinâmico
3. Publicar em produção
