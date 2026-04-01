import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { RatingCompany } from '../data/ratingData';
import { logoMap } from '../data/logoMap';

interface RatingTableProps {
  companies: RatingCompany[];
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

function Avatar({ name, rank, inn }: { name: string; rank: number; inn: string }) {
  const logoFile = logoMap[inn];
  const [imgError, setImgError] = useState(false);
  const letter = name[0] ?? '?';
  const bg = AVATAR_COLORS[(rank - 1) % AVATAR_COLORS.length];

  if (logoFile && !imgError) {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: '#fff',
          border: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <img
          src={`/logos/${logoFile}`}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            maxWidth: '28px',
            maxHeight: '28px',
            objectFit: 'contain',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
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
  padding: '0 6px',
  height: '36px',
  fontSize: '11px',
  color: '#9ca3af',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  background: '#F9FAFB',
  borderBottom: '1px solid #f0f0f0',
  userSelect: 'none',
  letterSpacing: '0.025em',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const TD_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 6px',
  height: '52px',
  fontSize: '12px',
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
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '7%' }} />   {/* № */}
            <col style={{ width: '3%' }} />   {/* logo */}
            <col style={{ width: '22%' }} />  {/* Компания */}
            <col style={{ width: '18%' }} />  {/* Выручка */}
            <col style={{ width: '18%' }} />  {/* Прибыль */}
            <col style={{ width: '16%' }} />  {/* Темп роста */}
            <col style={{ width: '8%' }} />   {/* Стаж */}
            <col style={{ width: '8%' }} />   {/* Капитал */}
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>№ <ArrowUpDown size={10} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, padding: 0 }} />
              <th style={TH_STYLE}><div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>Компания <ArrowUpDown size={10} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>Выручка + пр. доходы, тыс ₽ <ArrowUpDown size={10} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>Чистая прибыль, тыс ₽ <ArrowUpDown size={10} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>Рост фин. активов за 5 лет, % <ArrowUpDown size={10} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>Стаж, лет <ArrowUpDown size={10} color="#d1d5db" /></div></th>
              <th style={{ ...TH_STYLE, textAlign: 'center' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>Капитал</div></th>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RankBadge rank={company.rank} />
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: isUp ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {isUp
                          ? <ArrowUp style={{ width: '10px', height: '10px' }} />
                          : <ArrowDown style={{ width: '10px', height: '10px' }} />}
                        {Math.abs(company.yearChange)}%
                      </span>
                    </div>
                  </td>

                  <td style={{ ...TD_STYLE, padding: 0 }}>
                    <Avatar name={company.name} rank={company.rank} inn={company.inn} />
                  </td>

                  <td style={{ ...TD_STYLE, fontWeight: 500, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, gap: '1px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {company.city && (
                          <span style={{ fontSize: '11px', fontWeight: 400, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {company.city}
                          </span>
                        )}
                        {company.napka && (
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 500,
                            color: '#9ca3af',
                            flexShrink: 0,
                            lineHeight: '14px',
                          }}>
                            · НАПКА
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td style={{ ...TD_STYLE, color: '#374151', textAlign: 'right' }}>
                    {fmt(company.revenue)}
                  </td>

                  <td
                    style={{
                      ...TD_STYLE,
                      textAlign: 'right',
                      fontWeight: 500,
                      color: company.profit >= 0 ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {company.profit < 0 ? `−${fmt(company.profit)}` : fmt(company.profit)}
                  </td>

                  <td
                    style={{
                      ...TD_STYLE,
                      textAlign: 'right',
                      color: company.growthRate > 20 ? '#16a34a' : company.growthRate >= 0 ? '#d97706' : '#dc2626',
                      fontWeight: 500,
                    }}
                  >
                    {company.growthRate > 0 ? '+' : ''}{company.growthRate}
                  </td>

                  <td style={{ ...TD_STYLE, color: '#374151', textAlign: 'right' }}>
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
