import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { RatingCompany } from '../data/ratingData';
import { logoMap } from '../data/logoMap';

const PAGE_SIZE = 100;

interface RatingTableProps {
  companies: RatingCompany[];
}

const AVATAR_COLORS = [
  '#00B2AA', '#0060B9', '#4326BA', '#00B982', '#0DF0E6',
  '#0078d4', '#6B3FA0', '#00a67d', '#008c84', '#0052a3',
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
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
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
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      {rank}
    </span>
  );
}

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '4px 6px',
  height: '40px',
  fontSize: '10px',
  color: 'rgba(255,255,255,0.4)',
  fontWeight: 400,
  whiteSpace: 'normal',
  lineHeight: '1.3',
  background: '#111920',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  userSelect: 'none',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const TD_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0 6px',
  height: '44px',
  fontSize: '12px',
  color: '#fff',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

export function RatingTable({ companies }: RatingTableProps) {
  const [page, setPage] = useState(0);
  const fmt = (n: number) => Math.abs(n).toLocaleString('ru-RU');

  const totalPages = Math.ceil(companies.length / PAGE_SIZE);
  const pagedCompanies = companies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page if companies change and page is out of bounds
  if (page >= totalPages && totalPages > 0) setPage(0);

  const colWidths = ['7%', '5%', '3%', '23%', '24%', '20%', '10%'];
  const colHeaders = ['№', 'YoY', '', 'Компания', 'Выручка + пр. доходы, тыс ₽', 'Чистая прибыль, тыс ₽', 'Стаж, лет'];
  const colAligns: ('left' | 'right' | 'center')[] = ['left', 'center', 'left', 'left', 'right', 'right', 'right'];

  return (
    <div>
        <table style={{ width: '100%', minWidth: '830px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {colHeaders.map((h, i) => (
                <th key={i} style={{ ...TH_STYLE, textAlign: colAligns[i], ...(h === '' ? { padding: 0 } : {}), ...(i === 0 ? { paddingLeft: '20px' } : {}), ...(i === colHeaders.length - 1 ? { paddingRight: '20px' } : {}) }}>
                  {h && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: colAligns[i] === 'right' ? 'flex-end' : colAligns[i] === 'center' ? 'center' : 'flex-start', gap: '3px' }}>
                      {h} <ArrowUpDown size={10} color="#d1d5db" />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedCompanies.map((company, idx) => {
              const delta = company.rankDelta;
              const isLast = idx === pagedCompanies.length - 1;
              const rowBg = idx % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent';
              return (
                <tr
                  key={company.rank}
                  style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)', background: rowBg }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,240,230,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = rowBg)}
                >
                  {/* № */}
                  <td style={{ ...TD_STYLE, paddingLeft: '20px' }}>
                    <RankBadge rank={company.rank} />
                  </td>

                  {/* Динамика YoY */}
                  <td style={{ ...TD_STYLE, textAlign: 'center' }}>
                    {delta !== 0 ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: delta > 0 ? '#0DF0E6' : '#ef4444',
                        }}
                      >
                        {delta > 0
                          ? <ArrowUp style={{ width: '10px', height: '10px' }} />
                          : <ArrowDown style={{ width: '10px', height: '10px' }} />}
                        {Math.abs(delta)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>—</span>
                    )}
                  </td>

                  {/* Logo */}
                  <td style={{ ...TD_STYLE, padding: 0 }}>
                    <Avatar name={company.name} rank={company.rank} inn={company.inn} />
                  </td>

                  {/* Компания */}
                  <td style={{ ...TD_STYLE, fontWeight: 500, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, gap: '1px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {company.city && (
                          <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {company.city}
                          </span>
                        )}
                        {company.napka && (
                          <span style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', flexShrink: 0, lineHeight: '14px' }}>
                            · НАПКА
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Выручка */}
                  <td style={{ ...TD_STYLE, color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>
                    {fmt(company.revenue)}
                  </td>

                  {/* Прибыль */}
                  <td style={{ ...TD_STYLE, textAlign: 'right', fontWeight: 500, color: company.profit >= 0 ? '#0DF0E6' : '#ef4444' }}>
                    {company.profit < 0 ? `−${fmt(company.profit)}` : fmt(company.profit)}
                  </td>

                  {/* Стаж */}
                  <td style={{ ...TD_STYLE, color: 'rgba(255,255,255,0.7)', textAlign: 'right', paddingRight: '20px' }}>
                    {company.experience}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <span>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, companies.length)} из {companies.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: page === 0 ? 'default' : 'pointer',
                opacity: page === 0 ? 0.4 : 1,
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.7)' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '32px', height: '32px', borderRadius: '6px',
                  border: i === page ? '1px solid #0DF0E6' : '1px solid rgba(255,255,255,0.08)',
                  background: i === page ? 'rgba(13,240,230,0.1)' : 'transparent',
                  color: i === page ? '#0DF0E6' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  padding: '0 8px',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: page === totalPages - 1 ? 'default' : 'pointer',
                opacity: page === totalPages - 1 ? 0.4 : 1,
              }}
            >
              <ChevronRight style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
