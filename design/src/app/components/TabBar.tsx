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
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
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
              color: isActive ? '#111' : '#6b7280',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s',
              outline: 'none',
              marginBottom: '-1px',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.color = '#6b7280';
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
