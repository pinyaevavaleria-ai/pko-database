import { useIsMobile } from './ui/use-mobile';

interface SiteHeaderProps {
  activeTab?: 'pko300' | 'thematic';
  onNavigateToThematic?: () => void;
  onNavigateToRating?: () => void;
}

export function SiteHeader({ activeTab = 'pko300', onNavigateToThematic, onNavigateToRating }: SiteHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header style={{ padding: isMobile ? '12px 12px' : '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
        {/* Логотип РВ и ДП — слева */}
        <div style={{ position: 'relative', height: isMobile ? '40px' : '64px' }}>
          <img src="/logo-rvdp.png" alt="Рынок Взыскания и Debt Price" style={{ height: isMobile ? '40px' : '64px', opacity: 0.85 }} />
          <a href="https://debtprice.market/" target="_blank" rel="noopener noreferrer" title="Debt Price" style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%' }} />
          <a href="https://rvzrus.ru/" target="_blank" rel="noopener noreferrer" title="Рынок Взыскания" style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%' }} />
        </div>
        {!isMobile && <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.12)' }} />}
        {/* Навигация */}
        <nav style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '8px' }}>
          {([
            { label: 'ПКО-300', key: 'pko300' as const, onClick: onNavigateToRating },
            { label: 'Тематические рейтинги', key: 'thematic' as const, onClick: onNavigateToThematic },
          ]).map(({ label, key, onClick }) => {
            const isActive = activeTab === key;
            return (
              <a
                key={label}
                href="#"
                onClick={e => { e.preventDefault(); onClick?.(); }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '6px 14px',
                  border: `1px solid ${isActive ? 'rgba(13,240,230,0.25)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#0DF0E6' : 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(13,240,230,0.4)'; e.currentTarget.style.color = '#0DF0E6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isActive ? 'rgba(13,240,230,0.25)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = isActive ? '#0DF0E6' : 'rgba(255,255,255,0.4)'; }}
              >
                {label}
              </a>
            );
          })}
        </nav>
      </div>
      {/* Навигатор — справа */}
      <a href="https://navigator.debt-tech.ru/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/logo-navigator.png" alt="Навигатор" style={{ height: isMobile ? '48px' : '96px', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; }} />
      </a>
    </header>
  );
}
