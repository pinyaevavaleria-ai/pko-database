export type TabId = 'rating' | 'finance' | 'investment';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'rating', label: 'Рейтинг' },
  { id: 'finance', label: 'Финансы' },
  { id: 'investment', label: 'Инвестиции' },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      style={{
        background: '#111920',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '14px 20px 13px',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#0DF0E6' : 'rgba(255,255,255,0.4)',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid #0DF0E6' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s',
              outline: 'none',
              marginBottom: '-1px',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
