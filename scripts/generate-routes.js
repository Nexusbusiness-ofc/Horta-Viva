import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Pasta dist não encontrada. Execute vite build primeiro.');
  process.exit(1);
}

const baseIndexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(baseIndexHtmlPath)) {
  console.error('dist/index.html não encontrado.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseIndexHtmlPath, 'utf8');

const ROUTES = [
  {
    path: 'podas-mondas',
    title: 'Guia de Podas e Mondas em Portugal — Horta Viva',
    description: 'Calendário e guia prático de podas de árvores de fruto, oliveiras, citrinos, vinha e técnicas de monda para uma colheita saudável em Portugal.'
  },
  {
    path: 'animais',
    title: 'Animais da Quinta & Guia de Capoeira — Horta Viva',
    description: 'Guia de criação de galinhas poedeiras, cabras, ovelhas, patos, coelhos e abelhas. Cuidados diários, alimentação e diagnóstico de saúde.'
  },
  {
    path: 'calendario-curas',
    title: 'Curas e Produtos Fitofarmacêuticos — Horta Viva',
    description: 'Tratamentos fitofarmacêuticos e biológicos para combater míldio, oídio, pulgões e pragas em fruteiras e culturas hortícolas.'
  },
  {
    path: 'identificar',
    title: 'Identificador IA de Plantas e Animais por Foto — Horta Viva',
    description: 'Tira ou carrega uma fotografia para diagnosticar doenças em plantas ou identificar animais da quinta com Inteligência Artificial em tempo real.'
  },
  {
    path: 'cogumelos',
    title: 'Catálogo Micológico e Cogumelos de Portugal — Horta Viva',
    description: 'Guia e identificação de cogumelos silvestres comestíveis e tóxicos em Portugal. Épocas de colheita, habitats e regras de segurança.'
  },
  {
    path: 'minha-quinta',
    title: 'Minha Quinta & Gestão de Cultivos — Horta Viva',
    description: 'Gere as tuas plantações, colheitas, rega e criação de animais da quinta num único painel organizado com alertas inteligentes.'
  },
  {
    path: 'tarefas-hoje',
    title: 'Tarefas Diárias na Horta e Quinta — Horta Viva',
    description: 'Agenda e lista diária de tarefas inteligentes: rega, podas sazonais, tratamentos fitossanitários e cuidados com animais.'
  },
  {
    path: 'resumo-mensal',
    title: 'Resumo Mensal e Calendário Agrícola — Horta Viva',
    description: 'Visão geral mês a mês do que semear, plantar, podar e colher em Portugal com o calendário agrícola tradicional.'
  },
  {
    path: 'pro',
    title: 'Horta Viva Pro — Subscrições e Recursos Ilimitados',
    description: 'Acesso ilimitado ao Identificador IA por foto, sincronização de dados na nuvem e ferramentas agronómicas exclusivas da Horta Viva.'
  },
  {
    path: 'perfil',
    title: 'Perfil do Agricultor — Horta Viva',
    description: 'Dados da quinta, preferências de cultivo e configurações da aplicação Horta Viva.'
  }
];

const SITE_URL = 'https://nexusbusiness-ofc.github.io/Horta-Viva';

console.log('🚀 A gerar páginas estáticas para indexação multi-página no Google...');

for (const route of ROUTES) {
  const routeDir = path.join(distDir, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const canonicalUrl = `${SITE_URL}/${route.path}/`;

  let routeHtml = baseHtml
    // Atualizar título
    .replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)
    // Atualizar description
    .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${route.description}" />`)
    // Atualizar canonical
    .replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
    // Atualizar Open Graph
    .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
    // Atualizar Twitter
    .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`);

  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
  console.log(`  ✓ ${route.path}/index.html gerado com metatags dedicadas.`);
}

// Garantir que public/404.html é copiado para dist/404.html se necessário
const public404Path = path.resolve(__dirname, '../public/404.html');
const dist404Path = path.join(distDir, '404.html');
if (fs.existsSync(public404Path) && !fs.existsSync(dist404Path)) {
  fs.copyFileSync(public404Path, dist404Path);
  console.log('  ✓ 404.html copiado para dist/404.html.');
}

console.log('🎉 Rotas estáticas geradas com sucesso para o GitHub Pages!');
