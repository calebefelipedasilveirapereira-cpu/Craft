import { useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Blocks, Boxes, BriefcaseBusiness,
  CalendarDays, Check, ChevronDown, CircleDollarSign, ClipboardList, FileBarChart,
  LayoutDashboard, LogOut, Menu, MoreHorizontal, Package, Pickaxe,
  Plus, Search, Settings, Shield, ShoppingCart, Sparkles, TrendingUp, UserRound, Users,
  Wallet, X,
} from 'lucide-react';

type Icon = typeof LayoutDashboard;
type ModuleKey = 'Visão geral' | 'Vendas' | 'Clientes' | 'Produtos' | 'Serviços' | 'Estoque' | 'Financeiro' | 'Relatórios';
type ModalKind = 'sale' | 'client' | 'product' | null;

const navItems: { label: ModuleKey; icon: Icon; adminOnly?: boolean }[] = [
  { label: 'Visão geral', icon: LayoutDashboard },
  { label: 'Vendas', icon: ShoppingCart },
  { label: 'Clientes', icon: Users },
  { label: 'Produtos', icon: Package },
  { label: 'Serviços', icon: BriefcaseBusiness },
  { label: 'Estoque', icon: Boxes },
  { label: 'Financeiro', icon: Wallet, adminOnly: true },
  { label: 'Relatórios', icon: FileBarChart, adminOnly: true },
];

const activityItems = [
  { title: 'Nova venda realizada', detail: 'Pedido #1048 · Casa Norte', time: 'há 8 min', color: 'emerald', icon: ShoppingCart },
  { title: 'Pagamento recebido', detail: 'R$ 1.280,00 · PIX', time: 'há 32 min', color: 'diamond', icon: CircleDollarSign },
  { title: 'Estoque baixo', detail: 'Cabo USB-C 2m · 4 unidades', time: 'há 1 h', color: 'gold', icon: Package },
  { title: 'Novo cliente cadastrado', detail: 'Marina Costa · Pessoa física', time: 'há 2 h', color: 'redstone', icon: UserRound },
];

const salesRows = [
  { id: '#1048', client: 'Casa Norte Móveis', item: 'Kit escritório premium', value: 'R$ 2.480,00', status: 'Pago', initials: 'CN', tone: 'grass' },
  { id: '#1047', client: 'Marina Costa', item: 'Consultoria de processos', value: 'R$ 850,00', status: 'Pendente', initials: 'MC', tone: 'redstone' },
  { id: '#1046', client: 'Estúdio Aurora', item: 'Cadeira ergonômica', value: 'R$ 1.290,00', status: 'Pago', initials: 'EA', tone: 'gold' },
  { id: '#1045', client: 'Rafael Mendes', item: 'Plano mensal Pro', value: 'R$ 189,00', status: 'Pago', initials: 'RM', tone: 'diamond' },
];

const chartValues = [46, 62, 52, 78, 68, 88, 76, 94, 70, 84, 91, 100];
const monthLabels = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleKey>('Visão geral');
  const [modal, setModal] = useState<ModalKind>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('Este mês');
  const [toast, setToast] = useState('');

  const isAdmin = profile?.role === 'admin';
  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  const filteredRows = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return salesRows;
    return salesRows.filter((row) => `${row.client} ${row.item} ${row.id}`.toLowerCase().includes(value));
  }, [search]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  function chooseModule(label: ModuleKey) {
    setActiveModule(label);
    setSidebarOpen(false);
  }

  const initials = profile?.full_name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() ?? '??';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Blocks size={20} strokeWidth={2} /></div>
          <div>
            <strong>Craft<span>Board</span></strong>
            <small>Sistema de Gestão</small>
          </div>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"><X size={18} /></button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar"><Pickaxe size={14} /></div>
          <div><strong>{profile?.full_name ?? 'Jogador'}</strong><span>{isAdmin ? 'Administrador' : 'Funcionário'}</span></div>
          <ChevronDown size={15} />
        </div>

        <div className="nav-label">Menu Principal</div>
        <nav>
          {visibleNav.map(({ label, icon: NavIcon }) => (
            <button key={label} className={`nav-item ${activeModule === label ? 'active' : ''}`} onClick={() => chooseModule(label)}>
              <NavIcon size={18} strokeWidth={activeModule === label ? 2.3 : 1.8} />
              <span>{label}</span>
              {label === 'Estoque' && <em>4</em>}
              {label === 'Financeiro' && <Shield size={12} className="shield-icon" />}
              {label === 'Relatórios' && <Shield size={12} className="shield-icon" />}
            </button>
          ))}
        </nav>

        <div className="nav-label team-label">Sistema</div>
        <nav>
          <button className="nav-item" onClick={() => notify('Equipe disponível em breve')}><Users size={18} /><span>Equipe</span></button>
          <button className="nav-item" onClick={() => notify('Configurações disponíveis em breve')}><Settings size={18} /><span>Configurações</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Sparkles size={17} /></div>
            <strong>Precisa de ajuda?</strong>
            <p>Veja dicas para aproveitar melhor o CraftBoard.</p>
            <button onClick={() => notify('Central de ajuda aberta')}>Acessar central <ArrowUpRight size={14} /></button>
          </div>
          <button className="user-profile" onClick={signOut}>
            <div className="avatar avatar-dark">{initials}</div>
            <div><strong>{profile?.full_name ?? 'Jogador'}</strong><span>{profile?.email}</span></div>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-trigger" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeModule}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar em tudo..." /><kbd>⌘ K</kbd></div>
            <button className="icon-button notification" onClick={() => notify('Você está em dia!')} aria-label="Notificações"><Bell size={19} /><i /></button>
            <div className="top-avatar">{initials}</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="live-dot" /> Quarta-feira, 27 de agosto de 2026</div>
              <h1>Olá, {profile?.full_name?.split(' ')[0] ?? 'Jogador'} <span>⛏</span></h1>
              <p>Acompanhe o que está acontecendo na sua empresa hoje.</p>
            </div>
            <div className="heading-actions">
              <button className="date-button" onClick={() => setPeriod(period === 'Este mês' ? 'Últimos 30 dias' : 'Este mês')}><CalendarDays size={16} /> {period}<ChevronDown size={15} /></button>
              <button className="primary-button" onClick={() => setModal('sale')}><Plus size={17} /> Nova venda</button>
            </div>
          </div>

          {activeModule === 'Visão geral' ? (
            <>
              <section className="metric-grid">
                <MetricCard label="Receita total" value="R$ 48.290,00" variation="18,6%" caption="vs. mês anterior" icon={CircleDollarSign} color="diamond" trend="up" />
                <MetricCard label="Vendas realizadas" value="186" variation="12,4%" caption="vs. mês anterior" icon={ShoppingCart} color="gold" trend="up" />
                <MetricCard label="Novos clientes" value="42" variation="8,2%" caption="vs. mês anterior" icon={Users} color="grass" trend="up" />
                <MetricCard label="A receber" value="R$ 8.430,00" variation="3,8%" caption="vs. mês anterior" icon={Wallet} color="redstone" trend="down" />
              </section>

              <section className="main-grid">
                <div className="panel revenue-panel">
                  <div className="panel-header">
                    <div><h2>Visão financeira</h2><p>Receita acumulada ao longo do período</p></div>
                    <div className="panel-tools">
                      <button className="select-button" onClick={() => setPeriod(period === 'Este mês' ? 'Últimos 30 dias' : 'Este mês')}>{period}<ChevronDown size={14} /></button>
                      <button className="more-button"><MoreHorizontal size={18} /></button>
                    </div>
                  </div>
                  <div className="chart-summary"><strong>R$ 48.290,00</strong><span className="positive"><ArrowUpRight size={14} /> 18,6%</span></div>
                  <div className="chart-wrap">
                    <div className="chart-y"><span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0</span></div>
                    <div className="chart">
                      <div className="grid-lines"><i /><i /><i /><i /><i /><i /></div>
                      <div className="bars">
                        {chartValues.map((height, index) => (
                          <div className="bar-column" key={index}>
                            <div className={`bar ${index === 11 ? 'highlight' : ''}`} style={{ height: `${height}%` }} />
                            <span>{monthLabels[index]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <span><i className="legend-dot diamond-dot" /> Receita</span>
                    <span><i className="legend-dot muted-dot" /> Despesas</span>
                    <strong>Meta mensal <b>72%</b></strong>
                  </div>
                </div>

                <div className="panel goal-panel">
                  <div className="panel-header"><div><h2>Meta do mês</h2><p>Seu desempenho em agosto</p></div><button className="more-button"><MoreHorizontal size={18} /></button></div>
                  <div className="goal-ring"><div className="ring-inner"><strong>72<span>%</span></strong><small>da meta</small></div></div>
                  <div className="goal-numbers">
                    <div><span>Realizado</span><strong>R$ 48.290</strong></div>
                    <div><span>Objetivo</span><strong>R$ 67.000</strong></div>
                  </div>
                  <div className="goal-message"><TrendingUp size={17} /><span>Você está <strong>12% acima</strong> do ritmo esperado.</span></div>
                  <button className="secondary-button" onClick={() => notify('Detalhes da meta carregados')}>Ver detalhes <ArrowUpRight size={15} /></button>
                </div>
              </section>

              <section className="lower-grid">
                <div className="panel sales-panel">
                  <div className="panel-header">
                    <div><h2>Vendas recentes</h2><p>As últimas movimentações da sua empresa</p></div>
                    <button className="text-button" onClick={() => chooseModule('Vendas')}>Ver todas <ArrowUpRight size={15} /></button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Pedido</th><th>Cliente</th><th>Descrição</th><th>Valor</th><th>Status</th><th /></tr></thead>
                      <tbody>
                        {filteredRows.map((row) => (
                          <tr key={row.id}>
                            <td><strong>{row.id}</strong></td>
                            <td><div className="client-cell"><span className={`mini-avatar ${row.tone}`}>{row.initials}</span><strong>{row.client}</strong></div></td>
                            <td className="muted-cell">{row.item}</td>
                            <td><strong>{row.value}</strong></td>
                            <td><span className={`status ${row.status === 'Pago' ? 'paid' : 'pending'}`}><i />{row.status}</span></td>
                            <td><button className="row-more"><MoreHorizontal size={17} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredRows.length === 0 && <div className="empty-state">Nenhuma venda encontrada para "{search}".</div>}
                  </div>
                </div>
                <div className="panel activity-panel">
                  <div className="panel-header"><div><h2>Atividade recente</h2><p>Atualizações do workspace</p></div><button className="more-button"><MoreHorizontal size={18} /></button></div>
                  <div className="activity-list">
                    {activityItems.map(({ title, detail, time, color, icon: ActivityIcon }) => (
                      <div className="activity-item" key={title}>
                        <div className={`activity-icon ${color}`}><ActivityIcon size={16} /></div>
                        <div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div>
                        <time>{time}</time>
                      </div>
                    ))}
                  </div>
                  <button className="activity-footer" onClick={() => notify('Histórico completo aberto')}>Ver histórico completo <ArrowUpRight size={15} /></button>
                </div>
              </section>
            </>
          ) : (
            <ModuleView module={activeModule} onAction={(kind) => setModal(kind)} onNotify={notify} />
          )}
        </div>
      </main>

      {modal && (
        <Modal
          kind={modal}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            notify(modal === 'sale' ? 'Venda criada com sucesso!' : modal === 'client' ? 'Cliente cadastrado com sucesso!' : 'Produto cadastrado com sucesso!');
          }}
        />
      )}
      {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    </div>
  );
}

function MetricCard({ label, value, variation, caption, icon: CardIcon, color, trend }: {
  label: string; value: string; variation: string; caption: string; icon: Icon; color: string; trend: 'up' | 'down';
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}><CardIcon size={19} /></div>
      <div className="metric-info">
        <span>{label}</span>
        <strong>{value}</strong>
        <div>
          <b className={trend === 'up' ? 'positive' : 'negative'}>{trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{variation}</b>
          <small>{caption}</small>
        </div>
      </div>
      <Activity className="metric-spark" size={42} />
    </div>
  );
}

function ModuleView({ module, onAction, onNotify }: {
  module: ModuleKey; onAction: (kind: ModalKind) => void; onNotify: (message: string) => void;
}) {
  const configs: Record<Exclude<ModuleKey, 'Visão geral'>, { title: string; desc: string; icon: Icon; action: string; kind: ModalKind; stats: [string, string, string][] }> = {
    Vendas: { title: 'Vendas', desc: 'Acompanhe pedidos, pagamentos e resultados comerciais.', icon: ShoppingCart, action: 'Nova venda', kind: 'sale', stats: [['Vendas no mês', '186', '+12,4%'], ['Ticket médio', 'R$ 259,62', '+6,8%'], ['Conversão', '24,8%', '+2,1%']] },
    Clientes: { title: 'Clientes', desc: 'Organize seus relacionamentos e acompanhe cada oportunidade.', icon: Users, action: 'Novo cliente', kind: 'client', stats: [['Total de clientes', '1.248', '+8,2%'], ['Ativos este mês', '384', '+14,1%'], ['Satisfação', '4,8/5', '+0,4%']] },
    Produtos: { title: 'Produtos', desc: 'Gerencie seu catálogo, preços e disponibilidade.', icon: Package, action: 'Novo produto', kind: 'product', stats: [['Itens cadastrados', '328', '+4,3%'], ['Mais vendido', 'Cadeira Pro', '+18,7%'], ['Margem média', '36,4%', '+3,2%']] },
    Serviços: { title: 'Serviços', desc: 'Controle seu portfólio de serviços e a agenda da equipe.', icon: BriefcaseBusiness, action: 'Novo serviço', kind: 'product', stats: [['Serviços ativos', '42', '+8,1%'], ['Agendamentos', '86', '+22,4%'], ['Avaliação média', '4,9/5', '+0,6%']] },
    Estoque: { title: 'Estoque', desc: 'Tenha visibilidade sobre entradas, saídas e níveis críticos.', icon: Boxes, action: 'Registrar entrada', kind: 'product', stats: [['Itens em estoque', '2.840', '+5,8%'], ['Estoque baixo', '4 itens', '-2,0%'], ['Valor em estoque', 'R$ 84.290', '+9,4%']] },
    Financeiro: { title: 'Financeiro', desc: 'Visualize receitas, despesas e o fluxo de caixa da empresa.', icon: Wallet, action: 'Nova movimentação', kind: 'sale', stats: [['Saldo atual', 'R$ 39.860', '+18,6%'], ['A receber', 'R$ 8.430', '-3,8%'], ['Despesas do mês', 'R$ 12.640', '-6,2%']] },
    Relatórios: { title: 'Relatórios', desc: 'Transforme dados em decisões mais rápidas e seguras.', icon: FileBarChart, action: 'Gerar relatório', kind: null, stats: [['Relatórios salvos', '18', '+3 este mês'], ['Dados analisados', '12.480', '+21,4%'], ['Última atualização', 'Hoje, 09:42', 'Em dia']] },
  };
  const config = configs[module as Exclude<ModuleKey, 'Visão geral'>];
  const ModuleIcon = config.icon;

  return (
    <div className="module-view">
      <div className="module-hero">
        <div className="module-title">
          <div className="module-icon"><ModuleIcon size={22} /></div>
          <div><div className="eyebrow">Módulo operacional</div><h1>{config.title}</h1><p>{config.desc}</p></div>
        </div>
        <button className="primary-button" onClick={() => config.kind ? onAction(config.kind) : onNotify('Relatório gerado com sucesso!')}>
          <Plus size={17} /> {config.action}
        </button>
      </div>
      <div className="module-stats">
        {config.stats.map(([label, value, variation]) => (
          <div className="module-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small className={variation.startsWith('-') ? 'negative' : 'positive'}>{variation}</small>
          </div>
        ))}
      </div>
      <div className="module-placeholder">
        <div className="placeholder-illustration"><ClipboardList size={32} /></div>
        <h2>Seu espaço de {config.title.toLowerCase()}</h2>
        <p>Esta visão está pronta para receber os dados da sua operação. Comece adicionando um novo registro.</p>
        <button className="secondary-button" onClick={() => config.kind ? onAction(config.kind) : onNotify('Relatório gerado com sucesso!')}>Começar agora <ArrowUpRight size={15} /></button>
      </div>
    </div>
  );
}

function Modal({ kind, onClose, onSave }: { kind: Exclude<ModalKind, null>; onClose: () => void; onSave: () => void }) {
  const titles: Record<Exclude<ModalKind, null>, string> = {
    sale: 'Registrar nova venda', client: 'Cadastrar novo cliente', product: 'Adicionar novo produto',
  };
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><span className="eyebrow">Novo registro</span><h2>{titles[kind]}</h2></div>
          <button className="close-button" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="form-grid">
          <label>{kind === 'sale' ? 'Cliente' : 'Nome'}
            <input placeholder={kind === 'sale' ? 'Busque um cliente...' : kind === 'client' ? 'Nome completo' : 'Nome do produto'} />
          </label>
          {kind === 'sale' && <label>Produto ou serviço<input placeholder="Selecione um item..." /></label>}
          {kind === 'client' && <label>E-mail<input type="email" placeholder="cliente@empresa.com" /></label>}
          {kind === 'product' && (
            <label>Categoria
              <select defaultValue=""><option value="" disabled>Selecione uma categoria</option><option>Escritório</option><option>Eletrônicos</option><option>Acessórios</option></select>
            </label>
          )}
          <label>{kind === 'sale' ? 'Valor total' : kind === 'client' ? 'Telefone' : 'Preço de venda'}
            <input placeholder={kind === 'client' ? '(00) 00000-0000' : 'R$ 0,00'} />
          </label>
          {kind !== 'client' && (
            <label>{kind === 'sale' ? 'Forma de pagamento' : 'Estoque inicial'}
              <select defaultValue=""><option value="" disabled>Selecione uma opção</option><option>PIX</option><option>Cartão de crédito</option><option>Dinheiro</option><option>20 unidades</option></select>
            </label>
          )}
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="primary-button" onClick={onSave}><Check size={16} /> Salvar registro</button>
        </div>
      </div>
    </div>
  );
}
