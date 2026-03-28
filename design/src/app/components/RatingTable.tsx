import * as Tooltip from '@radix-ui/react-tooltip';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Company } from '../data/mockData';

interface RatingTableProps {
  companies: Company[];
}

const CAPITAL_CONFIG = {
  public: {
    color: '#22c55e',
    label: 'Публичное привлечение: облигации / займы через сайт',
  },
  corporate: {
    color: '#3b82f6',
    label: 'Инвестируется материнской структурой',
  },
  none: {
    color: '#d1d5db',
    label: 'Нет данных о привлечении капитала',
  },
};

const AVATAR_COLORS = [
  '#18181b', '#292524', '#1e3a5f', '#1a3a2a', '#3b1f1f',
  '#1f2d3b', '#2d1f3b', '#1f3b2d', '#3b2d1f', '#1f1f3b',
];

function Avatar({ name, rank }: { name: string; rank: number }) {
  const letter = name[0] ?? '?';
  const bg = AVATAR_COLORS[(rank - 1) % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: bg,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: 0,
      }}
    >
      {letter}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      style={{
        fontSize: '13px',
        fontWeight: 500,
        color: '#374151',
      }}
    >
      {rank}
    </span>
  );
}

function CapitalDot({ type }: { type: 'public' | 'corporate' | 'none' }) {
  const cfg = CAPITAL_CONFIG[type];
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: cfg.color,
              cursor: 'help',
              flexShrink: 0,
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            style={{
              background: '#18181b',
              color: '#fff',
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              maxWidth: '240px',
              lineHeight: '1.5',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              zIndex: 100,
            }}
          >
            {cfg.label}
            <Tooltip.Arrow style={{ fill: '#18181b' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 12px',
  height: '36px',
  fontSize: '12px',
  color: '#9ca3af',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  background: '#F9FAFB',
  borderBottom: '1px solid #f0f0f0',
  userSelect: 'none',
  letterSpacing: '0.025em',
};

const TD_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 12px',
  height: '44px',
  fontSize: '13px',
  color: '#111827',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

export function RatingTable({ companies }: RatingTableProps) {
  const fmt = (n: number) => Math.abs(n).toLocaleString('ru-RU');

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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Динамика, % <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>№ <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, width: '40px' }} />
              <th style={{ ...TH_STYLE, minWidth: '160px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Компания <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Выручка + пр. доходы, тыс ₽ <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Чистая прибыль, тыс ₽ <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Рост за 5 лет, % <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Стаж, лет <ArrowUpDown size={12} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, width: '80px', textAlign: 'center' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>Капитал <ArrowUpDown size={12} color="#d1d5db" /></div></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, idx) => {
              const isUp = company.yearChange >= 0;
              const isLast = idx === companies.length - 1;
              return (
                <tr
                  key={company.rank}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #f7f7f7',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={TD_STYLE}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isUp ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {isUp
                        ? <ArrowUp style={{ width: '11px', height: '11px' }} />
                        : <ArrowDown style={{ width: '11px', height: '11px' }} />}
                      {Math.abs(company.yearChange)}
                    </span>
                  </td>

                  <td style={TD_STYLE}>
                    <RankBadge rank={company.rank} />
                  </td>

                  <td style={{ ...TD_STYLE, padding: '0 8px 0 12px' }}>
                    <Avatar name={company.name} rank={company.rank} />
                  </td>

                  <td style={{ ...TD_STYLE, fontWeight: 500 }}>
                    {company.name}
                  </td>

                  <td style={{ ...TD_STYLE, color: '#374151' }}>
                    {fmt(company.revenue)}
                  </td>

                  <td
                    style={{
                      ...TD_STYLE,
                      fontWeight: 500,
                      color: company.profit >= 0 ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {company.profit < 0 ? `−${fmt(company.profit)}` : fmt(company.profit)}
                  </td>

                  <td
                    style={{
                      ...TD_STYLE,
                      color: company.cagr > 20 ? '#16a34a' : company.cagr >= 0 ? '#d97706' : '#dc2626',
                      fontWeight: 500,
                    }}
                  >
                    {company.cagr > 0 ? '+' : ''}{company.cagr}
                  </td>

                  <td style={{ ...TD_STYLE, color: '#374151' }}>
                    {company.experience}
                  </td>

                  <td style={{ ...TD_STYLE, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <CapitalDot type={company.capitalAttraction} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
