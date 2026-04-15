import { ArrowRight } from 'lucide-react';
import { articles } from '../data/articlesData';

function ArticleCard({ title, image, isLast, onClick }: {
  title: string; image: string; isLast: boolean; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
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
    </div>
  );
}

interface SidebarProps {
  onArticleClick?: (articleId: string) => void;
}

export function Sidebar({ onArticleClick }: SidebarProps) {
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
        {articles.map((article, i) => (
          <ArticleCard
            key={article.id}
            title={article.shortTitle}
            image={article.image}
            isLast={i === articles.length - 1}
            onClick={() => onArticleClick?.(article.id)}
          />
        ))}
      </div>

      {/* Navigator banner */}
      <div style={{
        marginTop: '16px',
        position: 'sticky' as const,
        top: '80px',
      }}>
        <div style={{
          overflow: 'hidden',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '24px 20px',
            background: 'linear-gradient(145deg, #0a1128 0%, #1a2a5e 50%, #0e1a3d 100%)',
            minHeight: '280px',
            overflow: 'hidden',
          }}>
            {/* Geometric accent lines (Navigator style) */}
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-10px',
                width: '80px',
                height: '200px',
                background: 'linear-gradient(160deg, rgba(30,70,160,0.4) 0%, transparent 100%)',
                transform: 'skewX(-15deg)',
              }} />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '30px',
                width: '40px',
                height: '180px',
                background: 'linear-gradient(160deg, rgba(40,80,180,0.25) 0%, transparent 100%)',
                transform: 'skewX(-15deg)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-20px',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(25,60,140,0.3) 0%, transparent 70%)',
              }} />
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', width: '100%' }}>
              <img src="/logo-navigator.png" alt="Навигатор" style={{ height: '48px', marginBottom: '20px', alignSelf: 'flex-start' }} />
              <p style={{
                fontSize: '13px',
                fontWeight: 800,
                fontStyle: 'italic',
                lineHeight: 1.4,
                color: '#ffffff',
                margin: '0 0 8px',
                textTransform: 'uppercase' as const,
              }}>
                Навигатор по&nbsp;технологическим решениям для&nbsp;работы с&nbsp;долговыми обязательствами
              </p>
              <p style={{
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.6)',
                margin: '0 0 20px',
              }}>
                От&nbsp;аналитики до&nbsp;продажи, взыскания и&nbsp;банкротства
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
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  padding: '10px 18px',
                  background: '#1a4bba',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  transition: 'background 0.15s',
                  alignSelf: 'flex-start',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2258d4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a4bba'; }}
              >
                Открыть каталог
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
