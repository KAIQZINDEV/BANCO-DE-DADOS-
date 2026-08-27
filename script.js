/* =====================================================
   DATACORE — LÓGICA DA APLICAÇÃO
===================================================== */

const K = {
  clients: 'datacore_clients_v2',
  logs: 'datacore_logs_v2',
  theme: 'datacore_theme'
};

const PAGE_SIZE = 6;

const SEED_CLIENTS = [
  { id: 1, nome: 'Ana Souza',        email: 'ana@email.com',      telefone: '(11) 98888-1234', status: 'Ativo',   createdAt: '2026-08-27T09:10:00' },
  { id: 2, nome: 'Carlos Oliveira',  email: 'carlos@email.com',   telefone: '(11) 97777-2345', status: 'Ativo',   createdAt: '2026-08-26T14:32:00' },
  { id: 3, nome: 'Mariana Costa',    email: 'mariana@email.com',  telefone: '(11) 96666-3456', status: 'Ativo',   createdAt: '2026-08-25T11:05:00' },
  { id: 4, nome: 'Lucas Almeida',    email: 'lucas@email.com',    telefone: '(11) 95555-4567', status: 'Inativo', createdAt: '2026-08-23T16:48:00' },
  { id: 5, nome: 'Fernanda Lima',    email: 'fernanda@email.com', telefone: '(11) 94444-5678', status: 'Ativo',   createdAt: '2026-08-21T08:55:00' },
  { id: 6, nome: 'Rafael Santos',    email: 'rafael@email.com',   telefone: '(11) 93333-6789', status: 'Ativo',   createdAt: '2026-08-19T13:20:00' },
  { id: 7, nome: 'Juliana Pereira',  email: 'juliana@email.com',  telefone: '(11) 92222-7890', status: 'Inativo', createdAt: '2026-08-16T10:15:00' },
  { id: 8, nome: 'Bruno Carvalho',   email: 'bruno@email.com',    telefone: '(11) 91111-8901', status: 'Ativo',   createdAt: '2026-08-12T17:40:00' }
];

const REPORTS = [
  { id: 1, nome: 'Clientes cadastrados',   tipo: 'Clientes',    registros: 125, data: '27/08/2026', status: 'Concluído' },
  { id: 2, nome: 'Atividade mensal',       tipo: 'Estatístico', registros: 84,  data: '26/08/2026', status: 'Concluído' },
  { id: 3, nome: 'Performance do sistema', tipo: 'Sistema',     registros: 48,  data: '25/08/2026', status: 'Processando' },
  { id: 4, nome: 'Novos clientes',         tipo: 'Clientes',    registros: 32,  data: '24/08/2026', status: 'Concluído' }
];

const CHART_7  = [14, 22, 18, 30, 26, 36, 32];
const CHART_30 = [8,10,9,12,11,14,13,15,17,16,19,18,21,20,24,22,26,25,28,27,30,29,32,31,34,33,36,35,38,40];
const LABELS_7 = ['Seg','Ter','Qua','Qui','Sex','Sáb','Hoje'];

let clients = load(K.clients) || SEED_CLIENTS.slice();
let logs = load(K.logs) || [];
let clientsPage = 1;
let dbTableAtual = '';
let confirmCallback = null;
let paletteSelIndex = -1;

/* =========================
   HELPERS
========================= */

function load(key){
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch(e){ return null; }
}
function save(){
  localStorage.setItem(K.clients, JSON.stringify(clients));
  localStorage.setItem(K.logs, JSON.stringify(logs));
}
function uid(arr){ return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1; }
function initials(name){
  return name.split(' ').map(p => p[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
}
function formatDateBR(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}
function nowTimeBR(){
  return new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function statusPill(status){
  const map = { 'Ativo':'active', 'Inativo':'inactive', 'Concluído':'active', 'Processando':'neutral' };
  return `<span class="status ${map[status] || 'neutral'}">${escapeHtml(status)}</span>`;
}
function $(sel, ctx){ return (ctx || document).querySelector(sel); }
function $all(sel, ctx){ return Array.from((ctx || document).querySelectorAll(sel)); }

/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  renderAll();
  bindNavigation();
  bindSidebarMobile();
  bindTheme();
  bindTopbar();
  bindPalette();
  bindClientToolbar();
  bindClientForm();
  bindConfirmModal();
  bindDatabasePage();
  bindReportsPage();
  bindGlobalKeys();
  bindOverlayBackdrops();
  animateGauge();
});

function renderAll(){
  renderStats();
  renderChart(document.getElementById('chartRange').value);
  renderRecent();
  renderClientsTable();
  renderDatabaseCounts();
  renderReports();
  updateMenuCount();
}

/* =====================================================
   TEMA
===================================================== */

function applyStoredTheme(){
  const stored = localStorage.getItem(K.theme);
  const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', preferred);
}
function bindTheme(){
  document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(K.theme, next);
  });
}

/* =====================================================
   NAVEGAÇÃO
===================================================== */

function bindNavigation(){
  $all('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.toast){
        showToast('info', 'Em breve', btn.dataset.toast);
        return;
      }
      showPage(btn.dataset.page);
    });
  });
  $('.brand').addEventListener('click', e => { e.preventDefault(); showPage('dashboard'); });
}

function showPage(page){
  $all('.page').forEach(p => p.classList.remove('active-page'));
  const target = document.getElementById(page);
  if (target) target.classList.add('active-page');

  $all('.menu-item[data-page]').forEach(item => item.classList.remove('active'));
  const activeItem = $all('.menu-item[data-page]').find(i => i.dataset.page === page && !i.dataset.toast);
  if (activeItem) activeItem.classList.add('active');

  closeMobileSidebar();
  window.scrollTo({ top:0, behavior:'smooth' });
}

/* =====================================================
   SIDEBAR MOBILE
===================================================== */

function bindSidebarMobile(){
  document.getElementById('sideOpen').addEventListener('click', openMobileSidebar);
  document.getElementById('sideClose').addEventListener('click', closeMobileSidebar);
  document.getElementById('sideScrim').addEventListener('click', closeMobileSidebar);
}
function openMobileSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sideScrim').classList.add('show');
}
function closeMobileSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sideScrim').classList.remove('show');
}

/* =====================================================
   TOPBAR: notificações
===================================================== */

function bindTopbar(){
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = notifPanel.hasAttribute('hidden');
    if (isHidden){
      renderNotifications();
      notifPanel.removeAttribute('hidden');
    } else {
      notifPanel.setAttribute('hidden', '');
    }
  });

  document.addEventListener('click', (e) => {
    if (!notifPanel.hasAttribute('hidden') && !e.target.closest('.notif-wrap')){
      notifPanel.setAttribute('hidden', '');
    }
  });

  document.getElementById('btnNovoCliente1').addEventListener('click', () => openClientModal('create'));
  document.getElementById('btnNovoCliente2').addEventListener('click', () => openClientModal('create'));
}

function renderNotifications(){
  const list = document.getElementById('notifList');
  const recent = logs.slice(-6).reverse();
  if (!recent.length){
    list.innerHTML = `<div class="notif-empty">Nenhuma atividade registrada ainda.</div>`;
    return;
  }
  list.innerHTML = recent.map(l => `
    <div class="notif-item">
      <div class="client-mini-avatar">${escapeHtml(initials(l.usuario))}</div>
      <div>
        <b>${escapeHtml(l.acao)}</b>
        <small>${escapeHtml(l.data)} · ${escapeHtml(l.horario)}</small>
      </div>
    </div>
  `).join('');
}

function refreshNotifDot(){
  document.getElementById('notifDot').toggleAttribute('hidden', logs.length === 0);
}

/* =====================================================
   PALETA DE COMANDO (CTRL+K)
===================================================== */

function bindPalette(){
  const overlay = document.getElementById('paletteModal');
  const input = document.getElementById('globalSearch');

  document.getElementById('searchOpener').addEventListener('click', openPalette);

  input.addEventListener('input', () => renderPaletteResults(input.value.trim().toLowerCase()));
}

function openPalette(){
  const overlay = document.getElementById('paletteModal');
  overlay.classList.add('show');
  const input = document.getElementById('globalSearch');
  input.value = '';
  renderPaletteResults('');
  setTimeout(() => input.focus(), 60);
}
function closePalette(){
  document.getElementById('paletteModal').classList.remove('show');
}

function renderPaletteResults(term){
  const box = document.getElementById('paletteResults');
  const matches = term
    ? clients.filter(c => c.nome.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
    : clients.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,6);

  if (!matches.length){
    box.innerHTML = `<div class="palette-empty">Nenhum cliente encontrado para “${escapeHtml(term)}”.</div>`;
    return;
  }

  box.innerHTML = matches.map(c => `
    <button class="palette-item" data-id="${c.id}">
      <div class="client-mini-avatar">${escapeHtml(initials(c.nome))}</div>
      <div><b>${escapeHtml(c.nome)}</b><small>${escapeHtml(c.email)}</small></div>
    </button>
  `).join('');

  $all('.palette-item', box).forEach(item => {
    item.addEventListener('click', () => {
      closePalette();
      showPage('clientes');
      document.getElementById('clientSearch').value = clients.find(c => c.id == item.dataset.id).nome;
      clientsPage = 1;
      renderClientsTable();
    });
  });
}

/* =====================================================
   ESTATÍSTICAS + SPARKLINES
========================= */

function sparklinePath(values, w, h){
  const max = Math.max(...values), min = Math.min(...values);
  const range = (max - min) || 1;
  const step = w / (values.length - 1);
  return values.map((v,i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function renderStats(){
  const total = clients.length;
  const ativos = clients.filter(c => c.status === 'Ativo').length;
  const registros = total;

  const trendTotal = [total-6, total-5, total-3, total-4, total-2, total-1, total].map(v => Math.max(v,0));
  const trendAtivos = trendTotal.map(v => Math.max(Math.round(v * (ativos/(total||1))), 0));

  const cards = [
    { label:'Total de clientes', value: total, icon:'ic-users', tone:'blue', trend: trendTotal, trendPct: '+12,5%' },
    { label:'Clientes ativos', value: ativos, icon:'ic-users', tone:'green', trend: trendAtivos, trendPct: '+8,2%' },
    { label:'Registros', value: registros, icon:'ic-db', tone:'purple', trend: trendTotal, trendPct: null, sub:'Banco principal' },
    { label:'Status do servidor', value:'Online', icon:'ic-server', tone:'orange', trend: [40,44,42,48,46,50,49], trendPct: null, sub:'99,98% uptime' }
  ];

  document.getElementById('statsRow').innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon ${c.tone}"><svg viewBox="0 0 24 24"><use href="#${c.icon}"/></svg></div>
        <svg class="stat-spark" viewBox="0 0 80 28" preserveAspectRatio="none">
          <path d="${sparklinePath(c.trend, 80, 28)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);opacity:.55"/>
        </svg>
      </div>
      <div class="stat-content">
        <span>${c.label}</span>
        <strong>${typeof c.value === 'number' ? c.value : c.value}</strong>
        ${c.trendPct ? `<span class="stat-trend up"><svg viewBox="0 0 24 24"><use href="#ic-arrow-up"/></svg>${c.trendPct} este mês</span>` : `<span class="stat-trend flat">${c.sub || ''}</span>`}
      </div>
    </div>
  `).join('');
}

/* =====================================================
   GRÁFICO DE ATIVIDADE
===================================================== */

function renderChart(range){
  const values = range === '30' ? CHART_30 : CHART_7;
  const labels = range === '30' ? [] : LABELS_7;
  const svg = document.getElementById('activitySvg');
  const W = 620, H = 200, PAD = 10;
  const max = Math.max(...values), min = 0;
  const step = (W - PAD*2) / (values.length - 1);

  const pts = values.map((v,i) => {
    const x = PAD + i*step;
    const y = H - PAD - ((v - min)/(max - min || 1)) * (H - PAD*2);
    return [x,y];
  });

  const linePath = pts.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length-1][0].toFixed(1)},${H-PAD} L${pts[0][0].toFixed(1)},${H-PAD} Z`;

  const dots = pts.map((p,i) => `
    <circle class="activity-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4">
      <title>${labels[i] ? labels[i] + ': ' : 'Dia ' + (i+1) + ': '}${values[i]} registros</title>
    </circle>
  `).join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path class="activity-area" d="${areaPath}"></path>
    <path class="activity-line" d="${linePath}"></path>
    ${dots}
  `;

  document.getElementById('chartLabels').innerHTML = labels.length
    ? labels.map(l => `<span>${l}</span>`).join('')
    : `<span>Dia 1</span><span>Dia 15</span><span>Dia 30</span>`;

  document.getElementById('chartRange').onchange = (e) => renderChart(e.target.value);
}

function animateGauge(){
  const circle = document.getElementById('gaugeCircle');
  const pct = 0.9998;
  const circumference = 2 * Math.PI * 50;
  requestAnimationFrame(() => {
    circle.style.strokeDashoffset = String(circumference * (1 - pct));
  });
}

/* =====================================================
   CLIENTES — TABELA PRINCIPAL
===================================================== */

function bindClientToolbar(){
  document.getElementById('clientSearch').addEventListener('input', () => { clientsPage = 1; renderClientsTable(); });
  document.getElementById('statusFilter').addEventListener('change', () => { clientsPage = 1; renderClientsTable(); });
  document.getElementById('sortClients').addEventListener('change', () => { clientsPage = 1; renderClientsTable(); });

  document.getElementById('clientTable').addEventListener('click', handleTableRowActions);
  document.getElementById('recentTable').addEventListener('click', handleTableRowActions);
}

function handleTableRowActions(e){
  const editBtn = e.target.closest('.action-btn.edit');
  const delBtn = e.target.closest('.action-btn.delete');
  if (editBtn) openClientModal('edit', Number(editBtn.dataset.id));
  if (delBtn) requestDeleteClient(Number(delBtn.dataset.id));
}

function getFilteredClients(){
  const term = document.getElementById('clientSearch').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const sort = document.getElementById('sortClients').value;

  let list = clients.filter(c =>
    (!term || c.nome.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.telefone.includes(term)) &&
    (!status || c.status === status)
  );

  if (sort === 'name') list = list.slice().sort((a,b) => a.nome.localeCompare(b.nome));
  else if (sort === 'status') list = list.slice().sort((a,b) => a.status.localeCompare(b.status));
  else list = list.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return list;
}

function clientRow(c, compact){
  const idCell = compact ? '' : `<td>#${String(c.id).padStart(4,'0')}</td>`;
  const actionsCell = compact
    ? `<td><div class="actions"><button class="action-btn edit" data-id="${c.id}" title="Editar"><svg viewBox="0 0 24 24"><use href="#ic-pencil"/></svg></button></div></td>`
    : `<td><div class="actions">
         <button class="action-btn edit" data-id="${c.id}" title="Editar"><svg viewBox="0 0 24 24"><use href="#ic-pencil"/></svg></button>
         <button class="action-btn delete" data-id="${c.id}" title="Excluir"><svg viewBox="0 0 24 24"><use href="#ic-trash"/></svg></button>
       </div></td>`;
  const phoneCell = compact ? '' : `<td>${escapeHtml(c.telefone)}</td>`;

  return `
    <tr>
      ${idCell}
      <td><div class="client-cell"><div class="client-mini-avatar">${escapeHtml(initials(c.nome))}</div><strong>${escapeHtml(c.nome)}</strong></div></td>
      <td>${escapeHtml(c.email)}</td>
      ${phoneCell}
      <td>${statusPill(c.status)}</td>
      <td>${formatDateBR(c.createdAt)}</td>
      ${actionsCell}
    </tr>
  `;
}

function emptyRow(colspan, message){
  return `<tr class="empty-row"><td colspan="${colspan}">
    <svg viewBox="0 0 24 24"><use href="#ic-users"/></svg><br>${message}
  </td></tr>`;
}

function renderClientsTable(){
  const filtered = getFilteredClients();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  clientsPage = Math.min(clientsPage, totalPages);
  const pageItems = filtered.slice((clientsPage-1)*PAGE_SIZE, clientsPage*PAGE_SIZE);

  const tbody = document.getElementById('clientTable');
  tbody.innerHTML = pageItems.length ? pageItems.map(c => clientRow(c, false)).join('') : emptyRow(7, 'Nenhum cliente encontrado com esses filtros.');

  document.getElementById('clientsCountLabel').textContent =
    `${filtered.length} cliente${filtered.length === 1 ? '' : 's'}${filtered.length !== clients.length ? ` de ${clients.length}` : ''}`;

  renderPagination(totalPages);
}

function renderPagination(totalPages){
  const box = document.getElementById('pagination');
  let html = `<button class="page-btn" id="pgPrev" ${clientsPage===1?'disabled':''} aria-label="Página anterior">‹</button>`;
  for (let i=1; i<=totalPages; i++){
    html += `<button class="page-btn ${i===clientsPage?'active':''}" data-p="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" id="pgNext" ${clientsPage===totalPages?'disabled':''} aria-label="Próxima página">›</button>`;
  box.innerHTML = html;

  box.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { clientsPage = Number(b.dataset.p); renderClientsTable(); }));
  const prev = document.getElementById('pgPrev'); if (prev) prev.addEventListener('click', () => { clientsPage--; renderClientsTable(); });
  const next = document.getElementById('pgNext'); if (next) next.addEventListener('click', () => { clientsPage++; renderClientsTable(); });
}

function renderRecent(){
  const recent = clients.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);
  const tbody = document.getElementById('recentTable');
  tbody.innerHTML = recent.length ? recent.map(c => clientRow(c, true)).join('') : emptyRow(5, 'Nenhum cliente cadastrado ainda.');
}

function updateMenuCount(){
  document.getElementById('menuCountClientes').textContent = clients.length;
}

/* =====================================================
   MODAL DE CLIENTE (criar / editar)
===================================================== */

function bindClientForm(){
  document.getElementById('fecharModalBtn').addEventListener('click', closeClientModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeClientModal);
  document.getElementById('clientForm').addEventListener('submit', handleClientSubmit);
}

function openClientModal(mode, id){
  const overlay = document.getElementById('modal');
  const form = document.getElementById('clientForm');
  form.reset();
  clearFieldErrors();

  if (mode === 'edit'){
    const c = clients.find(x => x.id === id);
    if (!c) return;
    document.getElementById('modalTitle').textContent = 'Editar cliente';
    document.getElementById('modalSubtitle').textContent = 'Atualize as informações do registro.';
    document.getElementById('clientId').value = c.id;
    document.getElementById('nome').value = c.nome;
    document.getElementById('email').value = c.email;
    document.getElementById('telefone').value = c.telefone;
    document.getElementById('statusSelect').value = c.status;
    document.getElementById('submitClientBtn').innerHTML = '<svg viewBox="0 0 24 24"><use href="#ic-check"/></svg>Salvar alterações';
  } else {
    document.getElementById('modalTitle').textContent = 'Novo cliente';
    document.getElementById('modalSubtitle').textContent = 'Adicione um novo registro ao banco.';
    document.getElementById('clientId').value = '';
    document.getElementById('statusSelect').value = 'Ativo';
    document.getElementById('submitClientBtn').innerHTML = '<svg viewBox="0 0 24 24"><use href="#ic-check"/></svg>Salvar cliente';
  }

  overlay.classList.add('show');
  setTimeout(() => document.getElementById('nome').focus(), 60);
}
function closeClientModal(){
  document.getElementById('modal').classList.remove('show');
}
function clearFieldErrors(){
  ['errNome','errEmail','errTelefone'].forEach(id => document.getElementById(id).textContent = '');
}

function handleClientSubmit(e){
  e.preventDefault();
  clearFieldErrors();

  const id = document.getElementById('clientId').value;
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const status = document.getElementById('statusSelect').value;

  let valid = true;
  if (nome.length < 3){ document.getElementById('errNome').textContent = 'Digite o nome completo.'; valid = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)){ document.getElementById('errEmail').textContent = 'E-mail inválido.'; valid = false; }
  if (telefone.length < 8){ document.getElementById('errTelefone').textContent = 'Telefone inválido.'; valid = false; }
  if (!valid) return;

  if (id){
    const c = clients.find(x => x.id === Number(id));
    c.nome = nome; c.email = email; c.telefone = telefone; c.status = status;
    addLog(`Cliente "${nome}" atualizado`);
    showToast('success', 'Cliente atualizado', `${nome} foi atualizado com sucesso.`);
  } else {
    clients.push({ id: uid(clients), nome, email, telefone, status, createdAt: new Date().toISOString() });
    addLog(`Cliente "${nome}" cadastrado`);
    showToast('success', 'Cliente cadastrado', `${nome} foi adicionado ao banco de dados.`);
  }

  save();
  closeClientModal();
  clientsPage = 1;
  renderAll();
}

/* =====================================================
   EXCLUSÃO (modal de confirmação)
===================================================== */

function bindConfirmModal(){
  document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirmModal);
  document.getElementById('confirmOkBtn').addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
  });
}
function requestDeleteClient(id){
  const c = clients.find(x => x.id === id);
  if (!c) return;
  document.getElementById('confirmTitle').textContent = 'Excluir cliente?';
  document.getElementById('confirmText').textContent = `Tem certeza que deseja excluir "${c.nome}"? Essa ação não pode ser desfeita.`;
  confirmCallback = () => {
    clients = clients.filter(x => x.id !== id);
    addLog(`Cliente "${c.nome}" excluído`);
    save();
    renderAll();
    showToast('success', 'Cliente excluído', `${c.nome} foi removido do sistema.`);
  };
  document.getElementById('confirmModal').classList.add('show');
}
function closeConfirmModal(){
  document.getElementById('confirmModal').classList.remove('show');
  confirmCallback = null;
}

/* =====================================================
   BANCO DE DADOS
===================================================== */

function bindDatabasePage(){
  $all('.database-row').forEach(row => {
    row.addEventListener('click', () => openTable(row.dataset.table));
  });
  document.getElementById('fecharTabelaBtn').addEventListener('click', () => {
    document.getElementById('databaseTableArea').classList.remove('show');
  });
  document.getElementById('databaseSearch').addEventListener('input', (e) => renderDbTable(dbTableAtual, e.target.value));
  document.getElementById('exportTableBtn').addEventListener('click', () => exportCSV(dbTableAtual));
}

function openTable(name){
  dbTableAtual = name;
  const area = document.getElementById('databaseTableArea');
  const titleMap = { clientes:'Clientes', relatorios:'Relatórios', logs:'Logs do sistema' };
  const descMap = {
    clientes:'Todos os clientes cadastrados no sistema.',
    relatorios:'Relatórios disponíveis no sistema.',
    logs:'Histórico de atividades realizadas.'
  };
  document.getElementById('databaseTableTitle').textContent = titleMap[name];
  document.getElementById('databaseTableDescription').textContent = descMap[name];
  document.getElementById('databaseSearch').value = '';
  area.classList.add('show');
  renderDbTable(name, '');
  area.scrollIntoView({ behavior:'smooth', block:'start' });
}

function renderDbTable(name, term){
  const head = document.getElementById('databaseHead');
  const body = document.getElementById('databaseBody');
  const t = (term || '').toLowerCase();

  if (name === 'clientes'){
    head.innerHTML = `<tr><th>ID</th><th>Cliente</th><th>E-mail</th><th>Telefone</th><th>Status</th><th>Data</th></tr>`;
    const rows = clients.filter(c => !t || c.nome.toLowerCase().includes(t) || c.email.toLowerCase().includes(t) || c.telefone.includes(t));
    body.innerHTML = rows.length ? rows.map(c => `
      <tr><td>#${String(c.id).padStart(4,'0')}</td><td>${escapeHtml(c.nome)}</td><td>${escapeHtml(c.email)}</td><td>${escapeHtml(c.telefone)}</td><td>${statusPill(c.status)}</td><td>${formatDateBR(c.createdAt)}</td></tr>
    `).join('') : emptyRow(6, 'Nenhum registro encontrado.');
  }

  if (name === 'relatorios'){
    head.innerHTML = `<tr><th>ID</th><th>Relatório</th><th>Tipo</th><th>Registros</th><th>Data</th><th>Status</th></tr>`;
    const rows = REPORTS.filter(r => !t || r.nome.toLowerCase().includes(t) || r.tipo.toLowerCase().includes(t));
    body.innerHTML = rows.length ? rows.map(r => `
      <tr><td>#${String(r.id).padStart(4,'0')}</td><td><strong>${escapeHtml(r.nome)}</strong></td><td>${escapeHtml(r.tipo)}</td><td>${r.registros}</td><td>${r.data}</td><td>${statusPill(r.status)}</td></tr>
    `).join('') : emptyRow(6, 'Nenhum relatório encontrado.');
  }

  if (name === 'logs'){
    head.innerHTML = `<tr><th>ID</th><th>Usuário</th><th>Ação</th><th>Data</th><th>Horário</th></tr>`;
    const rows = logs.slice().reverse().filter(l => !t || l.usuario.toLowerCase().includes(t) || l.acao.toLowerCase().includes(t));
    body.innerHTML = rows.length ? rows.map(l => `
      <tr><td>#${String(l.id).padStart(4,'0')}</td><td>${escapeHtml(l.usuario)}</td><td>${statusPill('Ativo').replace('Ativo', escapeHtml(l.acao))}</td><td>${escapeHtml(l.data)}</td><td>${escapeHtml(l.horario)}</td></tr>
    `).join('') : emptyRow(5, 'Nenhum log registrado ainda.');
  }
}

function renderDatabaseCounts(){
  document.getElementById('dbClientes').textContent = clients.length;
  document.getElementById('dbRelatorios').textContent = REPORTS.length;
  document.getElementById('dbLogs').textContent = logs.length;
  refreshNotifDot();
}

/* =====================================================
   RELATÓRIOS
===================================================== */

function bindReportsPage(){
  document.getElementById('exportReportBtn').addEventListener('click', () => exportCSV('relatorios'));
}

function renderReports(){
  const total = clients.length;
  const ativos = clients.filter(c => c.status === 'Ativo').length;
  document.getElementById('reportTotal').textContent = total;
  document.getElementById('reportAtivos').textContent = ativos;
  document.getElementById('reportTotalBar').style.width = Math.min(100, total * 8) + '%';
  document.getElementById('reportAtivosBar').style.width = (total ? Math.round((ativos/total)*100) : 0) + '%';

  document.getElementById('reportsTable').innerHTML = REPORTS.map(r => `
    <tr><td><strong>${escapeHtml(r.nome)}</strong></td><td>${escapeHtml(r.tipo)}</td><td>${r.registros}</td><td>${r.data}</td><td>${statusPill(r.status)}</td></tr>
  `).join('');
}

/* =====================================================
   EXPORTAÇÃO CSV
===================================================== */

function exportCSV(name){
  let rows = [], filename = 'export.csv';

  if (name === 'clientes'){
    rows = [['ID','Nome','Email','Telefone','Status','Data'], ...clients.map(c => [c.id, c.nome, c.email, c.telefone, c.status, formatDateBR(c.createdAt)])];
    filename = 'clientes.csv';
  } else if (name === 'relatorios'){
    rows = [['ID','Nome','Tipo','Registros','Data','Status'], ...REPORTS.map(r => [r.id, r.nome, r.tipo, r.registros, r.data, r.status])];
    filename = 'relatorios.csv';
  } else if (name === 'logs'){
    rows = [['ID','Usuário','Ação','Data','Horário'], ...logs.map(l => [l.id, l.usuario, l.acao, l.data, l.horario])];
    filename = 'logs.csv';
  } else {
    showToast('error', 'Nada para exportar', 'Selecione uma tabela primeiro.');
    return;
  }

  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('success', 'Exportação concluída', `${filename} baixado com sucesso.`);
}

/* =====================================================
   LOGS
===================================================== */

function addLog(acao){
  logs.push({ id: uid(logs), usuario:'Administrador', acao, data: new Date().toLocaleDateString('pt-BR'), horario: nowTimeBR() });
  save();
}

/* =====================================================
   TOASTS
===================================================== */

function showToast(type, title, message){
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : 'success'}`;
  const icon = type === 'error' ? 'ic-alert' : 'ic-check';
  el.innerHTML = `
    <div class="toast-icon"><svg viewBox="0 0 24 24"><use href="#${icon}"/></svg></div>
    <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span></div>
  `;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

/* =====================================================
   TECLAS GLOBAIS / OVERLAYS
===================================================== */

function bindGlobalKeys(){
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape'){
      closeClientModal();
      closeConfirmModal();
      closePalette();
      document.getElementById('notifPanel').setAttribute('hidden', '');
      closeMobileSidebar();
    }
  });
}

function bindOverlayBackdrops(){
  ['modal','confirmModal','paletteModal'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      if (e.target.id === id){
        if (id === 'modal') closeClientModal();
        if (id === 'confirmModal') closeConfirmModal();
        if (id === 'paletteModal') closePalette();
      }
    });
  });
}
