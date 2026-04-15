import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    title: 'Топ ПКО по темпам роста',
    tag: 'СТАТЬЯ',
    tagColor: '#16a34a',
    image: 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    title: 'Новые ПКО в 2025 году',
    tag: 'ОБЗОР',
    tagColor: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    title: 'Топ ПКО по прибыльности',
    tag: 'СТАТЬЯ',
    tagColor: '#16a34a',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
];

function ArticleCard({ title, tag, tagColor, image, isLast }: {
  title: string; tag: string; tagColor: string; image: string; isLast: boolean;
}) {
  return (
    <a
      href="#"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,240,230,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '80px',
        height: '52px',
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: '4px',
      }}>
        <img
          src={image}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: 'block',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: tagColor,
          marginBottom: '4px',
        }}>
          {tag}
        </span>
        <h3 style={{
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: 1.35,
          color: '#fff',
          margin: 0,
        }}>
          {title}
        </h3>
      </div>

      {/* Arrow */}
      <ArrowRight style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
    </a>
  );
}

export function Sidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.4)',
          whiteSpace: 'nowrap',
        }}>
          Материалы
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Articles */}
      <div style={{
        background: '#111920',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'none',
      }}>
        {ARTICLES.map((article, i) => (
          <ArticleCard
            key={i}
            {...article}
            isLast={i === ARTICLES.length - 1}
          />
        ))}
      </div>

      {/* Ad banner */}
      <div style={{
        marginTop: '16px',
        position: 'sticky' as const,
        top: '80px',
      }}>
        <div style={{
          overflow: 'hidden',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center' as const,
            padding: '32px 20px',
            background: 'linear-gradient(135deg, #09090b 0%, #1a2a2c 100%)',
            minHeight: '260px',
            overflow: 'hidden',
          }}>
            {/* Glow effects */}
            <div style={{
              position: 'absolute',
              top: '-32px',
              right: '-32px',
              width: '112px',
              height: '112px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(13,240,230,0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-24px',
              left: '-24px',
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,96,185,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/logo-navigator.png" alt="Навигатор" style={{ height: '56px', marginBottom: '16px', opacity: 0.95 }} />
              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.7)',
                margin: '0 0 20px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
              }}>
                Навигатор по&nbsp;технологическим решениям для&nbsp;работы с&nbsp;долговыми обязательствами
              </p>
              <a
                href="https://navigator.debt-tech.ru/catalog"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  padding: '10px 20px',
                  background: '#0DF0E6',
                  color: '#09090b',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  transition: 'brightness 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
              >
                Перейти
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
