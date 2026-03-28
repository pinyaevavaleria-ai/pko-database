import { BarChart3, Building2, TrendingUp } from 'lucide-react';

export function HeroScreen() {
  return (
    <div style={{ background: '#09090b', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      
      {/* Header */}
      <header style={{ padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a 
            href="#" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 16px', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              borderRadius: '100px', 
              fontSize: '15px', 
              fontWeight: 700, 
              color: '#fff', 
              textDecoration: 'none', 
              transition: 'all 0.2s' 
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            ПКО-300
          </a>
          <a 
            href="#" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 16px', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              borderRadius: '100px', 
              fontSize: '14px', 
              fontWeight: 600, 
              color: 'rgba(255, 255, 255, 0.7)', 
              textDecoration: 'none', 
              transition: 'all 0.2s', 
              letterSpacing: '-0.2px' 
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Тематические рейтинги
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, maxWidth: '800px' }}>
          <h1 style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2.5px', marginBottom: '24px' }}>
            Главный рейтинг<br />коллекторских<br />агентств
          </h1>
          <p style={{ fontSize: '20px', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '64px', maxWidth: '600px' }}>
            Единый дашборд с аналитикой ПКО-300. Оценка инвестиционной привлекател��ности, финансовой устойчивости и рыночных позиций.
          </p>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#71717a' }}>
                <Building2 size={18} /> <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Компаний</span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>540+</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#71717a' }}>
                <BarChart3 size={18} /> <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Данные</span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>РСБУ 2024</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#71717a' }}>
                <TrendingUp size={18} /> <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Динамика</span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>за 5 лет</div>
            </div>
          </div>
        </div>

        {/* Right Graphic Background */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '55%', zIndex: 1 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #09090b 0%, transparent 40%, transparent 80%, #09090b 100%)', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #09090b 0%, transparent 20%, transparent 80%, #09090b 100%)', zIndex: 2 }} />
          <img 
            src="https://images.unsplash.com/photo-1675012848706-ff1b1fd7c675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwbW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NDcxNDM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Architecture Background"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, filter: 'grayscale(100%) contrast(1.2) brightness(0.8)' }}
          />
        </div>
      </main>

      {/* No more gradient, just a clean cutoff */}
    </div>
  );
}