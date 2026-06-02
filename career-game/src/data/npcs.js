export const NPCS = [
  {
    id: 'j3r3',
    name: 'j3r3',
    gender: 'male',
    mapPosition: { tileX: 15, tileY: 20 },
    nameColor: '#f87171',
    dialog: [
      { speaker: 'PLAYER', text: "j3r3! Didn't expect to see you here. You finished CS uni already, right?" },
      { speaker: 'j3r3', text: "Graduated last year. You just starting?" },
      { speaker: 'PLAYER', text: "First semester. Algorithms is already crushing me." },
      { speaker: 'j3r3', text: "Same for everyone. Best thing I did — implement every data structure from scratch. No libraries. Linked list, BST, hash table. Write them yourself at least once." },
      { speaker: 'PLAYER', text: "From scratch sounds brutal though." },
      { speaker: 'j3r3', text: "It is. But once you physically build a linked list and trace through memory, Big-O stops being abstract. You FEEL the difference between O(n) and O(n²)." },
      { speaker: 'PLAYER', text: "What about Discrete Math? Feels completely disconnected from actual coding." },
      { speaker: 'j3r3', text: "It snaps into place when you hit graph algorithms. Suddenly DFS, shortest paths, all of it makes sense. The math isn't filler — it's the foundation." },
      { speaker: 'PLAYER', text: "Any survival tips for first year?" },
      { speaker: 'j3r3', text: "Build something every semester. Doesn't matter what. A small game, a CLI tool, anything you'd actually use. GitHub matters more than GPA when job hunting." },
      { speaker: 'j3r3', text: "And don't burn out in first semester. The content gets harder later — you need stamina more than intensity right now. Pace yourself." },
    ],
  },

  // ── LINIK — Sessão 1: Diagnóstico (próximo ao Graph Science) ──────────
  {
    id: 'linik',
    name: 'Prof. Linik',
    gender: 'female',
    mapPosition: { tileX: 31, tileY: 13 },
    nameColor: '#34d399',
    sessionId: 'session_1',
    dialog: [
      { speaker: 'Prof. Linik', text: "Lucas! Bem-vindo à Mentoria IDP. Sou a Prof. Linik Moraes — vamos trabalhar sua estratégia de carreira juntos. 4 encontros + 1 adicional." },
      { speaker: 'PLAYER', text: "Incrível! Por onde começamos?" },
      { speaker: 'Prof. Linik', text: "Sessão 1: Diagnóstico. Primeiro mapeamos suas habilidades — técnicas e comportamentais. Onde você está agora e onde quer chegar em 12 meses." },
      { speaker: 'PLAYER', text: "Tenho Python, ML, Neo4j, Data Engineering... mas não sei como me posicionar no mercado." },
      { speaker: 'Prof. Linik', text: "Exatamente o que vamos resolver. Defina o objetivo: qual cargo, qual empresa, qual mercado. Sem clareza de destino, não existe rota." },
      { speaker: 'PLAYER', text: "Quero ser AI Systems Engineer em uma empresa de tecnologia de ponta." },
      { speaker: 'Prof. Linik', text: "Perfeito. Agora o Pitch de 1 minuto: você precisa se apresentar de forma clara, concisa e impactante — hard skills + soft skills em 60 segundos." },
      { speaker: 'Prof. Linik', text: "Lição de casa: escreva seu pitch, grave em vídeo. Essa é a base de tudo que vem depois. Próxima sessão: seu projeto real no GitHub." },
    ],
  },

  // ── LINIK — Sessão 2: Projeto & GitHub (próximo ao Industry) ─────────
  {
    id: 'linik_industry',
    name: 'Prof. Linik',
    gender: 'female',
    mapPosition: { tileX: 24, tileY: 8 },
    nameColor: '#34d399',
    sessionId: 'session_2',
    dialog: [
      { speaker: 'Prof. Linik', text: "Segunda sessão! Hoje falamos de Projeto Real e GitHub. Você precisa de evidência concreta das suas habilidades — não basta dizer que sabe, precisa mostrar." },
      { speaker: 'PLAYER', text: "Estou construindo o DevPro — um jogo de carreira em JavaScript com Phaser 3 que conta minha jornada profissional." },
      { speaker: 'Prof. Linik', text: "Excelente escolha. Projeto real, problema real, solução criativa. Isso é exatamente o que diferencia você de 200 candidatos com o mesmo currículo." },
      { speaker: 'PLAYER', text: "Como devo organizar o GitHub para impressionar recrutadores técnicos?" },
      { speaker: 'Prof. Linik', text: "README impecável com o problema, a solução e como rodar. Commits bem escritos — cada um conta uma história. Projeto pinado no perfil com live demo linkado." },
      { speaker: 'Prof. Linik', text: "Recrutadores técnicos olham para: commits regulares, código organizado, arquitetura bem pensada. Seu GitHub é seu portfólio vivo — trate assim." },
      { speaker: 'Prof. Linik', text: "Missão: entregue o DevPro com live demo funcionando. Você tem 2 semanas. Próxima sessão: LinkedIn e posicionamento de mercado." },
    ],
  },

  // ── LINIK — Sessão 3: Posicionamento LinkedIn (próximo ao Advanced AI) ─
  {
    id: 'linik_advanced',
    name: 'Prof. Linik',
    gender: 'female',
    mapPosition: { tileX: 10, tileY: 5 },
    nameColor: '#34d399',
    sessionId: 'session_3',
    dialog: [
      { speaker: 'Prof. Linik', text: "Sessão 3: Posicionamento de Mercado! LinkedIn não é currículo online — é sua vitrine profissional ativa. A diferença é enorme." },
      { speaker: 'PLAYER', text: "Que partes do LinkedIn são realmente críticas para recrutadores técnicos?" },
      { speaker: 'Prof. Linik', text: "Foto profissional, headline que conta QUEM você é (não só o cargo atual), About section que conta sua história, Skills com endossos reais de pessoas que trabalharam com você." },
      { speaker: 'PLAYER', text: "E os 'símbolos de interação' que você mencionou no plano?" },
      { speaker: 'Prof. Linik', text: "Comentar posts de referências do setor com insights reais, publicar seus próprios artigos técnicos, interagir com conteúdo das empresas alvo. Visibilidade gera oportunidade." },
      { speaker: 'Prof. Linik', text: "Sua missão: 3 publicações este mês. Sobre o DevPro, sobre Neo4j + Graph AI, sobre a sua visão de AI Systems. Seja visto antes de precisar ser encontrado." },
      { speaker: 'Prof. Linik', text: "Com LinkedIn forte + GitHub impecável, você atrai recrutadores em vez de correr atrás deles. Esse é o jogo que queremos jogar." },
    ],
  },

  // ── LINIK — Sessão 4: Monetização (próximo ao Target final) ──────────
  {
    id: 'linik_target',
    name: 'Prof. Linik',
    gender: 'female',
    mapPosition: { tileX: 7, tileY: 3 },
    nameColor: '#34d399',
    sessionId: 'session_4',
    dialog: [
      { speaker: 'Prof. Linik', text: "Sessão final — Monetização e Estratégia de Venda. Lucas, você chegou longe. Agora vamos converter tudo isso em oportunidade real de carreira." },
      { speaker: 'PLAYER', text: "Tenho medo de não saber como negociar ou quanto vale meu trabalho." },
      { speaker: 'Prof. Linik', text: "Plano 12/30 dias: nos próximos 30 dias, aplique para 5 vagas por semana com candidatura personalizada. Em 12 meses, posição sênior ou promoção." },
      { speaker: 'PLAYER', text: "Como personalizo cada candidatura sem perder dias?" },
      { speaker: 'Prof. Linik', text: "30 minutos de pesquisa por empresa: um projeto deles que você admira, uma dor que seu perfil resolve, uma conexão genuína. Isso vale mais que 10 candidaturas genéricas." },
      { speaker: 'Prof. Linik', text: "Resultados desta mentoria: Plano de Carreira sólido, Currículo Estratégico, LinkedIn Forte, GitHub Profissional. Você saiu estudante." },
      { speaker: 'Prof. Linik', text: "\"Transformação do Estudante ao Profissional Pronto para o Mercado\" — isso é o que conquistamos juntos. Você está PRONTO, Lucas. Vai lá!" },
    ],
  },
];
