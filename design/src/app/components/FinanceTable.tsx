import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Company } from '../data/mockData';

export type FinanceMode = 'capital' | 'pl' | 'assets';
export type FinanceYear = 2020 | 2021 | 2022 | 2023 | 2024;

interface FinanceTableProps {
  companies: Company[];
  mode: FinanceMode;
  year: FinanceYear;
}

// ── Styles ──────────────────────────────────────────────────────
const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 12px',
  height: '36px',
  fontSize: '11px',
  color: '#9ca3af',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  background: '#fafafa',
  borderBottom: '1px solid #f0f0f0',
  userSelect: 'none',
  letterSpacing: '0.025em',
  cursor: 'pointer',
};

const TD_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 12px',
  height: '44px',
  fontSize: '13px',
  color: '#374151',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

const TD_COMPANY: React.CSSProperties = {
  ...TD_STYLE,
  fontWeight: 500,
  color: '#111827',
  minWidth: '160px',
};

const fmt = (n: number) =>
  n === 0 ? '0' : Math.abs(n).toLocaleString('ru-RU');

function Num({ value, colored = false }: { value: number; colored?: boolean }) {
  const neg = value < 0;
  return (
    <span style={{ color: colored ? (neg ? '#dc2626' : '#16a34a') : '#374151', fontWeight: colored ? 500 : 400 }}>
      {neg ? `−${fmt(value)}` : fmt(value)}
    </span>
  );
}

type SortDir = 'asc' | 'desc';

// ── Capital Table ────────────────────────────────────────────────
function CapitalTable({ companies, year }: { companies: Company[]; year: FinanceYear }) {
  const [sortCol, setSortCol] = useState<string>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const rows = companies.map(c => ({ ...c, row: c.assets[year] })).filter(c => c.row);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  const sorted = [...rows].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortCol === 'rank') return (a.rank - b.rank) * mul;
    
    let aV = 0, bV = 0;
    if (sortCol === 'ratio') {
      aV = a.row.equity > 0 ? a.row.totalDebt / a.row.equity : 999;
      bV = b.row.equity > 0 ? b.row.totalDebt / b.row.equity : 999;
    } else {
      aV = (a.row as Record<string, number>)[sortCol] ?? 0;
      bV = (b.row as Record<string, number>)[sortCol] ?? 0;
    }
    return (aV - bV) * mul;
  });

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowUpDown style={{ width: '10px', height: '10px', opacity: 0.3, marginLeft: '3px', display: 'inline' }} />;
    return sortDir === 'asc'
      ? <ArrowUp style={{ width: '10px', height: '10px', marginLeft: '3px', display: 'inline' }} />
      : <ArrowDown style={{ width: '10px', height: '10px', marginLeft: '3px', display: 'inline' }} />;
  }

  function Th({ col, children }: { col: string; children: React.ReactNode }) {
    return (
      <th onClick={() => handleSort(col)} style={TH_STYLE} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
        {children}<SortIcon col={col} />
      </th>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <Th col="rank">№</Th>
          <th style={{ ...TH_STYLE, cursor: 'default' }}>Компания</th>
          <Th col="equity">Собственный капитал, тыс ₽</Th>
          <Th col="longTermDebt">Долгосрочные обязательства, тыс ₽</Th>
          <Th col="shortTermDebt">Краткосрочные обязательства, тыс ₽</Th>
          <Th col="totalDebt">Всего обязательств, тыс ₽</Th>
          <Th col="ratio">Долг / Капитал</Th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((c, idx) => {
          const r = c.row;
          const isLast = idx === sorted.length - 1;
          const ratio = r.equity > 0 ? (r.totalDebt / r.equity).toFixed(2) : '—';
          return (
            <tr
              key={c.rank}
              style={{ borderBottom: isLast ? 'none' : '1px solid #f7f7f7' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ ...TD_STYLE, color: '#6b7280', fontWeight: 500, width: '48px' }}>{c.rank}</td>
              <td style={TD_COMPANY}>{c.name}</td>
              <td style={TD_STYLE}><Num value={r.equity} /></td>
              <td style={TD_STYLE}><Num value={r.longTermDebt} /></td>
              <td style={TD_STYLE}><Num value={r.shortTermDebt} /></td>
              <td style={TD_STYLE}><Num value={r.totalDebt} /></td>
              <td style={TD_STYLE}>{ratio}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── P&L Table ───────────────────────────────────────────────────
function PLTable({ companies, year }: { companies: Company[]; year: FinanceYear }) {
  const [sortCol, setSortCol] = useState<string>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const rows = companies.map(c => ({ ...c, row: c.pl[year] })).filter(c => c.row);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  const sorted = [...rows].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortCol === 'rank') return (a.rank - b.rank) * mul;
    const aV = (a.row as Record<string, number>)[sortCol] ?? 0;
    const bV = (b.row as Record<string, number>)[sortCol] ?? 0;
    return (aV - bV) * mul;
  });

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowUpDown style={{ width: '10px', height: '10px', opacity: 0.3, marginLeft: '3px', display: 'inline' }} />;
    return sortDir === 'asc'
      ? <ArrowUp style={{ width: '10px', height: '10px', marginLeft: '3px', display: 'inline' }} />
      : <ArrowDown style={{ width: '10px', height: '10px', marginLeft: '3px', display: 'inline' }} />;
  }

  function Th({ col, children }: { col: string; children: React.ReactNode }) {
    return (
      <th
        onClick={() => handleSort(col)}
        style={TH_STYLE}
        onMouseEnter={e => (e.currentTarget.style.color = '#374151')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
      >
        {children}<SortIcon col={col} />
      </th>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <Th col="rank">№</Th>
          <th style={{ ...TH_STYLE, cursor: 'default' }}>Компания</th>
          <Th col="revenue">Выручка, тыс ₽</Th>
          <Th col="otherIncome">Прочие доходы, тыс ₽</Th>
          <Th col="cogs">Себестоимость, тыс ₽</Th>
          <Th col="grossProfit">Валовая прибыль, тыс ₽</Th>
          <Th col="commercialExpenses">Коммерч. расходы, тыс ₽</Th>
          <Th col="adminExpenses">Управленч. расходы, тыс ₽</Th>
          <Th col="operatingProfit">Прибыль от продаж, тыс ₽</Th>
          <Th col="interestExpense">Проценты по долгам, тыс ₽</Th>
          <Th col="pretaxProfit">Прибыль до налога, тыс ₽</Th>
          <Th col="netProfit">Чистая прибыль, тыс ₽</Th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((c, idx) => {
          const r = c.row;
          const isLast = idx === sorted.length - 1;
          return (
            <tr
              key={c.rank}
              style={{ borderBottom: isLast ? 'none' : '1px solid #f7f7f7' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ ...TD_STYLE, color: '#6b7280', fontWeight: 500, width: '48px' }}>{c.rank}</td>
              <td style={TD_COMPANY}>{c.name}</td>
              <td style={TD_STYLE}><Num value={r.revenue} /></td>
              <td style={TD_STYLE}><Num value={r.otherIncome} /></td>
              <td style={TD_STYLE}><Num value={r.cogs} /></td>
              <td style={TD_STYLE}><Num value={r.grossProfit} colored /></td>
              <td style={TD_STYLE}><Num value={r.commercialExpenses} /></td>
              <td style={TD_STYLE}><Num value={r.adminExpenses} /></td>
              <td style={TD_STYLE}><Num value={r.operatingProfit} colored /></td>
              <td style={TD_STYLE}><Num value={r.interestExpense} /></td>
              <td style={TD_STYLE}><Num value={r.pretaxProfit} colored /></td>
              <td style={TD_STYLE}><Num value={r.netProfit} colored /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Assets Table ────────────────────────────────────────────────
function AssetsTable({ companies, year }: { companies: Company[]; year: FinanceYear }) {
  const [sortCol, setSortCol] = useState<string>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const rows = companies.map(c => ({ ...c, row: c.assets[year] })).filter(c => c.row);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  const sorted = [...rows].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortCol === 'rank') return (a.rank - b.rank) * mul;
    const aV = (a.row as Record<string, number>)[sortCol] ?? 0;
    const bV = (b.row as Record<string, number>)[sortCol] ?? 0;
    return (aV - bV) * mul;
  });

  function DebtBadge({ equity, totalAssets }: { equity: number; totalAssets: number }) {
    const ratio = totalAssets > 0 ? (equity / totalAssets) * 100 : 0;
    const color = ratio > 40 ? '#16a34a' : ratio > 20 ? '#d97706' : '#dc2626';
    return (
      <span style={{ color, fontWeight: 500 }}>{ratio.toFixed(1)}</span>
    );
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowUpDown style={{ width: '10px', height: '10px', opacity: 0.3, marginLeft: '3px', display: 'inline' }} />;
    return sortDir === 'asc'
      ? <ArrowUp style={{ width: '10px', height: '10px', marginLeft: '3px', display: 'inline' }} />
      : <ArrowDown style={{ width: '10px', height: '10px', marginLeft: '3px', display: 'inline' }} />;
  }

  function Th({ col, children }: { col: string; children: React.ReactNode }) {
    return (
      <th
        onClick={() => handleSort(col)}
        style={TH_STYLE}
        onMouseEnter={e => (e.currentTarget.style.color = '#374151')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
      >
        {children}<SortIcon col={col} />
      </th>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <Th col="rank">№</Th>
          <th style={{ ...TH_STYLE, cursor: 'default' }}>Компания</th>
          <Th col="totalAssets">Всего активов, тыс ₽</Th>
          <Th col="currentAssets">Оборотные активы, тыс ₽</Th>
          <Th col="fixedAssets">Внеоборотные активы, тыс ₽</Th>
          <Th col="equity">Капитал, тыс ₽</Th>
          <th style={{ ...TH_STYLE, cursor: 'default' }}>Авт. капитала, %</th>
          <Th col="longTermDebt">Долгосрочные обяз., тыс ₽</Th>
          <Th col="shortTermDebt">Краткосрочные обяз., тыс ₽</Th>
          <Th col="totalDebt">Всего обязательств, тыс ���</Th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((c, idx) => {
          const r = c.row;
          const isLast = idx === sorted.length - 1;
          return (
            <tr
              key={c.rank}
              style={{ borderBottom: isLast ? 'none' : '1px solid #f7f7f7' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ ...TD_STYLE, color: '#6b7280', fontWeight: 500, width: '48px' }}>{c.rank}</td>
              <td style={TD_COMPANY}>{c.name}</td>
              <td style={TD_STYLE}><Num value={r.totalAssets} /></td>
              <td style={TD_STYLE}><Num value={r.currentAssets} /></td>
              <td style={TD_STYLE}><Num value={r.fixedAssets} /></td>
              <td style={{ ...TD_STYLE, fontWeight: 500, color: '#111' }}><Num value={r.equity} /></td>
              <td style={TD_STYLE}><DebtBadge equity={r.equity} totalAssets={r.totalAssets} /></td>
              <td style={TD_STYLE}><Num value={r.longTermDebt} /></td>
              <td style={TD_STYLE}><Num value={r.shortTermDebt} /></td>
              <td style={TD_STYLE}><Num value={r.totalDebt} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Main export ────────��────────────────────────────────────────
export function FinanceTable({ companies, mode, year }: FinanceTableProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        {mode === 'capital' && <CapitalTable companies={companies} year={year} />}
        {mode === 'pl' && <PLTable companies={companies} year={year} />}
        {mode === 'assets' && <AssetsTable companies={companies} year={year} />}
      </div>
    </div>
  );
}
