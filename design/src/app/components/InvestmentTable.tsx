import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, ExternalLink } from 'lucide-react';
import { bonds, siteLoans, corporates, allInvestments, Bond, SiteLoan, Corporate, AllInvestment } from '../data/investmentData';
import { ratingData } from '../data/ratingData';

// Lookup: company name → rank in ПКО-300
const pkoRankMap = new Map<string, number>();
for (const c of ratingData) {
  if (!pkoRankMap.has(c.name)) pkoRankMap.set(c.name, c.rank);
}
// Aliases for names that differ between investmentData and ratingData
const ALIASES: Record<string, string> = {
  'НФИ': 'Национальная Фабрика Ипотеки',
  'Воксис': 'ПКО ВОКСИС',
  'Первое клиентское бюро': 'ПКБ',
  'Агентство Судебного Взыскания': 'АСВ',
  'Служба защиты активов': 'СЗА',
  'Юридическая служба взыскания': 'ЮСВ',
  'АктивБизнесКонсалт': 'АБК',
  'Столичная Сервисная Компания': 'Столичное АВД',
};
function getPkoRank(companyName: string): number | null {
  if (pkoRankMap.has(companyName)) return pkoRankMap.get(companyName)!;
  if (ALIASES[companyName] && pkoRankMap.has(ALIASES[companyName])) return pkoRankMap.get(ALIASES[companyName])!;
  for (const [name, rank] of pkoRankMap) {
    if (name.includes(companyName) || companyName.includes(name)) return rank;
  }
  return null;
}

export type InvestMode = 'bonds' | 'loans' | 'corporate' | 'all';

// ── Shared styles ───────────────────────────────────────────��────
const CARD: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  border: '1px solid #f0f0f0',
  boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
  overflow: 'hidden',
};

const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 14px',
  height: '36px',
  fontSize: '12px',
  color: '#9ca3af',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  background: '#F9FAFB',
  borderBottom: '1px solid #f0f0f0',
  letterSpacing: '0.025em',
  userSelect: 'none',
};

const TD: React.CSSProperties = {
  padding: '0 14px',
  height: '46px',
  fontSize: '13px',
  color: '#374151',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

const TD_NAME: React.CSSProperties = {
  ...TD,
  fontWeight: 600,
  color: '#111827',
  minWidth: '160px',
};

// ── Sub-mode switcher ────────�����───���──────────────────────────────
interface ModeSwitcherProps {
  mode: InvestMode;
  onChange: (m: InvestMode) => void;
}

function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  const opts: { value: InvestMode; label: string }[] = [
    { value: 'bonds',     label: 'Облигации (10)' },
    { value: 'loans',     label: 'Займы через сайт (3)' },
    { value: 'corporate', label: 'Корпоративные (11)' },
    { value: 'all',       label: 'Все (23)' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: '#9ca3af' }}>Показать</span>
      <div
        style={{
          display: 'flex',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {opts.map((opt, i) => {
          const active = opt.value === mode;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                padding: '5px 13px',
                fontSize: '12px',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : '#374151',
                background: active ? '#111' : '#fff',
                border: 'none',
                borderLeft: i === 0 ? 'none' : '1px solid #e5e7eb',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.12s, color 0.12s',
                outline: 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#fff'; }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: Bond['status'] }) {
  const active = status === 'active';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        background: '#fff',
        color: '#18181b',
        border: '1px solid #e4e4e7',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: active ? '#10b981' : '#f59e0b', // emerald for active, amber for placing
          flexShrink: 0,
        }}
      />
      {active ? 'В обращении' : 'Размещение'}
    </span>
  );
}

// ── Rating badge ─────────────────────────────────────────────────
function RatingBadge({ rating }: { rating: string }) {
  if (rating === '—') {
    return <span style={{ color: '#a1a1aa', fontSize: '13px' }}>—</span>;
  }
  
  let color = '#52525b';
  if (rating.startsWith('ruA') || rating.startsWith('A')) color = '#15803d'; // green-700
  else if (rating.startsWith('ruBBB') || rating.startsWith('BBB')) color = '#1d4ed8'; // blue-700
  else if (rating.startsWith('BB') || rating.startsWith('ruBB')) color = '#b45309'; // amber-700
  else if (rating.startsWith('ruB') || rating.startsWith('B')) color = '#b91c1c'; // red-700

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        color,
        background: '#fff',
        border: '1px solid #e4e4e7',
        whiteSpace: 'nowrap',
        letterSpacing: '0.5px'
      }}
    >
      {rating}
    </span>
  );
}

// ── Type badge ───────────────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Банк:                   { bg: '#fff', text: '#1e3a8a', border: '#e4e4e7' },
  'Иностранный холдинг':  { bg: '#fff', text: '#581c87', border: '#e4e4e7' },
  Секьюритизация:         { bg: '#fff', text: '#78350f', border: '#e4e4e7' },
  ЗПИФ:                   { bg: '#fff', text: '#064e3b', border: '#e4e4e7' },
  'Иностран��ая компания': { bg: '#fff', text: '#581c87', border: '#e4e4e7' },
  'Финтех-группа':        { bg: '#fff', text: '#7c2d12', border: '#e4e4e7' },
  'Контакт-центр/холдинг':{ bg: '#fff', text: '#0f172a', border: '#e4e4e7' },
};

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] || { bg: '#fff', text: '#3f3f46', border: '#e4e4e7' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        background: 'transparent',
        color: c.text,
        border: `1px solid ${c.text}33`,
        whiteSpace: 'nowrap',
      }}
    >
      {type}
    </span>
  );
}

// ── BONDS TABLE ───────────────────────────────────────��──────────
type BondSortKey = 'pkoRank' | 'company' | 'rating' | 'coupon' | 'volume' | 'status' | 'repayment';

function BondsTable() {
  const [sortKey, setSortKey] = useState<BondSortKey>('pkoRank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (k: BondSortKey) => {
    if (k === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  const sorted = [...bonds].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'pkoRank') return ((getPkoRank(a.company) ?? 999) - (getPkoRank(b.company) ?? 999)) * mul;
    if (sortKey === 'volume') return ((a.volume ?? -1) - (b.volume ?? -1)) * mul;
    const av = (a as Record<string, string | number | null>)[sortKey] as string ?? '';
    const bv = (b as Record<string, string | number | null>)[sortKey] as string ?? '';
    return av.localeCompare(bv, 'ru') * mul;
  });

  function Th({ k, children }: { k: BondSortKey; children: React.ReactNode }) {
    const active = sortKey === k;
    return (
      <th
        onClick={() => handleSort(k)}
        style={{ ...TH, cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#374151'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
          {children}
          {active
            ? sortDir === 'asc'
              ? <ArrowUp style={{ width: '10px', height: '10px' }} />
              : <ArrowDown style={{ width: '10px', height: '10px' }} />
            : <ArrowUpDown style={{ width: '10px', height: '10px', opacity: 0.25 }} />}
        </span>
      </th>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <Th k="pkoRank">№ в ПКО-300</Th>
          <Th k="company">Компания</Th>
          <Th k="rating">Рейтинг</Th>
          <th style={TH}>ISIN / Погашение</th>
          <Th k="coupon">Купон</Th>
          <Th k="volume">Объём, млн ₽</Th>
          <th style={TH}>Площадка</th>
          <Th k="status">Статус</Th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((b, idx) => (
          <tr
            key={b.isin + b.company + idx}
            style={{ borderBottom: idx < sorted.length - 1 ? '1px solid #f7f7f7' : 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <td style={{ ...TD, color: '#6b7280', fontSize: '12px', fontWeight: 600, width: '60px' }}>{getPkoRank(b.company) ?? '—'}</td>
            <td style={TD_NAME}>{b.company}</td>
            <td style={TD}><RatingBadge rating={b.rating} /></td>
            <td style={{ ...TD }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: b.isin === '—' ? '#d1d5db' : '#374151' }}>{b.isin}</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{b.repayment || '—'}</span>
              </div>
            </td>
            <td style={{ ...TD, fontWeight: 600, color: '#111' }}>{b.coupon}</td>
            <td style={TD}>
              {b.volume != null
                ? <span style={{ fontWeight: 500 }}>{b.volume.toLocaleString('ru-RU')}</span>
                : <span style={{ color: '#d1d5db' }}>н/д</span>}
            </td>
            <td style={TD}>{b.platform}</td>
            <td style={TD}><StatusBadge status={b.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── SITE LOANS TABLE ─────────────────────────────────────────────
function LoansTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...TH, width: '60px', fontSize: '11px' }}>№ в ПКО-300</th>
          <th style={TH}>Компания</th>
          <th style={TH}>Тип</th>
          <th style={TH}>Сайт</th>
        </tr>
      </thead>
      <tbody>
        {[...siteLoans].sort((a, b) => (getPkoRank(a.company) ?? 999) - (getPkoRank(b.company) ?? 999)).map((l, idx) => (
          <tr
            key={l.company}
            style={{ borderBottom: idx < siteLoans.length - 1 ? '1px solid #f7f7f7' : 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <td style={{ ...TD, color: '#6b7280', fontSize: '12px', fontWeight: 600 }}>{getPkoRank(l.company) ?? '—'}</td>
            <td style={TD_NAME}>{l.company}</td>
            <td style={TD}>
              <TypeBadge type={l.type} />
            </td>
            <td style={TD}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {l.sites.map(s => (
                  <a
                    key={s}
                    href={`https://${s}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
                    onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
                  >
                    {s}
                    <ExternalLink style={{ width: '11px', height: '11px', opacity: 0.5 }} />
                  </a>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── CORPORATE TABLE ──────────────────────────────────────────────
function CorporateTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...TH, width: '60px', fontSize: '11px' }}>№ в ПКО-300</th>
          <th style={TH}>Компания</th>
          <th style={TH}>Учредитель / Структура</th>
          <th style={TH}>Тип</th>
          <th style={TH}>Детали</th>
        </tr>
      </thead>
      <tbody>
        {[...corporates].sort((a, b) => (getPkoRank(a.company) ?? 999) - (getPkoRank(b.company) ?? 999)).map((c, idx) => (
          <tr
            key={c.company}
            style={{ borderBottom: idx < corporates.length - 1 ? '1px solid #f7f7f7' : 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <td style={{ ...TD, color: '#6b7280', fontSize: '12px', fontWeight: 600 }}>{getPkoRank(c.company) ?? '—'}</td>
            <td style={TD_NAME}>{c.company}</td>
            <td style={{ ...TD, color: '#374151', maxWidth: '280px', whiteSpace: 'normal' }}>
              {c.founder}
            </td>
            <td style={TD}><TypeBadge type={c.structureType} /></td>
            <td style={{ ...TD, color: '#6b7280', fontSize: '12px' }}>{c.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── ALL TABLE ────────────────────────────────────────────────────
const INVEST_TYPE_META: Record<AllInvestment['type'], { label: string; emoji: string; bg: string; color: string; border: string }> = {
  bonds:      { label: 'Облигации',     emoji: '📊', bg: '#fff', color: '#2563eb', border: '#e4e4e7' }, // Blue
  'site-loan':{ label: 'Займы',         emoji: '🌐', bg: '#fff', color: '#059669', border: '#e4e4e7' }, // Emerald
  corporate:  { label: 'Корпоративное', emoji: '🏛', bg: '#fff', color: '#7c3aed', border: '#e4e4e7' }, // Purple
};

function AllTable() {
  const [filterType, setFilterType] = useState<AllInvestment['type'] | 'all'>('all');

  const filtered = filterType === 'all'
    ? allInvestments
    : allInvestments.filter(r => r.type === filterType);

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: '60px', fontSize: '11px' }}>№ в ПКО-300</th>
            <th style={TH}>Компания</th>
            <th style={TH}>Тип привлечения</th>
            <th style={TH}>Детали</th>
            <th style={TH}>Подробнее</th>
          </tr>
        </thead>
        <tbody>
          {[...filtered].sort((a, b) => (getPkoRank(a.company) ?? 999) - (getPkoRank(b.company) ?? 999)).map((r, idx) => {
            const meta = INVEST_TYPE_META[r.type];
            return (
              <tr
                key={r.company + r.type}
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f7f7f7' : 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td style={{ ...TD, color: '#6b7280', fontSize: '12px', fontWeight: 600 }}>{getPkoRank(r.company) ?? '—'}</td>
                <td style={TD_NAME}>{r.company}</td>
                <td style={TD}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: meta.bg,
                      color: meta.color,
                      border: `1px solid ${meta.border}`,
                    }}
                  >
                    <span>{meta.emoji}</span>
                    {meta.label}
                  </span>
                </td>
                <td style={{ ...TD, fontWeight: 500, color: '#111' }}>{r.details}</td>
                <td style={{ ...TD, color: '#6b7280', fontSize: '12px', maxWidth: '280px', whiteSpace: 'normal' }}>
                  {r.subDetails}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Note block ───────────────────────────────────────────────────
function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        background: '#fafafa',
        borderBottom: '1px solid #e4e4e7',
        fontSize: '13px',
        color: '#52525b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '14px', color: '#a1a1aa' }}>ℹ️</span>
      {children}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────
interface InvestmentTableProps {
  companies?: unknown[]; // kept for API compat, not used — data comes from investmentData
}

export function InvestmentTable(_props: InvestmentTableProps) {
  const [mode, setMode] = useState<InvestMode>('bonds');

  return (
    <div>
      {/* Switcher */}
      <div style={{ marginBottom: '16px' }}>
        <ModeSwitcher mode={mode} onChange={setMode} />
      </div>

      {/* Table card */}
      <div style={CARD}>
        {mode === 'bonds' && (
          <>
            <InfoNote>
              Показаны 13 выпусков от 10 компаний. Всего у этих компаний — 32 выпуска облигаций.
              Финэква совмещает облигации и корпоративное финансирование.
            </InfoNote>
            <div style={{ overflowX: 'auto' }}>
              <BondsTable />
            </div>
          </>
        )}

        {mode === 'loans' && (
          <>
            <InfoNote>
              3 компании привлекают деньги от физических лиц напрямую через собственные сайты.
            </InfoNote>
            <div style={{ overflowX: 'auto' }}>
              <LoansTable />
            </div>
          </>
        )}

        {mode === 'corporate' && (
          <>
            <InfoNote>
              11 компаний финансируются через банки, иностранные ��олдинги или ЗПИФ.
              Финэква присутствует в двух разделах: облигации + корпоративное.
              Правило приоритета кружка в рейтинге: наличие публичного инструмента → 🟢, только корпоративное → 🔵.
            </InfoNote>
            <div style={{ overflowX: 'auto' }}>
              <CorporateTable />
            </div>
          </>
        )}

        {mode === 'all' && (
          <>
            <InfoNote>
              23 компании с установленным способом привлечения капитала из 545 в реестре.
              Финэква отображается дважды — в облигациях и корпоративных.
            </InfoNote>
            <div style={{ overflowX: 'auto' }}>
              <AllTable />
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          padding: '12px 16px',
          background: '#fff',
          borderRadius: '10px',
          border: '1px solid #f0f0f0',
          fontSize: '12px',
          color: '#6b7280',
        }}
      >
        <span style={{ fontWeight: 500, color: '#374151' }}>Кружок в рейтинге:</span>
        <span>🟢 Публичное (облигации / займы физлицам)</span>
        <span>�� Корпоративное (банки, ЗПИФ, иностранные структуры)</span>
        <span>⚪ Нет данных</span>
        <span style={{ marginLeft: 'auto', color: '#d1d5db' }}>
          Приоритет: 🟢 → 🔵 → ⚪
        </span>
      </div>
    </div>
  );
}
