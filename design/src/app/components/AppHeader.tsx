export function AppHeader() {
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
    </header>
  );
}
