import { Search, Download } from 'lucide-react';
import { mockCompanies } from '../data/mockData';

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
}

export function AppHeader({ searchQuery, onSearchChange }: AppHeaderProps) {
  const handleCsvDownload = () => {
    const rows = [
      ['№', 'Компания', 'ИНН', 'Выручка 2024 тыс ₽', 'Чистая прибыль тыс ₽', 'CAGR %', 'Стаж лет', 'Капитал'],
      ...mockCompanies.map(c => [
        c.rank,
        c.name,
        c.inn,
        c.revenue,
        c.profit,
        c.cagr,
        c.experience,
        c.capitalAttraction,
      ]),
    ];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pko300.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: '24px',
      }}
    >
      {/* Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px', color: '#111' }}>
          Рейтинг ПКО-300
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#9ca3af',
            background: '#f4f4f5',
            borderRadius: '12px',
            padding: '4px 10px',
            letterSpacing: '0.01em',
          }}
        >
          545 компаний
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#9ca3af',
          }}
        />
        <input
          type="text"
          placeholder="Поиск по названию или ИНН..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            paddingLeft: '36px',
            paddingRight: '14px',
            paddingTop: '10px',
            paddingBottom: '10px',
            width: '320px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            background: '#fff',
            color: '#111',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        />
      </div>

      {/* CSV Button */}
      <button
        onClick={handleCsvDownload}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '42px',
          padding: '0 16px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          color: '#374151',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          flexShrink: 0
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#f9fafb';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#fff';
        }}
      >
        <Download size={16} />
        CSV
      </button>
    </header>
  );
}
