import { useState, useRef, useEffect } from "react";

const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const KNOWLEDGE_BASE = `
REPERTÓRIO COMPLETO DE RECEITAS E TÉCNICAS DA RITCHELY (Histórico Perplexity Mar-Abr 2026):

═══ FRANGO ═══
COXA/SOBRECOXA AIR FRYER: alho+limão+páprica+sal+pimenta+azeite → marina 15min → air fryer 200°C: 15min pele baixo + 15min pele cima. Crocante fora, suculento dentro.
FRANGO DESFIADO BASE: 2kg peito pressão 12–15min com água+alho+sal+louro → desfiar → 3 potes: (1) tomate+páprica, (2) shoyu+pimenta, (3) natural. Geladeira 4 dias / freezer 10 dias.
ESTROGONOFE FRANGO LOW CARB: refoga alho+cebola → sela frango cubos → mostarda+páprica+champignon → creme de leite último (fogo baixo 3–4min). Para Kauê: arroz. Para Rity: purê couve-flor.
FRANGO CREMOSO GRATINADO: 1kg desfiado + 2cx creme leite + requeijão + 300g muçarela + 80g parmesão + temperos → forno 200°C/25min. Rende 6–8 potes freezer 7–10 dias.
FRANGO XADREZ LOW CARB: frango cubos + pimentões + champignon + amendoim + shoyu SEM AÇÚCAR. Fogo alto para selar. SEM amido de milho. ~8g carb/porção.
ESCONDIDINHO LOW CARB: purê couve-flor + frango desfiado pote 1 + queijos → forno 200°C/20–25min. ~9g carb/porção. Congela 7 dias.
COXINHA ABÓBORA LOW CARB: massa 500g cabotiá+ovo+linhaça → recheio frango+requeijão → empanar linhaça+parmesão → air fryer 180°C/15min. ~122kcal/9g carb/13g prot. Congela crua 1 mês.

═══ CAMARÃO ═══
FRICASSÊ: camarão 5–8min até rosado (NÃO passa do ponto) + molho tomate + creme leite + requeijão + muçarela → gratinar forno 200°C/15–20min. Freezer 2 semanas.
CAMARÃO CREMOSO ALHO: manteiga + alho lâminas fogo baixo 5min + camarão 4–5min + creme leite 2min. Total 20min.
CAMARÃO COCO BAMBU: camadas — arroz+presunto+ervilha → camarão refogado → creme+requeijão+leite coco → muçarela → forno 200°C/15min + batata palha final.

═══ CARRÉ DE PORCO ═══
PRESSÃO: marinada shoyu+limão+alho+louro (mín 20min) → sela frigideira 3min/lado → pressão 20–25min → reduz molho 5min. Para Rity: purê couve-flor + couve sautée.
AIR FRYER COSTELETA: sal+pimenta+alho+manteiga → 200°C/12–15min virando.

═══ ACOMPANHAMENTOS LOW CARB ═══
PURÊ COUVE-FLOR: vapor pressão 10min → mixer com manteiga+requeijão+sal+noz-moscada. ~5g carb/porção. Congela 3 meses. USAR MANTEIGA/REQUEIJÃO (nunca leite puro — separa).
Brócolis vapor: pressão 5min. Abobrinha grelhada: frigideira 8min. Couve sautée: 5min. Repolho refogado: 10min.

═══ SOBREMESAS LOW CARB ═══
MOUSSE 2 INGREDIENTES: 200g choc 70% banho-maria + 200ml creme fresco GELADO batido em picos → incorpora em 3 etapas → geladeira 2–3h. Guarda 3 dias. NÃO congela.
MOUSSE ABACATE: 240g choc 70% + 400g abacate maduro → mixer → geladeira 1h. 16 porções. Sem gosto de abacate.
MOUSSE CORTE GELATINA: choc+leite+cacau+gelatina → forma → geladeira 4–6h. ~75kcal/fatia. Ideal marmita.
BANHO-MARIA CORRETO: panela 2 dedos água + tigela seca encaixada → fogo médio → desligue ao ferver → mexa 2–5min. NUNCA água no chocolate.

═══ KAUÊ ═══
MACARRONADA PRESSÃO: 500g macarrão + 400g creme leite + 150g muçarela + calabresa + molho tomate → pressão 3min.

═══ TÉCNICAS ESSENCIAIS ═══
PANELA PRESSÃO TEMPOS: frango peito 15min, cubos 8–10min, couve-flor vapor 10min, carré 20–25min, feijão sem demolho 30–35min.
AIR FRYER: coxa/sobrecoxa 200°C/30min(15+15), coxinha abóbora 180°C/15min, costeleta 200°C/12–15min.
EMPANAR LOW CARB MIX BARATO: 1 xic linhaça + 1/2 xic parmesão + sal + alho pó + páprica (~R$5).
CONGELAMENTO: purê couve-flor 3 meses, fricassê camarão 2 semanas, frango desfiado 10 dias, frango cremoso 7–10 dias, escondidinho 7 dias, coxinha crua 1 mês.
NÃO CONGELA: saladas, mousse chocolate, purê com leite puro.

═══ FILOSOFIA LOW CARB RITCHELY ═══
~40–90g carb/dia (não keto extremo 20g). Proteína 118–140g/dia. Custo meta R$16–20/dia.
Proteínas baratas: frango, ovos, sardinha lata, peixe congelado, carne moída.
FAMÍLIA: mesma proteína, carbos diferentes. Ex: frango xadrez+arroz Kauê / frango xadrez+brócolis Rity.
PREP DAY (2h): 06h00 frango pressão → 06h20 couve-flor vapor → 06h35 purê+escondidinho forno → 06h40 divide 3 potes → 06h50 monta cremoso forno → 07h30 TUDO PRONTO. Etiqueta nome+data.
`;

const buildSystemPrompt = (pantry, weight, emotional, checkin) => {
  const energy = checkin?.energy ?? 3;
  const taquicardia = checkin?.taquicardia ?? false;
  const isDMV = energy <= 2;
  const hour = new Date().getHours();
  const currentBlock = hour < 9 ? "Oxigenação (antes das 09h) — corpo primeiro, livros depois"
    : hour < 11.5 ? "Bloco Principal (09h15–11h30) — matérias pesadas: MF, RL, TI, questões"
    : hour < 18.5 ? "Intervalo / Trabalho"
    : hour < 20 ? "Bloco Passivo (18h30–20h00) — videoaulas, lei seca, revisão leve"
    : "TETO (após 20h) — livros fechados. Sistema Parassimpático precisa assumir.";
  return `Você é a RITY — assistente pessoal completa da Ritchely. Três papéis integrados:

══ PAPEL 1: MENTOR DA COZINHA ══
Perfil: Ritchely (low carb 40–90g carb/dia, proteína 118–140g, 1600–1800kcal) + Kauê 13 anos (frango/carne/ovos/arroz, sem "verde").
Eletros: air fryer, panela elétrica, vaporizador, mixer. Batch cooking sábado+domingo. ≤15min dias corridos.
Despensa atual: ${pantry.length ? pantry.join(", ") : "não informada — pergunte"}
${KNOWLEDGE_BASE}
REGRAS COZINHA: conduza em etapas, pergunte uma coisa por vez, priorize o que tem em casa, indique (batch)/(freezer) no cardápio, lista de mercado por setor com custo.

══ PAPEL 2: MENTOR DE EMAGRECIMENTO ══
Ritchely: 38 anos, mãe solo, servidora, Rio. Meta: 90kg→73kg. Peso atual: ${weight ? weight + "kg" : "não registrado"}.
Corre Aterro do Flamengo, pace 8:00–8:30/km, máx 40min, Garmin 245. Perfil: comer emocional (estresse TCE+trabalho+maternidade).
Emocional hoje: ${emotional}/10 ${emotional <= 4 ? "⚠️ ALERTA — risco comer emocional" : emotional <= 6 ? "— monitorar" : "— estável"}.
REGRAS CORPO: NUNCA culpa. If-then para gatilhos. "Fome real" vs "fome emocional". Battery<40=descanso. Desvio=dado, não fracasso.

══ PAPEL 3: GUARDIÃ ANTI-BURNOUT (NOVO) ══
DIAGNÓSTICO REGISTRADO:
• Crash adrenal pós-viagem TCE-MG + sobrecarga cognitiva (8 metas em 2 dias) + sono irregular = exaustão real, não fraqueza.
• Taquicardia = Sistema Nervoso Simpático em sobrecarga. Corpo em "luta ou fuga". Mente que grita não absorve conteúdo.
• Fadiga de Decisão: se precisar decidir o que estudar às 05h30, a fadiga devolve ao travesseiro.

ENERGIA HOJE: ${energy}/5 ${isDMV ? "🔴 MODO DMV ATIVADO" : energy <= 3 ? "🟡 monitorar" : "🟢 estável"}
TAQUICARDIA HOJE: ${taquicardia ? "⚠️ SIM — protocolo de proteção ativo" : "não"}
BLOCO ATUAL: ${currentBlock}

AS 4 LEIS INEGOCIÁVEIS DO CICLO DE ESTUDOS:
1. LEI DA OXIGENAÇÃO (antes das 09h): corpo e luz solar PRIMEIRO. Exercício no Aterro → dopamina → então abre o livro. Nunca o contrário.
2. LEI DO BLOCO PRINCIPAL (09h15–11h30): matérias PESADAS aqui: Matemática Financeira, Raciocínio Lógico, TI, questões complexas. Cérebro banhado de dopamina pós-treino.
3. LEI DA META PASSIVA (18h30–20h): cérebro da noite ≠ cérebro da manhã. SÓ: videoaulas, lei seca, revisão caderno de erros leve, matérias fáceis (Português, Dir. Administrativo).
4. TETO INQUEBRÁVEL (20h): livros fechados. Ponto final. Não importa se faltam 10 questões. O fechamento rígido garante sono e o acordar às 05h sem sofrimento.

MODO DMV (Dia Mínimo Viável) — ATIVA QUANDO ENERGIA ≤ 2:
• Meta do dia: MANUTENÇÃO DO HÁBITO, não volume.
• Corta metas pela metade. Começa pela matéria mais fácil (sensação de vitória).
• Ambiente preparado na noite anterior: caderno na mesa, Anki engatilhado. Fricção zero.
• Se energia=1: apenas Anki de revisão (15min) conta como dia concluído.

QUANDO FALAR DE ESTUDOS/CANSAÇO:
- Se taquicardia reportada: valida o sinal físico, sugere respiração 4-7-8 ou caminhada leve antes de qualquer estudo.
- Se energia ≤ 2: ativa automaticamente o modo DMV sem pedir confirmação.
- Nunca sugere "força de vontade" como solução. Sugere ESTRUTURA e AMBIENTE.
- Não recomenda estudar após 20h. Se pedir, redireciona para o teto inquebrável.

Check-in hoje: ${checkin ? JSON.stringify(checkin) : "não feito"}.
Tom: direto, sem enrolação, máx 4 parágrafos. Pergunte antes de assumir.`;
};

const INIT_RECIPES = [
  { id:1, name:"Coxa/Sobrecoxa Air Fryer", person:"ambos", time:"30min", kcal:380, tags:["batch","proteína","air fryer","crocante"], ingredients:["coxa e sobrecoxa 1kg","alho amassado","limão","páprica","sal","pimenta","fio de azeite"], steps:"MARINADA (15min):\nAlho amassado + limão + páprica + sal + pimenta + azeite. Cobre bem as peças.\n\nAIR FRYER 200°C:\n→ 15min com a pele para BAIXO\n→ Vira: 15min com a pele para CIMA\n\nResultado: crocante por fora, suculento por dentro.\n\nAcompanha (Rity): purê de couve-flor + couve sautée\nAcompanha (Kauê): arroz + salada", fav:true },
  { id:2, name:"Frango Desfiado Base — 3 Sabores", person:"ambos", time:"20min+prep", kcal:220, tags:["batch","coringa","pressão","freezer","base"], ingredients:["peito de frango 2kg","água","alho 3 dentes","sal","louro 2 folhas"], steps:"PRESSÃO ELÉTRICA:\n2kg peito + água cobrindo + alho + sal + louro → pressão 12–15min → libera rápida.\n\nDESFIAR com 2 garfos enquanto ainda quente.\n\nDIVIDE EM 3 POTES:\n• Pote 1 — tomate + páprica: use em escondidinho, coxinha, wrap\n• Pote 2 — shoyu + pimenta: frango xadrez relâmpago\n• Pote 3 — natural + sal: omelete, salada, recheio\n\nEtiqueta: nome + data.\nGeladeira 4 dias / Freezer 10 dias.", fav:true },
  { id:3, name:"Frango Cremoso Gratinado", person:"rity", time:"40min", kcal:480, tags:["batch","forno","freezer","keto","6-8 potes"], ingredients:["frango desfiado 1kg","creme de leite 2cx","requeijão cremoso 1 pote","muçarela 300g","parmesão 80g","cebola 2un","alho 4 dentes","mostarda 1cs","páprica defumada","noz-moscada"], steps:"1. Refoga cebola picada + alho amassado até dourar (5min).\n2. Adiciona frango desfiado + mostarda + páprica + noz-moscada. Mistura.\n3. Incorpora creme de leite + requeijão cremoso. Mexe bem.\n4. Monta em refratário ou potes individuais em camadas:\n   → Frango cremoso → muçarela → parmesão ralado\n5. Forno 200°C por 25min até gratinar (cobre com alumínio nos primeiros 15min, retira nos últimos 10min).\n\nRende: 6–8 potes individuais.\nGeladeira: 3 dias / Freezer: 7–10 dias.", fav:true },
  { id:4, name:"Estrogonofe de Frango Low Carb", person:"rity", time:"30min", kcal:420, tags:["keto","jantar","rápido","frigideira"], ingredients:["peito de frango 500g em cubos","creme de leite 1cx","mostarda 1cs","páprica defumada","champignon","alho 3 dentes","cebola 1/2","sal","cheiro-verde"], steps:"1. Refoga alho + cebola em azeite (5min).\n2. Sela frango em cubos — fogo ALTO, sem mover por 3min.\n3. Adiciona mostarda + páprica + champignon. Mistura.\n4. Creme de leite por último — fogo BAIXO, não ferve, 3–4min.\n5. Cheiro-verde. Serve.\n\nRity: purê de couve-flor ou abobrinha grelhada\nKauê: arroz ou macarrão", fav:false },
  { id:5, name:"Frango Xadrez Low Carb", person:"rity", time:"25min", kcal:350, tags:["keto","jantar","8g carb","wok"], ingredients:["frango 500g em cubos","pimentões coloridos 2un","champignon 1 lata","amendoim torrado 50g","shoyu sem açúcar 3cs","alho 3 dentes","cebola 1un","azeite ou manteiga"], steps:"SEM amido de milho. SEM açúcar. SEM engrossante.\n\n1. Fogo ALTO. Sela frango em cubos sem mexer por 3min. Retira.\n2. Na mesma frigideira: cebola + alho (2min).\n3. Pimentões em cubos GRANDES (fogo alto, 3min — deve ficar crocante, não murchar).\n4. Volta frango + shoyu + champignon. Mistura rápida.\n5. Amendoim torrado no final. Serve imediatamente.\n\n~8g carb líquido por porção.\nKauê: serve com arroz.", fav:false },
  { id:6, name:"Escondidinho Low Carb (Couve-flor)", person:"rity", time:"40min", kcal:390, tags:["keto","forno","batch","9g carb","gratinado"], ingredients:["frango desfiado pote 1 (tomate+páprica)","couve-flor 1 cabeça (purê)","muçarela","parmesão","requeijão cremoso","manteiga"], steps:"PURÊ BASE:\n1 cabeça couve-flor em floretes → vapor pressão 10min → mixer com manteiga + requeijão + sal + noz-moscada até cremoso.\n\nMONTAGEM EM CAMADAS:\n→ Camada 1: purê de couve-flor\n→ Camada 2: frango desfiado pote 1 (já temperado com tomate + páprica)\n→ Camada 3: purê cobrindo\n→ Camada 4: muçarela + parmesão\n\nForno 200°C por 20–25min até gratinar.\nOu frigideira tampada fogo baixo 10–15min.\n\nRende 4–5 porções. ~9g carb cada. Congela 7 dias.", fav:true },
  { id:7, name:"Coxinha Low Carb de Abóbora", person:"rity", time:"50min", kcal:122, tags:["keto","batch","congelável","snack","12-15 un"], ingredients:["abóbora cabotiá 500g","ovo 1un","sal","páprica","farinha de linhaça 3cs","frango desfiado (recheio)","requeijão cremoso","cebola picada","cheiro-verde","parmesão + linhaça p/ empanar","ovo p/ empanar"], steps:"MASSA:\n1. Cozinha 500g cabotiá (pressão 8min ou cozida).\n2. Amassa bem + 1 ovo + sal + páprica + 3cs farinha linhaça.\n3. Massa deve soltar das mãos. Ajusta com linhaça se precisar.\n\nRECHEIO: frango desfiado + requeijão + cebola picada + cheiro-verde. Mistura.\n\nFORMAR E EMPANAR:\n1. Pega porção de massa, achata, coloca recheio, fecha em formato coxinha.\n2. Duplo empanado: ovo batido → mix linhaça+parmesão → ovo → mix.\n\nAIR FRYER 180°C/15min virando na metade.\nOu forno 200°C/20min.\n\nCONGELA CRU: 1 mês. Assa direto do freezer sem descongelar.\nRende 12–15 un. ~122kcal / ~9g carb / ~13g prot cada.", fav:false },
  { id:8, name:"Fricassê de Camarão", person:"ambos", time:"35min", kcal:460, tags:["batch","especial","forno","freezer","2 semanas"], ingredients:["camarão limpo 750g","cebola","alho","tomate","molho tomate","creme de leite","requeijão","parmesão","muçarela","sal","pimenta","limão"], steps:"REGRA DE OURO: camarão que passa do ponto fica borrachudo!\n\n1. Tempera camarão: sal + pimenta + limão. Deixa 5min.\n2. Refoga cebola + alho + tomate + molho tomate (5–10min).\n3. Adiciona camarão — refoga apenas 5–8min até ficar rosado. Para imediatamente.\n4. Molho cremoso (prepara separado): creme leite + requeijão + parmesão.\n5. Montagem em refratário: camarão com molho → creme por cima → muçarela.\n6. Gratina: forno 200°C/15–20min ou air fryer 180°C/10min.\n\nRende 4–6 porções. Freezer 2 semanas.", fav:true },
  { id:9, name:"Camarão Cremoso com Alho", person:"rity", time:"20min", kcal:380, tags:["keto","jantar","rápido","20min"], ingredients:["camarão limpo 750g","manteiga 2cs","alho em lâminas 4 dentes","páprica defumada","creme de leite 1cx","cheiro-verde","limão"], steps:"1. Frigideira grande. Derrete manteiga.\n2. Alho EM LÂMINAS — fogo BAIXO. Deixa desmanchar devagar (5min). Não queima.\n3. Camarão + páprica — fogo médio, 4–5min. Para quando ficar rosado.\n4. Creme de leite — mexe suavemente 2min fogo baixo.\n5. Cheiro-verde + limão. Serve imediatamente.\n\nDica: não tapa a frigideira (camarão vira borracha no vapor).", fav:false },
  { id:10, name:"Camarão Internacional (Coco Bambu)", person:"ambos", time:"40min", kcal:620, tags:["especial","kauê","família","forno"], ingredients:["camarão 500g","arroz cozido 2 xic","presunto picado","ervilha","muçarela picada","leite de coco 1cx","creme de leite 1cx","requeijão cremoso","parmesão","batata palha p/ finalizar"], steps:"CAMADAS em refratário fundo:\n1ª: Arroz cozido + presunto picado + ervilha + muçarela picada (base)\n2ª: Camarão refogado no alho + sal\n3ª: Molho cremoso — mistura: creme leite + requeijão + leite coco + parmesão\n4ª: Muçarela fatiada por cima\n\nForno 200°C/15min.\n\nFINALIZA: batata palha generosa na hora de servir. NÃO vai ao forno.\n\nEspecial para ocasiões com o Kauê.", fav:false },
  { id:11, name:"Carré de Porco na Pressão", person:"ambos", time:"45min", kcal:520, tags:["batch","especial","pressão","proteína"], ingredients:["carré de porco","shoyu 3cs","limão 1un","alho 4 dentes","louro 2 folhas","pimenta preta","molho inglês 1cs","cebola 1un","azeite"], steps:"MARINADA (mínimo 20–30min, ideal véspera):\nShoyu + limão + alho amassado + louro + pimenta + molho inglês. Cobre toda a carne.\n\n1. Fogo ALTO. Sela em frigideira com azeite — 3min por lado SEM mover.\n2. Transfere para pressão elétrica.\n3. Adiciona cebola em rodelas + alho + 1/2 xíc água.\n4. Pressão alta 20–25min.\n5. Função refogar: reduz o molho 5min mexendo.\n\nRity: purê couve-flor + couve sautée + repolho refogado\nKauê: arroz + feijão ou batata", fav:false },
  { id:12, name:"Costeleta de Porco Air Fryer", person:"ambos", time:"20min", kcal:450, tags:["air fryer","rápido","proteína","simples"], ingredients:["carré em costeletas","sal grosso","pimenta preta","alho amassado","manteiga"], steps:"1. Corta o carré em costeletas individuais.\n2. Tempera generosamente: sal + pimenta + alho amassado + manteiga em cada lado.\n3. Air fryer 200°C por 12–15min virando na metade.\n\nServe imediatamente. Não deixa descansando na air fryer.\n\nAcompanha (Rity): couve sautée ou abobrinha grelhada\nAcompanha (Kauê): arroz ou batata assada", fav:false },
  { id:13, name:"Purê de Couve-flor", person:"rity", time:"20min", kcal:120, tags:["base","keto","batch","freezer","5g carb","acompanhamento"], ingredients:["couve-flor 1 cabeça","manteiga 2cs","requeijão cremoso 2cs (ou creme de leite)","sal a gosto","noz-moscada"], steps:"1. Separa floretes da couve-flor.\n2. Coloca na CESTA VAPOR da panela elétrica + 1/2 xíc água no fundo.\n3. Pressão alta 10min → libera pressão RÁPIDA (abre a válvula).\n4. No mixer ou liquidificador: floretes + manteiga + requeijão (ou creme leite) + sal + noz-moscada.\n5. Bate 30–40seg em lotes. Se muito espesso: 1 colher da água reservada.\n\n~5g carb por porção. Rende 4 porções.\n\nCONGELAR: potes individuais → 3 meses.\n⚠️ USAR MANTEIGA/REQUEIJÃO. NÃO leite puro (separa água ao congelar).\nDESCONGELAR: geladeira 12–24h → reaquecer panela fogo baixo + 1cs manteiga.", fav:true },
  { id:14, name:"Couve Sautée Rápida", person:"rity", time:"5min", kcal:60, tags:["keto","acompanhamento","5min","rápido"], ingredients:["couve manteiga","azeite","alho fatiado","sal grosso"], steps:"1. Frigideira em fogo ALTO + fio de azeite.\n2. Alho fatiado fino — 1min até dourar levemente.\n3. Couve cortada em tiras finas + pitada de sal grosso.\n4. Mexe em fogo alto por 4–5min.\n\nDeve ficar levemente crocante, não murchar demais.", fav:false },
  { id:15, name:"Brócolis no Vapor", person:"rity", time:"8min", kcal:55, tags:["keto","acompanhamento","rápido","vapor"], ingredients:["brócolis 1 cabeça","sal","azeite (opcional)","limão (opcional)"], steps:"1. Brócolis em floretes médios.\n2. Cesta vapor da panela elétrica + 1/2 xíc água.\n3. Pressão 5min → libera pressão RÁPIDA imediatamente.\n\nTempera: azeite + sal ou limão + azeite.\n\nDica: liberar rápida é essencial — pressão natural deixa muito mole.", fav:false },
  { id:16, name:"Abobrinha Grelhada", person:"rity", time:"10min", kcal:70, tags:["keto","acompanhamento","rápido","grelha"], ingredients:["abobrinha 2 médias","azeite","alho 2 dentes","sal","pimenta opcional"], steps:"1. Corta em rodelas de 1cm (ou palitos).\n2. Frigideira com azeite quente + alho amassado.\n3. Abobrinha em camada única — fogo médio-alto.\n4. 4min de cada lado, vira UMA vez.\n\nNão mexa demais — deixa dourar.\nFica melhor AL DENTE, não desmanchada.", fav:false },
  { id:17, name:"Repolho Refogado", person:"rity", time:"12min", kcal:65, tags:["keto","acompanhamento","barato","substituto massas"], ingredients:["repolho 1/4 cabeça","manteiga 1cs","alho 2 dentes","sal","pimenta preta"], steps:"1. Corta repolho em tiras médias (não muito finas).\n2. Frigideira com manteiga + alho amassado.\n3. Repolho + sal → fogo médio, 10–12min mexendo a cada 2min.\n\nFica bom AL DENTE — perde graça se murchar demais.\nExcelente substituto de macarrão quando refogado assim.", fav:false },
  { id:18, name:"Mousse de Chocolate (2 ingredientes)", person:"rity", time:"15min+geladeira", kcal:280, tags:["sobremesa","keto","simples","sem culpa"], ingredients:["chocolate amargo 70% 200g","creme de leite FRESCO 200ml (gelado!)"], steps:"IMPORTANTE: creme de leite deve estar GELADO na geladeira (mín 2h).\n\nDERRETE O CHOCOLATE (banho-maria):\n→ Panela com 2 dedos de água\n→ Tigela SECA encaixada (não toca a água)\n→ Fogo médio até ferver levemente → DESLIGUE\n→ Mexa do centro para fora, 2–5min até derreter\n→ Deixa esfriar um pouco (tépido, não quente)\n\n⚠️ UMA GOTA DE ÁGUA EMPELOTA O CHOCOLATE\n\n1. Bate o creme de leite fresco GELADO até picos firmes (mixer ou fouet).\n2. Incorpora o chocolate tépido em 3 etapas — movimentos suaves de baixo para cima.\n3. Distribui em potes.\n4. Geladeira mínimo 2–3h.\n\nGuarda 3 dias na geladeira. NÃO CONGELA.", fav:true },
  { id:19, name:"Mousse Chocolate + Abacate", person:"rity", time:"10min+geladeira", kcal:210, tags:["sobremesa","keto","saudável","16 porções"], ingredients:["chocolate amargo 70% 240g","abacate maduro 400g","adoçante a gosto (opcional)"], steps:"1. Derrete 240g chocolate 70% no banho-maria (veja técnica na receita anterior).\n2. Bate 400g abacate maduro no mixer até ficar bem cremoso.\n3. Incorpora chocolate derretido (não quente) + adoçante.\n4. Geladeira 1h mínimo.\n\nNÃO tem gosto de abacate. Sério!\nRende 16 porções pequenas.\n\nCOMO SABER SE O ABACATE ESTÁ BOM:\n• Toque na palma: cede levemente = perfeito\n• Testa o talo: arranca com dedo, verde claro embaixo = maduro\n• Se verde: embrulha em jornal, lugar quente, 2–3 dias", fav:false },
  { id:20, name:"Mousse de Corte com Gelatina", person:"rity", time:"20min+freezer", kcal:75, tags:["sobremesa","keto","marmita","75kcal/fatia"], ingredients:["chocolate amargo 70% 150g","leite integral 200ml","cacau em pó 2cs","gelatina neutra 1 envelope","adoçante stevia"], steps:"1. Hidrata 1 envelope gelatina neutra em 50ml água fria (5min).\n2. Aquece leite (não ferve) + cacau + adoçante. Mistura bem.\n3. Incorpora gelatina hidratada + chocolate derretido. Mexe.\n4. Despeja em forma retangular untada.\n5. Freezer 3–4h ou geladeira 4–6h.\n6. Corta em fatias individuais.\n\n~75kcal por fatia. Ideal para porção diária + marmita.\nGuarda geladeira 3 dias.", fav:false },
  { id:21, name:"Omelete Clássico", person:"ambos", time:"5min", kcal:370, tags:["café","keto","5min","rápido","ovos"], ingredients:["ovos 3un","queijo fatiado","presunto ou bacon","manteiga 1cs","sal"], steps:"1. Bate 3 ovos com garfo + pitada de sal.\n2. Manteiga na frigideira, fogo médio-alto.\n3. Quando espumar: despeja os ovos.\n4. Coloca queijo + presunto/bacon na METADE.\n5. Quando a borda firmar (1–2min), dobra ao meio com espátula.\n6. 30seg e serve.\n\nVariações rápidas:\n+ cogumelo + queijo\n+ bacon + parmesão\n+ tomate seco + muçarela\n+ espinafre + requeijão", fav:true },
  { id:22, name:"Frittata de Legumes (Batch)", person:"rity", time:"25min", kcal:340, tags:["batch","café","forno","keto","prep day"], ingredients:["ovos 6-8un","queijo fatiado","abobrinha ou espinafre ou tomate","azeite","sal","pimenta"], steps:"1. Bate 6–8 ovos + sal + pimenta.\n2. Refoga legumes escolhidos em azeite (5min). Deixa esfriar.\n3. Mistura ovos + legumes + queijo picado.\n4. Despeja em forma untada com azeite.\n5. Forno 180°C/20min até firmar. Ou frigideira tampada fogo baixo 15min.\n\nCorta em 4–6 fatias → geladeira 3 dias.\nAquece 2min air fryer ou microondas.\n\nIdeal para café da manhã de segunda a quarta.", fav:false },
  { id:23, name:"Ovos Mexidos Cremosos", person:"ambos", time:"5min", kcal:280, tags:["café","5min","base","rápido"], ingredients:["ovos 3un","manteiga 1cs","sal","cheiro-verde opcional"], steps:"1. Bate ovos rapidamente com garfo (não muito).\n2. Manteiga em frigideira — fogo BAIXO (esse é o segredo).\n3. Despeja ovos. Não mexe por 30seg.\n4. Raspa o fundo devagar com espátula — 2min no total.\n5. Retira do fogo quando ainda levemente úmido (termina no calor residual).\n\nFica cremoso e não borrachudo.", fav:false },
  { id:24, name:"Macarronada Cremosa (Pressão) — Kauê", person:"kaue", time:"15min", kcal:580, tags:["kauê","pressão","almoço","rápido","cremoso"], ingredients:["macarrão parafuso 500g","creme de leite 400g","muçarela ralada 150g","calabresa fatiada","molho de tomate 1cx","água"], steps:"1. Coloca TUDO na panela de pressão:\n   macarrão + creme leite + muçarela + calabresa + molho tomate\n2. Água até cobrir 1 dedo acima do macarrão.\n3. Pressão 3min → libera rápida.\n4. Abre, mistura bem + cheiro-verde.\n\nSe macarrão al dente: tapa sem pressão mais 2min.\nVariações: trocar calabresa por atum ou frango.", fav:false },
  { id:25, name:"Arroz + Frango Air Fryer — Kauê", person:"kaue", time:"30min", kcal:520, tags:["kauê","batch","almoço","simples"], ingredients:["coxa ou sobrecoxa de frango","arroz 2 xíc","cebola","alho","sal","azeite","limão"], steps:"1. Arroz na panela elétrica (modo arroz).\n2. Frango temperado com sal + alho + limão + páprica.\n3. Air fryer 200°C/20min (vira na metade).\n4. Serve junto.\n\nVariações para Kauê:\n• Substituir frango por carne moída refogada\n• Adicionar feijão\n• Macarrão no lugar do arroz", fav:false },
];

const PANTRY_CHIPS = ["frango peito","coxa e sobrecoxa","carne moída","camarão","salmão","ovos","queijo","manteiga","azeite","alho","cebola","couve-flor","brócolis","abobrinha","espinafre","tomate","requeijão cremoso","creme de leite","chocolate 70%","abacate","limão","páprica","parmesão","bacon","arroz","feijão","muçarela"];
const SECTORS = ["🥩 Açougue","🧀 Frios/Laticínios","🥦 Hortifrúti","🧊 Congelados","🛒 Mercearia","🧴 Limpeza"];
const GATILHOS = ["Estudo pesado","Cansaço acumulado","Noite difícil com Kauê","Tédio","Ansiedade","Solidão","Pressão do concurso","PMS","Outro"];
const BATCH_STEPS = [
  {time:"06h00",task:"Frango 2kg na pressão",detail:"Água + alho + sal + louro → 12–15min. Passivo — aproveite para arrumar a cozinha.",eletro:"Panela Elétrica",who:"ambos"},
  {time:"06h15",task:"Couve-flor no vapor",detail:"Cesta vapor + 1/2 xíc água → pressão 10min. Frango ainda cozinhando.",eletro:"Panela Elétrica",who:"rity"},
  {time:"06h25",task:"Purê de couve-flor",detail:"Floretes quentes + manteiga + requeijão + sal + noz-moscada → mixer 40seg.",eletro:"Mixer",who:"rity"},
  {time:"06h35",task:"Monta Escondidinho → forno",detail:"Purê + frango pote 1 + muçarela + parmesão. Forno 200°C por 20min.",eletro:"Forno",who:"rity"},
  {time:"06h40",task:"Divide frango 3 potes",detail:"Pote 1: tomate+páprica / Pote 2: shoyu+pimenta / Pote 3: natural. Etiqueta.",eletro:"Manual",who:"ambos"},
  {time:"06h50",task:"Monta Frango Cremoso → forno",detail:"Frango + creme leite + requeijão + queijos. Forno 200°C por 25min.",eletro:"Forno",who:"rity"},
  {time:"07h30",task:"✅ TUDO PRONTO",detail:"Etiquetar com nome + data. Freezer: proteínas. Geladeira: prontos p/ comer hoje e amanhã.",eletro:"—",who:"ambos"},
];
const FREEZE_GUIDE = [
  {item:"Purê de couve-flor",tempo:"3 meses",ok:true,obs:"Usar manteiga/requeijão. NÃO leite puro."},
  {item:"Coxinha abóbora (crua)",tempo:"1 mês",ok:true,obs:"Assa direto do freezer, sem descongelar."},
  {item:"Fricassê de camarão",tempo:"2 semanas",ok:true,obs:"Sem batata palha (adiciona na hora)."},
  {item:"Frango cremoso gratinado",tempo:"7–10 dias",ok:true,obs:"Potes individuais etiquetados."},
  {item:"Escondidinho low carb",tempo:"7 dias",ok:true,obs:"Pode ir direto ao forno congelado (200°C/30min)."},
  {item:"Frango desfiado",tempo:"10 dias",ok:true,obs:"Em potes separados por tempero."},
  {item:"Mousse de corte c/ gelatina",tempo:"3 dias (geladeira)",ok:true,obs:"Não no freezer — altera textura."},
  {item:"Mousse de chocolate",tempo:"3 dias (geladeira)",ok:false,obs:"NÃO congela. Perde textura completamente."},
  {item:"Saladas",tempo:"—",ok:false,obs:"NÃO congela. Murcha."},
  {item:"Purê com leite puro",tempo:"—",ok:false,obs:"NÃO congela. Separa água ao descongelar."},
];

const pColor = p => p==="rity"?"#e8845c":p==="kaue"?"#60a5fa":"#a78bfa";
const pLabel = p => p==="rity"?"Rity":p==="kaue"?"Kauê":"Ambos";
const emotColor = v => v<=3?"#ef4444":v<=5?"#f59e0b":v<=7?"#84cc16":"#22c55e";
const emotLabel = v => v<=3?"Difícil":v<=5?"Regular":v<=7?"Bem":"Ótimo";

export default function App() {
  const [tab, setTab] = useState("home");
  const [subTab, setSubTab] = useState("receitas");
  const [recipes, setRecipes] = useState(() => load("rity_rv3", INIT_RECIPES));
  const [pantry, setPantry] = useState(() => load("rity_pantry", []));
  const [shopping, setShopping] = useState(() => load("rity_shop", {}));
  const [weights, setWeights] = useState(() => load("rity_weights", []));
  const [runs, setRuns] = useState(() => load("rity_runs", []));
  const [checkins, setCheckins] = useState(() => load("rity_checkins", []));
  const [msgs, setMsgs] = useState([{role:"assistant",text:"Oi Rity! 🌿 Sou sua mentora.\n\nTodo o seu repertório está carregado: 25 receitas do histórico com a Perplexity, técnicas completas, guia de congelamento e cronograma de batch cooking.\n\nComo você está hoje? Quer fazer o check-in ou já me conta o que precisa?"}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rfilt, setRfilt] = useState("todos");
  const [selectedR, setSelectedR] = useState(null);
  const [showAddR, setShowAddR] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showWt, setShowWt] = useState(false);
  const [showRun, setShowRun] = useState(false);
  const [newP, setNewP] = useState("");
  const [newSI, setNewSI] = useState("");
  const [newSS, setNewSS] = useState("🛒 Mercearia");
  const [newRec, setNewRec] = useState({name:"",tags:"",person:"rity",time:"",ingredients:"",steps:"",kcal:""});
  const [ci, setCi] = useState({sleep:7,battery:60,emotional:7,energy:3,taquicardia:false,water:0,keto:true,fasted:false,desvio:false,gatilho:"",note:""});
  const [newWt, setNewWt] = useState("");
  const [newRun, setNewRun] = useState({date:new Date().toISOString().slice(0,10),dist:"",pace:"",mins:"",battery:""});
  const [rsearch, setRsearch] = useState("");
  const chatEnd = useRef(null);

  useEffect(()=>{save("rity_rv3",recipes);},[recipes]);
  useEffect(()=>{save("rity_pantry",pantry);},[pantry]);
  useEffect(()=>{save("rity_shop",shopping);},[shopping]);
  useEffect(()=>{save("rity_weights",weights);},[weights]);
  useEffect(()=>{save("rity_runs",runs);},[runs]);
  useEffect(()=>{save("rity_checkins",checkins);},[checkins]);
  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const todayCi = checkins.find(c=>c.date===new Date().toISOString().slice(0,10));
  const lastWt = weights.length?weights[weights.length-1].value:null;
  const todayEm = todayCi?.emotional??7;
  const todayEnergy = todayCi?.energy??3;
  const isDMV = todayEnergy <= 2;
  const hasTaquicardia = todayCi?.taquicardia??false;
  const hour = new Date().getHours();
  const currentBlock = hour < 9 ? {label:"☀️ Oxigenação", sub:"Corpo primeiro — luz solar + exercício", color:"#f59e0b"} : hour < 12 ? {label:"🧠 Bloco Principal", sub:"09h15–11h30 — MF, RL, TI, questões pesadas", color:"#a78bfa"} : hour < 18.5 ? {label:"⏸️ Intervalo / Trabalho", sub:"Recarga de energia", color:"#6b6059"} : hour < 20 ? {label:"📖 Meta Passiva", sub:"18h30–20h — vídeos, lei seca, revisão leve", color:"#60a5fa"} : {label:"🔒 Teto Inquebrável", sub:"Após 20h — livros fechados. Período.", color:"#ef4444"};
  const totalShop = Object.values(shopping).reduce((a,b)=>a+b.length,0);
  const wtLost = lastWt?Math.max(0,90-lastWt).toFixed(1):0;
  const wtProg = lastWt?Math.min(100,((90-lastWt)/17)*100):0;

  const sendMsg = async (ov) => {
    const text = ov||input.trim(); if(!text||loading)return;
    setInput("");
    const um=[...msgs,{role:"user",text}]; setMsgs(um); setLoading(true);
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:buildSystemPrompt(pantry,lastWt,todayEm,todayCi),messages:um.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}))})});
      const d=await r.json();
      setMsgs(p=>[...p,{role:"assistant",text:d.content?.[0]?.text||"Erro."}]);
    } catch { setMsgs(p=>[...p,{role:"assistant",text:"Sem conexão."}]); }
    setLoading(false);
  };

  const saveCi=()=>{
    const entry={...ci,date:new Date().toISOString().slice(0,10)};
    setCheckins(p=>[...p.filter(c=>c.date!==entry.date),entry]);
    setShowCheckin(false);
    sendMsg(`Check-in: sono ${entry.sleep}h, battery ${entry.battery}, emocional ${entry.emotional}/10, energia ${entry.energy}/5${entry.energy<=2?' — MODO DMV':''}${entry.taquicardia?' — TAQUICARDIA':''}, keto:${entry.keto?'sim':'não'}, jejum:${entry.fasted?'sim':'não'}, desvio:${entry.desvio?'sim gatilho '+entry.gatilho:'não'}. ${entry.note||''}`);
  };
  const addP=(item)=>{const v=item||newP.trim();if(!v||pantry.includes(v))return;setPantry(p=>[...p,v]);setNewP("");};
  const addSI=()=>{if(!newSI.trim())return;setShopping(p=>{const s=p[newSS]||[];if(s.includes(newSI.trim()))return p;return{...p,[newSS]:[...s,newSI.trim()]}});setNewSI("");};
  const rmSI=(sec,item)=>setShopping(p=>{const u=(p[sec]||[]).filter(i=>i!==item);if(!u.length){const c={...p};delete c[sec];return c;}return{...p,[sec]:u};});
  const filtR=recipes.filter(r=>{
    const f=rfilt==="todos"||( rfilt==="fav"&&r.fav)||(rfilt==="rity"&&(r.person==="rity"||r.person==="ambos"))||(rfilt==="kaue"&&(r.person==="kaue"||r.person==="ambos"))||(rfilt==="batch"&&r.tags.includes("batch"))||(rfilt==="5min"&&r.tags.some(t=>t.includes("5min")||t.includes("rápido")));
    const s=!rsearch||r.name.toLowerCase().includes(rsearch.toLowerCase())||r.ingredients.some(i=>i.toLowerCase().includes(rsearch.toLowerCase()))||r.tags.some(t=>t.toLowerCase().includes(rsearch.toLowerCase()));
    return f&&s;
  });

  const S={
    app:{fontFamily:"'Nunito','DM Sans',sans-serif",background:"#12100e",minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",color:"#f5f0eb"},
    sc:{flex:1,overflowY:"auto",padding:"14px 16px 24px"},
    card:{background:"#1e1a16",borderRadius:16,padding:16,marginBottom:10,border:"1px solid #2a2420"},
    ca:(c)=>({background:c+"12",borderRadius:16,padding:16,marginBottom:10,border:`1px solid ${c}28`}),
    btn:(bg,fg="#12100e")=>({background:bg,color:fg,border:"none",borderRadius:24,padding:"9px 20px",fontSize:13,fontWeight:800,cursor:"pointer"}),
    bsm:(bg,fg="#12100e")=>({background:bg,color:fg,border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}),
    inp:{background:"#2a2420",border:"1px solid #3d3530",color:"#f5f0eb",borderRadius:10,padding:"9px 13px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"},
    lbl:{fontSize:10,color:"#9c8f85",marginBottom:4,fontWeight:800,letterSpacing:"0.6px",textTransform:"uppercase"},
    tag:(c)=>({background:c+"20",color:c,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700}),
    sec:{fontSize:12,fontWeight:900,color:"#c8a882",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10},
    row:{display:"flex",alignItems:"center",gap:8},
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      {/* HEADER */}
      <div style={{padding:"13px 18px 10px",background:"linear-gradient(160deg,#1e1a16,#12100e)",borderBottom:"1px solid #2a2420",flexShrink:0}}>
        <div style={{...S.row,justifyContent:"space-between"}}>
          <div style={S.row}>
            <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#e8845c,#c8622a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌿</div>
            <div>
              <div style={{fontWeight:900,fontSize:17,letterSpacing:"-0.5px"}}>RITY OS</div>
              <div style={{fontSize:10,color:"#9c8f85"}}>cozinha · corpo · mente · {recipes.length} receitas</div>
            </div>
          </div>
          <div style={S.row}>
            {lastWt&&<div style={{background:"#e8845c20",border:"1px solid #e8845c40",borderRadius:20,padding:"4px 10px",fontSize:12,color:"#e8845c",fontWeight:700}}>{lastWt}kg</div>}
            <div onClick={()=>setShowCheckin(true)} style={{width:34,height:34,borderRadius:"50%",background:emotColor(todayEm)+"20",border:`2px solid ${emotColor(todayEm)}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>
              {hasTaquicardia?"💓":isDMV?"🔴":todayCi?"✓":"☐"}
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {/* HOME */}
        {tab==="home"&&<div style={S.sc}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={S.ca("#e8845c")} onClick={()=>setShowWt(true)}>
              <div style={S.lbl}>Peso Atual</div>
              <div style={{fontSize:28,fontWeight:900,color:"#e8845c"}}>{lastWt||"—"}<span style={{fontSize:13}}> kg</span></div>
              <div style={{fontSize:11,color:"#9c8f85"}}>-{wtLost}kg de -17kg</div>
              <div style={{marginTop:8,background:"#2a2420",borderRadius:99,height:5,overflow:"hidden"}}>
                <div style={{height:"100%",width:wtProg+"%",background:"linear-gradient(90deg,#e8845c,#c8622a)",borderRadius:99,transition:"width 0.8s"}}/>
              </div>
            </div>
            <div style={S.ca(emotColor(todayEm))} onClick={()=>setShowCheckin(true)}>
              <div style={S.lbl}>Estado Hoje</div>
              <div style={{fontSize:28,fontWeight:900,color:emotColor(todayEm)}}>{todayCi?todayEm:"—"}<span style={{fontSize:13}}>/10</span></div>
              <div style={{fontSize:11,color:"#9c8f85"}}>{todayCi?emotLabel(todayEm):"Fazer check-in"}</div>
              <div style={{fontSize:10,color:emotColor(todayEm),marginTop:5,fontWeight:700}}>{todayCi?`Battery: ${todayCi.battery}`:"↑ toque para registrar"}</div>
            </div>
          </div>
          {isDMV && todayCi && <div style={{...S.ca("#ef4444"),padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontWeight:900,color:"#ef4444",fontSize:14}}>🔴 MODO DMV ATIVO</div>
              <span style={{background:"#ef444420",color:"#ef4444",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700}}>Energia {todayEnergy}/5</span>
            </div>
            <div style={{fontSize:12,color:"#d4c8be",lineHeight:1.6}}>Meta de hoje: manutenção do hábito. Corte as metas pela metade. Comece pelo mais fácil.</div>
            {hasTaquicardia && <div style={{marginTop:8,fontSize:12,color:"#f59e0b",fontWeight:700}}>⚠️ Taquicardia registrada — respire antes de estudar.</div>}
            <button style={{background:"linear-gradient(135deg,#ef4444,#c0392b)",color:"#fff",border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:10}} onClick={()=>{setTab("chat");sendMsg("Estou em modo DMV hoje. Como devo organizar meu dia?");}}>Falar com mentora →</button>
          </div>}
          {!todayCi&&<div style={{...S.ca("#f59e0b"),textAlign:"center",padding:"20px 16px",marginBottom:12}}>
            <div style={{fontSize:24,marginBottom:6}}>☀️</div>
            <div style={{fontWeight:900,color:"#f59e0b",marginBottom:4}}>Começar o dia certo</div>
            <div style={{fontSize:12,color:"#9c8f85",marginBottom:12}}>Check-in de 2min para eu te guiar melhor hoje.</div>
            <button style={S.btn("#f59e0b")} onClick={()=>setShowCheckin(true)}>Fazer check-in agora</button>
          </div>}
          <div style={{...S.ca(currentBlock.color),marginBottom:12,padding:"12px 14px"}}><div style={{...S.row,justifyContent:"space-between",marginBottom:3}}><div style={{fontSize:10,fontWeight:900,color:currentBlock.color,letterSpacing:"0.8px",textTransform:"uppercase"}}>BLOCO ATUAL</div></div><div style={{fontWeight:800,fontSize:14,color:currentBlock.color}}>{currentBlock.label}</div><div style={{fontSize:11,color:"#9c8f85",marginTop:2}}>{currentBlock.sub}</div></div>
          <div style={{...S.sec,marginBottom:8}}>⚡ AÇÃO RÁPIDA</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[{icon:"💬",label:"Falar com mentora",sub:"IA online",action:()=>setTab("chat"),c:"#a78bfa"},{icon:"🍳",label:"Ver receitas",sub:recipes.length+" receitas",action:()=>{setTab("cozinha");setSubTab("receitas");},c:"#e8845c"},{icon:"🛒",label:"Lista de compras",sub:totalShop>0?totalShop+" itens":"vazia",action:()=>{setTab("cozinha");setSubTab("lista");},c:"#4ade80"},{icon:"📋",label:"Batch cooking",sub:"cronograma",action:()=>{setTab("cozinha");setSubTab("batch");},c:"#f59e0b"},{icon:"📊",label:"Registrar peso",sub:lastWt?"atual: "+lastWt+"kg":"não registrado",action:()=>setShowWt(true),c:"#e8845c"},{icon:"🏃",label:"Registrar corrida",sub:runs.length+" corridas",action:()=>setShowRun(true),c:"#60a5fa"}].map(({icon,label,sub,action,c})=>(
              <button key={label} onClick={action} style={{background:c+"10",border:`1px solid ${c}22`,borderRadius:14,padding:"13px 12px",cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:12,fontWeight:800,color:c}}>{label}</div>
                <div style={{fontSize:10,color:"#9c8f85",marginTop:1}}>{sub}</div>
              </button>
            ))}
          </div>
          {runs.length>0&&(()=>{const r=runs[runs.length-1];return(
            <div style={S.card}>
              <div style={S.sec}>🏃 ÚLTIMA CORRIDA</div>
              <div style={{...S.row,justifyContent:"space-between"}}>
                <div><div style={{fontWeight:800,fontSize:18}}>{r.dist}<span style={{fontSize:12,color:"#9c8f85"}}> km · {r.pace}/km</span></div><div style={{fontSize:11,color:"#9c8f85"}}>{r.date} · {r.mins}min</div></div>
                {r.battery&&<div style={{background:"#60a5fa15",borderRadius:10,padding:"5px 12px",textAlign:"center"}}><div style={{fontSize:9,color:"#9c8f85"}}>BATTERY</div><div style={{fontSize:18,fontWeight:900,color:"#60a5fa"}}>⚡{r.battery}</div></div>}
              </div>
            </div>
          );})()}
          {todayCi?.desvio&&<div style={S.ca("#f59e0b")}>
            <div style={S.lbl}>⚠️ Desvio Registrado</div>
            <div style={{fontSize:13,color:"#f59e0b",fontWeight:700}}>Gatilho: {todayCi.gatilho||"não especificado"}</div>
            <div style={{fontSize:12,color:"#9c8f85",marginTop:4}}>Dado registrado. Não é fracasso.</div>
            <button style={{...S.bsm("#f59e0b"),marginTop:10}} onClick={()=>{setTab("chat");sendMsg(`Tive desvio alimentar hoje. Gatilho: ${todayCi.gatilho}. Me ajuda?`);}}>Conversar com mentora →</button>
          </div>}
        </div>}

        {/* CHAT */}
        {tab==="chat"&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,overflowY:"auto",padding:"14px 14px 6px"}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{marginBottom:10,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#e8845c,#c8622a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:8,marginTop:2}}>🌿</div>}
                <div style={{maxWidth:"80%",background:m.role==="user"?"linear-gradient(135deg,#e8845c,#c8622a)":"#1e1a16",color:"#f5f0eb",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",border:m.role==="assistant"?"1px solid #2a2420":"none"}}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{display:"flex",gap:4,padding:"8px 40px"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#e8845c",animation:`bounce 1s ease-in-out ${i*0.2}s infinite`}}/>)}</div>}
            <div ref={chatEnd}/>
          </div>
          <div style={{padding:"4px 12px 6px",display:"flex",gap:6,overflowX:"auto"}}>
            {["O que cozinhar hoje?","Cardápio da semana","Lista de compras","Sinto vontade de comer","Batch cooking","Treino ou descanso?","Receita com o que tenho"].map(q=>(
              <button key={q} onClick={()=>sendMsg(q)} style={{flexShrink:0,background:"#1e1a16",border:"1px solid #2a2420",color:"#9c8f85",borderRadius:20,padding:"5px 12px",fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{q}</button>
            ))}
          </div>
          <div style={{padding:"6px 12px 14px",borderTop:"1px solid #2a2420",display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Me conta o que está rolando..." style={{...S.inp,borderRadius:24,flex:1}}/>
            <button onClick={()=>sendMsg()} disabled={loading} style={{width:42,height:42,borderRadius:"50%",background:loading?"#2a2420":"linear-gradient(135deg,#e8845c,#c8622a)",border:"none",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>↑</button>
          </div>
        </div>}

        {/* COZINHA */}
        {tab==="cozinha"&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",gap:0,borderBottom:"1px solid #2a2420",flexShrink:0,overflowX:"auto"}}>
            {[{id:"receitas",l:"📖 Receitas"},{id:"despensa",l:"🧺 Despensa"},{id:"lista",l:`🛒${totalShop>0?" "+totalShop:""}`},{id:"batch",l:"⏱️ Batch"},{id:"freezer",l:"🧊 Freezer"}].map(({id,l})=>(
              <button key={id} onClick={()=>setSubTab(id)} style={{flexShrink:0,background:"none",border:"none",borderBottom:`2px solid ${subTab===id?"#e8845c":"transparent"}`,color:subTab===id?"#e8845c":"#9c8f85",padding:"10px 14px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
            {/* RECEITAS */}
            {subTab==="receitas"&&<div>
              <div style={{...S.row,justifyContent:"space-between",marginBottom:10}}>
                <div style={S.sec}>{filtR.length} de {recipes.length}</div>
                <button style={S.bsm("#e8845c")} onClick={()=>setShowAddR(!showAddR)}>{showAddR?"Cancelar":"+ Nova"}</button>
              </div>
              <input value={rsearch} onChange={e=>setRsearch(e.target.value)} placeholder="🔍 Buscar por nome ou ingrediente..." style={{...S.inp,marginBottom:10}}/>
              <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto"}}>
                {[{id:"todos",l:"Todos"},{id:"fav",l:"⭐ Fav"},{id:"rity",l:"Rity"},{id:"kaue",l:"Kauê"},{id:"batch",l:"Batch"},{id:"5min",l:"⚡ 5min"}].map(({id,l})=>(
                  <button key={id} onClick={()=>setRfilt(id)} style={{flexShrink:0,padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:700,border:"1px solid",borderColor:rfilt===id?"#e8845c":"#2a2420",background:rfilt===id?"#e8845c18":"transparent",color:rfilt===id?"#e8845c":"#9c8f85",cursor:"pointer"}}>{l}</button>
                ))}
              </div>
              {showAddR&&<div style={{...S.card,marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:900,color:"#e8845c",marginBottom:10}}>+ Nova Receita</div>
                {[{l:"Nome",k:"name",p:"Ex: Frango ao limão"},{l:"Tags (vírgulas)",k:"tags",p:"keto, batch"},{l:"Ingredientes (vírgulas)",k:"ingredients",p:"frango, limão, alho"},{l:"Tempo",k:"time",p:"20min"},{l:"Kcal",k:"kcal",p:"400"}].map(({l,k,p})=>(
                  <div key={k} style={{marginBottom:8}}><div style={S.lbl}>{l}</div><input value={newRec[k]} onChange={e=>setNewRec(prev=>({...prev,[k]:e.target.value}))} placeholder={p} style={S.inp}/></div>
                ))}
                <div style={{marginBottom:8}}><div style={S.lbl}>Para quem</div><select value={newRec.person} onChange={e=>setNewRec(p=>({...p,person:e.target.value}))} style={S.inp}><option value="rity">Rity (low carb)</option><option value="kaue">Kauê</option><option value="ambos">Ambos</option></select></div>
                <div style={{marginBottom:12}}><div style={S.lbl}>Preparo</div><textarea value={newRec.steps} onChange={e=>setNewRec(p=>({...p,steps:e.target.value}))} placeholder="Passo a passo..." rows={3} style={{...S.inp,resize:"none"}}/></div>
                <button onClick={()=>{if(!newRec.name.trim())return;setRecipes(p=>[...p,{id:Date.now(),name:newRec.name,tags:newRec.tags.split(",").map(t=>t.trim()).filter(Boolean),person:newRec.person,time:newRec.time,ingredients:newRec.ingredients.split(",").map(i=>i.trim()).filter(Boolean),steps:newRec.steps,kcal:parseInt(newRec.kcal)||0,fav:false}]);setNewRec({name:"",tags:"",person:"rity",time:"",ingredients:"",steps:"",kcal:""});setShowAddR(false);}} style={{...S.btn("linear-gradient(135deg,#e8845c,#c8622a)","#fff"),width:"100%",padding:11}}>Salvar Receita</button>
              </div>}
              {selectedR?(
                <div>
                  <button onClick={()=>setSelectedR(null)} style={{background:"none",border:"none",color:"#e8845c",fontSize:13,cursor:"pointer",marginBottom:10,padding:0}}>← Voltar</button>
                  <div style={S.card}>
                    <div style={{...S.row,justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontWeight:900,fontSize:17,flex:1}}>{selectedR.name}</div>
                      <button onClick={()=>{setRecipes(p=>p.map(r=>r.id===selectedR.id?{...r,fav:!r.fav}:r));setSelectedR(p=>({...p,fav:!p.fav}));}} style={{background:"none",border:"none",fontSize:22,cursor:"pointer"}}>{selectedR.fav?"⭐":"☆"}</button>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                      <span style={S.tag(pColor(selectedR.person))}>{pLabel(selectedR.person)}</span>
                      {selectedR.tags.map(t=><span key={t} style={S.tag("#6b6059")}>{t}</span>)}
                      {selectedR.time&&<span style={{fontSize:12,color:"#9c8f85"}}>⏱️ {selectedR.time}</span>}
                      {selectedR.kcal>0&&<span style={{fontSize:12,color:"#9c8f85"}}>🔥 {selectedR.kcal}kcal</span>}
                    </div>
                    <div style={{marginBottom:12}}><div style={S.lbl}>Ingredientes</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{selectedR.ingredients.map(i=><span key={i} style={{background:"#2a2420",borderRadius:8,padding:"4px 10px",fontSize:12}}>{i}</span>)}</div></div>
                    <div><div style={S.lbl}>Modo de Preparo</div><div style={{fontSize:13,lineHeight:1.8,color:"#d4c8be",whiteSpace:"pre-wrap"}}>{selectedR.steps}</div></div>
                  </div>
                </div>
              ):(
                <div>
                  {filtR.length===0&&<div style={{textAlign:"center",color:"#9c8f85",padding:32,fontSize:13}}>Nenhuma receita encontrada.</div>}
                  {filtR.map(r=>(
                    <div key={r.id} onClick={()=>setSelectedR(r)} style={{...S.card,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{r.name}</div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <span style={S.tag(pColor(r.person))}>{pLabel(r.person)}</span>
                          {r.time&&<span style={{color:"#9c8f85",fontSize:11}}>⏱️ {r.time}</span>}
                          {r.kcal>0&&<span style={{color:"#9c8f85",fontSize:11}}>🔥{r.kcal}</span>}
                          {r.tags.slice(0,2).map(t=><span key={t} style={{fontSize:10,color:"#6b6059"}}>#{t}</span>)}
                        </div>
                      </div>
                      <span style={{marginLeft:8,fontSize:r.fav?18:14,color:r.fav?"#f59e0b":"#6b6059"}}>{r.fav?"⭐":"›"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>}
            {/* DESPENSA */}
            {subTab==="despensa"&&<div>
              <div style={S.sec}>🧺 DESPENSA ({pantry.length} itens)</div>
              <div style={{...S.row,marginBottom:10}}>
                <input value={newP} onChange={e=>setNewP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addP()} placeholder="Adicionar item..." style={{...S.inp,flex:1}}/>
                <button onClick={()=>addP()} style={S.btn("#4ade80")}>+</button>
              </div>
              <div style={{marginBottom:10}}><div style={S.lbl}>Adicionar rápido</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{PANTRY_CHIPS.filter(s=>!pantry.includes(s)).slice(0,16).map(s=><button key={s} onClick={()=>addP(s)} style={{background:"#1e1a16",border:"1px solid #2a2420",color:"#9c8f85",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>+{s}</button>)}</div></div>
              {pantry.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>{pantry.map(item=><div key={item} style={{background:"#2a2420",border:"1px solid #3d3530",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:6,fontSize:12}}>{item}<button onClick={()=>setPantry(p=>p.filter(i=>i!==item))} style={{background:"none",border:"none",color:"#9c8f85",cursor:"pointer",padding:0,fontSize:14}}>×</button></div>)}</div>}
              {pantry.length>0&&<button onClick={()=>{setTab("chat");sendMsg(`Tenho em casa: ${pantry.join(", ")}. O que posso cozinhar hoje para mim e para o Kauê?`);}} style={{...S.btn("linear-gradient(135deg,#e8845c,#c8622a)","#fff"),width:"100%"}}>🤖 O que cozinhar com isso?</button>}
            </div>}
            {/* LISTA */}
            {subTab==="lista"&&<div>
              <div style={{...S.row,justifyContent:"space-between",marginBottom:10}}>
                <div style={S.sec}>🛒 LISTA ({totalShop})</div>
                {totalShop>0&&<button onClick={()=>setShopping({})} style={S.bsm("#3d3530","#9c8f85")}>Limpar</button>}
              </div>
              <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                <select value={newSS} onChange={e=>setNewSS(e.target.value)} style={{...S.inp,flex:"0 0 auto",width:"auto"}}>{SECTORS.map(s=><option key={s} value={s}>{s}</option>)}</select>
                <input value={newSI} onChange={e=>setNewSI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSI()} placeholder="Item..." style={{...S.inp,flex:1,minWidth:80}}/>
                <button onClick={addSI} style={S.btn("#4ade80")}>+</button>
              </div>
              {totalShop===0?<div><div style={{fontSize:12,color:"#9c8f85",marginBottom:16,textAlign:"center",padding:20}}>Lista vazia.</div><button onClick={()=>{setTab("chat");sendMsg("Monta a lista de compras da semana. Vou te passar o que já tenho em casa.");}} style={{...S.btn("linear-gradient(135deg,#e8845c,#c8622a)","#fff"),width:"100%"}}>🤖 Gerar lista com IA</button></div>:
                SECTORS.filter(s=>shopping[s]?.length>0).map(sec=>(
                  <div key={sec} style={{marginBottom:14}}>
                    <div style={{fontSize:12,color:"#e8845c",fontWeight:900,marginBottom:6}}>{sec}</div>
                    {shopping[sec].map(item=><div key={item} style={{background:"#1e1a16",border:"1px solid #2a2420",borderRadius:8,padding:"8px 12px",marginBottom:4,display:"flex",justifyContent:"space-between",fontSize:13}}>{item}<button onClick={()=>rmSI(sec,item)} style={{background:"none",border:"none",color:"#4ade80",cursor:"pointer",fontSize:16}}>✓</button></div>)}
                  </div>
                ))
              }
            </div>}
            {/* BATCH */}
            {subTab==="batch"&&<div>
              <div style={S.sec}>⏱️ CRONOGRAMA BATCH COOKING</div>
              <div style={{...S.ca("#f59e0b"),marginBottom:14}}><div style={{fontSize:12,color:"#f59e0b",fontWeight:800,marginBottom:4}}>MODELO — SÁBADO MANHÃ (2h)</div><div style={{fontSize:11,color:"#9c8f85"}}>Proteínas + purê + escondidinho + frango cremoso. Congela a semana inteira.</div></div>
              {BATCH_STEPS.map((s,i)=>(
                <div key={i} style={{...S.card,marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{background:"#e8845c18",borderRadius:10,padding:"6px 10px",flexShrink:0,textAlign:"center"}}>
                    <div style={{fontSize:11,fontWeight:900,color:"#e8845c"}}>{s.time}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:13,marginBottom:2}}>{s.task}</div>
                    <div style={{fontSize:11,color:"#9c8f85",marginBottom:4}}>{s.detail}</div>
                    <div style={{display:"flex",gap:5}}><span style={S.tag("#9c8f85")}>{s.eletro}</span><span style={S.tag(pColor(s.who==="ambos"?"ambos":s.who))}>{pLabel(s.who==="ambos"?"ambos":s.who)}</span></div>
                  </div>
                </div>
              ))}
              <button onClick={()=>{setTab("chat");sendMsg("Vou fazer batch cooking agora. Me ajuda a personalizar o cronograma de hoje?");}} style={{...S.btn("linear-gradient(135deg,#e8845c,#c8622a)","#fff"),width:"100%",marginTop:8}}>🤖 Personalizar com mentora</button>
            </div>}
            {/* FREEZER */}
            {subTab==="freezer"&&<div>
              <div style={S.sec}>🧊 GUIA DE CONGELAMENTO</div>
              <div style={{...S.ca("#60a5fa"),marginBottom:14}}><div style={{fontSize:12,color:"#60a5fa",fontWeight:800,marginBottom:4}}>SISTEMA DE POTES</div><div style={{fontSize:11,color:"#9c8f85"}}>Sempre etiquetar: nome + data. Potes individuais = nunca ficar sem opção.</div></div>
              {FREEZE_GUIDE.map((g,i)=>(
                <div key={i} style={{...S.card,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,marginRight:8}}>
                    <div style={{fontWeight:800,fontSize:13,marginBottom:3}}>{g.item}</div>
                    <div style={{fontSize:11,color:"#9c8f85"}}>{g.obs}</div>
                  </div>
                  <span style={S.tag(g.ok?"#4ade80":"#ef4444")}>{g.tempo}</span>
                </div>
              ))}
            </div>}
          </div>
        </div>}

        {/* CORPO */}
        {tab==="corpo"&&<div style={S.sc}>
          <div style={{...S.row,justifyContent:"space-between",marginBottom:10}}>
            <div style={S.sec}>⚖️ PESO</div>
            <button style={S.bsm("#e8845c")} onClick={()=>setShowWt(true)}>+ Registrar</button>
          </div>
          {lastWt?<div style={S.ca("#e8845c")}>
            <div style={{...S.row,justifyContent:"space-between",marginBottom:10}}>
              <div><div style={{fontSize:32,fontWeight:900,color:"#e8845c"}}>{lastWt}<span style={{fontSize:14}}> kg</span></div><div style={{fontSize:12,color:"#9c8f85"}}>Meta: 73kg · -{wtLost}kg de -17kg</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#9c8f85"}}>Falta</div><div style={{fontSize:24,fontWeight:900,color:"#f59e0b"}}>{Math.max(0,(lastWt-73)).toFixed(1)}<span style={{fontSize:12}}>kg</span></div></div>
            </div>
            <div style={{background:"#2a2420",borderRadius:99,height:8,overflow:"hidden"}}><div style={{height:"100%",width:wtProg+"%",background:"linear-gradient(90deg,#e8845c,#c8622a)",borderRadius:99}}/></div>
            <div style={{fontSize:11,color:"#9c8f85",marginTop:5}}>{wtProg.toFixed(0)}% da meta</div>
          </div>:<div style={{...S.card,textAlign:"center",padding:24}}><div style={{fontSize:12,color:"#9c8f85",marginBottom:10}}>Nenhum peso registrado.</div><button style={S.btn("#e8845c")} onClick={()=>setShowWt(true)}>Registrar agora</button></div>}
          {weights.length>1&&<div style={S.card}><div style={S.lbl}>Histórico</div><div style={{display:"flex",gap:6,overflowX:"auto"}}>{weights.slice(-7).map((w,i)=><div key={i} style={{flexShrink:0,textAlign:"center"}}><div style={{fontSize:10,color:"#9c8f85",marginBottom:3}}>{w.date.slice(5)}</div><div style={{background:"#e8845c15",border:"1px solid #e8845c30",borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:700,color:"#e8845c"}}>{w.value}</div></div>)}</div></div>}
          <div style={{...S.row,justifyContent:"space-between",marginBottom:10,marginTop:4}}><div style={S.sec}>🏃 CORRIDAS</div><button style={S.bsm("#60a5fa")} onClick={()=>setShowRun(true)}>+ Registrar</button></div>
          {runs.length===0?<div style={{...S.card,textAlign:"center",padding:20,fontSize:12,color:"#9c8f85"}}>Nenhuma corrida registrada.</div>:runs.slice(-5).reverse().map(r=>(
            <div key={r.id} style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:800,fontSize:16}}>{r.dist}<span style={{fontSize:11,color:"#9c8f85"}}> km · {r.pace}/km</span></div><div style={{fontSize:11,color:"#9c8f85"}}>{r.date} · {r.mins}min</div></div>
              {r.battery&&<div style={{background:"#60a5fa15",borderRadius:10,padding:"5px 10px"}}><div style={{fontSize:9,color:"#9c8f85"}}>BATTERY</div><div style={{fontSize:16,fontWeight:900,color:"#60a5fa"}}>⚡{r.battery}</div></div>}
            </div>
          ))}
          <div style={S.sec}>☀️ CHECK-INS</div>
          {checkins.length===0?<div style={{fontSize:12,color:"#9c8f85"}}>Nenhum check-in feito.</div>:checkins.slice(-5).reverse().map((c,i)=>(
            <div key={i} style={S.card}>
              <div style={{...S.row,justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:"#9c8f85"}}>{c.date}</span><span style={S.tag(emotColor(c.emotional))}>{emotLabel(c.emotional)} {c.emotional}/10</span></div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#9c8f85"}}>😴 {c.sleep}h</span><span style={{fontSize:11,color:"#9c8f85"}}>⚡ {c.battery}</span>
                <span style={{fontSize:11,color:c.keto?"#4ade80":"#ef4444"}}>{c.keto?"✓":"✗"} keto</span>
                {c.desvio&&<span style={S.tag("#f59e0b")}>⚠️ {c.gatilho}</span>}
              </div>
              {c.note&&<div style={{fontSize:11,color:"#9c8f85",marginTop:5,fontStyle:"italic"}}>"{c.note}"</div>}
            </div>
          ))}
        </div>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{display:"flex",background:"#1a1612",borderTop:"1px solid #2a2420",flexShrink:0}}>
        {[{id:"home",icon:"🏠",label:"Início"},{id:"chat",icon:"🌿",label:"Mentora"},{id:"cozinha",icon:"🍳",label:`Cozinha${totalShop>0?" ·"+totalShop:""}`},{id:"corpo",icon:"🏃",label:"Corpo"}].map(({id,icon,label})=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"10px 0 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:20}}>{icon}</span>
            <span style={{fontSize:10,fontWeight:700,color:tab===id?"#e8845c":"#9c8f85"}}>{label}</span>
            {tab===id&&<div style={{width:4,height:4,borderRadius:"50%",background:"#e8845c"}}/>}
          </button>
        ))}
      </div>

      {/* MODAIS */}
      {showCheckin&&<div style={{position:"fixed",inset:0,background:"#000b",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowCheckin(false)}>
        <div style={{background:"#1e1a16",borderRadius:"20px 20px 0 0",padding:"20px 18px 30px",width:"100%",maxWidth:480,margin:"0 auto",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:900,fontSize:17,marginBottom:16,color:"#e8845c"}}>☀️ Check-in de Hoje</div>
          {[{l:"Sono (horas)",k:"sleep",min:3,max:12,step:0.5,unit:"h"},{l:"Body Battery Garmin",k:"battery",min:0,max:100,step:1,unit:""},{l:"Estado Emocional",k:"emotional",min:1,max:10,step:1,unit:"/10"},{l:"Energia para estudar",k:"energy",min:1,max:5,step:1,unit:"/5"}].map(({l,k,min,max,step,unit})=>(
            <div key={k} style={{marginBottom:14}}>
              <div style={{...S.row,justifyContent:"space-between",marginBottom:6}}>
                <div style={S.lbl}>{l}</div>
                <div style={{fontWeight:900,color:k==="emotional"?emotColor(ci[k]):k==="energy"?(ci[k]<=2?"#ef4444":ci[k]<=3?"#f59e0b":"#22c55e"):"#e8845c",fontSize:18}}>{ci[k]}{unit}{k==="energy"&&ci[k]<=2?" 🔴 DMV":""}</div>
              </div>
              <input type="range" min={min} max={max} step={step} value={ci[k]} onChange={e=>setCi(p=>({...p,[k]:parseFloat(e.target.value)}))} style={{width:"100%",accentColor:k==="emotional"?emotColor(ci[k]):k==="energy"?(ci[k]<=2?"#ef4444":ci[k]<=3?"#f59e0b":"#22c55e"):"#e8845c"}}/>
            </div>
          ))}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[{l:"✓ Keto hoje",k:"keto"},{l:"⏱️ Jejum feito",k:"fasted"},{l:"💓 Taquicardia",k:"taquicardia"},{l:"⚠️ Desvio alimentar",k:"desvio"}].map(({l,k})=>(
              <button key={k} onClick={()=>setCi(p=>({...p,[k]:!p[k]}))} style={{background:ci[k]?"#e8845c18":"#2a2420",border:`1px solid ${ci[k]?"#e8845c":"#3d3530"}`,borderRadius:10,padding:"10px 8px",fontSize:12,fontWeight:700,color:ci[k]?"#e8845c":"#9c8f85",cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          {ci.desvio&&<div style={{marginBottom:14}}><div style={S.lbl}>Qual gatilho?</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{GATILHOS.map(g=><button key={g} onClick={()=>setCi(p=>({...p,gatilho:g}))} style={{background:ci.gatilho===g?"#f59e0b18":"#2a2420",border:`1px solid ${ci.gatilho===g?"#f59e0b":"#3d3530"}`,borderRadius:20,padding:"4px 11px",fontSize:11,color:ci.gatilho===g?"#f59e0b":"#9c8f85",cursor:"pointer"}}>{g}</button>)}</div></div>}
          <div style={{marginBottom:16}}><div style={S.lbl}>Nota livre</div><input value={ci.note} onChange={e=>setCi(p=>({...p,note:e.target.value}))} placeholder="Como você está?" style={S.inp}/></div>
          <button onClick={saveCi} style={{...S.btn("linear-gradient(135deg,#e8845c,#c8622a)","#fff"),width:"100%",padding:13,fontSize:15,borderRadius:14}}>Registrar + Enviar para Mentora</button>
        </div>
      </div>}

      {showWt&&<div style={{position:"fixed",inset:0,background:"#000b",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowWt(false)}>
        <div style={{background:"#1e1a16",borderRadius:"20px 20px 0 0",padding:"24px 18px 32px",width:"100%",maxWidth:480,margin:"0 auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:900,fontSize:17,marginBottom:16}}>⚖️ Registrar Peso</div>
          <input type="number" step="0.1" value={newWt} onChange={e=>setNewWt(e.target.value)} placeholder="Ex: 88.5" style={{...S.inp,fontSize:22,textAlign:"center",marginBottom:14}}/>
          <button onClick={()=>{const v=parseFloat(newWt);if(!v)return;setWeights(p=>[...p,{date:new Date().toISOString().slice(0,10),value:v}]);setNewWt("");setShowWt(false);}} style={{...S.btn("linear-gradient(135deg,#e8845c,#c8622a)","#fff"),width:"100%",padding:13,fontSize:15,borderRadius:14}}>Salvar</button>
        </div>
      </div>}

      {showRun&&<div style={{position:"fixed",inset:0,background:"#000b",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowRun(false)}>
        <div style={{background:"#1e1a16",borderRadius:"20px 20px 0 0",padding:"24px 18px 32px",width:"100%",maxWidth:480,margin:"0 auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:900,fontSize:17,marginBottom:16}}>🏃 Registrar Corrida</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[{l:"Distância (km)",k:"dist",p:"5.2"},{l:"Pace (min/km)",k:"pace",p:"8:20"},{l:"Duração (min)",k:"mins",p:"40"},{l:"Body Battery",k:"battery",p:"65"}].map(({l,k,p})=>(
              <div key={k}><div style={S.lbl}>{l}</div><input value={newRun[k]} onChange={e=>setNewRun(prev=>({...prev,[k]:e.target.value}))} placeholder={p} style={S.inp}/></div>
            ))}
          </div>
          <button onClick={()=>{if(!newRun.dist)return;setRuns(p=>[...p,{...newRun,id:Date.now()}]);setNewRun({date:new Date().toISOString().slice(0,10),dist:"",pace:"",mins:"",battery:""});setShowRun(false);}} style={{...S.btn("linear-gradient(135deg,#60a5fa,#3b82f6)","#fff"),width:"100%",padding:13,fontSize:15,borderRadius:14}}>Salvar Corrida</button>
        </div>
      </div>}

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-5px);opacity:1}}*{box-sizing:border-box}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#2a2420;border-radius:2px}input::placeholder,textarea::placeholder{color:#4a3f38}input[type=range]{-webkit-appearance:none;height:5px;background:#2a2420;border-radius:3px;outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#e8845c;cursor:pointer}select option{background:#1e1a16;color:#f5f0eb}`}</style>
    </div>
  );
}
