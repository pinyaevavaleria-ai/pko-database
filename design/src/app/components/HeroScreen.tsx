import { Building2, BarChart3, TrendingUp } from 'lucide-react';
import { useIsMobile } from './ui/use-mobile';

interface HeroScreenProps {
  activeTab?: 'pko300' | 'thematic';
  onNavigateToThematic?: () => void;
  onNavigateToRating?: () => void;
}

export function HeroScreen({ activeTab = 'pko300', onNavigateToThematic, onNavigateToRating }: HeroScreenProps) {
  const isMobile = useIsMobile();
  const spaceGrotesk = "'Space Grotesk', sans-serif";

  return (
    <div style={{
      background: '#0a0f15',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Glow effects */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '120%',
        background: 'radial-gradient(circle, rgba(0,185,177,0.12) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', bottom: '-30%', left: '-10%', width: '50%', height: '80%',
        background: 'radial-gradient(circle, rgba(0,96,185,0.08) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Header */}
      <header style={{ padding: isMobile ? '12px 12px' : '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
          {/* Логотип РВ и ДП — слева */}
          <div style={{ position: 'relative', height: isMobile ? '40px' : '64px' }}>
            <img src="/logo-rvdp.png" alt="Рынок Взыскания и Debt Price" style={{ height: isMobile ? '40px' : '64px', opacity: 0.85 }} />
            <a href="https://rvzrus.ru/" target="_blank" rel="noopener noreferrer" title="Рынок Взыскания" style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%' }} />
            <a href="https://debtprice.market/" target="_blank" rel="noopener noreferrer" title="Debt Price" style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%' }} />
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

      {/* Pyramid Background — на всю высоту */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: isMobile ? '100%' : '55%', zIndex: 1, opacity: isMobile ? 0.4 : 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0a0f15 0%, transparent 40%, transparent 80%, #0a0f15 100%)', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0f15 0%, transparent 10%, transparent 80%, #0a0f15 100%)', zIndex: 2 }} />
        <img
          src="https://images.unsplash.com/photo-1675012848706-ff1b1fd7c675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwbW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NDcxNDM5Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Architecture Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.3, filter: 'grayscale(100%) contrast(1.2) brightness(0.7)' }}
        />
      </div>

      {/* Main Content */}
      <main style={{ display: 'flex', position: 'relative' }}>
        <div style={{ flex: 1, padding: isMobile ? '16px 16px 24px' : '24px 32px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, maxWidth: '700px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)',
            marginBottom: '12px', fontFamily: spaceGrotesk,
          }}>
            Аналитическая платформа
          </span>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            fontFamily: "'Inter', sans-serif",
          }}>
            Главный рейтинг<br />коллекторских<br />агентств
          </h1>

          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
            marginBottom: '24px', maxWidth: '520px',
          }}>
            Единый дашборд с аналитикой ПКО-300. Оценка инвестиционной привлекательности, финансовой устойчивости и рыночных позиций.
          </p>

          <div style={{ display: 'flex', gap: isMobile ? '20px' : '32px', flexWrap: 'wrap' }}>
            {[
              { icon: Building2, label: 'Компаний', value: '630+' },
              { icon: BarChart3, label: 'Данные', value: 'ФНС 2025' },
              { icon: TrendingUp, label: 'Динамика', value: 'за 5 лет' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'rgba(255,255,255,0.3)' }}>
                  <Icon size={14} />
                  <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontFamily: spaceGrotesk }}>
                    {label}
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: spaceGrotesk }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
